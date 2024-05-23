import { gql } from '@apollo/client';

export const USER_EVENTS = gql`
  subscription OnUserEvent {
    userEvent {
      type
      user {
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
  }
`;
