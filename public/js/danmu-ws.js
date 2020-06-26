// 打开一个 web socket
var ws = new WebSocket("ws://localhost:4000/danmu");
ws.binaryType="arraybuffer";

ws.onopen = function() {
    // Web Socket 已连接上，使用 send() 方法发送数据
    var fileName = $('#pictureName').attr('_name');
    ws.send(fileName);
};
                
ws.onmessage = function (msg) { 
    // var danmu = evt.data;
    var danmus = JSON.parse(msg.data);
    danmus.forEach(function(danmu) {
        console.log(danmu);
    });
};

$(document).ready(function() {
    $("#danmu-button").on('click', function(e) {
        $target = $(e.target);
        var content = $('#danmu-input').val();
        var danmu = {
            content: content,
            time: 10,
            pos: "50px"
        }
        ws.send(JSON.stringify(danmu));
    });
});


