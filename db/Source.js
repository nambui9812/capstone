const mongoose = require('mongoose');

const SourceSchema = new mongoose.Schema({
    index: {
        type: Number,
        required: true
    },
    onoff: {
        type: Boolean,
        required: true
    }
});

module.exports = Source = mongoose.model('Source', SourceSchema);
