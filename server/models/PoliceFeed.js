const mongoose = require('mongoose');

const policeFeedSchema = new mongoose.Schema({
    type: { type: String, required: true },
    title: { type: String, required: true },
    user: { type: String, required: true },
    location: { type: String, required: true },
    time: { type: String, required: true },
    idNumber: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    phone: { type: String, required: true },
    threatConfidence: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PoliceFeed', policeFeedSchema);
