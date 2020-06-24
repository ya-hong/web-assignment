const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Link Database
mongoose.connect('mongodb://localhost/web')
let db = mongoose.connection;

// Check DB errors

db.once('open', function() {
    console.log("Connected to mongoDB")
})

db.on('error', function(err) {
    console.log(err);
});

// Init App
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static('public'));



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