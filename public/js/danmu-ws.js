
class Barrage {
    constructor(canvas) {
        this.canvas = document.getElementById(canvas);

        this.canvas.width = document.getElementById('img').width;
        this.canvas.height = document.getElementById('img').height;

        let rect = this.canvas.getBoundingClientRect();
        this.w = rect.right - rect.left;
        this.h = rect.bottom - rect.top;

        this.ctx = this.canvas.getContext('2d');
        this.ctx.font = '28px Microsoft YaHei';
        this.barrageList = [];
    }

    //添加弹幕列表
    shoot(value) {
        let top = this.getTop();
        let color = this.getColor();
        let offset = this.getOffset();
        let width = Math.ceil(this.ctx.measureText(value).width);

        let barrage = {
            value: value,
            top: top,
            left: this.w,
            color: color,
            offset: offset,
            width: width
        }
        this.barrageList.push(barrage);
    }

    //开始绘制
    draw() {
        if (this.barrageList.length) {
            this.ctx.clearRect(0, 0, this.w, this.h);
            for (let i = 0; i < this.barrageList.length; i++) {
                let b = this.barrageList[i];
                if (b.left + b.width <= 0) {
                    this.barrageList.splice(i, 1);
                    i--;
                    continue;
                }
                b.left -= b.offset;
                this.drawText(b);
            }
        }
        requestAnimationFrame(this.draw.bind(this));
    }

    //绘制文字
    drawText(barrage) {
        this.ctx.fillStyle = barrage.color;
        this.ctx.fillText(barrage.value, barrage.left, barrage.top);
    }

    //获取随机颜色
    getColor() {
        return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
    }

    //获取随机top
    getTop() {
        //canvas绘制文字x,y坐标是按文字左下角计算，预留30px
        return Math.floor(Math.random() * (this.h - 30)) + 30;
    }

    //获取偏移量
    getOffset() {
        return +(Math.random() * 3).toFixed(1) + 1;
    }

}


/********************************************/

// 打开一个 web socket
var ip = document.location.hostname;
var ws = new WebSocket("ws://" + ip + ":4000/danmu/" + $('#pictureName').attr('_name'));

ws.onopen = function() {
    // Web Socket 已连接上，使用 send() 方法发送数据

    console.log('ws open');

    var fileName = $('#pictureName').attr('_name');
    ws.send(fileName);
};
                
ws.onmessage = function (msg) { 
    var danmus = JSON.parse(msg.data);
    let barrage = new Barrage('canvas');

    console.log(danmus);
    danmus.forEach((t) => {
        barrage.shoot(t);
    })

    barrage.draw();
};

$(document).ready(function() {
    $("#danmu-button").on('click', function(e) {
        $target = $(e.target);
        var content = $('#danmu-input').val();
        if (content == "") return;
        ws.send(content);
    });
});

