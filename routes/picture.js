const express = require("express");
const path = require('path'); 
const filesys = require("../public/filesys.js");
const fs = require('fs');
const formidable = require('formidable');
const router= express.Router();

const Picture = require('../public/picture.js');

const basepath = path.join(__dirname, "./..", "public", "pictures");

router.post('/upload', function(req, res, callback){ 
    var fileName;

    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = basepath;     //设置上传目录
    form.keepExtensions = true;     //不保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大

    form.parse(req, function(err, fields, files) {
        if (err) {
            return console.log(err);
        }
        fileName = encodeURI(files.resource.name);
        var newPath = path.join(form.uploadDir , fileName);
        var prefix = 0;
        while (fs.existsSync(newPath)) {
            fileName = encodeURI(prefix + files.resource.name);
            newPath = path.join(form.uploadDir, fileName);
            prefix++;
        }

        console.log("fileName: " + decodeURI(fileName));

        var fileNamep = "EDIT" + fileName;

        var picture = new Picture();
        picture.name = fileName;
        picture.danmu = [];

        Picture.find({name: fileName}, function(err, find) {
            if (find.length) {
                res.end("some thing worng");
            }
            picture.save(function(err) {
                if (err) return console.log(err);
                fs.mkdirSync(newPath);
                fs.copyFileSync(files.resource.path, path.join(newPath, fileName));
                fs.copyFileSync(files.resource.path, path.join(newPath, fileNamep));
                fs.unlinkSync(files.resource.path);
                return res.redirect('/picture');
            })
        });
    });
});

router.get('/', function(req, res, next) {
    // 显示服务器文件 
    // 文件目录
    fs.readdir(basepath, function(err, results){
        if(err) {
            return res.end("something wrong");
        }
        var dirs = [];
        results.forEach(function(dir){
            if(fs.statSync(path.join(basepath, dir)).isDirectory()){
                dirs.push({ name: decodeURI(dir), url: encodeURI(dir)});
            }
        });
        res.render('picture', {
            title: "Pictures",
            dirs: dirs,
            user: req.session.user
        });
    });
});

router.get('/:picture', function(req, res) {


});

module.exports = router;