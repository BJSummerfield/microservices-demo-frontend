import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_USER, UPDATE_USER } from '../graphql/mutations';
import './UserForm.css';

const UserForm = ({ user, onClose }) => {
  const [username, setUsername] = useState('');
  const [birthday, setBirthday] = useState('');
  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);

  useEffect(() => {
    if (user) {
      setUsername(user.name.username);
      setBirthday(user.birthday.birthday);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      await updateUser({ variables: { id: user.id, username, birthday } });
    } else {
      await createUser({ variables: { username, birthday } });
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <h2>{user ? 'Edit User' : 'Create User'}</h2>
      <div>
        <label>Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div>
        <label>Birthday</label>
        <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} required />
      </div>
      <button type="submit">Submit</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default UserForm;


