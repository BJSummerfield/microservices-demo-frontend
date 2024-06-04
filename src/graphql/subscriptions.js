import { gql } from '@apollo/client';

export const USER_UPDATES = gql`
  subscription OnUserUpdated{
    userUpdates {
      action 
      data {
        __typename
        ... on User {
          id
          email
        }
        ... on Name {
          id
          name
        }
        ... on Birthday {
          id
          birthday
        }
      }
    }
  }
`;

