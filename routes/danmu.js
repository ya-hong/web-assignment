const express = require("express");
const path = require('path'); 
const fs = require('fs');
const router= express.Router();

const Picture = require('../DBcollection/picture.js');

const basepath = path.join(__dirname, "./..", "public", "pictures");


router.get('/:picture', function(req, res) {
    var fileName = req.params.picture;

    res.render("danmu-picture", {
        title: "正在播放弹幕……",
        fileName: fileName,
        user: req.session.user
    })
});

router.get('/', function(req, res) {
    // 显示服务器文件 
    // 文件目录
    fs.readdir(basepath, function(err, results){
        if(err) {
            return res.end("something wrong");
        }
        var dirs = [];
        results.forEach(function(dir){
            if(fs.statSync(path.join(basepath, dir)).isDirectory()){
                dirs.push(dir);
            }
        });
        res.render('danmu', {
            title: "Pictures",
            dirs: dirs,
            user: req.session.user
        });
    });
});

module.exports = router;