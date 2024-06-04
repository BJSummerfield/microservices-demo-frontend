import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_USERS } from '../graphql/queries';
import { DELETE_USER } from '../graphql/mutations';
import { USER_UPDATES } from '../graphql/subscriptions';
import UserForm from './UserForm';
import './UserList.css';

const UserList = () => {
  const { loading, error, data, subscribeToMore } = useQuery(GET_ALL_USERS);
  const [deleteUser] = useMutation(DELETE_USER);
  const [userFormVisible, setUserFormVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  console.log('data', data);


  useEffect(() => {
    const unsubscribeFromUserUpdates = subscribeToMore({
      document: USER_UPDATES,
      updateQuery: (prev, { subscriptionData }) => {
        console.log(' DATA', subscriptionData);
        if (!subscriptionData.data) return prev;
        const { action, data } = subscriptionData?.data?.userUpdates;

        switch (action) {
          case 'userCreated': {
            if (!data || !data.id) {
              console.error("Invalid user data:", data);
              return prev;
            }

            data.name = data.name || { id: data.id, name: null };
            data.birthday = data.birthday || { id: data.id, birthday: null };

            if (!prev || !prev.getAllUsers) {
              console.error("Previous data is null or invalid:", prev);
              return {
                getAllUsers: [data]
              };
            }

            const existingUsers = prev.getAllUsers;
            if (existingUsers.some(user => user.id === data.id)) {
              return prev;
            }

            return {
              ...prev,
              getAllUsers: [data, ...existingUsers]
            };
          }
          case 'userDeleted': {
            if (!data) return prev;
            const deletedUserId = data.id;

            if (!deletedUserId) {
              console.error("Received null or undefined ID for deleted user.");
              return prev;
            }

            const existingUsers = prev.getAllUsers || [];
            const updatedUsers = existingUsers.filter(user => user.id !== deletedUserId);

            return {
              ...prev,
              getAllUsers: updatedUsers
            };
          }
        }
      }
    });

    return () => {
      unsubscribeFromUserUpdates();
    };
  }, [subscribeToMore]);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const handleDelete = async (id) => {
    await deleteUser({ variables: { id } });
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setUserFormVisible(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setUserFormVisible(true);
  };

  const buildUser = (user) => {
    let string = '';
    if (user.email) string += user.email;
    if (user.name?.name) string += ` - ${user.name.name}`;
    if (user.birthday?.birthday) string += ` - ${user.birthday.birthday}`;
    return string;
  }

  return (
    <div className="user-list">
      <h1>Users</h1>
      <button onClick={handleCreate}>Create User</button>
      <ul>
        {data.getAllUsers.map((user) => (
          <li key={user?.id}>
            {buildUser(user)}
            <div>
              <button onClick={() => handleEdit(user)}>Edit</button>
              <button onClick={() => handleDelete(user.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {userFormVisible && <UserForm user={selectedUser} onClose={() => setUserFormVisible(false)} />}
    </div>
  );
};

export default UserList;
