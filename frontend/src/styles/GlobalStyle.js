import {createGlobalStyle} from 'styled-components'

export const GlobalStyle = createGlobalStyle`
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
    }

    :root{
        --primary-color: #222260;
        --primary-color2: white;
        --primary-color3: violet;
        --color-green: #42AD00;
        --color-grey: #aaa;
        --color-accent: #F56692;
        --color-delete: #FF0000;
    }

    html, body {
        height: 100%;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Nunito', sans-serif;
        font-size: clamp(1rem, 1.5vw, 1.2rem);
        color: black;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    #root {
        height: 100%;
    }

    img {
        max-width: 100%;
        height: auto;
    }

    button {
        cursor: pointer;
        font-family: inherit;
    }

    a {
        text-decoration: none;
        color: inherit;
    }
`;