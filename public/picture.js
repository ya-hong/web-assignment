let mongoose = require('mongoose');


let picture = mongoose.Schema({
    name: String,
    danmu: [{
        content: String, 
        time: Number,
        pos: String 
    }],
});

let Picture = module.exports = mongoose.model('pictures', picture); 