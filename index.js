const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require('express-session');
const expressWs = require('express-ws');


// Link Database
mongoose.connect('mongodb://localhost/web', {useMongoClient:true})
let db = mongoose.connection;
mongoose.plugin(schema => { schema.options.usePushEach = true });


// Check DB errors

db.once('open', function() {
    console.log("Connected to mongoDB")
})
db.on('error', function(err) {
    console.log(err);
});

// Init App
const app = express();

expressWs(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json()); // 使用bodyparder中间件，
app.use(bodyParser.urlencoded({ extended: true }));// 使用 session 中间件
app.use(session({    secret :  'IDontKnow', // 对session id 相关的cookie 进行签名
   resave : true,    saveUninitialized: false, // 是否保存未初始化的会话
   cookie : {        maxAge : 1000 * 60 * 60, // 设置 session 的有效时间，单位毫秒
   },
}));


// Contest
let contest = require("./routes/contest.js");
app.use('/contest', contest);


// File
let file = require("./routes/file.js");
app.use('/file', file);


// Picture
let picture = require("./routes/picture.js");
app.use('/picture', picture);


// Danmu
let danmu = require("./routes/danmu.js");
app.use('/danmu', danmu);


// Main page
let home = require("./routes/home.js");
app.use("/", home);


// Listen
app.listen(4000, function() {
    console.log("listen in port 4000");
});