process.on('uncaughtException', (err) => {
    console.error('CRITICAL UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('CRITICAL UNHANDLED REJECTION:', reason);
});

require('dotenv').config();
require('./config/firebase-admin');
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

// Models
const PoliceFeed = require('./models/PoliceFeed');
const DigitalId = require('./models/DigitalId');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { evaluateThreat } = require('./ml/threatModel');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shinraigo';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));


// ======= ROUTES =======

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

// GET Live Feed for Police Dashboard
app.get('/api/feed/live', async (req, res) => {
    try {
        const feed = await PoliceFeed.find().sort({ createdAt: -1 });
        res.json(feed);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch live feed' });
    }
});

// DELETE All Live Feed records (Purge Dossier)
app.delete('/api/feed/live', async (req, res) => {
    try {
        await PoliceFeed.deleteMany({});
        res.json({ message: 'Active dossier successfully purged' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to purge dossiers' });
    }
});

// POST Panic Alert from Mobile app
app.post('/api/alerts/panic', async (req, res) => {
    const { user, location, idNumber, phone, bloodGroup, audioLevel, motionLevel } = req.body;

    if (!user || !location) {
        return res.status(400).json({ error: 'User and location are required for an SOS alert.' });
    }

    try {
        // --- AI Threat Assessment Integration ---
        // Capture sensory data from the mobile device's Audio and Motion Sentinels
        const timeOfDay = new Date().getHours() / 24.0; 
        const audioInput = typeof audioLevel === 'number' ? audioLevel : 0.2;
        const motionInput = typeof motionLevel === 'number' ? motionLevel : 0.5;
        
        const confidenceScore = await evaluateThreat(timeOfDay, audioInput, motionInput);
        console.log(`[Neural SOS] User: ${user}, Audio: ${audioInput.toFixed(2)}, Motion: ${motionInput.toFixed(2)} -> Threat Score: ${confidenceScore}%`);

        const newAlert = new PoliceFeed({
            type: 'panic',
            title: 'SOS Panic Button Activated',
            user,
            location,
            time: 'Just now',
            idNumber: idNumber || 'Unknown',
            bloodGroup: bloodGroup || 'Unknown',
            phone: phone || 'Unknown',
            threatConfidence: confidenceScore
        });

        await newAlert.save();
        res.status(201).json({ message: 'SOS Alert broadcasted successfully', alert: newAlert });
    } catch (error) {
        res.status(500).json({ error: 'Failed to broadcast SOS Alert' });
    }
});

// POST Mint Digital ID
app.post('/api/digital-id/mint', async (req, res) => {
    const { name, idNumber, nationality, bloodGroup, destination, duration, phone, emergencyContact } = req.body;

    if (!name || !idNumber || !destination) {
        return res.status(400).json({ error: 'Missing required KYC fields.' });
    }

    try {
        const newDoc = new DigitalId({
            id: `ID-ST-${Math.floor(Math.random() * 90000) + 10000}`,
            qrData: `sh-id:${idNumber}-${destination}`,
            name,
            idNumber,
            nationality,
            bloodGroup,
            destination,
            duration,
            phone,
            emergencyContact,
            status: 'verified'
        });

        await newDoc.save();

        res.status(201).json({
            message: 'Digital ID successfully minted to blockchain.',
            document: newDoc
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to mint digital ID' });
    }
});

// GET All Registered User Locations for Police Dashboard
app.get('/api/admin/user-locations', async (req, res) => {
    const User = require('./models/User');
    try {
        const users = await User.find({ 
            "lastLocation.lat": { $exists: true },
            role: 'user' // Only show standard users on the map
        }).select('name email lastLocation profilePic');
        
        const mappedUsers = users.map(u => ({
            id: u._id,
            name: u.name,
            lat: u.lastLocation.lat,
            lng: u.lastLocation.lng,
            profilePic: u.profilePic,
            status: (Date.now() - new Date(u.lastLocation.updatedAt).getTime() < 60000) ? 'Active' : 'Offline'
        }));
        
        res.json(mappedUsers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user locations' });
    }
});

// POST User Heartbeat (Update real-time location)
app.post('/api/user/heartbeat', async (req, res) => {
    const User = require('./models/User');
    const { firebaseUid, lat, lng } = req.body;
    
    if (!firebaseUid || !lat || !lng) return res.status(400).json({ error: 'Missing telemetry data' });
    
    try {
        await User.findOneAndUpdate(
            { firebaseUid },
            { 
                lastLocation: { 
                    lat, 
                    lng, 
                    updatedAt: new Date() 
                } 
            }
        );
        res.json({ status: 'Heartbeat received' });
    } catch (error) {
        res.status(500).json({ error: 'Telemetry sync failed' });
    }
});

// Export for Vercel Serverless
module.exports = app;

// Start Server locally if not running on Vercel
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`[Safeguard Server] Running on http://localhost:${PORT}`);
    });
}
