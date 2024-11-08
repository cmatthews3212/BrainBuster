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
  mutation CreateGame($amount: Int!, $category: String!, $difficulty: String!) {
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

export const UPDATE_USER = gql`
  mutation updateUser($userId: ID!) {
    updateUser(userId: $userId) {
      _id
      friends
    }
  }
`;

export const ADD_FRIEND = gql`
  mutation addFriend($userId: ID!, $friendId: ID!, $firstName: String!, $lastName: String!, $email: String!) {
    addFriend(userId: $userId, friendId: $friendId, firstName: $firstName, lastName: $lastName, email: $email) {
      _id
      friendRequests {
        _id
        firstName
        lastName
        email
      }
      friends {
        _id
        firstName
        lastName
        email
      }
    }
  }
`;

export const SEND_FRIEND_REQUEST = gql`
  mutation sendFriendRequest($userId: ID!, $friendId: ID!, $firstName: String!, $lastName: String!, $email: String!) {
    sendFriendRequest(userId: $userId, friendId: $friendId, firstName: $firstName, lastName: $lastName, email: $email) {
      _id
      friendRequests {
        _id
        firstName
        lastName
        email
      }
    }
  }
`;



export const DECLINE_FRIEND_REQUEST = gql`
  mutation declineFriendRequest($userId: ID!, $friendId: ID!) {
    declineFriendRequest(userId: $userId, friendId: $friendId) {
      _id
      friendRequests {
        _id
        firstName
        lastName
        email
      }
    }
  }
`;

export const REMOVE_FRIEND = gql`
  mutation removeFriend($userId: ID!, $friendId: ID!) {
    removeFriend(userId: $userId, friendId: $friendId) {
      _id
      friends {
        _id
        firstName
        lastName
        email
      }
    }
  }
`;

export const ADD_AVATAR = gql`
  mutation addAvatar($userId: ID!, $avatar: AvatarInput) {
    addAvatar(userId: $userId, avatar: $avatar){
      src
    }
  }
`;

export const UPDATE_AVATAR = gql`
  mutation updateAvatar($userId: ID!, $avatar: AvatarInput) {
    updateAvatar(userId: $userId, avatar: $avatar){
      src
    }
  }
`;