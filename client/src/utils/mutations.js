import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        email
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

export const ADD_AVATAR = gql`
  mutation addAvatar($userId: ID!, $avatar: avatarInput!) {
    addAvatar(userId: $userId, avatar: $avatar){
      _id
      email
      avatar {
        _id
        seed
        size
        hair
      }
    }
  }
`;

export const UPDATE_AVATAR = gql`
  mutation updateAvatar($userId: ID!, $avatar: AvatarInput!) {
    updateAvatar(userId: $userId, avatar: $avatar){
      _id
      email
      avatar {
        seed
        size
        hair
      }
    }
  }
`;