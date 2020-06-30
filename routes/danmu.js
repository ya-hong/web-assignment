const express = require("express");
const path = require('path'); 
const fs = require('fs');
const router= express.Router();
const expressWs = require('express-ws');
const Picture = require('../DBcollection/picture.js');

const basepath = path.join(__dirname, "../public/pictures");

expressWs(router);

router.get('/:picture', function(req, res) {

    if (req.session.user == undefined) {
        return res.redirect('/');
    }
    var fileName = req.params.picture;
    Picture.findOne({name: fileName}, function(err, find) {
        if (!find) return res.end("some thing wrong");
        res.render("danmu-picture", {
            title: "正在播放弹幕……",
            fileName: fileName,
            danmu: find.danmu,
            filePath: path.join("/pictures", fileName, "EDIT" + fileName),
            user: req.session.user
        })
    })
});
router.ws('/:picture', function(ws, req) {
    var picture;
    ws.on('message', function(msg) {
        console.log('ws connected');
        if (picture == undefined) {
            Picture.findOne({name: msg}, function(err, find) {
                if (err) return console.log(err);
                if (find == null) return console.log("ws err");
                picture = find;
                ws.send(JSON.stringify(picture.danmu));
            });
        }
        else {
            picture.danmu.push(msg);
            picture.save();
        }
    });
});

router.get('/', function(req, res) {
    if (req.session.user == undefined) {
        return res.redirect('/');
    }
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