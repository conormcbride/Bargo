var mongoose = require('mongoose');

var BarSchema = new mongoose.Schema({
    barName: String,
    location: String,
    // earnings: Number
    });

module.exports = mongoose.model('Bar', BarSchema);