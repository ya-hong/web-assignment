const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require('express-session');


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

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json()); // 使用bodyparder中间件，
app.use(bodyParser.urlencoded({ extended: true }));// 使用 session 中间件
app.use(session({    secret :  'IDontKnow', // 对session id 相关的cookie 进行签名
   resave : true,    saveUninitialized: false, // 是否保存未初始化的会话
   cookie : {        maxAge : 1000 * 60 * 60, // 设置 session 的有效时间，单位毫秒
   },
}));

var checker = function(req, res, callback) {
    var user = req.session.user ;
    if (user.type == undefined || user.type == null) {
        console.log("you're not log in !");
        return res.redirect('/');
    }
    callback(req, res);
}

// Main page

let User = require("./public/user.js");

app.get('/', function(req, res) {

    req.session.user = {
        name: "root", 
        password: "root", 
        type: "teacher"
    };

    if (req.session.user) {
        res.render('home', {
            user: req.session.user,
            title: 'HOME',
        });
    }
    else {
        res.render('home-signin', {
            user: req.session.user,
            title: "user Sign in",
        });
    }
});

app.post('/', function(req, res) {
    let query = {
        name: req.body.name,
        password: req.body.password
    };
    User.findOne(query, function(err, user) {
        if (err) {
            res.end("some thing wrong")
            return console.log(err);
        }
        if (user != undefined) {
            req.session.user = user;
            return res.render('home', {
                title: "HOME",
                user: req.session.user
            });
        }
        else {
            return res.render('home-signin', {
                title: "Sorry, no this user",
                user: req.session.user
            })
        }
    });
});

app.get('/signup', function(req, res) {
    res.render('home-signup', {
        user: req.session.user,
        title: "user Sign up",
    });
});
app.post('/signup', function(req, res) {
    User.find({name: req.body.name}, function(err, find) {
        if (find.length) {
            console.log(find);
            res.render("home-signup", {
                user: req.session.user,
                title: "Same User Name - plz try again",
            });
        }
        else {
            let user = new User();
            user.name = req.body.name;
            user.password = req.body.password;
            if (req.body.type && req.body.type == 'on') {
                user.type = "teacher";
            }
            else {
                user.type = "student";
            }
            user.save(function(err) {
                if (err) {
                    res.end("some thing wrong");
                    return console.log(err);
                }
                req.session.user = user;
                res.redirect('/');
            });
        }
    });
});



// Contest
let contest = require("./routes/contest.js");
app.use('/contest', contest);


// File
let file = require("./routes/file.js");
app.use('/file', file);


// Picture
let picture = require("./routes/picture.js");
app.use('/picture', picture);

// Listen
app.listen(4000, function() {
    console.log("listen in port 4000");
});