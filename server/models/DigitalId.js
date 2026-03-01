const mongoose = require('mongoose');

const digitalIdSchema = new mongoose.Schema({
    id: { type: String, required: true },
    qrData: { type: String, required: true },
    name: { type: String, required: true },
    idNumber: { type: String, required: true },
    nationality: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    destination: { type: String, required: true },
    duration: { type: String, required: true },
    phone: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    status: { type: String, default: 'verified' },
    mintedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DigitalId', digitalIdSchema);
