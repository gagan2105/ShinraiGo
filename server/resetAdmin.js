require('dotenv').config();
const admin = require('./config/firebase-admin');

async function resetPass() {
    try {
        const email = 'nexus3340@gmail.com';
        const password = 'Nexus334023K';
        
        let userRecord;
        try {
            userRecord = await admin.auth().getUserByEmail(email);
            await admin.auth().deleteUser(userRecord.uid);
            console.log("Deleted old user");
        } catch(e) {}
        
        userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: 'Nexus Admin'
        });
        console.log("Created fresh user with exact password");
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
resetPass();
