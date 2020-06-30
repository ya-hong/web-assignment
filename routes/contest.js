const express = require("express");

const router= express.Router();

let Contest = require("../DBcollection/tasks.js");
let User = require("../DBcollection/user.js");
let Score = require("../DBcollection/score.js");

let ObjectId = require('mongodb').ObjectId;


router.get('/', function(req, res) {
    if (req.session.user == undefined) {
        return res.redirect('/');
    }

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
    if (req.session.user == undefined) {
        return res.redirect('/');
    }
    if (req.session.user.type != 'teacher') {
        return res.redirect('/contest');
    }

    res.render('contest-add', {
        title: 'create new Contest',
        user: req.session.user
    });
});

router.post('/add', function(req, res) {
    let contest = new Contest();
    contest.title = req.body.title;
    contest.teacher= req.session.user.name;
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
    if (req.session.user == undefined) {
        return res.redirect('/');
    }
    if (req.session.user.type != 'teacher') {
        return res.redirect('/contest');
    }

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
    if (req.session.user == undefined) {
        return res.redirect('/');
    }

    var userid = req.session.user._id;
    Contest.findById(ObjectId(req.params.id), function(err, contest) {
        contest.score = 0;
        contest.tasks.forEach(function(task) {
            contest.score += task.score;
        });

        Score.findOne({
            user: userid,
            contest: req.params.id
        }, function(err, score) {
            if (score) {
                res.render('contest-tasks-finish', {
                    title: "Contest Tasks (你已完成)",
                    contest: contest,
                    user: req.session.user,
                    id: req.params.id,
                    score: score.score
                })
            }
            else {
                res.render('contest-tasks', {
                    title: "Contest Tasks",
                    contest: contest,
                    user: req.session.user,
                    id: req.params.id
                });
            }
        })
    });
});

router.post('/tasks/:id', function(req, res) {
    var contestid = req.params.id, userid = req.session.user._id;

    Score.findOne({
        user: userid,
        contest: contestid
    }, function(err, score) {
        console.log(score);
        if (score) {
            res.redirect('/contest');
        }
        else {
            Contest.findById(ObjectId(contestid), function(err, contest) {
                score = new Score();
                score.user = userid;
                score.contest = contestid;
                score.score = 0;
                for (var i = 0; i < contest.tasks.length; ++i) {
                    if (
                        (req.body[i + 'A'] == 'on') == contest.tasks[i].A.ans &
                        (req.body[i + 'B'] == 'on') == contest.tasks[i].B.ans &
                        (req.body[i + 'C'] == 'on') == contest.tasks[i].C.ans &
                        (req.body[i + 'D'] == 'on') == contest.tasks[i].D.ans
                    ) {
                        score.score += contest.tasks[i].score;
                    }
                }
                score.save(function(err) {
                    res.redirect('/contest/tasks/' + contestid);
                })
            })
        }
    })
});

router.get('/chart', function(req, res) {
    if (req.session.user == undefined) {
        return res.redirect('/');
    }

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

        res.render('contest-chart', {
            title: '查看考试分数分布',
            user: req.session.user,
            contests: contests
        });
    });
});

router.get('/chart/:id', function(req, res) {
    if (req.session.user == undefined) {
        return res.redirect('/');
    }

    Score.find({contest: req.params.id}, function(err, scores) {
        Contest.findOne(ObjectId(req.params.id), function(err, contest) {
            var obj = {};
            scores.forEach(function(score) {
                if (obj[score.score]) obj[score.score]++;
                else obj[score.score] = 1;
            });
            console.log(obj);
            var data = [];
            for (var name in obj) {
                data.push({
                    name: name + "分",
                    value: obj[name]
                })
            }
            console.log(data);
            res.render('contest-chart-tasks', {
                title: '查看考试分数分布',
                user: req.session.user,
                contest: contest,
                data: JSON.stringify(data)
            });
        })
    })
});

module.exports = router;