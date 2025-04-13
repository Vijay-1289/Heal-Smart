import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';
import { generateResponse } from '../../utils/api';
import ThinkingAnimation from '../shared/ThinkingAnimation';

const MindBotStyled = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: transparent;
    padding: 1rem;

    h1 {
        color: #9333ea;
        font-size: 2rem;
        margin-bottom: 1rem;
        font-weight: 600;
    }

    .chat-container {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .message {
        max-width: 90%;
        padding: 1rem;
        border-radius: 1.5rem;
        line-height: 1.6;
        font-size: 1.1rem;
        animation: fadeIn 0.3s ease-in-out;

        &.user {
            align-self: flex-end;
            background: rgba(255, 255, 255, 0.9);
            color: #333;
        }

        &.bot {
            align-self: flex-start;
            background: rgba(255, 255, 255, 0.9);
            color: #333;

            .greeting {
                font-size: 2.5rem;
                margin-bottom: 1rem;
                
                .hi {
                    color: #4a90e2;
                }
                
                .there {
                    color: #e57373;
                }
            }

            .question {
                font-size: 2rem;
                color: #9e9e9e;
                margin-bottom: 1rem;
            }

            .structured-response {
                white-space: pre-line;
            }
        }
    }

    .input-container {
        position: relative;
        margin: 2rem auto;
        width: 90%;
        max-width: 800px;

        input {
            width: 100%;
            padding: 1rem 3rem 1rem 1.5rem;
            border: none;
            border-radius: 100px;
            font-size: 1rem;
            background: rgba(255, 255, 255, 0.9);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            color: #333;

            &::placeholder {
                color: #999;
            }

            &:focus {
                outline: none;
                box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);
            }
        }

        button {
            position: absolute;
            right: 0.5rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #9333ea;
            cursor: pointer;
            padding: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.3s;

            &:hover {
                color: #7c3aed;
            }

            &:disabled {
                color: #ccc;
                cursor: not-allowed;
            }
        }
    }

    .disclaimer {
        text-align: center;
        color: #666;
        font-size: 0.9rem;
        margin-top: 1rem;
        padding: 0 1rem;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

function MindBot() {
    const [messages, setMessages] = useState([
        {
            text: {
                greeting: { hi: "Hi", there: "there!" },
                question: "How are you feeling today?"
            },
            sender: 'bot',
            isInitial: true
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const getMockDiseasePrompt = (userInput) => {
        return `You are a mental health professional assistant. The user says: "${userInput}". 
        Please provide a structured response following this exact format:

        COPING STRATEGIES:
        1. [First strategy]
        2. [Second strategy]
        3. [Third strategy]

        MEDICATIONS (if applicable):
        - [List medications with exact dosages]
        - Maximum duration: [specify days/weeks]
        - Important warnings: [list key warnings]

        LIFESTYLE CHANGES:
        - [First change]
        - [Second change]
        - [Third change]

        WHEN TO SEEK EMERGENCY HELP:
        - [First emergency sign]
        - [Second emergency sign]
        - [Third emergency sign]

        IMPORTANT NOTES:
        - Always consult a mental health professional
        - Do not exceed recommended dosages
        - Monitor for side effects
        - Follow up with your therapist if symptoms persist

        Keep each section concise and specific. Only include relevant information based on the user's condition.`;
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
        setLoading(true);

        try {
            const prompt = getMockDiseasePrompt(userMessage);
            const response = await generateResponse(prompt);
            
            setMessages(prev => [...prev, { 
                text: response,
                sender: 'bot',
                isStructured: true
            }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { 
                text: "I'm sorry, I'm having trouble connecting right now. Please try again later.", 
                sender: 'bot' 
            }]);
        } finally {
            setLoading(false);
        }
    };

    const renderMessage = (message, index) => {
        if (message.sender === 'bot') {
            if (message.isInitial) {
                return (
                    <div key={index} className={`message ${message.sender}`}>
                        <div className="greeting">
                            <span className="hi">{message.text.greeting.hi}</span>{" "}
                            <span className="there">{message.text.greeting.there}</span>
                        </div>
                        <div className="question">{message.text.question}</div>
                    </div>
                );
            } else if (message.isStructured) {
                return (
                    <div key={index} className={`message ${message.sender}`}>
                        <div className="structured-response">{message.text}</div>
                    </div>
                );
            }
        }
        return (
            <div key={index} className={`message ${message.sender}`}>
                {message.text}
            </div>
        );
    };

    return (
        <MindBotStyled>
            <h1>Mind-Bot</h1>
            <div className="chat-container" ref={chatContainerRef}>
                {messages.map((message, index) => renderMessage(message, index))}
                {loading && <ThinkingAnimation />}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Share your thoughts here"
                    disabled={loading}
                />
                <button onClick={handleSend} disabled={loading}>
                    <FaPaperPlane size={20} />
                </button>
            </div>
            <div className="disclaimer">
                Mind-Bot cannot replace professional help. If you need it, it will guide you towards qualified mental health resources.
            </div>
        </MindBotStyled>
    );
}

export default MindBot; 