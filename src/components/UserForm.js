import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_USER, UPDATE_NAME, UPDATE_BIRTHDAY } from '../graphql/mutations';
import './UserForm.css';

const UserForm = ({ user, onClose }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [birthday, setBirthday] = useState('');
  const [createUser] = useMutation(CREATE_USER);
  const [updateName] = useMutation(UPDATE_NAME);
  const [updateBirthday] = useMutation(UPDATE_BIRTHDAY);

  useEffect(() => {
    if (user) {
      setEmail(user?.email);
      setUsername(user?.name?.name);
      setBirthday(user?.birthday?.birthday);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      const updates = [];
      if (username !== user.name?.name) {
        updates.push(updateName({ variables: { id: user.id, name: username } }));
      }
      if (birthday !== user.birthday?.birthday) {
        updates.push(updateBirthday({ variables: { id: user.id, birthday } }));
      }
      await Promise.all(updates);
    } else {
      await createUser({ variables: { email } });
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <h2>{user ? 'Edit User' : 'Create User'}</h2>
      {!user && (
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
      )}
      {user && (
        <div>
          <div>
            <label>Email</label>
            <input type="email" value={email} disabled />
          </div>
          <div>
            <label>Name</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label>Birthday</label>
            <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
          </div>
        </div>
      )}
      <button type="submit">Submit</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default UserForm;
