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
            user: {
                firebaseUid: user.firebaseUid,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('[Auth Sync] Error syncing user:', error);
        res.status(500).json({ error: 'Server error during auth sync' });
    }
});

module.exports = router;
