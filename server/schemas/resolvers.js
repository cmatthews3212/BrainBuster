const { User, Game } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } =require('apollo-server-express');
const { fetchTriviaQuestions } = require('../utils/requests');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id);

        return user;
      }
      throw new AuthenticationError('Please log in.');
    },
    user: async (parent, args, context) => {
      const user = await User.findById(args._id);

      return user;
    },
    users: async () => {
      return User.find({});
    },
    game: async (parent, { gameId }, context) => {
      if (context.user) {
        return await Game.findById(gameId).populate('players');
      }
      throw new AuthenticationError('Please log in.')
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, {
          new: true,
        });
      }
      throw new AuthenticationError('Please log in.');
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect email or password');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect email or password');
      }

      const token = signToken(user);

      return { token, user };
    },
    createGame: async (parents, args, context) => {
      if (context.user) {
        const { amount, category, difficulty } = args;

        try {
          const questions = await fetchTriviaQuestions(amount, category, difficulty);

          if (!questions || questions.length === 0) {
            throw new Error('No trivia questions available for the specified parameters');
          }

          const game = await Game.create({
            players: [context.user._id],
            questions,
            scores: {
              [context.user._id] : 0
            },
            state: 'waiting',
          });
          return game;
        } catch (error) {
          console.error('Error:', error);
          throw new Error('Failed to create game.')
        }
      }
      throw new AuthenticationError('Please log in');
    },
    joinGame: async (parent, { gameId }, context) => {
      if (context.user) {
        const game = await Game.findById(gameId);

        if (game && game.players.length < 2) {
          game.players.push(context.user._id);
          game.scores.set(context.user._id, 0);
          await game.save();
          return game;
        } else {
          throw new Error('Game is full or does not exist')
        }
      }
      throw new AuthenticationError('Please log in');
    },
    addAvatar: async (parent, { userId, seed, src, size, hair }, context) => {
      if (!context.user) console.error('Please log in');
      const avatarData = { seed, src, size, hair };

      const user = await User.findByIdAndUpdate(
        userId,
        { avatar: avatarData},
        {
          new: true,
          runValidators: true,
        }
      );
      if (!user) {
        console.error('User not found')
      }
      return user;
    },
    updateAvatar: async (parent, { userId, seed, src, size, hair }, context) => {
      if (!context.user) console.error('Please log in');
      const avatarUpdates = {};
      if (seed) avatarUpdates['avatar.seed'] = seed;
      if (src) avatarUpdates['avatar.src'] = src;
      if (size) avatarUpdates['avatar.size'] = size;
      if (hair) avatarUpdates['avatar.hair'] = hair;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: avatarUpdates },
        { new: true, runValidators: true }
      );

      if (!updatedUser) console.error('User not found');
      return updatedUser;
    },
  },
  User: {
    avatarUrl: (user) => {
      const baseUrl = 'https://api.dicebear.com/9.x';
      const style = user.avatarStyle || 'pixel-art';
      const seed = user.avatarSeed || user._id.toString();
      return `${baseUrl}/${style}/svg?seed=${encodeURIComponent(seed)}`;
    },
  },
};

module.exports = resolvers;
