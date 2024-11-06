const express = require("express");
const http = require("http");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");
const { authMiddleware } = require("./utils/auth");

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");
const socketIo = require("socket.io");

const PORT = process.env.PORT || 3001;
const app = express();

const gameServer = http.createServer(app);
const io = socketIo(gameServer);

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
    app.listen(PORT, () => {
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

  socket.on("createGame", (gameId) => {
    console.log(`${socket.id} created a game with ID: ${gameId}`);
    games[gameId] = { player1: socket.id, player2: null };
    socket.emit("waitingForOpponent");
  });

  socket.on("joinGame", (gameId) => {
    console.log(`${socket.id} joined game ${gameId}`);
    if (games[gameId] && !games[gameId].player2) {
      games[gameId].player2 = socket.id;
      io.to(gameId).emit("gameStarted", { opponentId: socket.id });
      io.to(games[gameId].player2).emit("gameStarted", {
        opponentId: games[gameId].player1,
      });
    } else {
      socket.emit("gameFull", gameId);
    }
  });

  socket.on("submitAnswer", (gameId, questionIndex, answer) => {
    console.log(`Answer recieved from ${socket.id}: ${answer}`);
    io.to(games[gameId].player1).emit("newAnswer", {
      questionIndex,
      answer,
      playerId: socket.id,
    });
    io.to(games[gameId].player2).emit("newAnswer", {
      questionIndex,
      answer,
      playerId: socket.id,
    });
  });

  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);
    for (let gameId in games) {
      if (games[gameId].player1 === socket.id) {
        io.to(games[gameId].player2).emit("opponentLeft");
        delete games[gameId];
      } else if (games[gameId].player2 === socket.id) {
        io.to(games[gameId].player1).emit("opponentLeft");
        delete games[gameId];
      }
    }
  });
});
