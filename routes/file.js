const express = require("express");
const path = require('path');
const filesys = require("../filesys.js");
const fs = require('fs');


const router= express.Router();

const basepath = path.join(__dirname, "./..", "public", "resource");

router.post('/upload/*', function(req, res){
    var prePath = req.params[0];
    console.log(prePath);
    var filePath = path.join(basepath, prePath);
    console.log(filePath);
    filesys.upload(filePath, req, undefined, function(err) {
        if (err) {
            return console.log(err);
        }
        res.redirect('/file/' + prePath);
    });
});

router.get('/download/*', function(req, res) {
    var fileName = req.params[0];
    fileName = encodeURI(fileName);
    var filePath = path.join(basepath, fileName);
    filesys.download(filePath, res);
});

router.post('/mkdir/*', function(req, res) {
    var prepath = path.join(encodeURI(req.params[0]));
    var dirpath = path.join(basepath, prepath, encodeURI(req.body.dirname));
    filesys.mkdir(dirpath, function(err) {
        if (err) {
            return console.log(err);
        }
        res.redirect('/file/' + prepath);
    });
});

router.get('/*', function(req, res, next) {
    // 显示服务器文件 
    // 文件目录
    var pth = encodeURI(req.params[0]);
    pth = path.join(pth);

    while (pth[pth.length-1] == '/') {
        pth = pth.substr(0, pth.length - 1);
    }

    var filePath = path.join(basepath, pth);

    fs.readdir(filePath, function(err, results){
        if(err) {
            return res.end("something wrong");
        }
        var files = [], dirs = [];
        if (pth != ".") dirs.push({ name: '上一层目录', url: '..'});

        results.forEach(function(file){
            // console.log(file);
            if(fs.statSync(path.join(filePath, file)).isFile()){
                files.push({name: decodeURI(file), url: file});
            }
            if(fs.statSync(path.join(filePath, file)).isDirectory()){
                dirs.push({ name: decodeURI(file), url: file });
            }
        });

        res.render('file', {
            title: "Files",
            files:files, 
            dirs:dirs, 
            prepath: pth, 
            user: req.session.user
        });
    });
});

module.exports = router;