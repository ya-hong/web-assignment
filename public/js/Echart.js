// 基于准备好的dom，初始化echarts实例
var div = document.getElementById('chart');
var myChart = echarts.init(div);
var scores = JSON.parse($('#chart').attr('scores'));

// 指定图表的配置项和数据
option = {
    series : [
        {
            // name: '访问来源',
            type: 'pie',
            // radius: '55%',
            roseType: 'angle',
            data: scores,

            // itemStyle的emphasis是鼠标 hover 时候的高亮样式。
            // 这个示例里是正常的样式下加阴影，但是可能更多的时候是 hover 的时候通过阴影突出
            itemStyle: {
                emphasis: {
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },

            //可以每个系列分别设置，每个系列的文本设置在 label.textStyle。
            label: {
                textStyle: {
                    color: 'rgba(255, 255, 255, 0.7)'
                },
            },
            // 饼图的话还可以将标签的视觉引导线的颜色设为浅色
            labelLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                }
            },
        }
    ],
    // 设置背景色(背景色是全局的)
    backgroundColor: '#2c343c',

    // 设置文本样式（文本的样式可以设置全局的 textStyle。）
    textStyle: {
        color: 'rgba(255, 255, 255, 0.7)'
    }


};


// 使用刚指定的配置项和数据显示图表。
console.log(scores);
myChart.setOption(option);