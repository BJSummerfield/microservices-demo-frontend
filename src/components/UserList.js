import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_USERS } from '../graphql/queries';
import { DELETE_USER } from '../graphql/mutations';
import { USER_EVENTS } from '../graphql/subscriptions';
import UserForm from './UserForm';
import MessageBox from './MessageBox';
import './UserList.css';

const UserList = () => {
  const { loading, error, data, subscribeToMore } = useQuery(GET_ALL_USERS);
  const [deleteUser] = useMutation(DELETE_USER);
  const [userFormVisible, setUserFormVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: USER_EVENTS,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { type, user } = subscriptionData.data.userEvent;

        // Update messages state
        setMessages((msgs) => [...msgs, { id: user.id, type }]);

        switch (type) {
          case 'USER_CREATED':
            return {
              ...prev,
              getAllUsers: [...prev.getAllUsers, user],
            };
          case 'USER_UPDATED':
            return {
              ...prev,
              getAllUsers: prev.getAllUsers.map(existingUser =>
                existingUser.id === user.id ? { ...existingUser, ...user } : existingUser
              ),
            };
          case 'USER_DELETED':
            return {
              ...prev,
              getAllUsers: prev.getAllUsers.filter(existingUser => existingUser.id !== user.id),
            };
          default:
            return prev;
        }
      },
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

  return (
    <div className="user-list">
      <MessageBox messages={messages} />
      <h1>Users</h1>
      <button onClick={handleCreate}>Create User</button>
      <ul>
        {data.getAllUsers.map((user) => (
          <li key={user.id}>
            {user.name.username} - {user.birthday.birthday}
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
