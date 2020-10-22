const mongoose = require('mongoose');
const Shema = mongoose.Schema;

const HistorySchema = new mongoose.Schema({
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
