let mongoose = require('mongoose');


let picture = mongoose.Schema({
    name: String,
    danmu: [],
});

let Picture = module.exports = mongoose.model('pictures', picture); 