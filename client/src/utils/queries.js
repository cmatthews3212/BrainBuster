import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  {
    user {
      _id
      firstName
      lastName
      stats {
      gamesPlayed
      gamesWon
      }
      avatar {
        src
      }
    }
  }
`;

export const GET_ME = gql`
  query me {
    me{
      _id
      firstName
      lastName
      email
      stats {
      gamesPlayed
      gamesWon
      }
      friends {
        _id
        firstName
        lastName
        email
      }
      friendRequests {
        _id
        firstName
        lastName
        email
      }
      avatar {
        src
      }
    }
  }
`

export const QUERY_USERS = gql`
  {
    users {
        _id
        firstName
        lastName
        email
        stats {
        gamesPlayed
        gamesWon
        }
        avatar {
          src
        }
    }
}
`;

