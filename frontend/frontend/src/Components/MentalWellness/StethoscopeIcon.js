import React from 'react';
import styled from 'styled-components';
import { FaStethoscope } from 'react-icons/fa';

function StethoscopeIcon() {
    return (
        <IconStyled>
            <FaStethoscope className="icon" />
        </IconStyled>
    );
}

const IconStyled = styled.div`
    width: 40px;
    height: 40px;
    background: rgba(147, 51, 234, 0.1);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .icon {
        color: #9333ea;
        font-size: 20px;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }
`;

export default StethoscopeIcon; 