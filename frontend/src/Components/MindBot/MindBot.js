import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaUser, FaPaperPlane } from 'react-icons/fa';
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
            // Add initial welcome message
            setMessages([
                {
                    type: 'bot',
                    content: "Hello! I'm your Mental Health Assistant. I'm here to help you with mental health concerns, stress management, and emotional well-being. How are you feeling today?"
                }
            ]);
        }
    }, [navigate]);

    const getMockDiseasePrompt = (userInput) => {
        const symptoms = userInput.toLowerCase();
        let specializedPrompt = `You are a mental health professional assistant. The user says: "${userInput}". 
        Analyze their message and provide a thoughtful, empathetic response. Consider these aspects:

        1. Emotional State Assessment
        2. Potential Mental Health Concerns
        3. Coping Strategies
        4. Professional Help Recommendations
        5. Supportive Resources

        Common conditions to consider:
        - Anxiety Disorders
        - Depression
        - Stress-related issues
        - Sleep problems
        - Mood disorders
        - Panic attacks
        - Social anxiety
        - Work-related stress
        - Relationship issues
        - Self-esteem concerns
        - Grief and loss
        - Trauma-related stress

        Provide a response that:
        1. Shows empathy and understanding
        2. Offers practical advice
        3. Suggests professional help when needed
        4. Includes relevant coping techniques
        5. Maintains a supportive and non-judgmental tone

        Format the response in a clear, easy-to-read manner.`;

        return specializedPrompt;
    };

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

            const prompt = getMockDiseasePrompt(input);
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
                content: "I apologize, but I encountered an error. Please try rephrasing your question or seek professional help if you need immediate assistance."
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
                    <FaRobot className="bot-icon" />
                    <div className="header-text">
                        <h1>Mind Bot</h1>
                        <p>Your Mental Wellness Assistant</p>
                    </div>
                </div>
                <div className="messages">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.type}`}>
                            <div className="message-icon">
                                {message.type === 'bot' ? <FaRobot /> : <FaUser />}
                            </div>
                            <div className="message-content">
                                {message.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="message bot">
                            <div className="message-icon">
                                <FaRobot />
                            </div>
                            <div className="message-content loading">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
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
                        disabled={loading}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="send-button"
                    >
                        <FaPaperPlane />
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
        max-width: 800px;
        height: 80vh;
        background: white;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .header {
        background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
        color: white;
        padding: 1.5rem 2rem;
        display: flex;
        align-items: center;
        gap: 1rem;

        .bot-icon {
            font-size: 2rem;
            background: rgba(255, 255, 255, 0.2);
            padding: 0.5rem;
            border-radius: 50%;
        }

        .header-text {
            h1 {
                margin: 0;
                font-size: 1.5rem;
                font-weight: 600;
            }

            p {
                margin: 0;
                font-size: 0.9rem;
                opacity: 0.9;
            }
        }
    }

    .messages {
        flex: 1;
        padding: 2rem;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-track {
            background: #f1f1f1;
        }

        &::-webkit-scrollbar-thumb {
            background: #9333ea;
            border-radius: 3px;
        }

        .message {
            display: flex;
            gap: 1rem;
            max-width: 80%;

            &.user {
                margin-left: auto;
                flex-direction: row-reverse;

                .message-content {
                    background: #9333ea;
                    color: white;
                    border-radius: 20px 20px 0 20px;
                }

                .message-icon {
                    background: #9333ea;
                }
            }

            &.bot {
                margin-right: auto;

                .message-content {
                    background: #f3f4f6;
                    color: #1f2937;
                    border-radius: 20px 20px 20px 0;
                }

                .message-icon {
                    background: #9333ea;
                }
            }

            .message-icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                flex-shrink: 0;
            }

            .message-content {
                padding: 1rem 1.5rem;
                font-size: 1rem;
                line-height: 1.5;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

                &.loading {
                    .typing-indicator {
                        display: flex;
                        gap: 0.5rem;
                        padding: 0.5rem 0;

                        span {
                            width: 8px;
                            height: 8px;
                            background: #9333ea;
                            border-radius: 50%;
                            animation: bounce 1.4s infinite ease-in-out;

                            &:nth-child(1) { animation-delay: -0.32s; }
                            &:nth-child(2) { animation-delay: -0.16s; }
                        }
                    }
                }
            }
        }
    }

    .input-section {
        padding: 1.5rem;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 1rem;
        background: white;

        input {
            flex: 1;
            padding: 1rem 1.5rem;
            border: 2px solid #e5e7eb;
            border-radius: 25px;
            font-size: 1rem;
            transition: all 0.3s ease;

            &:focus {
                outline: none;
                border-color: #9333ea;
                box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
            }

            &::placeholder {
                color: #9ca3af;
            }

            &:disabled {
                background: #f3f4f6;
                cursor: not-allowed;
            }
        }

        .send-button {
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 25px;
            background: #9333ea;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover:not(:disabled) {
                background: #7e22ce;
                transform: scale(1.05);
            }

            &:disabled {
                background: #9ca3af;
                cursor: not-allowed;
            }
        }
    }

    @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
    }

    @media (max-width: 768px) {
        padding: 1rem;

        .chat-container {
            height: calc(100vh - 2rem);
            border-radius: 15px;
        }

        .header {
            padding: 1rem 1.5rem;

            .bot-icon {
                font-size: 1.5rem;
            }

            .header-text {
                h1 {
                    font-size: 1.2rem;
                }

                p {
                    font-size: 0.8rem;
                }
            }
        }

        .messages {
            padding: 1rem;
            gap: 1rem;

            .message {
                max-width: 90%;

                .message-content {
                    padding: 0.75rem 1rem;
                    font-size: 0.9rem;
                }
            }
        }

        .input-section {
            padding: 1rem;

            input {
                padding: 0.75rem 1rem;
            }

            .send-button {
                width: 45px;
                height: 45px;
            }
        }
    }
`;

export default MindBot; 