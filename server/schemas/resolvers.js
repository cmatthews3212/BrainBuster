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
      return await User.find({});
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
    deleteUser: async (parent, {userId}) => {
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
          throw new Error('user not found')
        }
       
      
      console.log('user deleted')
      return {sucess: true, message: "Deleted Sucessfully"}

    
    },
    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, {
          new: true,
        });
      }
      throw new AuthenticationError('Please log in.');
    },
    sendFriendRequest: async (parent, { userId, friendId, firstName, lastName, email }, context) => {
   
    
    
      if (!context.user) {
        console.error('Please log in');
        throw new AuthenticationError('Please log in.');
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
        console.error('User or friend not found');
        throw new AuthenticationError('User or friend not found.');
    }

    // Avoid duplicate requests
    if (!friend.friendRequests.some(request => request.userId.toString() === userId)) {
        friend.friendRequests.push({
            userId,
            firstName,
            lastName,
            email
        });
        console.log(user.friendRequests)
    }

    await friend.save();

    await friend.populate({
        path: 'friendRequests',
        select: 'userId firstName lastName email'
    });
    return friend;
    },
    declineFriendRequest: async (parent, { userId, friendId, firstName, lastName, email }, context) => {
      if (!context.user) {
        console.error('Please log in');
        throw new AuthenticationError('Please log in.');
      }
      const user = await User.findById(userId);

      if (!user) {
        console.error('User not found');
        throw new AuthenticationError('User not found.');
      }

      user.friendRequests = user.friendRequests.filter((request) => request._id.toString() !== friendId);

      await user.save();
      await user.populate('friendRequests');
      return user;
  },
  addFriend: async (parent, { userId, friendId, firstName, lastName, email }, context) => {
    if (!context.user) {
      console.error('Please log in');
      throw new AuthenticationError('Please log in.');
  }

  const user = await User.findById(userId);
  if (!user) {
      console.error('User not found');
      throw new AuthenticationError('User not found.');
  }

  const friend = await User.findById(friendId);
  if (!friend) {
      console.error('Friend not found');
      throw new AuthenticationError('Friend not found.');
  }

  const isFriend = user.friends.some((f) => f.userId.toString() === friendId);
  if (!isFriend) {
      user.friends.push({friendId, firstName, lastName, email });
  }
  await user.save();

  const isUserFriend = friend.friends.some((f) => f.userId.toString() === userId);
  if (!isUserFriend) {
      friend.friends.push({ userId, firstName: context.user.firstName, lastName: context.user.lastName, email: context.user.email });
  }
  await friend.save();

  // Populate friends for both user and friend
  await user.populate({
      path: 'friends',
      select: 'firstName lastName email'
  });

  await friend.populate({
      path: 'friends',
      select: 'firstName lastName email'
  });

  // Return both user and friend objects, or just user if that's your preference
  return {
      user,
      friend
  }
  },
    removeFriend: async (parent, { userId, friendId, firstName, lastName, email }, context) => {
        if (!context.user) {
          console.error('Please log in');
          throw new AuthenticationError('Please log in.');
        }
        const user = await User.findById(userId);

        if (!user) {
          console.error('User not found');
          throw new AuthenticationError('User not found.');
        }

        user.friends = user.friends.filter((friend) => friend._id.toString() !== friendId);

        await user.save();
        await user.populate('friends');
        return user;
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
          console.error('Error in createGame resolver:', error);
          throw new Error(error.message || 'Failed to create game.');
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
    addAvatar: async (parent, { userId, avatar }, context) => {
      if (!context.user) {
        console.error('Please log in');
        throw new AuthenticationError('Please log in.');
      }

      const user = await User.findById(userId);

      if (!user) {
        console.error('User not found');
        throw new AuthenticationError('User not found.');
      }

      user.avatar = avatar;
      await user.save();
      return user.avatar;
    },
    updateAvatar: async (parent, { userId, avatar}, context) => {
      if (!context.user) {
        console.error('Please log in');
        throw new AuthenticationError('Please log in.');
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { 'avatar.src' : avatar.src},
        {new: true}
      );

      if (!updatedUser) {
        console.error('User not found');
        throw new AuthenticationError('User not found')
      }

      return updatedUser.avatar;
      // const user = await User.findById(userId);

      // if (!user) {
      //   console.error('User not found');
      //   throw new AuthenticationError('User not found.');
      // }

      // if (avatar.src) user.avatar.src = avatar.src;
  

      //   await user.save();
      //   return user.avatar;
    },
  },
  // User: {
  //   avatarUrl: (user) => {
  //     const baseUrl = 'https://api.dicebear.com/9.x';
  //     const style = user.avatarStyle || 'pixel-art';
  //     const seed = user.avatarSeed || user._id.toString();
  //     return `${baseUrl}/${style}/svg?seed=${encodeURIComponent(seed)}`;
  //   },
  // },
};

module.exports = resolvers;
