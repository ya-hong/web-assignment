const express = require("express");
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const { debug } = require("console");


const router= express.Router();

const basepath = path.join(__dirname, "./..", "public", "resource");

router.post('/upload/*', function(req, res, next){
    var prepath = path.join(encodeURI(req.params[0]));
    var pth = path.join(basepath, prepath);

    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = pth;     //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
  
    form.parse(req, function(err, fields, files) {
        if (err) {
            console.log(err);
        }
        var filename = encodeURI(files.resource.name);
        var newPath = path.join(form.uploadDir , filename);
        fs.renameSync(files.resource.path, newPath);
    });
    res.redirect('/file/' + prepath);
});

router.get('/download/*', function(req, res, next) {
    // 实现文件下载 
    var fileName = req.params[0];
    fileName = encodeURI(fileName);
    var filePath = path.join(basepath, fileName);

    console.log(filePath);

    var stats = fs.statSync(filePath); 
    if(stats.isFile()){
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename='+fileName,
            'Content-Length': stats.size
        });
        fs.createReadStream(filePath).pipe(res);
    } 
    else {
        res.end(404);
    }
});

router.post('/mkdir/*', function(req, res) {
    var prepath = path.join(encodeURI(req.params[0]));
    var dir = path.join(encodeURI(req.body.dirname));
    var dirpath = path.join(basepath, prepath, dir);

    console.log("prepath: " + prepath);
    console.log("dir: " + dir);
    console.log("dirpath: " + dirpath);


    if (!fs.existsSync(dirpath)) {
        fs.mkdirSync(dirpath, function(err) {
            if (err) res.end("something wrong");
        });
    }
    res.redirect('/file/' + prepath);
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

    console.log("pth:" + pth);
    console.log("basepath:" + basepath);
    console.log("filePath: " + filePath);

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