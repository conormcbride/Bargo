var mongoose = require('mongoose');

var FinanceSchema = new mongoose.Schema({
    income: Number,
    expenditure: Number,
    barName:String,
    profit:Number

});

module.exports = mongoose.model('Finance', FinanceSchema);