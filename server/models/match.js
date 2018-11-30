// Create trade schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = new Schema({
    trade_id:String,
    seller_id:String,
    buyer_id:String,
});

module.exports = mongoose.model('match',matchSchema);