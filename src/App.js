import React from 'react';
import ApolloProviderComponent from './ApolloClient';
import UserList from './components/UserList';
import './App.css';

const App = () => {
  return (
    <ApolloProviderComponent>
      <div className="App">
        <UserList />
      </div>
    </ApolloProviderComponent>
  );
};

export default App;

