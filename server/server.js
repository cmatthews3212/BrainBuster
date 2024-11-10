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

const gameServer = http.createServer(app);
const io = socketIo(gameServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

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
    gameServer.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Start the server
startApolloServer();

// Game state management
let games = {};

const startGameLoop = (gameId) => {
  const game = games[gameId];

  if (!game) return;

  let currentQuestionIndex = 0;
  const totalQuestions = game.questions.length;

  const sendQuestion = () => {
    if (currentQuestionIndex >= totalQuestions) {
      endGame(gameId);
      return;
    }

    const question = game.questions[currentQuestionIndex];


    const shuffledAnswers = shuffleAnswers([
      ...question.incorrectAnswers,
      question.correctAnswer,
    ]);
    
    io.to(gameId).emit('newQuestion', {
      questionIndex: currentQuestionIndex,
      question: question.question, 
      answers: shuffledAnswers,
    });

    game.timers.questionTimer = setTimeout(() => {
      
      showAnswer(gameId, currentQuestionIndex);
    }, 20000); // 20 seconds
  };

  const showAnswer = (gameId, questionIndex) => {
    const game = games[gameId];
    if (!game) return;

    const question = game.questions[questionIndex];
    const correctAnswer = question.correctAnswer; 

    [game.player1, game.player2].forEach((playerId) => {
      const answer = game.answers[playerId][questionIndex];
      if (answer === correctAnswer) {
        game.scores[playerId] = (game.scores[playerId] || 0) + 1;
      }
    });

    io.to(gameId).emit('showAnswer', {
      questionIndex,
      correctAnswer,
      players: {
        [game.player1]: game.answers[game.player1][questionIndex],
        [game.player2]: game.answers[game.player2][questionIndex],
      },
    });

    
    game.timers.answerTimer = setTimeout(() => {
      currentQuestionIndex += 1;
      sendQuestion();
    }, 10000); 
  };

  const endGame = (gameId) => {
    const game = games[gameId];
    if (!game) return;

    const score1 = game.scores[game.player1] || 0;
    const score2 = game.scores[game.player2] || 0;

    let result;
    if (score1 > score2) {
      result = {
        winner: game.player1,
        loser: game.player2,
      };
    } else if (score2 > score1) {
      result = {
        winner: game.player2,
        loser: game.player1,
      };
    } else {
      result = {
        winner: null, 
      };
    }


    io.to(gameId).emit('gameOver', {
      scores: game.scores,
      result,
    });

    clearTimeout(game.timers.questionTimer);
    clearTimeout(game.timers.answerTimer);
    delete games[gameId];
  };

  sendQuestion();
};


io.on("connection", (socket) => {
  console.log(`A player connected: ${socket.id}`);

  // Handle 'createGame' event
  socket.on("createGame", ({ gameId, category, difficulty }) => {
    if (games[gameId]) {
      socket.emit('error', { message: 'Game ID already exists.' });
      return;
    }

    games[gameId] = {
      player1: socket.id,
      player2: null,
      category,
      difficulty,
      questions: [],
      answers: {},
      scores: {},
      timers: {},
      ready: {},
    };

    games[gameId].answers[socket.id] = {};
    games[gameId].scores[socket.id] = 0;
    games[gameId].ready[socket.id] = false; 

    socket.join(gameId);
    socket.emit("waitingForOpponent");
    console.log(`Game ${gameId} created by ${socket.id}`);
  });

  socket.on("joinGame", async ({ gameId }) => {
    console.log(`${socket.id} attempting to join game ${gameId}`);

    const game = games[gameId];

    if (game) {
      if (!game.player2) {
        game.player2 = socket.id;

        games[gameId].answers[socket.id] = {};
        games[gameId].scores[game.player1] = 0;
        games[gameId].scores[game.player2] = 0;

        socket.join(gameId);
        socket.emit("gameJoined", { gameId });

        console.log(`Player ${socket.id} joined game ${gameId}`);

        try {
          const questions = await fetchTriviaQuestions(10, game.category, game.difficulty);
          game.questions = questions;

          console.log(`joinGame: Questions fetched for game ${gameId}. Total Questions: ${questions.length}`);
          console.log('First Question:', questions[0]);

          io.to(gameId).emit('gameStarted', { 
            gameId, 
            opponentId: game.player1, 
            playerId: game.player2 
          });

      
          startGameLoop(gameId);
        } catch (error) {
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

  socket.on("submitAnswer", ({ gameId, questionIndex, answer }) => {
    const game = games[gameId];
    if (!game) {
      socket.emit('error', { message: 'Game not found.' });
      return;
    }

    if (![game.player1, game.player2].includes(socket.id)) {
      socket.emit('error', { message: 'You are not a player in this game.' });
      return;
    }

    if (game.answers[socket.id][questionIndex] !== undefined) {
      return;
    }

    game.answers[socket.id][questionIndex] = answer;

    console.log(`Player ${socket.id} answered question ${questionIndex}: ${answer}`);
  });


  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);

    for (let gameId in games) {
      const game = games[gameId];
      if (game.player1 === socket.id || game.player2 === socket.id) {
        const opponentId = game.player1 === socket.id ? game.player2 : game.player1;

        if (opponentId) {
          io.to(opponentId).emit("opponentLeft");
        }

    
        clearTimeout(game.timers.questionTimer);
        clearTimeout(game.timers.answerTimer);

        delete games[gameId];

        console.log(`Game ${gameId} ended due to player disconnect.`);
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