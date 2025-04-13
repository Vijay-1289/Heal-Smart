import React, { createContext, useContext, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const Context = createContext();

export const useGlobalContext = () => {
    return useContext(Context);
};

const ContextProvider = ({ children }) => {
    const [input, setInput] = useState('');
    const [recentPrompt, setRecentPrompt] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState('');

    const genAI = new GoogleGenerativeAI('AIzaSyCu-RVi6xqkAMW9tvycx6CWeaaIC3uwZpg');

    const onSent = async () => {
        if (!input.trim()) return;

        setLoading(true);
        setRecentPrompt(input);
        setShowResult(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `You are a supportive mental wellness assistant. Provide empathetic, helpful responses while maintaining appropriate boundaries. Focus on:
            1. Active listening and validation
            2. Practical coping strategies
            3. Encouragement for seeking professional help when needed
            4. General wellness advice
            5. Stress management techniques
            
            User message: ${input}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            // Format the response with line breaks and emphasis
            const formattedText = text
                .split('\n')
                .map(line => line.trim())
                .filter(line => line)
                .map(line => `<p>${line}</p>`)
                .join('');

            setResultData(formattedText);
        } catch (error) {
            console.error('Error generating response:', error);
            setResultData('I apologize, but I encountered an error. Please try again or seek professional help if you need immediate assistance.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Context.Provider value={{
            input,
            setInput,
            onSent,
            recentPrompt,
            showResult,
            loading,
            resultData
        }}>
            {children}
        </Context.Provider>
    );
};

export default ContextProvider;