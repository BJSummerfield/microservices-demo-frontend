//experimenting with component level subscriptions and updates,  
//this should probably be handled in the apollo client and directly
//update cache with typePolicies

import { USER_UPDATES } from '../graphql/subscriptions';
import { useEffect } from 'react';
import { useApolloClient } from '@apollo/client';

export const useUserUpdates = (subscribeToMore) => {
  const client = useApolloClient();
  useEffect(() => {
    const unsubscribeFromUserUpdates = subscribeToMore({
      document: USER_UPDATES,
      updateQuery: (prev, { subscriptionData }) => {
        console.log(' DATA', subscriptionData);
        if (!subscriptionData.data) return prev;
        const { action, data } = subscriptionData?.data?.userUpdates;

        switch (action) {
          case 'userCreated':
            return handleUserCreated(prev, data);
          case 'userDeleted':
            return handleUserDeleted(client.cache, data);
          case 'birthdayUpdated':
            return handleBirthdayUpdated(prev, data);
          case 'nameUpdated':
            return handleNameUpdated(prev, data);
          default:
            return prev;
        }
      }
    });

    return () => {
      unsubscribeFromUserUpdates();
    };
  }, [subscribeToMore]);
};

const handleUserCreated = (prev, data) => {
  if (!data || !data.id) {
    console.error("Invalid user data:", data);
    return prev;
  }

  const newUserData = {
    ...data,
    name: data.name || { id: data.id, name: null },
    birthday: data.birthday || { id: data.id, birthday: null }
  };

  const existingUsers = prev.getAllUsers;
  if (existingUsers.some(user => user.id === data.id)) {
    return prev;
  }

  return {
    ...prev,
    getAllUsers: [newUserData, ...existingUsers]
  };
};

const handleUserDeleted = (cache, data) => {
  if (!data || !data.id) {
    console.error("Received null or undefined ID for deleted user.");
    return;
  }

  cache.modify({
    fields: {
      getAllUsers(existingUserRefs = [], { readField }) {
        return existingUserRefs.filter(
          userRef => readField('id', userRef) !== data.id
        );
      }
    }
  });

  // Evict user from the cache manually evict their orphaned id's
  const userIdent = cache.identify({ __typename: 'User', id: data.id });
  const nameIdent = cache.identify({ __typename: 'Name', id: data.id });
  const birthdayIdent = cache.identify({ __typename: 'Birthday', id: data.id });

  if (userIdent) cache.evict({ id: userIdent });
  if (nameIdent) cache.evict({ id: nameIdent });
  if (birthdayIdent) cache.evict({ id: birthdayIdent });
};

const handleBirthdayUpdated = (prev, data) => {
  if (!data || !data.id) {
    console.error("Received null or undefined ID for updated user.");
    return prev;
  }
  return {
    ...prev,
    getAllUsers: prev.getAllUsers.map(user => user.id === data.id ? { ...user, birthday: data } : user)
  };
};

const handleNameUpdated = (prev, data) => {
  if (!data || !data.id) {
    console.error("Received null or undefined ID for updated user.");
    return prev;
  }
  return {
    ...prev,
    getAllUsers: prev.getAllUsers.map(user => user.id === data.id ? { ...user, name: data } : user)
  };
};

