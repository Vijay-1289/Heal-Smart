import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useNavigate } from 'react-router-dom';

function MindBot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
            // Add welcome message
            setMessages([{
                type: 'bot',
                content: "Hello! I'm your mental health companion. How are you feeling today?"
            }]);
        } else {
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

            const prompt = `You are a compassionate mental health companion. The user says: ${input}. 
                          Provide empathetic support and practical advice. Remember to:
                          1. Validate their feelings
                          2. Offer constructive suggestions
                          3. Encourage professional help when appropriate
                          4. Maintain a supportive and understanding tone`;

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
                content: "I apologize, but I'm having trouble processing your message. Please try again."
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
                <div className="chat-header">
                    <div className="user-info">
                        <img src={user?.picture} alt={user?.name} className="user-avatar" />
                        <span>{user?.name}</span>
                    </div>
                    <div className="actions">
                        <button onClick={() => navigate('/dashboard')} className="dashboard-btn">
                            Dashboard
                        </button>
                        <button 
                            onClick={() => {
                                localStorage.clear();
                                navigate('/');
                            }} 
                            className="logout-btn"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="messages-container">
                    {messages.map((message, index) => (
                        <div 
                            key={index} 
                            className={`message ${message.type}`}
                        >
                            <div className="message-content">
                                {message.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="message bot">
                            <div className="message-content typing">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="input-container">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message here..."
                        rows="3"
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
    padding: 2rem;
    background: #f7fafc;

    .chat-container {
        width: 100%;
        max-width: 800px;
        height: 80vh;
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
    }

    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #e2e8f0;

        .user-info {
            display: flex;
            align-items: center;
            gap: 1rem;

            .user-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
            }

            span {
                font-weight: 500;
                color: #2d3748;
            }
        }

        .actions {
            display: flex;
            gap: 1rem;

            button {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;

                &.dashboard-btn {
                    background: #9333ea;
                    color: white;

                    &:hover {
                        background: #7e22ce;
                    }
                }

                &.logout-btn {
                    background: #ef4444;
                    color: white;

                    &:hover {
                        background: #dc2626;
                    }
                }
            }
        }
    }

    .messages-container {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .message {
            display: flex;
            margin-bottom: 1rem;

            &.user {
                justify-content: flex-end;

                .message-content {
                    background: #9333ea;
                    color: white;
                    border-radius: 16px 16px 0 16px;
                }
            }

            &.bot .message-content {
                background: #f3f4f6;
                color: #1f2937;
                border-radius: 16px 16px 16px 0;
            }

            .message-content {
                max-width: 70%;
                padding: 1rem;
                font-size: 0.95rem;
                line-height: 1.5;

                &.typing {
                    display: flex;
                    gap: 0.5rem;
                    padding: 0.75rem 1rem;

                    span {
                        width: 8px;
                        height: 8px;
                        background: #9333ea;
                        border-radius: 50%;
                        animation: bounce 1s infinite;

                        &:nth-child(2) { animation-delay: 0.2s; }
                        &:nth-child(3) { animation-delay: 0.4s; }
                    }
                }
            }
        }
    }

    .input-container {
        padding: 1.5rem;
        border-top: 1px solid #e2e8f0;
        display: flex;
        gap: 1rem;

        textarea {
            flex: 1;
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            resize: none;
            font-family: inherit;
            font-size: 0.95rem;
            line-height: 1.5;

            &:focus {
                outline: none;
                border-color: #9333ea;
            }
        }

        button {
            padding: 0.75rem 1.5rem;
            background: #9333ea;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover:not(:disabled) {
                background: #7e22ce;
            }

            &:disabled {
                background: #cbd5e0;
                cursor: not-allowed;
            }
        }
    }

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }

    @media (max-width: 640px) {
        padding: 1rem;

        .chat-container {
            height: 90vh;
        }

        .message .message-content {
            max-width: 85%;
        }
    }
`;

export default MindBot; 