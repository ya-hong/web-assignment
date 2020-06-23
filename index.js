const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

// Link Database
mongoose.connect('mongodb://localhost/web')
let db = mongoose.connection;

// Init App
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



// Main page
app.get('/', function(req, res) {
    res.end("hello");
});

// Contest
let contest = require("./routes/contest.js");
app.use('/contest', contest);




// Listen
app.listen(4000, function() {
    console.log("listen in port 4000");
});