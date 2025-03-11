import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useNavigate } from 'react-router-dom';
import { IoSend } from 'react-icons/io5';

function MindBot() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/');
        } else {
            setMessages([
                {
                    type: 'bot',
                    content: {
                        greeting: 'Hi, there!',
                        question: 'How are you feeling today?'
                    }
                }
            ]);
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
                          4. Maintain a supportive and understanding tone
                          Keep responses concise and conversational.`;

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
                <h1>Mind-Bot</h1>
                <div className="messages">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.type}`}>
                            {message.type === 'bot' && typeof message.content === 'object' ? (
                                <>
                                    <div className="greeting">{message.content.greeting}</div>
                                    <div className="question">{message.content.question}</div>
                                </>
                            ) : (
                                <div className="text">{message.content}</div>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div className="message bot">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Share your thoughts here"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="send-button"
                    >
                        <IoSend />
                    </button>
                </div>
                <div className="disclaimer">
                    Mind-Bot cannot replace professional help. If you need it, it will guide you towards qualified mental health resources.
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
    padding: 1rem;

    .chat-container {
        width: 100%;
        max-width: 800px;
        min-height: 600px;
        display: flex;
        flex-direction: column;
        position: relative;
        padding: 2rem;

        h1 {
            color: #9333ea;
            margin: 0 0 2rem;
            font-size: 2rem;
            font-weight: 600;
        }

        .messages {
            flex: 1;
            overflow-y: auto;
            margin-bottom: 2rem;
            padding: 1rem 0;

            .message {
                margin-bottom: 1.5rem;

                &.bot {
                    .greeting {
                        font-size: 2.5rem;
                        color: #3b82f6;
                        margin-bottom: 0.5rem;
                    }

                    .question {
                        font-size: 2rem;
                        color: #6b7280;
                    }

                    .text {
                        font-size: 1.1rem;
                        color: #4b5563;
                        line-height: 1.6;
                    }
                }

                &.user .text {
                    color: #1f2937;
                    font-size: 1.1rem;
                }

                .typing-indicator {
                    display: flex;
                    gap: 0.5rem;
                    padding: 0.5rem;

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

        .input-container {
            position: relative;
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;

            input {
                flex: 1;
                padding: 1rem 1.5rem;
                border: none;
                border-radius: 999px;
                background: white;
                font-size: 1rem;
                color: #1f2937;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

                &:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px #9333ea;
                }

                &::placeholder {
                    color: #9ca3af;
                }
            }

            .send-button {
                background: none;
                border: none;
                color: #9333ea;
                cursor: pointer;
                font-size: 1.5rem;
                display: flex;
                align-items: center;
                padding: 0.5rem;
                transition: transform 0.2s;

                &:hover:not(:disabled) {
                    transform: scale(1.1);
                }

                &:disabled {
                    color: #d1d5db;
                    cursor: not-allowed;
                }
            }
        }

        .disclaimer {
            text-align: center;
            color: #6b7280;
            font-size: 0.875rem;
            position: absolute;
            bottom: 1rem;
            left: 0;
            right: 0;
            padding: 0 2rem;
        }
    }

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }

    @media (max-width: 640px) {
        padding: 0.5rem;

        .chat-container {
            padding: 1rem;

            h1 {
                font-size: 1.5rem;
                margin-bottom: 1.5rem;
            }

            .messages .message.bot {
                .greeting {
                    font-size: 2rem;
                }

                .question {
                    font-size: 1.5rem;
                }
            }
        }
    }
`;

export default MindBot; 