const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const User = require('../models/User');

/**
 * @route   GET /api/admin/system-stats
 * @desc    Get privileged system metrics.
 * @access  Private (Admin & Police only)
 */
router.get('/system-stats', verifyToken, requireRole(['admin', 'police']), (req, res) => {
    res.json({
        status: 'Operational',
        uptime: process.uptime(),
        activeIncidents: 12,
        anomaliesDetected: 4
    });
});

/**
 * @route   PUT /api/admin/users/:firebaseUid/role
 * @desc    Promote or demote a user.
 * @access  Private (Admin ONLY)
 */
router.put('/users/:firebaseUid/role', verifyToken, requireRole('admin'), async (req, res) => {
    try {
        const { role } = req.body;
        const validRoles = ['user', 'admin', 'police'];

        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: 'Invalid role assignment' });
        }

        const user = await User.findOneAndUpdate(
            { firebaseUid: req.params.firebaseUid },
            { role: role },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Role updated successfully', user });
    } catch (error) {
        console.error('Role Update Error:', error);
        res.status(500).json({ error: 'Failed to update user role' });
    }
});

module.exports = router;
