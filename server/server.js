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

// Create a new instance of an Apollo server with the GraphQL schema
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

// Call the async function to start the server
startApolloServer();

let games = {};

io.on("connection", (socket) => {
  console.log(`A player connected: ${socket.id}`);

  socket.on("createGame", ({ gameId, category, difficulty }) => {
    console.log(`${socket.id} created a game with ID: ${gameId}`);

    if (games[gameId]) {
      console.log(`Game ID ${gameId} already exists.`);

      socket.emit('error', { message: 'ID already exists.'});

      return;
    }

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
    };

    games[gameId].answers[socket.id] = {};
    games[gameId].scores[socket.id] = 0;

    socket.join(gameId);
    socket.emit("waitingForOpponent");
  });

  socket.on("joinGame", async ({ gameId }) => {
    console.log(`${socket.id} attempting to join game ${gameId}`);

    const game = games[gameId];

    if (game) {
      if (!game.player2) {
        game.player2 = socket.id;

        games[gameId].answers[socket.id] = {};
        games[gameId].scores[socket.id] = 0;

        socket.join(gameId);
        socket.emit("gameJoined", { gameId });


        try {
          const questions = await fetchTriviaQuestions(10, game.category, game.difficulty);
          
          game.questions = questions;

          console.log(`Fetched questions for game ${gameId}.`);
    
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

          startQuestion(gameId);

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

  socket.on("submitAnswer", (gameId, questionIndex, answer) => {
    console.log(`Received submitAnswer from ${socket.id} for game ${gameId}, question ${questionIndex}: ${answer}`);

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

    if (game.answers[game.player1][questionIndex] !== undefined &&
      game.answers[game.player2][questionIndex] !== undefined) {

      if (game.questionTimer) {
        clearTimeout(game.questionTimer);

        game.questionTimer = null;
      }

      processAnswers(gameId);
    };
  });

  socket.on('timeUp', ({ gameId }) => {
    console.log(`Time up for game ${gameId}. Processing answers.`);

    const game = games[gameId];

    if (!game) {
      socket.emit('error', { message: 'Game not found.' });
      return;
    }

    processAnswers(gameId);
  })

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

        delete games[gameId];
        console.log(`Deleted game ${gameId} due to player disconnection.`);
        break;
      }
    }
  });
});

function startQuestion(gameId) {
  const game = games[gameId];

  if (!game) return;

  const questionIndex = game.currentQuestionIndex;
  const question = game.questions[questionIndex];

  if (!question) {
    endGame(gameId);
    return;
  }

  console.log(`Starting question ${questionIndex} for game ${gameId}.`);

  const shuffledAnswers = shuffleAnswers([
    ...question.incorrectAnswers,
    question.correctAnswer,
  ]);

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

  game.questionTimer = setTimeout(() => {
    console.log(`Question ${questionIndex} time up for game ${gameId}.`);

    processAnswers(gameId);
  }, 20000);
}

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

  const results = {
    gameId,
    questionIndex,
    correctAnswer: question.correctAnswer,
    scores: game.scores,
    player1Correct,
    player2Correct,
  };

  io.to(game.player1).emit('questionResult', results);
  io.to(game.player2).emit('questionResult', results);

  console.log(`Emitted questionResult for game ${gameId}, question ${questionIndex}.`);

  if (game.questionTimer) {
    clearTimeout(game.questionTimer);
    game.questionTimer = null;
  }

  game.resultTimer = setTimeout(() => {
    game.currentQuestionIndex += 1;

    startQuestion(gameId);
  }, 10000); 
}

function endGame(gameId) {
  const game = games[gameId];

  if (!game) return;

  console.log(`Ending game ${gameId}.`);

  io.to(game.player1).emit('gameOver', { scores: game.scores });
  io.to(game.player2).emit('gameOver', { scores: game.scores });

  delete games[gameId];
}

function shuffleAnswers(answers) {
  let shuffled = [...answers];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}