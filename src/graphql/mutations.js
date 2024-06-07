import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($email: String!) {
    createUser(email: $email) {
      id
      email
    }
  }
`;

export const UPDATE_NAME = gql`
  mutation UpdateName($id: ID!, $name: String!) {
    updateName(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_BIRTHDAY = gql`
  mutation UpdateBirthday($id: ID!, $birthday: String!) {
    updateBirthday(id: $id, birthday: $birthday) {
      id
      birthday
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
