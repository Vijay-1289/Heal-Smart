import React, { createContext, useState } from 'react';

export const Context = createContext();

const ContextProvider = ({ children }) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const onSent = async () => {
        if (input.trim() === "") return;

        setLoading(true);
        setShowResult(true);
        setRecentPrompt(input);

        try {
            const response = await fetch('http://localhost:5000/api/mental-wellness/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ message: input })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setResultData(data.response);
        } catch (error) {
            console.error('Error:', error);
            setResultData("I apologize, but I'm having trouble processing your request right now. Please try again later.");
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    const contextValue = {
        input,
        setInput,
        recentPrompt,
        showResult,
        loading,
        resultData,
        onSent
    };

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    );
};

export default ContextProvider;