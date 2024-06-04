import { gql } from '@apollo/client';

export const USER_CREATED = gql`
  subscription OnUserCreated {
    userCreated {
      id
      email
    }
  }
`;
