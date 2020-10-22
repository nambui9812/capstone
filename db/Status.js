const mongoose = require('mongoose');
const Shema = mongoose.Schema;

const StatusSchema = new mongoose.Schema({
    on: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Status = mongoose.model('Status', StatusSchema);
