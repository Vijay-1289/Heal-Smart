import React from 'react';
import styled, { keyframes } from 'styled-components';

const NurseAvatar = ({ isSpeaking, isListening }) => {
    return (
        <NurseAvatarStyled isSpeaking={isSpeaking} isListening={isListening}>
            <div className="nurse-container">
                <div className="nurse-image">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        {/* Hair */}
                        <path d="M60 80C60 50 90 30 100 30C110 30 140 50 140 80C140 90 135 100 130 105C125 110 120 115 100 115C80 115 75 110 70 105C65 100 60 90 60 80Z" fill="#6B4F4F"/>
                        
                        {/* Face */}
                        <circle cx="100" cy="80" r="30" fill="#FFE5D9"/>
                        
                        {/* Eyes */}
                        <g className="eyes">
                            <circle cx="90" cy="75" r="3" fill="#2D3436"/>
                            <circle cx="110" cy="75" r="3" fill="#2D3436"/>
                            {/* Eye shine */}
                            <circle cx="91" cy="74" r="1" fill="#FFFFFF"/>
                            <circle cx="111" cy="74" r="1" fill="#FFFFFF"/>
                            {/* Eyelashes */}
                            <path d="M87 72L85 70M93 72L95 70" stroke="#2D3436" strokeWidth="1"/>
                            <path d="M107 72L105 70M113 72L115 70" stroke="#2D3436" strokeWidth="1"/>
                        </g>
                        
                        {/* Blush */}
                        <circle cx="85" cy="85" r="5" fill="#FFB6C1" opacity="0.5"/>
                        <circle cx="115" cy="85" r="5" fill="#FFB6C1" opacity="0.5"/>
                        
                        {/* Mouth */}
                        <path className="mouth" d="M95 90Q100 95 105 90" stroke="#2D3436" fill="none" strokeWidth="2" strokeLinecap="round"/>
                        
                        {/* Nurse Cap */}
                        <path d="M70 60C70 50 80 40 100 40C120 40 130 50 130 60C130 65 125 70 100 70C75 70 70 65 70 60Z" fill="#FFFFFF"/>
                        <path d="M85 55H115" stroke="#FF0000" strokeWidth="3"/>
                        <circle cx="100" cy="55" r="5" fill="#FF0000"/>
                        
                        {/* Uniform */}
                        <path d="M70 105C70 105 80 120 100 120C120 120 130 105 130 105L140 150H60L70 105Z" fill="#FFFFFF"/>
                        <path d="M85 105L90 150H110L115 105" fill="#FF0000"/>
                        
                        {/* Collar */}
                        <path d="M85 105C85 105 95 110 100 110C105 110 115 105 115 105" stroke="#FF0000" strokeWidth="3"/>
                    </svg>
                </div>
                {isListening && (
                    <div className="listening-indicator">
                        <div className="pulse" />
                    </div>
                )}
                {isSpeaking && (
                    <div className="speaking-indicator">
                        <div className="wave" />
                        <div className="wave" />
                        <div className="wave" />
                    </div>
                )}
            </div>
        </NurseAvatarStyled>
    );
};

const pulse = keyframes`
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.2);
        opacity: 0.7;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
`;

const wave = keyframes`
    0%, 100% {
        height: 20px;
    }
    50% {
        height: 40px;
    }
`;

const breathe = keyframes`
    0%, 100% {
        transform: translateY(0) scale(1);
    }
    50% {
        transform: translateY(-5px) scale(1.02);
    }
`;

const blink = keyframes`
    0%, 90%, 100% {
        transform: scaleY(1);
    }
    95% {
        transform: scaleY(0.1);
    }
`;

const NurseAvatarStyled = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .nurse-container {
        position: relative;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: center;
        align-items: center;
        animation: ${breathe} 3s ease-in-out infinite;
        transition: transform 0.3s ease;

        ${props => props.isListening && `
            transform: scale(1.05);
        `}
    }

    .nurse-image {
        width: 280px;
        height: 280px;
        border-radius: 50%;
        overflow: hidden;
        
        svg {
            width: 100%;
            height: 100%;
        }

        .eyes {
            animation: ${blink} 4s infinite;
        }

        .mouth {
            transform-origin: center;
            transition: all 0.3s ease;
            ${props => props.isSpeaking && `
                d: path('M95 90Q100 98 105 90');
            `}
        }
    }

    .listening-indicator {
        position: absolute;
        top: -10px;
        right: -10px;
        width: 40px;
        height: 40px;
        
        .pulse {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: #4CAF50;
            animation: ${pulse} 1.5s ease-in-out infinite;
        }
    }

    .speaking-indicator {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 4px;
        
        .wave {
            width: 4px;
            height: 20px;
            background: #9333ea;
            border-radius: 2px;
            animation: ${wave} 1s ease-in-out infinite;
            
            &:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            &:nth-child(3) {
                animation-delay: 0.4s;
            }
        }
    }
`;

export default NurseAvatar; 