var NavBar=require('../../components/NavBar');
var Icon=require('../../components/Icon');
var Loader=require('../../components/Loader');

var db = require('../../utils/IndexDB');
var typeInfo=require('../../config/typeInfo');

var Chart=require('./Chart');

module.exports=React.createClass({
    getInitialState:function(){
        return {
            loading:true,
            list: []
        }
    },
    componentWillMount:function(){
        //读取数据库
        db.getList(db.TABLE_BILL, function(list){
            //倒序排序
            list.sort(function(a, b){
                return new Date(b.date).getTime()-new Date(a.date).getTime();
            });
            this.setState({
                loading:false,
                list:list
            });
        }.bind(this));
    },
    render:function(){
        if(this.state.loading){
            return <Loader/>
        }else {
            //数据预处理，同月份的合并
            var monthList=[];
            var typeList=[];
            var mapObj={}; //month_type => amount
            var chartData=[];
            var list = [];
            var total = 0;
            if (this.state.list.length) {
                var header = '', month, types;
                this.state.list.forEach(function (o, i) {
                    if(!~typeList.indexOf(o.type)){
                        typeList.push(o.type);
                    }

                    //插入标题头
                    month = o.date.slice(0, 7);
                    if (header != month) {

                        monthList.push(month);

                        //插入第一个到倒数第二个月的项（从第二个循环开始）
                        if(types) {
                            for (var t in types) {
                                mapObj[header + '_' + t] = types[t].amount; //取上一个月

                                types[t].amount += ' 元';
                                list.push(types[t]);
                            }
                        }

                        list.push({
                            title: month
                        });

                        //合并类型，初始化
                        types = {};

                        header = month;
                    }

                    //针对每个月累加每一项
                    if (!types[o.type]) {
                        types[o.type] = {
                            name: typeInfo[o.type].name,
                            icon: typeInfo[o.type].icon,
                            color: typeInfo[o.type].color,
                            amount: 0
                        }
                    }
                    types[o.type].amount += +o.amount;
                    total += +o.amount;

                    //插入最后一项
                    if (i == this.state.list.length - 1) {
                        for (var t in types) {
                            mapObj[month+'_'+t]=types[t].amount;

                            types[t].amount += ' 元';
                            list.push(types[t]);
                        }
                    }
                }.bind(this));

                //反转（原来月份是倒序的）
                monthList.reverse();
                typeList.forEach(function(type, i){
                    chartData.push({
                        type:type,
                        data:[]
                    });
                    monthList.forEach(function(month){
                        chartData[i].data.push(mapObj[month+'_'+type]||0);
                    });
                });
            }
            return (
                <div className="container container-fill container-column">
                    <NavBar title={`总览（共 ${+total.toFixed(2)} 元）`} leftNav={{}} />
                    <div className="views">
                        <div className="view">
                            <div className="container container-fill container-scrollable">
                                <div className="margin-0 group group-no-padded">
                                    <div className="group-body">
                                        <Chart data={{label:monthList,ds:chartData}}/>
                                        {
                                            list.length ? (
                                                <ul className="list">
                                                    {
                                                        list.map(function (o, i) {
                                                            return o.title
                                                                ? <li className="item item-header" key={i}>{o.title}</li>
                                                                : (
                                                                <li className="item" key={i}>
                                                                    <h3 className="item-title">
                                                                        <div style={{display:'flex',alignItems:'center'}}>
                                                                            <Icon name={o.icon} color={o.color} size="30"/>
                                                                            <span style={{marginLeft:5}}>{o.name}</span>
                                                                        </div>
                                                                    </h3>
                                                                    <div className="item-after">{o.amount}</div>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            ) : (
                                                <h3 className="text-center padding-v-lg">没有数据！</h3>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
});