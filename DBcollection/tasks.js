let mongoose = require('mongoose');

let problem = mongoose.Schema({
    desc: {
        type: String,
        default: ""
    },
    ans: {
        type: Boolean,
        default: false
    }
});

let tasks = mongoose.Schema({
    teacher: String,
    title: String,
    class: String,
    tasks: [{
        name: String,
        score: Number,
        A: problem,
        B: problem,
        C: problem,
        D: problem
    }]
});

let contest = module.exports = mongoose.model('tasks', tasks); 