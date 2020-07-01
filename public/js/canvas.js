let canvas = document.getElementById("drawing-board");
let ctx = canvas.getContext("2d");

let click= false;
let clear = false;

let color = document.getElementById("color");
let penrange = document.getElementById("penrange");
let eraser = document.getElementById("eraser");
let eraserrange = document.getElementById("eraserrange");
let reSetCanvas = document.getElementById("clear");
let saveButton = document.getElementById("save");
let submitimg = document.getElementById("submitimg");
let reSetCanvasAll = document.getElementById("clearAll");

let imgObj = new Image();

var imgPath = $('#drawing-board').attr('imgPath');
var imgName = $('#drawing-board').attr('imgName');


var offsetX, offsetY;

function reOffset(){
    var BB=canvas.getBoundingClientRect();
    offsetX=BB.left;
    offsetY=BB.top;
}


imgObj.onload = function() {
    let w = this.width;
    let h = this.height;

    canvas.height = canvas.width / w * h;

    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
};



eraser.onclick = function () {
    if (clear == false) clear = true;
    else clear = false;
};



//鼠标按下事件
canvas.onmousedown = function (e) {
    if (!e.button == 0) return;
    click = true;
    if (!clear) {
        ctx.beginPath();
        reOffset();
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;
        ctx.lineWidth=penrange.value;
        ctx.moveTo(x, y);
    }
};

//鼠标移动事件
canvas.onmousemove = function (e) {
    reOffset();
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;
    if (!clear && click) {
        ctx.lineTo(x, y);
        ctx.strokeStyle= color.value;
        ctx.stroke();
    }
    if (clear && click) {
        // ctx.stroke();
        let len = eraserrange.value;
        ctx.clearRect(x-len, y-len, 2 * len, 2 * len);
    }
};

//鼠标松开事件
canvas.onmouseup = function () {
    // ctx.stroke();
    click = false;
}


reSetCanvas.onclick = function () {
    // ctx = canvas.getContext('2d');
    ctx.stroke();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    imgObj.onload();
};
reSetCanvasAll.onclick = function() {
    main(imgPath + '/' + imgName);
    reSetCanvas.onclick();
}

//图片转成Buffer
function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
}

saveButton.onclick = function() {
    var form = $("<form enctype='multipart/form-data'>\n" +
                "    <input type='text' name='fileType' value='1'/>\n" +
                "</form>");
    var param = new FormData(form[0]);
    var src = canvas.toDataURL("image/png");//这里转成的是base64的地址，直接用到img标签的src是可以显示图片的

    var blob = dataURItoBlob(src);

    param.append('source_from', 'webpage_upload');//在formdata加入需要的参数
    param.append('resource', blob);

    console.log($('#drawing-board').attr('imgname'));

    $.ajax({
        url: "/picture/edit/" + $('#drawing-board').attr('imgname'),
        type: "POST",
        data: param,
        processData: false,
        dataType: "json",
        cache: false,
        contentType: false,
        success: function (response) {
            main(imgPath + '/EDIT' + imgName);
            imgObj.onload();
        },
        error: function (xhr, status, error) {

        }
    })
}


var main = function(src) {
    imgObj.setAttribute('crossorigin', 'anonymous'); 
    imgObj.src = src;
}

main(imgPath + '/EDIT' + imgName);
imgObj.onload();