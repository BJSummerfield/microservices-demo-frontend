import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_USERS } from '../graphql/queries';
import { DELETE_USER } from '../graphql/mutations';
import UserForm from './UserForm';
import './UserList.css';

const UserList = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_USERS);
  const [deleteUser] = useMutation(DELETE_USER);
  const [userFormVisible, setUserFormVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const handleDelete = async (id) => {
    await deleteUser({ variables: { id } });
    refetch();
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
