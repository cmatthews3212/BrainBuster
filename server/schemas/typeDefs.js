const typeDefs = `
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    avatar: String
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
    currentQuestionIndex: Int
    state: String
    createdAt: String
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
    addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
    updateUser(firstName: String, lastName: String, email: String, password: String): User
    login(email: String!, password: String!): Auth
    createGame: Game
    joinGame(gameId: ID!): Game
  }
`;

module.exports = typeDefs;
