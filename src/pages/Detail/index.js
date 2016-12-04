var Link=require('react-router').Link;
var NavBar=require('../../components/NavBar');
var Icon=require('../../components/Icon');
var Loader=require('../../components/Loader');

var db = require('../../utils/IndexDB');
var typeInfo=require('../../config/typeInfo');

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
        }.bind(this), db.index_type, db.keyRange.inType(this.props.params.type));
    },
    //条目数据预处理
    getItem:function(item){
        var date=new Date(item.date.replace(/-/g, '/'));
        return {
            id:item.id,
            day:date.getDate(),
            month:(date.getMonth()+1),
            year:date.getFullYear(),
            icon:typeInfo[item.type].icon,
            name:typeInfo[item.type].name,
            color:typeInfo[item.type].color,
            amount:item.amount
        };
    },
    render:function(){
        if(this.state.loading){
            return <Loader/>
        }else {
            var list=this.state.list;

            //计算总数
            var total=0;
            list.forEach(function(o){
                total+=+o.amount;
            });
            total=+total.toFixed(2);

            return (
                <div className="container container-column container-fill">
                    <div className="view">
                        <NavBar title={`【${typeInfo[this.props.params.type].name}】明细`} leftNav={{}} rightNav={{icon:'plus',href:`/edit/${this.props.params.type}`}}/>
                        <div className="item item-header">小计：{total} 元</div>
                        <div className="container container-scrollable container-fill">
                            {
                                list.length ? (
                                    <ul className="list touch-auto margin-0">
                                        {
                                            list.map(function (o, i) {
                                                o = this.getItem(o);
                                                return (
                                                    <li key={i} className="item item-linked">
                                                        <Link to={`/edit/${this.props.params.type}/${o.id}`} style={{display:'flex',alignItems:'center'}}>
                                                            <div className="text-center" style={{lineHeight:1,borderRight:'1px solid #ccc',paddingRight:10,marginRight:10}}>
                                                                <small>{o.year}-{o.month<10?`0${o.month}`:o.month}-{o.day<10?`0${o.day}`:o.day}</small>
                                                            </div>
                                                            <Icon name={o.icon} color={o.color} size="30"/>
                                                            <strong
                                                                style={{marginLeft:'5px',verticalAlign:'text-top',flexGrow:1}}>{o.name}</strong>
                                                            <div>
                                                                <span>￥{o.amount} </span>
                                                                <Icon name="right" color="#ccc" size="16" style={{margin:'0 0 -2px 10px'}}/>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                )
                                            }.bind(this))
                                        }
                                    </ul>
                                ) : (
                                    <h3 className="text-center padding-v-lg">没有数据！</h3>
                                )
                            }
                        </div>
                    </div>
                </div>
            )
        }
    }
});