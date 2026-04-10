const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/auth/sync
 * @desc    Syncs a newly authenticated Firebase user with MongoDB. 
 *          Creates the user document if it doesn't exist, assigning the default 'user' role.
 * @access  Private (Requires valid Firebase ID token)
 */
router.post('/sync', verifyToken, async (req, res) => {
    try {
        const { uid, email } = req.user;
        const displayName = req.body.name || req.user.name || 'Unknown User';

        // 1. Check if user exists by Firebase UID OR Email (to prevent duplicates during testing)
        let user = await User.findOne({ 
            $or: [
                { firebaseUid: uid },
                { email: email }
            ]
        });
        
        let isNewUser = false;

        if (user) {
            // Update existing user details if they changed
            user.firebaseUid = uid;
            user.name = displayName;
            // Force admin role for the nexus email
            if (email === 'nexus@shinraigo.admin') {
                user.role = 'admin';
            } else if (email === 'officer@shinraigo.police') {
                user.role = 'police';
            }
            await user.save();
        } else {
            // First time this Firebase user is hitting our backend
            user = new User({
                firebaseUid: uid,
                email: email,
                name: displayName,
                role: email === 'nexus@shinraigo.admin' ? 'admin' : (email === 'officer@shinraigo.police' ? 'police' : 'user')
            });
            await user.save();
            isNewUser = true;
        }

        res.status(200).json({
            message: isNewUser ? 'User synced to MongoDB successfully' : 'User profile fetched',
            isNewUser: isNewUser || !user.isOnboarded, // Treat as new if not onboarded
            user: {
                firebaseUid: user.firebaseUid,
                email: user.email,
                name: user.name,
                role: user.role,
                profilePic: user.profilePic,
                isOnboarded: user.isOnboarded
            }
        });

    } catch (error) {
        console.error('[Auth Sync] Error syncing user:', error);
        res.status(500).json({ error: 'Server error during auth sync' });
    }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Updates user onboarding details
 * @access  Private
 */
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { uid } = req.user;
        const { fullName, phone, bloodGroup, nationality, emergencyContact, profilePic } = req.body;

        const user = await User.findOneAndUpdate(
            { firebaseUid: uid },
            { 
                name: fullName,
                phone,
                bloodGroup,
                nationality,
                emergencyContact: typeof emergencyContact === 'string' ? { phone: emergencyContact } : emergencyContact,
                profilePic,
                isOnboarded: true 
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('[Profile Update] Error:', error);
        res.status(500).json({ error: 'Server error during profile update' });
    }
});

module.exports = router;
