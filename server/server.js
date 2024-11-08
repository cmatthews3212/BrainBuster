const express = require("express");
const http = require("http");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");
const { authMiddleware } = require("./utils/auth");
const { fetchTriviaQuestions } = require('./utils/requests');

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");
const socketIo = require("socket.io");

const PORT = process.env.PORT || 3001;
const app = express();

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create HTTP server
const httpServer = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(httpServer, {
  cors: {
    origin: 'http://localhost:3000', // Update if your client runs on a different origin
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Start Apollo Server
const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use(
    "/images",
    express.static(path.join(__dirname, "../client/public/images"))
  );

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  db.once("open", () => {
    httpServer.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Start the server
startApolloServer();

// Game state management
let games = {};

io.on("connection", (socket) => {
  console.log(`A player connected: ${socket.id}`);

  // Handle 'createGame' event
  socket.on("createGame", ({ gameId, category, difficulty }) => {
    console.log(`${socket.id} created a game with ID: ${gameId}`);

    if (games[gameId]) {
      console.log(`Game ID ${gameId} already exists.`);
      socket.emit('error', { message: 'Game ID already exists.' });
      return;
    }

    // Initialize game state
    games[gameId] = {
      player1: socket.id,
      player2: null,
      category,
      difficulty,
      questions: [],
      currentQuestionIndex: 0,
      answers: {},
      scores: {},
      questionTimer: null,
      resultTimer: null,
      ready: {},
    };

    games[gameId].answers[socket.id] = {};
    games[gameId].scores[socket.id] = 0;
    games[gameId].ready[socket.id] = false; // Initialize readiness for Player1

    socket.join(gameId);
    socket.emit("waitingForOpponent");
  });

  // Handle 'joinGame' event
  socket.on("joinGame", async ({ gameId }) => {
    console.log(`${socket.id} attempting to join game ${gameId}`);

    const game = games[gameId];

    if (game) {
      if (!game.player2) {
        game.player2 = socket.id;

        games[gameId].answers[socket.id] = {};
        games[gameId].scores[socket.id] = 0;
        games[gameId].ready[socket.id] = false; // Initialize readiness for Player2

        socket.join(gameId);
        socket.emit("gameJoined", { gameId });

        try {
          const rawQuestions = await fetchTriviaQuestions(10, game.category, game.difficulty);
          
          // Map API response to desired structure
          const mappedQuestions = rawQuestions.map(q => ({
            ...q,
            correctAnswer: q.correct_answer, // Adjust based on the-trivia-api's field names
            incorrectAnswers: q.incorrect_answers, // Adjust based on the-trivia-api's field names
          }));
          
          game.questions = mappedQuestions;

          console.log(`Fetched and mapped ${game.questions.length} questions for game ${gameId}.`);

          // Emit 'gameStarted' to both players
          io.to(game.player1).emit('gameStarted', {
            gameId,
            playerId: game.player1,
            opponentId: game.player2,
          });
            
          io.to(game.player2).emit('gameStarted', {
            gameId,
            playerId: game.player2,
            opponentId: game.player1,
          });

        } catch (error)  {
          console.error('Error fetching questions:', error);

          io.to(gameId).emit('error', { message: 'Failed to fetch questions.' });

          delete games[gameId];
        }
      } else {
        console.log(`Game ${gameId} is full.`);
        socket.emit('gameFull');
      }
    } else {
      console.log(`Game ${gameId} not found.`);
      socket.emit('gameNotFound');
    }
  });

  // Handle 'ready' event globally
  socket.on("ready", ({ gameId }) => {
    const game = games[gameId];

    if (!game) {
      socket.emit('error', { message: 'Game not found.' });
      return;
    }

    if (socket.id !== game.player1 && socket.id !== game.player2) {
      socket.emit('error', { message: 'Player not part of the game.' });
      return;
    }

    game.ready[socket.id] = true;
    console.log(`Player ${socket.id} is ready in game ${gameId}.`);

    // Check if both players are ready
    if (game.player1 && game.player2 && game.ready[game.player1] && game.ready[game.player2]) {
      console.log(`Both players are ready. Starting first question for game ${gameId}.`);
      startQuestion(gameId);
    }
  });

  // Handle 'submitAnswer' event
  socket.on("submitAnswer", (gameId, questionIndex, answer) => {
    console.log(`Received submitAnswer from ${socket.id} for game ${gameId}, question ${questionIndex + 1}: ${answer}`);

    const game = games[gameId];

    if (!game) {
      socket.emit('error', { message: 'Game not found.'});
      return;
    }

    if (questionIndex !== game.currentQuestionIndex) {
      socket.emit('error', { message: 'Invalid question index.' });
      return;
    }

    if (!game.answers[socket.id]) {
      socket.emit('error', { message: 'Player not part of the game.' });
      return;
    }

    game.answers[socket.id][questionIndex] = answer;

    console.log(`Player ${socket.id} submitted answer: ${answer} for question ${questionIndex + 1} in game ${gameId}`);

    // Check if both players have submitted their answers
    if (
      game.answers[game.player1][questionIndex] !== undefined &&
      game.answers[game.player2][questionIndex] !== undefined
    ) {

      if (game.questionTimer) {
        clearTimeout(game.questionTimer);
        game.questionTimer = null;
        console.log(`Cleared questionTimer for game ${gameId}, question ${questionIndex + 1}.`);
      }

      processAnswers(gameId);
    }
  });

  // Handle 'timeUp' event
  socket.on('timeUp', ({ gameId }) => {
    console.log(`Time up for game ${gameId}. Processing answers.`);

    const game = games[gameId];

    if (!game) {
      socket.emit('error', { message: 'Game not found.' });
      return;
    }

    processAnswers(gameId);
  });

  // Handle 'disconnect' event
  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);

    for (let gameId in games) {
      const game = games[gameId];

      if (game.player1 === socket.id || game.player2 === socket.id) {
        const opponentId = game.player1 === socket.id ? game.player2 : game.player1;

        if (opponentId) {
          io.to(opponentId).emit("opponentLeft");
        }

        if (game.questionTimer) {
          clearTimeout(game.questionTimer);
        }

        if (game.resultTimer) {
          clearTimeout(game.resultTimer);
        }

        // Remove readiness status
        delete games[gameId].ready[socket.id];

        delete games[gameId];
        console.log(`Deleted game ${gameId} due to player disconnection.`);
        break;
      }
    }
  });
});

// Function to start a question
function startQuestion(gameId) {
  const game = games[gameId];

  if (!game) return;

  const questionIndex = game.currentQuestionIndex;
  const question = game.questions[questionIndex];

  if (!question) {
    endGame(gameId);
    return;
  }

  console.log(`Starting question ${questionIndex + 1} of ${game.questions.length} for game ${gameId}.`);

  const shuffledAnswers = shuffleAnswers([
    ...question.incorrectAnswers,
    question.correctAnswer,
  ]);

  console.log(`Shuffled Answers for game ${gameId}, question ${questionIndex + 1}:`, shuffledAnswers);

  // Verify that 'correctAnswer' is included
  if (!shuffledAnswers.includes(question.correctAnswer)) {
    console.error(`Correct answer not found in shuffledAnswers for game ${gameId}, question ${questionIndex + 1}.`);
  }

  // Emit 'newQuestion' to both players
  io.to(game.player1).emit('newQuestion', {
    gameId,
    questionIndex,
    question: question.question,
    answers: shuffledAnswers,
  });

  io.to(game.player2).emit('newQuestion', {
    gameId,
    questionIndex,
    question: question.question,
    answers: shuffledAnswers,
  });

  // Set a timer for the question duration (e.g., 20 seconds)
  game.questionTimer = setTimeout(() => {
    console.log(`Question ${questionIndex + 1} time up for game ${gameId}.`);
    processAnswers(gameId);
  }, 20000);
}

// Function to process answers after both players have answered or time is up
function processAnswers(gameId) {
  const game = games[gameId]; 

  if (!game) return;

  const questionIndex = game.currentQuestionIndex;
  const question = game.questions[questionIndex];

  if (!question) return;

  const player1Answer = game.answers[game.player1][questionIndex];
  const player2Answer = game.answers[game.player2][questionIndex];
  const player1Correct = player1Answer === question.correctAnswer;
  const player2Correct = player2Answer === question.correctAnswer;

  if (player1Correct) {
    game.scores[game.player1] += 1;
  }
  if (player2Correct) {
    game.scores[game.player2] += 1;
  }

  console.log(`Player1 (${game.player1}) answered correctly: ${player1Correct}`);
  console.log(`Player2 (${game.player2}) answered correctly: ${player2Correct}`);
  console.log(`Scores after question ${questionIndex + 1}:`, game.scores);

  const results = {
    gameId,
    questionIndex,
    correctAnswer: question.correctAnswer,
    scores: game.scores,
    player1Correct,
    player2Correct,
  };

  // Emit 'questionResult' to both players
  io.to(game.player1).emit('questionResult', results);
  io.to(game.player2).emit('questionResult', results);

  console.log(`Emitted questionResult for game ${gameId}, question ${questionIndex + 1}.`);

  if (game.questionTimer) {
    clearTimeout(game.questionTimer);
    game.questionTimer = null;
    console.log(`Cleared questionTimer for game ${gameId}, question ${questionIndex + 1}.`);
  }

  // Set a timer for the results display duration (e.g., 10 seconds)
  game.resultTimer = setTimeout(() => {
    game.currentQuestionIndex += 1;
    console.log(`Moving to question ${game.currentQuestionIndex + 1} for game ${gameId}.`);

    // Check if there are more questions
    if (game.currentQuestionIndex < game.questions.length) {
      startQuestion(gameId);
    } else {
      endGame(gameId);
    }
  }, 10000); 
}

// Function to end the game and emit final scores
function endGame(gameId) {
  const game = games[gameId];

  if (!game) return;

  console.log(`Ending game ${gameId}.`);
  
  io.to(game.player1).emit('gameOver', { scores: game.scores });
  io.to(game.player2).emit('gameOver', { scores: game.scores });

  delete games[gameId];
}

// Utility function to shuffle answers
function shuffleAnswers(answers) {
  let shuffled = [...answers];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}