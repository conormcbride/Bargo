var mongoose = require('mongoose');

var MailSchema = new mongoose.Schema({
    sender: String,
    recipient: String,
    bodyOfMessage:String
});

module.exports = mongoose.model('Mail', MailSchema);