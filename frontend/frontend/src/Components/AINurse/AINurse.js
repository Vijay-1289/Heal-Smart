import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import NurseAvatar from './NurseAvatar';
import { generateResponse } from '../../utils/api';

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
                    font-size: 1.1rem;
                }
            }

            .message {
                margin-bottom: 1rem;
                max-width: 80%;

                &.user {
                    margin-left: auto;
                    text-align: right;
                }

                .message-content {
                    display: inline-block;
                    padding: 1rem;
                    border-radius: 12px;
                    background: #e5e7eb;
                    color: #1f2937;
                    white-space: pre-line;

                    .user & {
                        background: #9333ea;
                        color: white;
                    }
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
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 8px;
                background: #9333ea;
                color: white;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;

                &:hover {
                    background: #7e22ce;
                }

                &:disabled {
                    background: #9ca3af;
                    cursor: not-allowed;
                }

                &.active {
                    background: #dc2626;
                }
            }

            .loading-indicator {
                color: #6b7280;
                font-size: 0.9rem;
            }
        }
    }
`;

function AINurse() {
    const [messages, setMessages] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const navigate = useNavigate();
    const recognition = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/');
        } else {
            setMessages([
                {
                    type: 'nurse',
                    content: "Hello! I'm your AI Nurse. How can I help you today? Please describe your symptoms or medical concerns."
                }
            ]);
        }

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

        // Cleanup function to stop speech when component unmounts
        return () => {
            if (recognition.current) {
                recognition.current.abort();
            }
            if (synthRef.current) {
                synthRef.current.cancel();
            }
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
        if (!input.trim()) return;

        const userMessage = {
            type: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setIsSpeaking(true);
        setLoading(true);

        // Cancel any ongoing speech
        if (synthRef.current) {
            synthRef.current.cancel();
        }

        try {
            const prompt = `You are a professional medical assistant. The user says: "${input}". 
            Please provide a structured medical response following this exact format:

            MEDICATIONS (if applicable):
            - [List medications with exact dosages]
            - Maximum duration: [specify days/weeks]
            - Important warnings: [list key warnings]

            PRECAUTIONS:
            1. [First precaution]
            2. [Second precaution]
            3. [Third precaution]

            LIFESTYLE CHANGES:
            - [First change]
            - [Second change]
            - [Third change]

            WHEN TO SEEK EMERGENCY CARE:
            - [First emergency sign]
            - [Second emergency sign]
            - [Third emergency sign]

            IMPORTANT NOTES:
            - Always consult a healthcare professional for proper diagnosis
            - Do not exceed recommended dosages
            - Monitor for side effects
            - Follow up with your doctor if symptoms persist

            Keep each section concise and specific. Only include relevant information based on the user's condition.`;

            const responseText = await generateResponse(prompt);
            
            setMessages(prev => [...prev, {
                type: 'nurse',
                content: responseText
            }]);

            // Convert response to speech
            const utterance = new SpeechSynthesisUtterance(responseText);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.onend = () => setIsSpeaking(false);
            synthRef.current.speak(utterance);
        } catch (error) {
            console.error('Error:', error);
            let errorMessage = "I'm having trouble connecting to the service. ";
            
            if (error.message.includes('API key')) {
                errorMessage = "The service is not properly configured. Please contact support.";
            } else if (error.message.includes('quota')) {
                errorMessage = "The service is currently experiencing high demand. Please try again in a few minutes.";
            } else if (error.message.includes('network')) {
                errorMessage = "Please check your internet connection and try again.";
            } else {
                errorMessage += "Please try again in a moment or seek professional help if you need immediate assistance.";
            }
            
            setMessages(prev => [...prev, {
                type: 'nurse',
                content: errorMessage
            }]);

            // Convert error message to speech
            const errorUtterance = new SpeechSynthesisUtterance(errorMessage);
            errorUtterance.rate = 0.9;
            errorUtterance.pitch = 1;
            errorUtterance.onend = () => setIsSpeaking(false);
            synthRef.current.speak(errorUtterance);
        } finally {
            setLoading(false);
            setIsSpeaking(false);
        }
    };

    return (
        <AINurseStyled>
            <div className="nurse-container">
                <div className="avatar-section">
                    <NurseAvatar isSpeaking={isSpeaking} isListening={isListening} />
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
                        {loading && <div className="loading-indicator">Processing your request...</div>}
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
                    </div>
                </div>
            </div>
        </AINurseStyled>
    );
}

export default AINurse; 