// src/components/ChatbotWidget.js

import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const WidgetContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  height: 400px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  text-align: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const MessageContainer = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
`;

const Message = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: ${props => (props.isuser ? '#007bff' : '#f1f1f1')};
  color: ${props => (props.isuser ? '#fff' : '#000')};
  align-self: ${props => (props.isuser ? 'flex-end' : 'flex-start')};
  max-width: 80%;
`;

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ChatbotWidget = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, isuser: true }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await axios.post(
        'https://puf122bwn4.execute-api.us-east-2.amazonaws.com/Dev/chatbot',
        { question: input },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Response:', response);

      const responseBody = response.data.body;
      if (responseBody && responseBody.answer) {
        const parsedAnswer = JSON.parse(responseBody.answer);
        setMessages([...newMessages, { text: parsedAnswer, isuser: false }]);
      } else {
        console.error('Unexpected response structure:', responseBody);
      }
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
    }
  };

  return (
    <WidgetContainer>
      <Header>Chatbot</Header>
      <MessageContainer>
        {messages.map((msg, index) => (
          <Message key={index} isuser={msg.isuser}>{msg.text}</Message>
        ))}
      </MessageContainer>
      <InputContainer>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend}>Send</Button>
      </InputContainer>
    </WidgetContainer>
  );
};

export default ChatbotWidget;
