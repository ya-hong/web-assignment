const express = require("express");

const router= express.Router();

let Contest = require("../DBcollection/tasks.js");
let ObjectId = require('mongodb').ObjectId;


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
            user: req.session.user,
            contests: contests
        });
    });
});

router.get('/add', function(req, res) {
    res.render('contest-add', {
        title: 'create new Contest',
        user: req.session.user
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
    Contest.findById(ObjectId(req.params.id), function(err, contest) {
        if (err) {
            return console.log(err);
        }
        console.log("/add/tasks contest: " + contest);
        if (contest.tasks == undefined) {
            contest.tasks = [];
        }
        res.render('contest-add-tasks', {
            title: "add Tasks", 
            user: req.session.user,
            contest: contest
        });
    });
});
router.post('/add/tasks/:id', function(req, res) {
    Contest.findById(ObjectId(req.params.id), function(err, contest) {
        if (err) {
            return console.log(err);
        }
        if (contest.tasks == undefined) {
            contest.tasks = [];
        }
        console.log(req.body);

        let task = {
            name : req.body.name,
            score : req.body.score,
            A: {
                desc: req.body.A_desc,
                ans:  req.body.A_ans
            },
            B: {
                desc: req.body.B_desc,
                ans:  req.body.B_ans
            },
            C: {
                desc: req.body.C_desc,
                ans:  req.body.C_ans
            },
            D: {
                desc: req.body.D_desc,
                ans:  req.body.D_ans
            },
        };


        if (req.body.A_ans && req.body.A_ans == "on") {
            task.A.ans = true;
        }
        else task.A.ans = false;

        if (req.body.B_ans && req.body.B_ans == "on") {
            task.B.ans = true;
        }
        else task.B.ans = false;

        if (req.body.C_ans && req.body.C_ans == "on") {
            task.C.ans = true;
        }
        else task.C.ans = false;

        if (req.body.D_ans && req.body.C_ans == "on") {
            task.D.ans = true;
        }
        else task.D.ans = false;

        console.log(task);
        contest.tasks.push(task);
        contest.save(function(err) {
            if (err) {
                return console.log('!' + err);
            }
            res.redirect('/contest/add/tasks/' + req.params.id);
        });
    });

});

router.get('/tasks/:id', function(req, res) {
    Contest.findById(ObjectId(req.params.id), function(err, contest) {
        contest.score = 0;
        contest.tasks.forEach(function(task) {
            contest.score += task.score;
        });

        res.render('contest-tasks', {
            title: "Contest Tasks",
            contest: contest,
            user: req.session.user
        });
    });
})

module.exports = router;