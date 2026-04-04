const admin = require('firebase-admin');

// IMPORTANT: The user must provide the serviceAccountKey.json file in the root of the server folder.
// This is required to verify the Firebase ID tokens sent from the React frontend.
try {
    let serviceAccount;
    
    // 1. Try environment variable (JSON string) - Best for Vercel
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
        // 2. Fallback to local file
        serviceAccount = require('../serviceAccountKey.json');
    }

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
    
    console.log('[Firebase Admin] Successfully Initialized');
} catch (error) {
    console.warn('\n======================================================');
    console.warn('[Firebase Admin WARNING]');
    console.warn('Failed to initialize Firebase Admin SDK.');
    console.warn('Reason:', error.message);
    console.warn('Deployment: Add "FIREBASE_SERVICE_ACCOUNT" to environment variables.');
    console.warn('Local: Place "serviceAccountKey.json" in /server directory.');
    console.warn('======================================================\n');
}

module.exports = admin;
