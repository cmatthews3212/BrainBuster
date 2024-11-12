const express = require("express");
const http = require("http");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");
const { authMiddleware } = require("./utils/auth");
const { fetchTriviaQuestions } = require('./utils/requests');
const { v4: uuidv4 } = require('uuid');

const userIdToSocketIds = new Map();
const socketIdToUserId = new Map();

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
console.log('socket', io.sockets.sockets.keys())

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

let games = {};

function shuffleAnswers2(answers) {
  let shuffled = [...answers];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function showAnswer(gameId, questionIndex) {
  const game = games[gameId];

  if (!game) {
    console.error(`showAnswer: Game ${gameId} not found.`);
    return;
  }

  const question = game.questions[questionIndex];
  const correctAnswer = question.correctAnswer;

  [game.player1, game.player2].forEach((playerId) => {
    const answer = game.answers[playerId][questionIndex];
    if (answer === correctAnswer) {
      game.scores[playerId] = (game.scores[playerId] || 0) + 1;
      console.log(
        `showAnswer: Player ${socketIdToUserId.get(playerId)} answered correctly. Score: ${game.scores[playerId]}`
      );
    } else {
      console.log(
        `showAnswer: Player ${socketIdToUserId.get(playerId)} answered incorrectly or did not answer.`
      );
    }
  });

  const player1UserId = socketIdToUserId.get(game.player1);
  const player2UserId = socketIdToUserId.get(game.player2);

  io.to(gameId).emit('showAnswer', {
    questionIndex,
    correctAnswer,
    players: {
      [player1UserId]: game.answers[game.player1][questionIndex],
      [player2UserId]: game.answers[game.player2][questionIndex],
    },
  });

  console.log(`Emitted showAnswer for gameId: ${gameId}, questionIndex: ${questionIndex}`);

  game.timers.answerTimer = setTimeout(() => {
    game.currentQuestionIndex += 1;
    sendQuestion(gameId);
  }, 5000); 
};

function endGame(gameId) {
  const game = games[gameId];

  if (!game) {
    console.error(`endGame: Game ${gameId} not found.`);
    return;
  }

  console.log(`Ending game ${gameId}.`);

  const player1UserId = socketIdToUserId.get(game.player1);
  const player2UserId = socketIdToUserId.get(game.player2);

  const score1 = game.scores[game.player1] || 0;
  const score2 = game.scores[game.player2] || 0;

  let result;

  if (score1 > score2) {
    result = {
      winner: player1UserId,
      loser: player2UserId,
    };
    console.log(`endGame: Player ${player1UserId} wins against Player ${player2UserId}.`);
  } else if (score2 > score1) {
    result = {
      winner: player2UserId,
      loser: player1UserId,
    };
    console.log(`endGame: Player ${player2UserId} wins against Player ${player1UserId}.`);
  } else {
    result = {
      winner: null,
    };
    console.log(`endGame: Game ${gameId} ended in a tie.`);
  }

  io.to(gameId).emit('gameOver', {
    scores: game.scores,
    result,
  });

  console.log(`Emitted gameOver for gameId: ${gameId}`);

  clearTimeout(game.timers.questionTimer);
  clearTimeout(game.timers.answerTimer);
  
  delete games[gameId];
  console.log(`endGame: Game ${gameId} has been cleaned up.`);
};

function sendQuestion(gameId) {
  const game = games[gameId];
  if (!game) {
    console.error(`sendQuestion: Game ${gameId} not found.`);
    return;
  }

  if (game.currentQuestionIndex >= game.totalQuestions) {
    endGame(gameId);
    return;
  }

  const question = game.questions[game.currentQuestionIndex];
  const shuffledAnswers = shuffleAnswers2([
    ...question.incorrectAnswers,
    question.correctAnswer,
  ]);

  game.answersSubmitted = {};

  io.to(gameId).emit('newQuestion', {
    questionIndex: game.currentQuestionIndex,
    question: question.question,
    answers: shuffledAnswers,
    totalQuestions: game.totalQuestions,
  });

  console.log(`Sent newQuestion to gameId: ${gameId}, questionIndex: ${game.currentQuestionIndex}`);

  game.timers.questionTimer = setTimeout(() => {
    showAnswer(gameId, game.currentQuestionIndex);
  }, 10000); // 10 seconds
}

function startGameLoop(gameId) {
  console.log(`Attempting to start game loop for gameId: ${gameId}`);
  const game = games[gameId];

  if (!game) {
    console.error(`startGameLoop: Game ${gameId} not found.`);
    return;
  }

  if (game.isStarted) {
    console.log(`Game ${gameId} is already started.`);
    return;
  }

  console.log(`Starting game loop for gameId: ${gameId}`);

  game.isStarted = true;
  game.currentQuestionIndex = 0;
  game.totalQuestions = game.questions.length;

  console.log(`Starting game loop for gameId: ${gameId}`);

  sendQuestion(gameId);
}

io.on("connection", (socket) => {
  console.log(`A player connected: ${socket.id}`);

  socket.on('authenticated', (userId) => {
    if (userIdToSocketIds.has(userId)) {
      userIdToSocketIds.get(userId).add(socket.id);
    } else {
      userIdToSocketIds.set(userId, new Set([socket.id]));
    }
    socketIdToUserId.set(socket.id, userId);
    console.log(`User ${userId} authenticated with socket ID ${socket.id}`);
    console.log('Current User Mappings:', Array.from(userIdToSocketIds.entries()));
  });

  socket.on("createGame", ({ gameId, category, difficulty }) => {
    if (games[gameId]) {
      socket.emit('error', { message: 'Game ID already exists.' });
      console.log(`createGame: Game ID ${gameId} already exists.`);
      return;
    }
  
    if (games[gameId]) {
      socket.emit('error', { message: 'Game ID already exists.' });
      console.error(`createGame: Game ID ${gameId} already exists.`);
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
      answersSubmitted: {},
      isStarted: false,
      currentQuestionIndex: 0,
      totalQuestions: 0,
    };

    games[gameId].answers[socket.id] = {};
    games[gameId].scores[socket.id] = 0;
    games[gameId].ready[socket.id] = false; 

    socket.join(gameId);
    socket.emit("waitingForOpponent", { gameId });
    console.log(`Game ${gameId} created by ${socket.id}`);
  });

  // Handle game joining via 'joinGame'
  socket.on("joinGame", async ({ gameId }) => {
    console.log(`${socket.id} attempting to join game ${gameId}`);

    const game = games[gameId];

    if (game) {
      if (!game.player2) {
        game.player2 = socket.id;

        games[gameId].answers[socket.id] = {};
        games[gameId].scores[socket.id] = 0;
        games[gameId].ready[socket.id] = false;

        socket.join(gameId);
        socket.emit("gameJoined", { gameId });

        console.log(`Player ${socket.id} joined game ${gameId}`);

        try {
          const questions = await fetchTriviaQuestions(10, game.category, game.difficulty);
          game.questions = questions;

          console.log(`joinGame: Questions fetched for game ${gameId}. Total Questions: ${questions.length}`);
          console.log('First Question:', questions[0]);

          const player1UserId = socketIdToUserId.get(game.player1);
          const player2UserId = socketIdToUserId.get(game.player2);

          // Emit 'gameStarted' to both players with user IDs
          io.to(game.player1).emit('gameStarted', { 
            gameId, 
            opponentId: player2UserId, 
            playerId: player1UserId,
            totalQuestions: questions.length,
          });

          io.to(game.player2).emit('gameStarted', { 
            gameId, 
            opponentId: player1UserId, 
            playerId: player2UserId,
            totalQuestions: questions.length,
          });

          console.log(`Emitted gameStarted to Player1: ${player1UserId} and Player2: ${player2UserId}`);

          // Start the game loop
          startGameLoop(gameId);
          console.log(`startGameLoop called for gameId: ${gameId}`);
        } catch (error) {
          console.error('Error fetching questions:', error);
          io.to(gameId).emit('error', { message: 'Failed to fetch questions.' });
          delete games[gameId];
          console.log(`joinGame: Game ${gameId} deleted due to error.`);
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

  socket.on('gameInvite', ({ gameId, friendId, inviterId, senderName }) => {
    console.log('sending invite to ', { gameId, friendId, inviterId, senderName})

    const recipientSocketIds = userIdToSocketIds.get(friendId);

    if (recipientSocketIds && recipientSocketIds.size > 0) {
      recipientSocketIds.forEach((recipientSocketId) => {
        io.to(recipientSocketId).emit('gameInviteReceived', {
          gameId,
          inviterId,
          senderName,
        });
        console.log(`Invite sent to ${friendId} with socket ID ${recipientSocketId}`);
      });
    } else {
      // Notify the inviter that the friend is not online
      socket.emit('error', { message: 'Friend is not online.' });
      console.log(`Failed to send invite to ${friendId}: Friend not online.`);
    }
  });

  // Handle acceptance of game invitations
  socket.on('acceptGameInvite', async ({ gameId, opponentId }) => {
    console.log(`Player ${socket.id} accepted invite to join game ${gameId} from ${opponentId}`);

    const game = games[gameId];

    if (!game) {
      socket.emit('error', { message: 'Game not found.' });
      console.log(`acceptGameInvite: Game ${gameId} not found.`);
      return;
    }
  
    if (game.player2) {
      socket.emit('error', { message: 'Game already has two players.' });
      console.log(`acceptGameInvite: Game ${gameId} already has two players.`);
      return;
    }

    game.player2 = socket.id

    games[gameId].answers[socket.id] = {};
    games[gameId].scores[socket.id] = 0;
    games[gameId].ready[socket.id] = false;

    socket.join(gameId);
    socket.emit("gameJoined", { gameId });

    console.log(`Player ${socket.id} joined game ${gameId}`);

    try {
      const questions = await fetchTriviaQuestions(10, game.category, game.difficulty);
      game.questions = questions;

      console.log(`acceptGameInvite: Questions fetched for game ${gameId}. Total Questions: ${questions.length}`);
      console.log('First Question:', questions[0]);

      const player1UserId = socketIdToUserId.get(game.player1);
      const player2UserId = socketIdToUserId.get(game.player2);

      // Emit 'gameStarted' to both players with user IDs
      io.to(game.player1).emit('gameStarted', { 
        gameId, 
        opponentId: player2UserId, 
        playerId: player1UserId,
        totalQuestions: questions.length,
      });

      io.to(game.player2).emit('gameStarted', { 
        gameId, 
        opponentId: player1UserId, 
        playerId: player2UserId,
        totalQuestions: questions.length,
      });

      console.log(`Emitted gameStarted to Player1: ${player1UserId} and Player2: ${player2UserId}`);

      if (!game.isStarted) {
        game.isStarted = true;
        startGameLoop(gameId);
        console.log(`startGameLoop called for gameId: ${gameId}`);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      io.to(gameId).emit('error', { message: 'Failed to fetch questions.' });
      delete games[gameId];
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
    game.answersSubmitted[socket.id] = true;

    const userId = socketIdToUserId.get(socket.id);
    console.log(`Player ${userId} answered question ${questionIndex}: ${answer}`);

    const bothAnswered = [game.player1, game.player2].every(player => game.answersSubmitted[player])

    if (bothAnswered) {
      console.log(`Both players have answered question ${questionIndex} in game ${gameId}. Showing answer immediately.`);

      clearTimeout(game.timers.questionTimer);

      showAnswer(gameId, questionIndex);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);

    const userId = socketIdToUserId.get(socket.id);
    if (userId) {
      const socketIdSet = userIdToSocketIds.get(userId);
      if (socketIdSet) {
        socketIdSet.delete(socket.id);
        console.log(`Removed socket ID ${socket.id} from user ${userId}`);

        if (socketIdSet.size === 0) {
          userIdToSocketIds.delete(userId);
          console.log(`User ${userId} has no more active connections and was removed from mappings.`);
        }
      }
      socketIdToUserId.delete(socket.id);
    }
  
    // Handle game disconnection
    for (let gameId in games) {
      const game = games[gameId];
      if (game.player1 === socket.id || game.player2 === socket.id) {
        const opponentId = game.player1 === socket.id ? game.player2 : game.player1;

        if (opponentId) {
          io.to(opponentId).emit("opponentLeft");
          console.log(`Emitted opponentLeft to ${opponentId}`);
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

const showAnswer = (gameId, questionIndex) => {
  const game = games[gameId];

  if (!game) {
    console.error(`showAnswer: Game ${gameId} not found.`);
    return;
  }

  const question = game.questions[questionIndex]
  const correctAnswer = question.correctAnswer;

  [game.player1, game.player2].forEach((playerId) => {
    const answer = game.answers[playerId][questionIndex];
    if (answer === correctAnswer) {
      game.scores[playerId] = (game.scores[playerId] || 0) + 1;
      console.log(
        `showAnswer: Player ${playerId} answered correctly. Score: ${game.scores[playerId]}`
      );
    } else {
      console.log(
        `showAnswer: Player ${playerId} answered incorrectly or did not answer.`
      );
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
    game.currentQuestionIndex += 1;
    const sendQuestion = () => {
      if (game.currentQuestionIndex >= game.totalQuestions) {
        endGame(gameId);
        return;
      }

      const question = game.questions[game.currentQuestionIndex];

      // Verify the question structure
      if (
        !question ||
        typeof question.question !== 'string' ||
        !question.correctAnswer ||
        !Array.isArray(question.incorrectAnswers)
      ) {
        console.error(
          `sendQuestion: Invalid question structure for questionIndex ${game.currentQuestionIndex} in game ${gameId}.`
        );
        endGame(gameId);
        return;
      }

      const shuffledAnswers = shuffleAnswers2([
        ...question.incorrectAnswers,
        question.correctAnswer,
      ]);

      // Reset answer tracking for the new question
      game.answersSubmitted = {};

      // Emit 'newQuestion' event with correct data
      io.to(gameId).emit('newQuestion', {
        questionIndex: game.currentQuestionIndex,
        question: question.question,
        answers: shuffledAnswers,
        totalQuestions: game.totalQuestions,
      });

      // Start 20-second timer for answering
      game.timers.questionTimer = setTimeout(() => {
        console.log(
          `sendQuestion: Time up for question ${game.currentQuestionIndex + 1} in game ${gameId}. Showing answer.`
        );
        showAnswer(gameId, game.currentQuestionIndex);
      }, 20000); // 20 seconds
    };

    sendQuestion();
  }, 10000); // 10 seconds
};


function endGame(gameId) {
  const game = games[gameId];

  if (!game) return;

  console.log(`Ending game ${gameId}.`);
  
  const score1 = game.scores[game.player1] || 0;
  const score2 = game.scores[game.player2] || 0;

  let result;
  if (score1 > score2) {
    result = {
      winner: game.player1,
      loser: game.player2,
    };
    console.log(`endGame: Player ${game.player1} wins against Player ${game.player2}.`);
  } else if (score2 > score1) {
    result = {
      winner: game.player2,
      loser: game.player1,
    };
    console.log(`endGame: Player ${game.player2} wins against Player ${game.player1}.`);
  } else {
    result = {
      winner: null,
    };
    console.log(`endGame: Game ${gameId} ended in a tie.`);
  }

  io.to(gameId).emit('gameOver', {
    scores: game.scores,
    result,
  });

  clearTimeout(game.timers.questionTimer);
  clearTimeout(game.timers.answerTimer);
  
  delete games[gameId];
  console.log(`endGame: Game ${gameId} has been cleaned up.`);
}

function shuffleAnswers2(answers) {
  let shuffled = [...answers];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};