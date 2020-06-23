let mongoose = require('mongoose');

let problem = mongoose.Schema({
    desc: {
        type: String
    },
    ans: {
        type: Boolean,
        default: false
    }
})

let task = mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    A: {
        type: problem,
        required: true
    },
    B: {
        type: problem,
        required: true
    },
    C: {
        type: problem,
        required: true
    },
    D: {
        type: problem,
        required: true
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
        type: [task],
        required: true
    }
})