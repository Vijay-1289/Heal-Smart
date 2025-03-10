import React from 'react';
import styled from 'styled-components';

function DoctorLoader() {
    return (
        <LoaderStyled>
            <div className="loader">
                <hr />
                <hr />
                <hr />
            </div>
        </LoaderStyled>
    );
}

const LoaderStyled = styled.div`
    .loader {
        display: flex;
        gap: 8px;
        padding: 10px;
    }

    .loader hr {
        width: 8px;
        height: 8px;
        border: none;
        border-radius: 50%;
        background-color: #9333ea;
        animation: typing 1s infinite alternate;
    }

    .loader hr:nth-child(1) {
        animation-delay: 0s;
    }

    .loader hr:nth-child(2) {
        animation-delay: 0.2s;
    }

    .loader hr:nth-child(3) {
        animation-delay: 0.4s;
    }

    @keyframes typing {
        0% {
            transform: translateY(0);
            background-color: #9333ea;
        }
        50% {
            transform: translateY(-8px);
            background-color: #6b21a8;
        }
        100% {
            transform: translateY(0);
            background-color: #9333ea;
        }
    }
`;

export default DoctorLoader; 