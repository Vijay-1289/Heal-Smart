import React from 'react';
import styled from 'styled-components';

const ThinkingAnimationStyled = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 1.5rem;
    width: fit-content;
    margin: 1rem 0;

    .doctor {
        width: 40px;
        height: 40px;
        position: relative;
        
        &:before {
            content: '👨‍⚕️';
            font-size: 2rem;
            position: absolute;
            animation: think 2s infinite;
        }
    }

    .dots {
        display: flex;
        gap: 0.5rem;

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

    @keyframes think {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }

    @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
    }
`;

const ThinkingAnimation = () => {
    return (
        <ThinkingAnimationStyled>
            <div className="doctor"></div>
            <div className="dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </ThinkingAnimationStyled>
    );
};

export default ThinkingAnimation; 