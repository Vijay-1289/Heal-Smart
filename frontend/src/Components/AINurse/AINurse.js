import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import NurseAvatar from './NurseAvatar';
import PatientDashboard from '../Dashboard/PatientDashboard';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../context/Context';

// Initial medical knowledge base
let medicalKnowledge = {
    greetings: [
        "Hello! I'm your virtual assistant. How are you feeling today?",
        "Hi there! I'm here to listen to your health concerns. What's bothering you?",
        "Welcome! I can help gather information about how you're feeling today."
    ],
    followUpQuestions: {
        duration: "How long have you been experiencing these symptoms?",
        severity: "On a scale of 1-10, how severe is your discomfort?",
        frequency: "How often do you experience these symptoms?",
        triggers: "Have you noticed anything that triggers or worsens these symptoms?",
        medication: "Are you currently taking any medications?",
        allergies: "Do you have any known allergies?",
        medicalHistory: "Do you have any pre-existing medical conditions?"
    },
    conditions: {
        "headache": {
            symptoms: ["pain in head", "headache", "migraine", "head hurts"],
            controlMeasures: [
                "Rest in a quiet, dark room",
                "Ensure good posture when working",
                "Take regular breaks from screens",
                "Stay hydrated",
                "Practice stress management techniques",
                "Maintain regular sleep schedule",
                "Avoid loud noises and bright lights"
            ],
            prevention: [
                "Identify and avoid personal triggers",
                "Maintain good sleep hygiene",
                "Practice regular exercise",
                "Stay well hydrated",
                "Manage stress levels",
                "Take regular breaks during work"
            ],
            followUp: "Please consult a healthcare provider for proper medical advice."
        },
        "fever": {
            symptoms: ["fever", "high temperature", "feeling hot", "chills"],
            controlMeasures: [
                "Rest adequately",
                "Stay hydrated with water and clear fluids",
                "Use light clothing and bedding",
                "Keep the room at a comfortable temperature",
                "Monitor temperature regularly"
            ],
            prevention: [
                "Practice good hand hygiene",
                "Maintain a healthy diet",
                "Get adequate sleep",
                "Avoid close contact with sick people",
                "Keep your immune system strong"
            ],
            followUp: "Please consult a healthcare provider for proper medical advice."
        },
        "sore throat": {
            symptoms: ["sore throat", "throat pain", "difficulty swallowing", "throat hurts"],
            controlMeasures: [
                "Rest your voice",
                "Stay hydrated with warm liquids",
                "Gargle with warm salt water",
                "Use a humidifier",
                "Avoid irritants like smoking"
            ],
            prevention: [
                "Practice good hand hygiene",
                "Avoid sharing personal items",
                "Stay hydrated",
                "Avoid smoking and secondhand smoke",
                "Maintain good air quality"
            ],
            followUp: "Please consult a healthcare provider for proper medical advice."
        },
        "common cold": {
            symptoms: ["runny nose", "congestion", "sneezing", "cough", "cold"],
            controlMeasures: [
                "Get plenty of rest",
                "Stay hydrated with warm fluids",
                "Use a humidifier",
                "Practice good hand hygiene",
                "Cover mouth when coughing/sneezing"
            ],
            prevention: [
                "Wash hands frequently",
                "Avoid touching face",
                "Maintain distance from sick people",
                "Keep your immune system strong",
                "Clean frequently touched surfaces"
            ],
            followUp: "Please consult a healthcare provider for proper medical advice."
        },
        "stomach ache": {
            symptoms: ["stomach pain", "stomach ache", "nausea", "abdominal pain"],
            controlMeasures: [
                "Rest your digestive system",
                "Stay hydrated with clear fluids",
                "Eat bland, easily digestible foods",
                "Avoid fatty or spicy foods",
                "Use a heating pad on your stomach"
            ],
            prevention: [
                "Practice good food hygiene",
                "Wash hands before eating",
                "Eat regular, balanced meals",
                "Manage stress levels",
                "Stay hydrated"
            ],
            followUp: "Please consult a healthcare provider for proper medical advice."
        }
    },
    emergencySymptoms: [
        "severe chest pain",
        "difficulty breathing",
        "severe bleeding",
        "loss of consciousness",
        "stroke symptoms",
        "severe allergic reaction"
    ]
};

// OpenFDA API key (you should move this to an environment variable)
const FDA_API_KEY = 'lHVmMOgKPs8IAnMKr81eKJCx59fNOLiaBlYuwUNL';

// Function to fetch drug information from OpenFDA
const fetchDrugInfo = async (drugName) => {
    try {
        const response = await fetch(
            `https://api.fda.gov/drug/label.json?api_key=${FDA_API_KEY}&search=generic_name:"${encodeURIComponent(drugName)}"&limit=1`
        );
        const data = await response.json();
        return data.results[0];
    } catch (error) {
        console.error('Error fetching drug information:', error);
        return null;
    }
};

// Function to format drug information from OpenFDA
const formatOpenFDAInfo = (fdaData) => {
    if (!fdaData) return 'No FDA information available';

    return `
MEDICATION DETAILS
Brand Names: ${fdaData.openfda?.brand_name?.join(', ') || 'Not available'}
Generic Name: ${fdaData.openfda?.generic_name?.join(', ') || 'Not available'}
Manufacturer: ${fdaData.openfda?.manufacturer_name?.join(', ') || 'Not available'}

DOSAGE AND ADMINISTRATION
${fdaData.dosage_and_administration ? fdaData.dosage_and_administration.join('\n') : 'Not available'}

WARNINGS
${fdaData.warnings ? fdaData.warnings.join('\n') : 'No specific warnings available'}

PRECAUTIONS
${fdaData.precautions ? fdaData.precautions.join('\n') : 'No specific precautions available'}

DRUG INTERACTIONS
${fdaData.drug_interactions ? fdaData.drug_interactions.join('\n') : 'No known drug interactions available'}

CONTRAINDICATIONS
${fdaData.contraindications ? fdaData.contraindications.join('\n') : 'No contraindications available'}`;
};

function AINurse() {
    const { input, setInput, onSent, loading, resultData } = useGlobalContext();
    const [chatHistory, setChatHistory] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [spokenResponse, setSpokenResponse] = useState('');
    const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
    const [currentCondition, setCurrentCondition] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    
    const speechRecognition = useRef(null);
    const speechSynthesis = useRef(window.speechSynthesis);

    useEffect(() => {
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            navigate('/');
        }
    }, [navigate]);

    // Speech synthesis function
    const speak = useCallback(async (text) => {
        if (speechSynthesis.current) {
            speechSynthesis.current.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
            utterance.volume = 1;
            
            let voices = speechSynthesis.current.getVoices();
            if (voices.length === 0) {
                await new Promise(resolve => {
                    speechSynthesis.current.onvoiceschanged = () => {
                        voices = speechSynthesis.current.getVoices();
                        resolve();
                    };
                });
            }
            
            const femaleVoice = voices.find(voice => 
                voice.name.toLowerCase().includes('female') || 
                voice.name.toLowerCase().includes('samantha') ||
                voice.name.toLowerCase().includes('zira')
            );
            
            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }

            setIsAvatarSpeaking(true);
            utterance.onend = () => setIsAvatarSpeaking(false);
            speechSynthesis.current.speak(utterance);
            setSpokenResponse(text);
        }
    }, []);

    // Function to structure the response
    const structureResponse = useCallback((condition) => {
        const conditionInfo = medicalKnowledge.conditions[condition];
        
        return `
CONTROL MEASURES FOR ${condition.toUpperCase()}
${conditionInfo.controlMeasures.map((measure, index) => `${index + 1}. ${measure}`).join('\n')}

PREVENTION TIPS
${conditionInfo.prevention.map((tip, index) => `${index + 1}. ${tip}`).join('\n')}

IMPORTANT NOTE
This information is for educational purposes only.
Always consult a healthcare provider for proper medical advice.`;
    }, []);

    // Modified processUserInput to handle direct condition queries
    const processUserInput = useCallback(async (input) => {
        const lowercaseInput = input.toLowerCase();
        
        // Check for emergency symptoms
        const emergencyFound = medicalKnowledge.emergencySymptoms.some(symptom => 
            lowercaseInput.includes(symptom)
        );
        
        if (emergencyFound) {
            return `
⚠️ MEDICAL EMERGENCY ⚠️

IMMEDIATE ACTION REQUIRED:
• Call emergency services (911)
• Go to nearest emergency room
• Do not wait for online advice

This is a serious medical situation that requires immediate professional attention.`;
        }

        // Check for specific conditions
        for (const condition of Object.keys(medicalKnowledge.conditions)) {
            if (lowercaseInput.includes(condition)) {
                setCurrentCondition(condition);
                return structureResponse(condition);
            }
        }

        // If no specific condition is mentioned but pain is mentioned
        if (lowercaseInput.includes('pain') || lowercaseInput.includes('hurt')) {
            return `
GENERAL PAIN MANAGEMENT MEASURES

1. Rest the affected area
2. Practice good posture
3. Use appropriate support when sitting or lying down
4. Stay hydrated
5. Maintain a comfortable environment

PREVENTION TIPS
1. Practice proper body mechanics
2. Take regular breaks during activities
3. Maintain good physical fitness
4. Get adequate sleep
5. Manage stress levels

IMPORTANT NOTE
This information is for educational purposes only.
Always consult a healthcare provider for proper medical advice.`;
        }

        return `
Please let me know what condition you'd like to learn about, and I'll provide control measures and prevention tips.

Available conditions:
• Headache
• Fever
• Sore throat
• Common cold
• Stomach ache
• General pain management`;
    }, [structureResponse]);

    const handleUserInput = useCallback(async (input) => {
        const response = await processUserInput(input);
        speak(response);
    }, [processUserInput, speak]);

    const toggleListening = useCallback(() => {
        if (isListening) {
            speechRecognition.current.stop();
        } else {
            setSpokenResponse('');
            speechRecognition.current.start();
            setIsListening(true);
        }
    }, [isListening]);
    
    useEffect(() => {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            speechRecognition.current = new SpeechRecognition();
            speechRecognition.current.continuous = false;
            speechRecognition.current.interimResults = false;
            
            speechRecognition.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                handleUserInput(transcript);
            };
            
            speechRecognition.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };
            
            speechRecognition.current.onend = () => {
                setIsListening(false);
            };
        }
        
        const currentSpeechRecognition = speechRecognition.current;
        const currentSpeechSynthesis = speechSynthesis.current;
        
        return () => {
            if (currentSpeechRecognition) {
                currentSpeechRecognition.abort();
            }
            if (currentSpeechSynthesis) {
                currentSpeechSynthesis.cancel();
            }
        };
    }, [handleUserInput]);

    useEffect(() => {
        const randomGreeting = medicalKnowledge.greetings[Math.floor(Math.random() * medicalKnowledge.greetings.length)];
        speak(randomGreeting);
    }, [speak]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = () => {
        if (input.trim()) {
            onSent();
            setChatHistory([...chatHistory, { type: 'user', content: input }]);
            setInput('');
        }
    };

    return (
        <AINurseStyled isAvatarSpeaking={isAvatarSpeaking}>
            <InnerLayout>
                <div className="main-container">
                    <div className="user-header">
                        <div className="user-info">
                            <img src={user?.picture} alt={user?.name} className="user-avatar" />
                            <span>{user?.name}</span>
                        </div>
                        <div className="actions">
                            <button onClick={() => navigate('/dashboard')} className="dashboard-btn">
                                Go to Dashboard
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

                    <div className="nurse-container">
                        <div className="nurse-header">
                            <h2>AI Nurse Assistant</h2>
                            <p>Your 24/7 healthcare companion</p>
                        </div>
                        
                        <div className="nurse-content">
                            <div className="nurse-info">
                                <div className="info-section">
                                    <h3>Available Services</h3>
                                    <ul>
                                        <li>Health advice and guidance</li>
                                        <li>Medication information</li>
                                        <li>First aid instructions</li>
                                        <li>General health tips</li>
                                        <li>Emergency guidance</li>
                                    </ul>
                                </div>
                                
                                <div className="info-section">
                                    <h3>Important Notes</h3>
                                    <ul>
                                        <li>This is an AI assistant, not a replacement for professional medical care</li>
                                        <li>For emergencies, call emergency services immediately</li>
                                        <li>Always consult healthcare providers for medical decisions</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="chat-section">
                                <div className="chat-messages">
                                    {chatHistory.map((message, index) => (
                                        <div key={index} className={`message ${message.type}`}>
                                            <div className="message-content">
                                                {message.content}
                                            </div>
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="message bot">
                                            <div className="message-content loading">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="chat-input">
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Ask your health-related question..."
                                        rows="3"
                                    />
                                    <button onClick={handleSend} disabled={loading}>
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </InnerLayout>
        </AINurseStyled>
    );
}

const AINurseStyled = styled.div`
    .login-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #9333ea 0%, #6b21a8 100%);
        padding: 2rem;

        .login-content {
            text-align: center;
            color: white;

            h1 {
                font-size: 2.5rem;
                margin-bottom: 1rem;
                font-weight: 700;
            }

            > p {
                font-size: 1.2rem;
                margin-bottom: 3rem;
                opacity: 0.9;
            }

            .login-box {
                background: white;
                padding: 2.5rem;
                border-radius: 16px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                max-width: 400px;
                margin: 0 auto;

                h2 {
                    color: #2d3748;
                    margin-bottom: 0.5rem;
                    font-size: 1.8rem;
                }

                p {
                    color: #718096;
                    margin-bottom: 2rem;
                }

                .google-btn {
                    display: flex;
                    justify-content: center;
                }
            }
        }
    }

    .main-container {
        .user-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 2rem;

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
                    color: #2d3748;
                    font-weight: 500;
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
    }

    .nurse-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: calc(100vh - 4rem);
        padding: 2rem;
    }

    .nurse-header {
        padding: 1.5rem;
        background: #2c3e50;
        color: white;
        border-radius: 10px 10px 0 0;
        text-align: center;

        h2 {
            margin: 0;
            font-size: 1.8rem;
        }

        p {
            margin: 0.5rem 0 0;
            opacity: 0.9;
        }
    }

    .nurse-content {
        flex: 1;
        display: flex;
        padding: 1.5rem;
        gap: 2rem;
        overflow: hidden;
    }

    .nurse-info {
        width: 300px;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
        overflow-y: auto;

        .info-section {
            margin-bottom: 1.5rem;

            h3 {
                color: #2c3e50;
                margin-bottom: 0.8rem;
                font-size: 1.2rem;
            }

            ul {
                list-style: none;
                padding: 0;
                margin: 0;

                li {
                    padding: 0.5rem 0;
                    color: #666;
                    font-size: 0.9rem;
                    border-bottom: 1px solid #eee;

                    &:last-child {
                        border-bottom: none;
                    }
                }
            }
        }
    }

    .chat-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: white;
        border-radius: 8px;
        border: 1px solid #eee;
    }

    .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
    }

    .message {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
    }

    .message.user {
        align-items: flex-end;
    }

    .message-content {
        max-width: 70%;
        padding: 0.8rem;
        border-radius: 10px;
        background: #f0f2f5;
    }

    .message.user .message-content {
        background: #2c3e50;
        color: white;
    }

    .chat-input {
        padding: 1rem;
        border-top: 1px solid #eee;
        display: flex;
        gap: 1rem;
    }

    textarea {
        flex: 1;
        padding: 0.8rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        resize: none;
    }

    button {
        padding: 0.8rem 1.5rem;
        background: #2c3e50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s ease;

        &:hover {
            background: #34495e;
        }

        &:disabled {
            background: #95a5a6;
            cursor: not-allowed;
        }
    }

    .loading {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;
    }

    .loading span {
        width: 8px;
        height: 8px;
        background: #2c3e50;
        border-radius: 50%;
        animation: bounce 1.4s infinite ease-in-out;
    }

    .loading span:nth-child(1) { animation-delay: -0.32s; }
    .loading span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
    }

    @media (max-width: 768px) {
        .nurse-container {
            padding: 1rem;
        }

        .nurse-info {
            width: 100%;
        }
    }

    @media (max-width: 480px) {
        .nurse-info {
            width: 100%;
        }
    }
`;

export default AINurse; 