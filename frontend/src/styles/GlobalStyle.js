import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Nunito', sans-serif;
    }

    html {
        font-size: 16px;
        @media (max-width: 768px) {
            font-size: 14px;
        }
    }

    body {
        font-family: ${({ theme }) => theme?.fonts?.primary || 'Nunito, sans-serif'};
        background-color: ${({ theme }) => theme?.colors?.background || '#f8f9fa'};
        color: ${({ theme }) => theme?.colors?.text || '#333'};
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-x: hidden;
        position: relative;
        min-height: 100vh;
        
        /* Prevent pull-to-refresh on mobile */
        overscroll-behavior-y: none;
        
        /* Improve touch and scroll on mobile */
        -webkit-overflow-scrolling: touch;
        
        /* Prevent text size adjustment on orientation change */
        -webkit-text-size-adjust: 100%;
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    button, input, textarea, select {
        font-family: inherit;
    }

    /* Improve button and link tap targets on mobile */
    button, a {
        touch-action: manipulation;
    }

    /* Remove tap highlight on mobile */
    * {
        -webkit-tap-highlight-color: transparent;
    }

    /* Smooth scrolling for the whole page */
    html {
        scroll-behavior: smooth;
    }

    /* Better image handling */
    img {
        max-width: 100%;
        height: auto;
        display: block;
    }

    /* Improve form elements on mobile */
    input, select, textarea, button {
        font-size: 16px; /* Prevents zoom on focus in iOS */
        
        @media (max-width: 768px) {
            font-size: 16px;
        }
    }
`;