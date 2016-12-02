// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
require('echarts/lib/chart/line');
// 引入提示框和标题组件
require('echarts/lib/component/legend');

var typeInfo=require('../../config/typeInfo');

var Chart = React.createClass({
    //因为echarts不支持隐藏类目，故以原始的类目作为模板再进行过滤来达到同样目的
    originalLabels:[],
    originalSeries:[],
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
    /**
     * 计算Y轴最小值
     * @param option
     * @param selected
     * @returns {*}
     */
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
    /**
     * 过滤那些值都为0的类目
     * @param option
     * @param selected
     * @returns {*}
     */
    filterZeroSeries:function(option, selected){
        //当前可见的系列名
        var visibleSeriesName=[];
        for(var name in selected){
            if(selected[name]){
                visibleSeriesName.push(name);
            }
        }

        //都复制一份进行操作
        var labels=this.originalLabels.concat();
        var series=this.originalSeries.concat();
        var totalData=[];
        var visibleSeries=series.filter(function(o){
            return ~visibleSeriesName.indexOf(o.name);
        });
        labels.forEach(function(l, i){
            totalData[i]=0;
            visibleSeries.forEach(function(o){
                totalData[i]+=o.data[i];
            });
        });

        //需要去除的index
        var removedIndex=[];
        totalData.forEach(function(o, i){
            //都等于0的“柱子”去掉
            if(o==0){
                removedIndex.push(i);
            }
        });

        if(removedIndex.length) {
            //把都等于0的那一列挑掉
            labels=labels.filter(function(o, i){
                return !~removedIndex.indexOf(i);
            });

            series=series.map(function (s) {
                //复制对象，否则操作原对象会对this.originalSeries造成影响
                var o=Object.assign({}, s);
                o.data = o.data.filter(function (o, i) {
                    return !~removedIndex.indexOf(i);
                });
                return o;
            });
        }

        option.xAxis[0].data=labels;
        option.series=series;

        return option;
    },
    /**
     * 画图
     * @param data
     */
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
            legendSelected[typeInfo[o.type].name]=false;
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
        legendSelected['TOTAL']=true;

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(this.refs.main);

        //初始化
        this.originalLabels=data.label.map(function(date){return +date.split('-')[1]+'月';});
        this.originalSeries=ds;

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
                    data : this.originalLabels.concat()
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel:{
                        formatter:function(val){
                            return Math.round(val);
                        }
                    }
                }
            ],
            series: this.originalSeries.concat()
        };

        opt=this.calculateMinAxis(opt, legendSelected);
        opt=this.filterZeroSeries(opt, legendSelected);

        myChart.setOption(opt);

        myChart.on('legendselectchanged', function(e){
            var option=myChart.getOption();
            option=this.calculateMinAxis(option, e.selected);
            option=this.filterZeroSeries(option, e.selected);
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