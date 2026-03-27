require('dotenv').config();
const admin = require('./config/firebase-admin');
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shinraigo';

async function setupAdmin() {
    try {
        console.log('--- Starting Admin Setup ---');

        // 1. Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const adminEmail = 'nexus@shinraigo.admin';
        const adminName = 'Nexus';
        const adminPassword = 'Nexus334023';

        let firebaseUid;

        // 2. Check if user already exists in Firebase
        try {
            const userRecord = await admin.auth().getUserByEmail(adminEmail);
            console.log(`⚠️ User already exists in Firebase with UID: ${userRecord.uid}`);

            // Force update password just in case
            await admin.auth().updateUser(userRecord.uid, {
                password: adminPassword,
                displayName: adminName
            });
            console.log('✅ Firebase password updated to Nexus334023');

            firebaseUid = userRecord.uid;
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                // 3. Create user in Firebase
                const userRecord = await admin.auth().createUser({
                    email: adminEmail,
                    password: adminPassword,
                    displayName: adminName,
                });
                console.log(`✅ Created new Firebase user with UID: ${userRecord.uid}`);
                firebaseUid = userRecord.uid;
            } else {
                throw error;
            }
        }

        // 4. Upsert Admin user in MongoDB
        const existingMongoUser = await User.findOne({ email: adminEmail });

        if (existingMongoUser) {
            existingMongoUser.role = 'admin'; // Ensure role is admin
            await existingMongoUser.save();
            console.log('✅ Updated existing MongoDB User role to Admin');
        } else {
            const newMongoUser = new User({
                firebaseUid: firebaseUid,
                email: adminEmail,
                name: adminName,
                role: 'admin'
            });
            await newMongoUser.save();
            console.log('✅ Created new MongoDB Admin Document');
        }

        console.log('\n=======================================');
        console.log('🎉 ADMIN SETUP COMPLETE');
        console.log(`Login Email: ${adminEmail}`);
        console.log(`Login Password: ${adminPassword}`);
        console.log('=======================================\n');

        process.exit(0);

    } catch (error) {
        console.error('❌ Failed to setup admin:', error);
        process.exit(1);
    }
}

setupAdmin();
