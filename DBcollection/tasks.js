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
})

let Task = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sum: Number,
    score: {
        type: Number,
        required: true
    },
    A: {
        type: problem,
        required: false 
    },
    B: {
        type: problem,
        required: false 
    },
    C: {
        type: problem,
        required: false
    },
    D: {
        type: problem,
        required: false
    },
})

let tasks = mongoose.Schema({
    teacher: {
        type: String,
        required: true
    } ,
    title: {
        type: String,
        required: true
    } ,
    class: {
        type: String,
        required: true
    },
    tasks: {
        type: [Task],
        default: [],
        required: true
    }
})

let contest = module.exports = mongoose.model('tasks', tasks); 