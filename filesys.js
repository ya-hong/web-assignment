const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

var download = function(filePath, res) {
    while (filePath[filePath.length - 1] == '/') {
        filePath= filePath.substr(0, filePath.length - 1);
    }
    var pos = filePath.length - 1;
    while (pos >= 0 && filePath[pos] != '/' ) pos--;
    pos++;
    var fileName = filePath.substr(pos, filePath.length - pos);

    console.log(filePath);

    var stats = fs.statSync(filePath); 
    if(stats.isFile()){
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename='+encodeURI(fileName),
            'Content-Length': stats.size,
        });
        fs.createReadStream(filePath).pipe(res);
        // console.log(res);
    } 
    else {
        res.end('some thing wrong');
    }
};

var upload = function(filePath, req, fileName, callback) {
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = filePath;     //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function(err, fields, files) {
        if (err) {
            return console.log(err);
        }

        if (fileName != undefined) {
            fs.renameSync(files.resource.path, path.join(filePath, fileName));
            if (callback) return callback(err);
        }
        else {
            fileName = (files.resource.name);
            var prefix = 0;
            while (fs.existsSync(path.join(filePath, fileName))) {
                fileName = prefix + files.resource.name;
                prefix++;
            }
            fs.renameSync(files.resource.path, path.join(filePath, fileName));
            if (callback) return callback(err);
        }
    });
}

var mkdir = function(dirPath, callback) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
        return callback();
    }
    else return callback();
}

exports.download = download;
exports.upload = upload;
exports.mkdir = mkdir;