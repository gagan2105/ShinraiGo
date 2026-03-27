const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/user/profile
 * @desc    Get current user profile generic data.
 * @access  Private (Any authenticated user)
 */
router.get('/profile', verifyToken, (req, res) => {
    // req.user logic comes from our verifyToken middleware
    res.json({
        message: 'Acccessed generic User profile data successfully.',
        profile: {
            email: req.user.email,
            role: req.user.role,
            mongoId: req.user.mongoUser ? req.user.mongoUser._id : null
        }
    });
});

/**
 * @route   GET /api/user/mobile-sim
 * @desc    Placeholder for Mobile Simulator Data fetch logic.
 * @access  Private
 */
router.get('/mobile-sim/config', verifyToken, (req, res) => {
    res.json({
        config: { version: '1.4.1', environment: 'production' }
    });
});

module.exports = router;
