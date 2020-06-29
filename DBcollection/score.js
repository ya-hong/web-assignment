let mongoose = require('mongoose');

let score = mongoose.Schema({
    user : String,
    contest: String,
    score: Number
});

let Score = module.exports = mongoose.model('score', score);