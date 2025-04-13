import React, { useState } from 'react';
import styled from 'styled-components';
import NurseAvatar from './NurseAvatar';

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 20px;
`;

const ChatContainer = styled.div`
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const MessagesContainer = styled.div`
  height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Message = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: ${props => props.isUser ? '#e3f2fd' : '#f5f5f5'};
  max-width: 80%;
  margin-left: ${props => props.isUser ? 'auto' : '0'};
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

const AINurse = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }]);
      setInput('');
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "I'm your AI nurse. How can I help you today?", 
          isUser: false 
        }]);
      }, 1000);
    }
  };

  return (
    <Container>
      <Title>AI Nurse Assistant</Title>
      <NurseAvatar />
      <ChatContainer>
        <MessagesContainer>
          {messages.map((message, index) => (
            <Message key={index} isUser={message.isUser}>
              {message.text}
            </Message>
          ))}
        </MessagesContainer>
        <InputContainer>
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </InputContainer>
      </ChatContainer>
    </Container>
  );
};

export default AINurse; 