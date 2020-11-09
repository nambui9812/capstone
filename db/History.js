const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    index: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = History = mongoose.model('History', HistorySchema);
