const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['state', 'vidhansabha', 'district', 'block', 'village'],
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        default: null
    },
    code: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);
