require('dotenv').config();
const admin = require('./config/firebase-admin');
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shinraigo';

async function createAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'nexus3340@gmail.com';
        const password = 'Nexus334023K';

        // Check if user exists in Firebase
        let userRecord;
        try {
            userRecord = await admin.auth().getUserByEmail(email);
            console.log('User already exists in Firebase with UID:', userRecord.uid);
            await admin.auth().updateUser(userRecord.uid, { password });
            console.log('Updated Firebase password');
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                userRecord = await admin.auth().createUser({
                    email,
                    password,
                    displayName: 'Nexus Admin'
                });
                console.log('Created new Firebase user:', userRecord.uid);
            } else {
                throw error;
            }
        }

        // Check if user exists in MongoDB
        let dbUser = await User.findOne({ email });
        if (dbUser) {
            dbUser.role = 'admin';
            dbUser.firebaseUid = userRecord.uid;
            dbUser.isOnboarded = true; // Force skip onboarding for existing accounts
            await dbUser.save();
            console.log('Updated user in MongoDB to admin');
        } else {
            dbUser = new User({
                firebaseUid: userRecord.uid,
                email: email,
                name: 'Nexus Admin',
                role: 'admin',
                isOnboarded: true
            });
            await dbUser.save();
            console.log('Created user in MongoDB as admin');
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

createAdmin();
