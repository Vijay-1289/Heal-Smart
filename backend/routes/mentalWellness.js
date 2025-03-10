const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

router.post('/chat', auth, async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `You are a supportive and empathetic mental wellness assistant. Your role is to:
1. Listen to users' concerns with empathy
2. Provide general wellness advice and coping strategies
3. Encourage healthy lifestyle choices
4. Suggest relaxation and mindfulness techniques
5. Recognize when to recommend professional help

Important: Never provide medical advice or diagnoses. Always emphasize that you're not a replacement for professional mental health care.

User's message: ${message}

Please respond in a warm, supportive manner while maintaining appropriate boundaries.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        // Format the response text with line breaks and emphasis
        const formattedText = response.text()
            .replace(/\n/g, '<br/>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        res.json({ response: formattedText });
    } catch (error) {
        console.error('Mental wellness chat error:', error);
        res.status(500).json({ 
            error: 'Failed to process your request',
            details: error.message 
        });
    }
});

module.exports = router; 