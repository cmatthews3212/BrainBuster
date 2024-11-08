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

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Serve up static assets
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

const gameServer = http.createServer(app);
const io = socketIo(gameServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`A player connected: ${socket.id}`);

  socket.on("createGame", ({ gameId, category, difficulty }) => {
    console.log(`${socket.id} created a game with ID: ${gameId}`);

    games[gameId] = {
      player1: socket.id,
      player2: null,
      category,
      difficulty,
      answers: {}
    };

    games[gameId].answers[socket.id] = {};

    socket.join(gameId);

    socket.emit("waitingForOpponent");
  });

  socket.on("joinGame", ({ gameId }) => {
    console.log(`${socket.id} attempting to join game ${gameId}`);

    const game = games[gameId];

    if (game) {
      if (!game.player2) {
        game.player2 = socket.id;
        games[gameId].answers[socket.id] = {};

        socket.join(gameId);

        socket.emit("gameJoined", { gameId });



        fetchTriviaQuestions(10, game.category, game.difficulty)
          .then((questions) => {
            game.questions = questions;
    
            io.to(gameId).emit('gameStarted', {
              gameId,
              questions,
              opponentId: socket.id === game.player1 ? game.player2 : game.player1,
              players: [game.player1, game.player2],
            });
    
            console.log(`Game ${gameId} started with players ${game.player1} and ${game.player2}`);
          })
          .catch((error) => {
            console.error('Error fetching questions:', error);
            io.to(gameId).emit('error', { message: 'Failed to fetch questions.' });
            });
          } else {
            console.log(`Game ${gameId} is full.`);
            socket.emit('gameFull');
          }
      } else {
        console.log(`Game ${gameId} not found.`);
        socket.emit('gameNotFound');
    }
  });

  function bothPlayerFinished(gameId) {
    const game = games[gameId];
    const totalQuestions = game.questions.length;

    return (
      Object.keys(game.answers[game.player1]).length === totalQuestions &&
      Object.keys(game.answers[game.player2]).length === totalQuestions
    );
  }

  function calculateScores(gameId) {
    const game = games[gameId];
    const scores = {};

    [game.player1, game.player2].forEach((playerId) => {
      const playerAnswers = game.answers[playerId];

      let score = 0;

      game.questions.forEach((question, index) => {
        if (playerAnswers[index] === question.correctAnswer) {
          score += 1;
        }
      });
      scores[playerId] = score;
    });
    return scores;
  }

  socket.on('startGame', async (gameId) => {
    const game = games[gameId];
    
    if (!game) {
      socket.emit('gameNotFound', gameId);
      return;
    }

    const questions = await fetchTriviaQuestions(10, game.category, game.difficulty);

    game.questions = questions;

    io.to(gameId).emit('gameStarted', { questions });
  });

  socket.on("submitAnswer", (gameId, questionIndex, answer) => {
    games[gameId].answers[socket.id][questionIndex] = answer;

    if (bothPlayerFinished(gameId)) {
      const scores = calculateScores(gameId);

      io.to(gameId).emit('gameOver', { scores });
    } else {
      socket.to(gameId).emit('opponentAnswer', { questionIndex, playerId: socket.id });
    }
  });

  socket.on('timeUp', ({ gameId }) => {
    const scores = calculateScores(gameId);

    io.to(gameId).emit('gameOver', { scores });
  })

  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);

    for (let gameId in games) {
      if (games[gameId].player1 === socket.id || games[gameId].player2 === socket.id) {
        const opponentId = games[gameId].player1 === socket.id ? games[gameId].player2 : games[gameId].player1;

        if (opponentId) {
          io.to(opponentId).emit("opponentLeft");
        }

        delete games[gameId];

        break;
      }
    }
  })
});
