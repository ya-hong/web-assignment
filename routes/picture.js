const express = require("express");
const path = require('path'); 
const filesys = require("../filesys.js");
const fs = require('fs');
const formidable = require('formidable');
const router= express.Router();

const Picture = require('../DBcollection/picture.js');

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
        fileName = files.resource.name;
        var newPath = path.join(form.uploadDir , fileName);
        var prefix = 0;
        while (fs.existsSync(newPath)) {
            fileName = prefix + files.resource.name;
            newPath = path.join(form.uploadDir, fileName);
            prefix++;
        }

        console.log("fileName: " + fileName);

        var fileNamep = "EDIT" + fileName;

        var picture = new Picture();
        picture.name = fileName;
        picture.danmu = [];

        Picture.find({name: fileName}, function(err, find) {
            if (find.length) {
                return res.end("some thing worng");
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

router.post('/edit/:picture', function(req, res) {
    // console.log(req.body);
    var fileName = req.params.picture;
    var filePath = path.join(basepath, fileName);
    filesys.upload(filePath, req, "EDIT" + fileName);
})

router.get('/:picture', function(req, res) {
    var fileName = req.params.picture;
    var filePath = path.join("/pictures", fileName);

    res.render("picture-edit", {
        title: "Edit picture",
        
        filePath: filePath,
        fileName: fileName,
        user: req.session.user
    })
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
                dirs.push(dir);
            }
        });
        res.render('picture', {
            title: "Pictures",
            dirs: dirs,
            user: req.session.user
        });
    });
});

module.exports = router;