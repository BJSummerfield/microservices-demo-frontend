import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name {
        username
      }
      birthday {
        birthday
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name {
        username
      }
      birthday {
        birthday
      }
    }
  }
`;

