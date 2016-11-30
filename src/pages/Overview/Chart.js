// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
require('echarts/lib/chart/line');
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
    calculateMinAxis:function(option, selected){
        //当前可见的系列名
        var visibleSeriesName=[];
        for(var name in selected){
            if(selected[name]){
                visibleSeriesName.push(name);
            }
        }

        //当前可见的系列
        var allValues=[];
        var visibleSeries=option.series.filter(function(o){
            if(~visibleSeriesName.indexOf(o.name)){
                //同时获得该系列的所有值，供下面计算使用
                allValues=allValues.concat(o.data);
                return true;
            }else{
                return false;
            }
        });

        //计算Y轴最小值
        var min=0;
        if(allValues.length){
            var maxValue=Math.max.apply(Math, allValues);
            var minValue=Math.min.apply(Math, allValues);
            var midValue=(maxValue-minValue)/2;
            midValue=Math.round(midValue);
            min=midValue>=minValue?minValue:(minValue-midValue);
        }

        //设置回去
        option.yAxis[0].min=min;
        return option;
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
        var legendSelected={};
        data.ds.forEach(function(o){
            types.push(o.type);
            legendSelected[typeInfo[o.type].name]=o.type==='LOAN';
            ds.push({
                name:typeInfo[o.type].name,
                type:'bar',
                barMaxWidth:20,
                //stack:'bill',
                data:o.data,
                itemStyle:{
                    normal:{
                        color:typeInfo[o.type].color
                    }
                }
            });
        });

        //计算total
        var totalData=[];
        data.label.forEach(function(l, i){
            totalData[i]=0;
            ds.forEach(function(o){
                totalData[i]+=o.data[i];
            });
        });
        //添加折线
        ds.push({
            name:'TOTAL',
            type:'line',
            data:totalData,
            itemStyle:{
                normal:{
                    color:'red'
                }
            }
        });

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(this.refs.main);

        // 绘制图表
        var opt={
            legend: {
                selected:legendSelected,
                data:types.map(function(type){
                    return {name:typeInfo[type].name,icon:'path://'+document.querySelector(`#icon-${typeInfo[type].icon} path`).getAttribute('d')};
                }).concat([{name:'TOTAL'}]),
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
        };

        opt=this.calculateMinAxis(opt, legendSelected);

        myChart.setOption(opt);

        myChart.on('legendselectchanged', function(e){
            var option=myChart.getOption();
            option=this.calculateMinAxis(option, e.selected);
            myChart.setOption(option);
        }.bind(this));
    },
    render: function() {
        return (
            <div ref="main" style={{width:320,height:180,margin:'0 auto'}}></div>
        );
    }
});

module.exports = Chart;