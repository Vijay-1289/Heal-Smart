import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: ${({ theme }) => theme?.fonts?.primary || 'Arial, sans-serif'};
        background-color: ${({ theme }) => theme?.colors?.background || '#f8f9fa'};
        color: ${({ theme }) => theme?.colors?.text || '#333'};
        line-height: 1.6;
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    button {
        cursor: pointer;
        border: none;
        outline: none;
    }

    input, textarea {
        font-family: inherit;
    }
`;