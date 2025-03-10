const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;
        
        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: "246049626035-uhst0uqgq7p7nt84f6idr1171nif77b8.apps.googleusercontent.com"
        });
        
        const payload = ticket.getPayload();
        
        // Find or create user
        let user = await User.findOne({ email: payload.email });
        
        if (!user) {
            user = new User({
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
                googleId: payload.sub
            });
            await user.save();
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id, 
                email: user.email,
                name: user.name,
                picture: user.picture
            },
            'your-jwt-secret',
            { expiresIn: '24h' }
        );
        
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture
            }
        });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
});

// Get user health history
router.get('/users/:email/health', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ healthHistory: user.healthHistory });
    } catch (error) {
        console.error('Error fetching health history:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add health record
router.post('/users/:email/health', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user.healthHistory.push({
            condition: req.body.condition,
            date: new Date(),
            measures: req.body.measures,
            prevention: req.body.prevention
        });
        
        await user.save();
        res.json({ healthHistory: user.healthHistory });
    } catch (error) {
        console.error('Error adding health record:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 