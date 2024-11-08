const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar JSON

  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    avatar: Avatar!
    stats: UserStats
    preferences: Preferences
    friends: [User]
    friendRequests: [User]
  }

  type UserStats {
    gamesPlayed: Int
    gamesWon: Int
  }

  type Preferences {
    colorTheme: String
  }

  type Game {
    _id: ID
    players: [User]
    questions: [Question]
    scores: JSON
    state: String
  }

  type Question {
    category: String
    id: String
    correctAnswer: String
    incorrectAnswers: [String]
    question: String
    tags: [String]
    type: String
    difficulty: String
    regions: [String]
    isNiche: Boolean
  }

  type Query {
    me: User
    user: User
    users: [User]
    game(gameId: ID!): Game
  }

  type Auth {
    token: ID
    user: User
  }

  type Avatar {
    avatarId: ID!
    src: String!
  }

  input AvatarInput {
    avatarId: ID
    src: String
  }

  type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
    addAvatar(userId: ID!, avatar: AvatarInput!): Avatar
    updateUser(firstName: String, lastName: String, email: String, password: String): User
    updateAvatar(userId: ID!, avatar: AvatarInput): Avatar
    addFriend(userId: ID!, friendId: ID!, firstName: String!, lastName: String!, email: String!): User
    sendFriendRequest(userId: ID!, friendId: ID!): User
    declineFriendRequest(userId: ID!, friendId: ID!): User
    removeFriend(userId: ID!, friendId: ID!): User
    login(email: String!, password: String!): Auth
    createGame(amount: Int!, category: String!, difficulty: String!): Game
    joinGame(gameId: ID!): Game
  }
`;

module.exports = typeDefs;
