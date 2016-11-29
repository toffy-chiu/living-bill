// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
// 引入提示框和标题组件
require('echarts/lib/component/legend');

var typeInfo=require('../../config/typeInfo');

var Chart = React.createClass({
    propTypes:{
        data:React.PropTypes.object
    },
    componentDidMount:function(){
        this.paintChart(this.props.data);
    },
    componentWillReceiveProps:function(nextProps){
        if(nextProps.data!=this.props.data){
            this.paintChart(nextProps.data);
        }
    },
    paintChart:function(data){
        /*data=require('mockjs').mock({
            'ds|8':[{
                'type|+1':Object.keys(typeInfo),
                'data|36':['@integer(100, 1000)']
            }],
            'label|36':['2016-@increment']
        });*/
        //数据预处理
        var ds=[];
        var types=[];
        data.ds.forEach(function(o){
            types.push(o.type);
            ds.push({
                name:typeInfo[o.type].name,
                type:'bar',
                barMaxWidth:20,
                stack:'bill',
                data:o.data,
                itemStyle:{
                    normal:{
                        color:typeInfo[o.type].color
                    }
                }
            });
        });

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(this.refs.main);
        // 绘制图表
        myChart.setOption({
            legend: {
                data:types.map(function(type){
                    return {name:typeInfo[type].name,icon:'path://'+document.querySelector(`#icon-${typeInfo[type].icon} path`).getAttribute('d')};
                }),
                formatter:' ',
                //itemGap:5,
                itemWidth:15,
                itemHeight:20
            },
            grid:{
                left:40,
                right:20,
                top:30,
                bottom:30
            },
            xAxis : [
                {
                    type : 'category',
                    data : data.label.map(function(date){return +date.split('-')[1]+'月';})
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series: ds
        });
    },
    render: function() {
        return (
            <div ref="main" style={{width:320,height:180,margin:'0 auto'}}></div>
        );
    }
});

module.exports = Chart;