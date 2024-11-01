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
    seed: String!
    src: String!
    size: Int
    hair: String
  }

  type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, password: String!, avatar: Avatar!): Auth
    addAvatar(userId: ID!, seed: String!, src: String!, size: Int, hair: String): Avatar
    updateUser(firstName: String, lastName: String, email: String, password: String): User
    updateAvatar(userId: ID!, seed: String, src: String, size: Int, hair: String): Avatar
    login(email: String!, password: String!): Auth
    createGame(amount: Int, category: String, difficulty: String): Game
    joinGame(gameId: ID!): Game
  }
`;

module.exports = typeDefs;
