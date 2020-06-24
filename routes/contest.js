const express = require("express");

const router= express.Router();

let Contest = require("../public/tasks.js");
let ObjectId = require('mongodb').ObjectId;

const { renderFile } = require("pug");
const { isValidObjectId } = require("mongoose");

router.get('/', function(req, res) {
    Contest.find({}, function(err, contests) {
        if (err) {
            return console.log(err);
        }

        contests.forEach(function(contest) {
            contest.score = 0;
            contest.tasks.forEach(function(task) {
                contest.score += task.score;
            });
        });

        res.render('contest', {
            title: 'Contests',
            contests: contests
        });
    });
});

router.get('/add', function(req, res) {
    res.render('contest-add', {
        title: 'create new Contest'
    });
});

router.post('/add', function(req, res) {
    let contest = new Contest();
    contest.title = req.body.title;
    contest.teacher= req.body.teacher;
    contest.class = req.body.class;

    contest.save(function(err) {
        console.log("/add contest: ", contest)
        if (err) {
            return console.log(err);
        }
        res.redirect('add/tasks/' + contest._id);
    })
});

router.get('/add/tasks/:id', function(req, res) {
    console.log("!req.params:"  + req.params);
    console.log("ID: " + ObjectId(req.params._id));
    Contest.findById(ObjectId(req.params._id), function(err, contest) {
        if (err) {
            return console.log(err);
        }
        console.log("/add/tasks contest: " + contest);
        if (contest.tasks == undefined) {
            contest.tasks = [];
        }
        res.render('contest-add-tasks', {
            title: "add Tasks", 
            contest: contest
        });
    });
});
router.post('/add/tasks/:id', function(req, res) {
    Contest.findById(req.params._id, function(err, contest) {
        if (err) {
            return console.log(err);
        }
        if (contest.tasks == undefined) {
            contest.tasks = [];
        }
        let task = {
            name: req.params.name,
            score: req.params.score,
            A: {
                desc: req.params.A_desc,
                ans:  req.params.A_ans
            },
            B: {
                desc: req.params.B_desc,
                ans:  req.params.B_ans
            },
            C: {
                desc: req.params.C_desc,
                ans:  req.params.C_ans
            },
            D: {
                desc: req.params.D_desc,
                ans:  req.params.D_ans
            },
        };
        contest.tasks.push(task);
        cantest.save(function(err) {
            if (err) {
                return console.log('!' + err);
            }
            res.redirect('/');
        });
    });

});

module.exports = router;