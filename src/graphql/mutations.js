import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $birthday: String!) {
    createUser(username: $username, birthday: $birthday) {
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

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $username: String, $birthday: String) {
    updateUser(id: $id, username: $username, birthday: $birthday) {
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

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;
