import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { InnerLayout } from '../../styles/Layouts';
import send_icon from '../../img/send_icon.png'
import user_icon from '../../img/user_icon.png'
import { useGlobalContext } from '../../context/Context';
import DoctorLoader from './DoctorLoader';
import StethoscopeIcon from './StethoscopeIcon';

const MentalWellness = () => {
  const { input, setInput, onSent, recentPrompt, showResult, loading, resultData } = useGlobalContext();
  const [chatHistory, setChatHistory] = useState([]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      onSent();
      setChatHistory([...chatHistory, { type: 'user', content: input }]);
      setInput('');
    }
  };

  useEffect(() => {
    if (resultData) {
      setChatHistory([...chatHistory, { type: 'bot', content: resultData }]);
    }
  }, [resultData]);

  return (
    <MentalWellnessStyled>
      <div className="chat-container">
        <div className="chat-header">
          <h2>Mind Bot - Your Mental Wellness Assistant</h2>
        </div>
        <div className="chat-messages">
          {chatHistory.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              <div className="message-content">
                {message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message bot">
              <div className="message-content loading">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
        <div className="chat-input">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            rows="3"
          />
          <button onClick={handleSend} disabled={loading}>
            Send
          </button>
        </div>
      </div>
    </MentalWellnessStyled>
  )
}

const MentalWellnessStyled = styled.div`
  padding: 2rem;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .chat-container {
    width: 100%;
    max-width: 800px;
    height: 80vh;
    background: white;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
  }

  .chat-header {
    padding: 1rem;
    background: #2c3e50;
    color: white;
    border-radius: 10px 10px 0 0;
    text-align: center;
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }

  .message {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
  }

  .message.user {
    align-items: flex-end;
  }

  .message-content {
    max-width: 70%;
    padding: 0.8rem;
    border-radius: 10px;
    background: #f0f2f5;
  }

  .message.user .message-content {
    background: #2c3e50;
    color: white;
  }

  .chat-input {
    padding: 1rem;
    border-top: 1px solid #eee;
    display: flex;
    gap: 1rem;
  }

  textarea {
    flex: 1;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    resize: none;
  }

  button {
    padding: 0.8rem 1.5rem;
    background: #2c3e50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
      background: #34495e;
    }

    &:disabled {
      background: #95a5a6;
      cursor: not-allowed;
    }
  }

  .loading {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
  }

  .loading span {
    width: 8px;
    height: 8px;
    background: #2c3e50;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;
  }

  .loading span:nth-child(1) { animation-delay: -0.32s; }
  .loading span:nth-child(2) { animation-delay: -0.16s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
`;

export default MentalWellness;