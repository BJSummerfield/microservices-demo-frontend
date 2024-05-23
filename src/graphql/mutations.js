import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($email: String!) {
    createUser(email: $email) {
      id
      email
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String, $birthday: String) {
    updateUser(id: $id, name: $name, birthday: $birthday) {
      id
      email
      name {
        name
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
