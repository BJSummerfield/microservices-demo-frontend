import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_USERS } from '../graphql/queries';
import { DELETE_USER } from '../graphql/mutations';
import { USER_CREATED } from '../graphql/subscriptions';
import UserForm from './UserForm';
import './UserList.css';

const UserList = () => {
  const { loading, error, data, subscribeToMore } = useQuery(GET_ALL_USERS);
  const [deleteUser] = useMutation(DELETE_USER);
  const [userFormVisible, setUserFormVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  console.log('data', data);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: USER_CREATED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newUser = subscriptionData.data.userCreated;

        newUser.name = newUser.name || { id: newUser.id, name: null };
        newUser.birthday = newUser.birthday || { id: newUser.id, birthday: null }

        const existingUsers = prev.getAllUsers || [];
        if (existingUsers.some(user => user.id === newUser.id)) {
          return prev; // Prevent duplicate entries
        }

        return {
          ...prev,
          getAllUsers: [newUser, ...existingUsers]
        };
      },
      onError: (err) => {
        console.error('Subscription error:', err);
        console.error('message', err.message);
      }
    });

    return () => unsubscribe();
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
