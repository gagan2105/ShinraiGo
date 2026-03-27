const admin = require('firebase-admin');

// IMPORTANT: The user must provide the serviceAccountKey.json file in the root of the server folder.
// This is required to verify the Firebase ID tokens sent from the React frontend.
try {
    const serviceAccount = require('../serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('[Firebase Admin] Successfully Initialized');
} catch (error) {
    console.warn('\n======================================================');
    console.warn('[Firebase Admin WARNING]');
    console.warn('Failed to initialize Firebase Admin SDK.');
    console.warn('Reason:', error.message);
    console.warn('Authentication middleware will NOT work properly.');
    console.warn('Please download "serviceAccountKey.json" from Firebase Console and place it in the /server directory.');
    console.warn('======================================================\n');
}

module.exports = admin;
