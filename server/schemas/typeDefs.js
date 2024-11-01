const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar JSON

  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    avatarUrl: String
    avatarStyle: String
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

  type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, password: String!, avatarStyle: String!): Auth
    updateUser(firstName: String, lastName: String, email: String, password: String): User
    login(email: String!, password: String!): Auth
    createGame(amount: Int, category: String, difficulty: String): Game
    joinGame(gameId: ID!): Game
  }
`;

module.exports = typeDefs;
