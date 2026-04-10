const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        default: "Unknown"
    },
    profilePic: {
        type: String,
        default: "https://i.pravatar.cc/150?img=11"
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'police'],
        default: 'user'
    },
    // Onboarding Details
    phone: String,
    bloodGroup: String,
    nationality: String,
    emergencyContact: {
        name: String,
        phone: String,
        relation: String
    },
    isOnboarded: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
