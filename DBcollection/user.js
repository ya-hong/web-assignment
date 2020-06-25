let mongoose = require('mongoose');


let user = mongoose.Schema({
    name: String,
    type: String, 
    password:  String
})

let User = module.exports = mongoose.model('users', user); 