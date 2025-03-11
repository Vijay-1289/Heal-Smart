import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

function AINurse() {
    const [messages, setMessages] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modelLoaded, setModelLoaded] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const recognition = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/');
        } else {
            setUser(JSON.parse(userData));
        }

        // Load model-viewer script dynamically
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
        script.onload = () => setModelLoaded(true);
        document.head.appendChild(script);

        // Initialize Web Speech API
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition.current = new SpeechRecognition();
            recognition.current.continuous = false;
            recognition.current.interimResults = false;

            recognition.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                handleUserInput(transcript);
            };

            recognition.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognition.current.onend = () => {
                setIsListening(false);
            };
        }

        return () => {
            if (recognition.current) {
                recognition.current.abort();
            }
            // Clean up script
            document.head.removeChild(script);
        };
    }, [navigate]);

    const toggleListening = () => {
        if (isListening) {
            recognition.current.stop();
        } else {
            recognition.current.start();
            setIsListening(true);
        }
    };

    const handleUserInput = async (input) => {
        const userMessage = {
            type: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setLoading(true);

        try {
            const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `You are an AI nurse. The user says: ${input}. 
                          Provide caring and professional medical advice. Remember to:
                          1. Show empathy and understanding
                          2. Give clear medical guidance
                          3. Recommend seeing a doctor when necessary
                          4. Keep responses concise and easy to understand
                          Keep responses under 3 sentences for better voice output.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const responseText = response.text();
            
            setMessages(prev => [...prev, {
                type: 'bot',
                content: responseText
            }]);

            // Convert response to speech
            const utterance = new SpeechSynthesisUtterance(responseText);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            synthRef.current.speak(utterance);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = "I apologize, but I encountered an error. Please try again.";
            setMessages(prev => [...prev, {
                type: 'bot',
                content: errorMessage
            }]);
            const utterance = new SpeechSynthesisUtterance(errorMessage);
            synthRef.current.speak(utterance);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AINurseStyled>
            <div className="nurse-container">
                <div className="avatar-section">
                    {modelLoaded ? (
                        <model-viewer
                            src="https://cdn.glitch.global/b99994c4-94f9-4472-9962-6c4b54f39403/nurse-avatar.glb"
                            alt="3D AI Nurse Avatar"
                            auto-rotate
                            camera-controls
                            disable-zoom
                            camera-orbit="0deg 75deg 105%"
                            min-camera-orbit="auto 0deg auto"
                            max-camera-orbit="auto 180deg auto"
                            environment-image="neutral"
                            shadow-intensity="1"
                            exposure="1"
                            style={{ width: '100%', height: '400px', background: '#2d3748' }}
                        ></model-viewer>
                    ) : (
                        <div className="loading-avatar">
                            <div className="spinner"></div>
                            <p>Loading 3D Avatar...</p>
                        </div>
                    )}
                </div>
                <div className="interaction-section">
                    <div className="messages">
                        <div className="welcome-message">
                            <h2>Hello! I'm your AI Nurse</h2>
                            <p>Speak to me about your health concerns</p>
                        </div>
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.type}`}>
                                <div className="message-content">
                                    {message.content}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="voice-control">
                        <button 
                            className={`mic-button ${isListening ? 'active' : ''}`}
                            onClick={toggleListening}
                            disabled={loading}
                        >
                            {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                            {isListening ? 'Stop' : 'Start'} Speaking
                        </button>
                        {loading && <div className="loading-indicator">Processing...</div>}
                    </div>
                </div>
            </div>
        </AINurseStyled>
    );
}

const AINurseStyled = styled.div`
    min-height: 100vh;
    background: #f3f4f6;
    padding: 2rem;

    .nurse-container {
        max-width: 1200px;
        margin: 0 auto;
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .avatar-section {
        background: #2d3748;
        padding: 2rem;
        border-bottom: 1px solid #e5e7eb;
        min-height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;

        .loading-avatar {
            text-align: center;
            color: white;

            .spinner {
                width: 50px;
                height: 50px;
                border: 5px solid #f3f3f3;
                border-top: 5px solid #9333ea;
                border-radius: 50%;
                margin: 0 auto 1rem;
                animation: spin 1s linear infinite;
            }

            p {
                margin: 0;
                font-size: 1.1rem;
            }
        }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .interaction-section {
        padding: 2rem;

        .messages {
            min-height: 300px;
            max-height: 500px;
            overflow-y: auto;
            margin-bottom: 2rem;
            padding: 1rem;
            background: #f8fafc;
            border-radius: 12px;

            .welcome-message {
                text-align: center;
                margin-bottom: 2rem;

                h2 {
                    color: #2d3748;
                    font-size: 1.8rem;
                    margin-bottom: 0.5rem;
                }

                p {
                    color: #6b7280;
                }
            }

            .message {
                margin-bottom: 1rem;
                display: flex;
                justify-content: flex-end;

                &.bot {
                    justify-content: flex-start;
                }

                .message-content {
                    max-width: 80%;
                    padding: 1rem;
                    border-radius: 12px;
                    background: #2d3748;
                    color: white;
                }

                &.bot .message-content {
                    background: #9333ea;
                }
            }
        }

        .voice-control {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;

            .mic-button {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 1rem 2rem;
                border: none;
                border-radius: 8px;
                background: #2d3748;
                color: white;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;

                &:hover:not(:disabled) {
                    background: #1f2937;
                }

                &.active {
                    background: #dc2626;

                    &:hover {
                        background: #b91c1c;
                    }
                }

                &:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
            }

            .loading-indicator {
                color: #6b7280;
                font-size: 0.9rem;
            }
        }
    }

    @media (max-width: 768px) {
        padding: 1rem;

        .avatar-section {
            padding: 1rem;
        }

        .interaction-section {
            padding: 1rem;
        }
    }
`;

export default AINurse; 