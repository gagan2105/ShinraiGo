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
        const { uid, email, name } = req.user;
        // req.user from our middleware might only have uid/email decoded, 
        // so we can also check req.body.name if we passed it specifically.
        const displayName = req.body.name || name || 'Unknown User';

        let user = await User.findOne({ firebaseUid: uid });
        let isNewUser = false;

        if (!user) {
            // First time this Firebase user is hitting our backend
            user = new User({
                firebaseUid: uid,
                email: email,
                name: displayName,
                role: 'user' // Default Role
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
