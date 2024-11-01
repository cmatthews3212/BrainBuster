import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    addUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      token
      user {
        _id
      }
    }
  }
`;

export const CREATE_GAME = gql`
  mutation CreateGame($amount: Int, $category: String, $difficulty: String) {
    createGame(amount: $amount, category: $category, difficulty: $difficulty) {
      _id
      players {
        _id
        firstName
      }
      questions {
        question
        correctAnswer
        incorrectAnswers
        category
        difficulty
      }
      state
      scores
    }
  }
`;