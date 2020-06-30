const express = require("express");
const router= express.Router();

let User = require("../DBcollection/user.js");

router.get('/', function(req, res) {

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

router.post('/', function(req, res) {
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

router.get('/signup', function(req, res) {
    res.render('home-signup', {
        user: req.session.user,
        title: "user Sign up",
    });
});

router.post('/signup', function(req, res) {
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

            console.log(user);
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


module.exports = router;