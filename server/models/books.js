// Create book schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    title: String,
    author: String,
    edition: Number
});

module.exports = mongoose.model('book',bookSchema);