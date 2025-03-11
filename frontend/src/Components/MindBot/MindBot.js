import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaStethoscope, FaSpinner } from 'react-icons/fa';
import { GoogleGenerativeAI } from '@google/generative-ai';

function MindBot() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/');
        } else {
            setUser(JSON.parse(userData));
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
                    <FaStethoscope className="stethoscope-icon" />
                    <span>Mind Bot - Your Mental Wellness Assistant</span>
                </div>
                <div className="messages">
                    <div className="welcome-message">
                        <h2>Hello! I'm your Mental Wellness Assistant</h2>
                        <p>How can I help you today?</p>
                    </div>
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
                                <FaSpinner className="spinner" />
                                <p>Analyzing your request...</p>
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
        display: flex;
        align-items: center;
        gap: 1rem;

        .stethoscope-icon {
            font-size: 1.5rem;
            color: #9333ea;
        }
    }

    .welcome-message {
        text-align: center;
        padding: 2rem;
        color: #2d3748;

        h2 {
            margin: 0 0 1rem;
            font-size: 1.5rem;
        }

        p {
            color: #4a5568;
        }
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
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;

                    .spinner {
                        font-size: 2rem;
                        animation: spin 1s linear infinite;
                    }

                    p {
                        margin: 0;
                    }
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
            padding: 0.75rem 1.5rem;
            background: #2d3748;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.2s;

            &:hover:not(:disabled) {
                background: #1a202c;
            }

            &:disabled {
                background: #9ca3af;
                cursor: not-allowed;
            }
        }
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @media (max-width: 768px) {
        padding: 1rem;

        .chat-container {
            min-height: calc(100vh - 2rem);
        }

        .messages {
            padding: 1rem;
        }

        .input-section {
            padding: 1rem;
        }
    }
`;

export default MindBot; 