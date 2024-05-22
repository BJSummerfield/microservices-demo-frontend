import React from 'react';
import './MessageBox.css';

const MessageBox = ({ messages }) => {
  return (
    <div className="message-box">
      {messages.map((msg, index) => (
        <div key={index} className="message">
          User ID: {msg.id}, Event Type: {msg.type}
        </div>
      ))}
    </div>
  );
};

export default MessageBox;
