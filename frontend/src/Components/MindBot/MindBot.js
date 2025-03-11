import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useNavigate } from 'react-router-dom';

function MindBot() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/');
        }
    }, [navigate]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = {
            type: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `You are a mental health and medical assistant. The user says: ${input}. 
                          Provide helpful medical advice and support. Remember to:
                          1. Assess the symptoms carefully
                          2. Provide practical suggestions
                          3. Recommend professional medical help when needed
                          4. Maintain a professional and caring tone
                          Keep responses clear and actionable.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            
            setMessages(prev => [...prev, {
                type: 'bot',
                content: response.text()
            }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                type: 'bot',
                content: "I apologize, but I encountered an error. Please try again or seek professional help if you need immediate assistance."
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <MindBotStyled>
            <div className="chat-container">
                <div className="header">
                    Mind Bot - Your Mental Wellness Assistant
                </div>
                <div className="messages">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.type}`}>
                            <div className="message-content">
                                {message.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="message bot">
                            <div className="message-content loading">
                                Processing your request...
                            </div>
                        </div>
                    )}
                </div>
                <div className="input-section">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message here..."
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                    >
                        Send
                    </button>
                </div>
            </div>
        </MindBotStyled>
    );
}

const MindBotStyled = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #f3e8ff;
    padding: 2rem;

    .chat-container {
        width: 100%;
        max-width: 1000px;
        min-height: 600px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .header {
        background: #2d3748;
        color: white;
        padding: 1rem 2rem;
        font-size: 1.25rem;
        font-weight: 500;
        text-align: center;
    }

    .messages {
        flex: 1;
        padding: 2rem;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .message {
            display: flex;
            justify-content: flex-end;

            &.bot {
                justify-content: flex-start;
            }

            .message-content {
                max-width: 80%;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                font-size: 1rem;
                line-height: 1.5;
                
                &.loading {
                    background: #f3f4f6;
                    color: #6b7280;
                }
            }

            &.user .message-content {
                background: #2d3748;
                color: white;
                margin-left: auto;
            }

            &.bot .message-content {
                background: #f3f4f6;
                color: #1f2937;
            }
        }
    }

    .input-section {
        padding: 1.5rem;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 1rem;

        input {
            flex: 1;
            padding: 0.75rem 1rem;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            font-size: 1rem;
            color: #1f2937;

            &:focus {
                outline: none;
                border-color: #2d3748;
            }

            &::placeholder {
                color: #9ca3af;
            }
        }

        button {
            padding: 0.75rem 2rem;
            background: #2d3748;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.2s;

            &:hover:not(:disabled) {
                background: #1f2937;
            }

            &:disabled {
                background: #9ca3af;
                cursor: not-allowed;
            }
        }
    }

    @media (max-width: 640px) {
        padding: 1rem;

        .chat-container {
            min-height: calc(100vh - 2rem);
            border-radius: 8px;
        }

        .header {
            padding: 0.75rem 1rem;
            font-size: 1.1rem;
        }

        .messages {
            padding: 1rem;

            .message .message-content {
                max-width: 90%;
            }
        }

        .input-section {
            padding: 1rem;
        }
    }
`;

export default MindBot; 