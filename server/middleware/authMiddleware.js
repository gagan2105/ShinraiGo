const admin = require('../config/firebase-admin');
const User = require('../models/User');

/**
 * Middleware: Verify Firebase ID Token
 * Decodes the JWT token sent from the client in the Authorization header.
 * Attaches the decoded user data and MongoDB user document to req.user.
 */
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const idToken = authHeader.split('Bearer ')[1];

        // 1. Verify the token with Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // 2. Fetch the user's role from MongoDB using their Firebase UID
        const mongoUser = await User.findOne({ firebaseUid: decodedToken.uid });

        // 3. Attach both Firebase and MongoDB info strictly to the request
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            mongoUser: mongoUser || null,
            role: mongoUser ? mongoUser.role : 'user' // Default fallback
        };

        next();
    } catch (error) {
        console.error('[Auth Middleware] Token Verification Error:', error);
        return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
    }
};

/**
 * Middleware Factory: Require Specific Role
 * Must be used AFTER `verifyToken`. Checks if `req.user.role` matches the required role(s).
 * @param {string|string[]} roles - A single role string or an array of acceptable roles (e.g., ['admin', 'police'])
 */
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ error: 'Forbidden: Access denied' });
        }

        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: `Forbidden: Requires one of roles [${allowedRoles.join(', ')}]` });
        }

        next();
    };
};

module.exports = { verifyToken, requireRole };
