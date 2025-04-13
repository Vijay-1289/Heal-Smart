import styled from "styled-components";

export const MainLayout = styled.div` 
    padding: 2rem;
    height: 100vh;
    display: flex;
    gap: 2rem;
    overflow: hidden;

    main {
        flex: 1;
        overflow-y: auto;
        padding: 2rem;
        background: rgba(252, 246, 249, 0.78);
        border: 3px solid #FFFFFF;
        backdrop-filter: blur(4.5px);
        border-radius: 32px;

        &::-webkit-scrollbar {
            width: 8px;
        }

        &::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 10px;
        }

        &::-webkit-scrollbar-thumb {
            background: rgba(147, 51, 234, 0.2);
            border-radius: 10px;

            &:hover {
                background: rgba(147, 51, 234, 0.4);
            }
        }
    }

    @media (max-width: 768px) {
        padding: 1rem;
        flex-direction: column;
        height: 100%;
        overflow-y: auto;
        
        main {
            padding: 1rem;
            min-height: 0;
            flex: none;
        }
    }
`;

export const InnerLayout = styled.div`
    width: 100%;
    height: 100%;
`;