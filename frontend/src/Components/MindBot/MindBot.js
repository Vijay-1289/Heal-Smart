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
            color: #4a90e2;
            background: rgba(74, 144, 226, 0.1);
            border: 1px solid rgba(74, 144, 226, 0.2);
        }

        &.bot {
            align-self: flex-start;
            color: #333;
            background: rgba(147, 51, 234, 0.1);
            border: 1px solid rgba(147, 51, 234, 0.2);

            .greeting {
                font-size: 2.5rem;
                margin-bottom: 1rem;
                background: none;
                border: none;
                
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
                background: none;
                border: none;
            }

            .structured-response {
                white-space: pre-line;

                h3 {
                    color: #9333ea;
                    margin: 1rem 0 0.5rem 0;
                    font-size: 1.2rem;
                }

                ul, ol {
                    margin: 0.5rem 0;
                    padding-left: 1.5rem;
                }

                li {
                    margin: 0.25rem 0;
                }
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
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(147, 51, 234, 0.2);
            color: #333;
            transition: all 0.3s ease;

            &::placeholder {
                color: #999;
            }

            &:focus {
                outline: none;
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(147, 51, 234, 0.4);
                box-shadow: 0 2px 15px rgba(147, 51, 234, 0.1);
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

    const formatResponse = (text) => {
        const sections = text.split('\n\n');
        return sections.map(section => {
            if (section.includes(':')) {
                const [title, ...content] = section.split(':');
                return `<h3>${title.trim()}</h3>${content.join(':').trim()}`;
            }
            return section;
        }).join('\n\n');
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
        setLoading(true);

        try {
            const prompt = `You are a mental health professional assistant. The user says: "${userMessage}". 
            Please provide a structured response following this exact format:

            COPING STRATEGIES:
            1. [First strategy]
            2. [Second strategy]
            3. [Third strategy]

            LIFESTYLE CHANGES:
            - [First change]
            - [Second change]
            - [Third change]

            WHEN TO SEEK HELP:
            - [First sign]
            - [Second sign]
            - [Third sign]

            IMPORTANT NOTES:
            - Always consult a mental health professional
            - Practice self-care regularly
            - Reach out to loved ones for support`;

            const response = await generateResponse(prompt);
            
            setMessages(prev => [...prev, { 
                text: formatResponse(response),
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
                        <div className="structured-response" 
                            dangerouslySetInnerHTML={{ __html: message.text }}>
                        </div>
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