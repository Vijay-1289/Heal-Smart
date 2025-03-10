const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    picture: {
        type: String
    },
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    healthRecords: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthRecord'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
});

// Update lastLogin on each save
userSchema.pre('save', function(next) {
    this.lastLogin = new Date();
    next();
});

module.exports = mongoose.model('User', userSchema); 