const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;
        
        if (!credential) {
            return res.status(400).json({ message: 'Credential is required' });
        }

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        
        if (!payload) {
            return res.status(400).json({ message: 'Invalid token payload' });
        }

        // Check if user exists
        let user = await User.findOne({ email: payload.email });
        
        if (!user) {
            // Create new user if doesn't exist
            user = new User({
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
                googleId: payload.sub,
                emailVerified: payload.email_verified
            });
            try {
                await user.save();
            } catch (error) {
                console.error('Error saving user:', error);
                return res.status(500).json({ message: 'Error creating user account' });
            }
        } else {
            // Update existing user's information
            user.name = payload.name;
            user.picture = payload.picture;
            user.emailVerified = payload.email_verified;
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id,
                email: user.email,
                name: user.name
            },
            process.env.GOOGLE_CLIENT_SECRET,
            { 
                expiresIn: '24h',
                algorithm: 'HS256'
            }
        );

        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture
            }
        });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ 
            message: 'Authentication failed',
            error: error.message 
        });
    }
});

module.exports = router; 