let mongoose = require('mongoose');

let user = mongoose.Schema({
    name: String,
    type: String, 
    password:  String,
    contests: [{
        score: Number,
        tasks: [{
            A: Boolean,
            B: Boolean,
            C: Boolean,
            D: Boolean
        }]
    }]
})

let User = module.exports = mongoose.model('users', user); 