var NavBar=require('../../components/NavBar');
var Loader=require('../../components/Loader');
var Icon=require('../../components/Icon');

var dateFormat = require('tf-utils/lib/dateFormat');
var db = require('../../utils/IndexDB');
var typeInfo=require('../../config/typeInfo');

module.exports=React.createClass({
    getInitialState:function(){
        return {
            loading:true,
            isNew:true, //当前页面是否新增状态
            data:{}
        }
    },
    componentWillMount:function(){
        var id=this.props.params.id;
        //通过ID来判断是增加还是编辑
        if(id) {
            //加载编辑信息
            db.get(db.TABLE_BILL, id, function (info) {
                info.id = id;
                this.setState({
                    isNew:false,
                    loading:false,
                    data:info
                });
            }.bind(this));
        }else{
            //设置默认值
            this.setState({
                loading:false,
                data:{
                    type:this.props.params.type,
                    date:dateFormat(new Date(), 'yyyy-MM-dd'),
                    amount:'',
                    remark:''
                }
            });
        }
    },
    /**
     * 输入组件值变化时
     */
    handleChange:function(e){
        var t=e.target;
        var data=this.state.data;
        data[t.name]=t.value;
        //设置各组件的值
        this.setState({data:data});
    },
    handleSubmit:function(e){
        e.preventDefault();

        if(this.state.data.amount>0) {
            if (this.state.isNew) {
                db.add(db.TABLE_BILL, this.state.data);
            } else {
                db.save(db.TABLE_BILL, this.props.params.id, this.state.data);
            }
            location.hash = '/detail/' + this.props.params.type;
        }else{
            alert('请输入合法的消费金额');
        }
    },
    /**
     * 删除
     */
    handleDelete:function(){
        if(confirm('确定要删除该记录吗？')){
            //删除该记录
            db.del(db.TABLE_BILL, this.props.params.id);
            location.hash = '/detail/'+this.props.params.type;
        }
    },
    render:function(){
        if(this.state.loading){
            return <Loader/>
        }else {
            var info=typeInfo[this.props.params.type];
            return (
                <form onSubmit={this.handleSubmit} className="container container-fill container-column">
                    <NavBar title={this.state.isNew?'新增记录':'编辑记录'} leftNav={{href:`/detail/${this.props.params.type}`}} />
                    <div className="group group-no-padded margin-0">
                        <header className="group-header">
                            <Icon name={info.icon} color={info.color} style={{marginBottom:-6}}/>
                            <span style={{color:info.color,fontSize:'1.2rem'}}>{info.name}</span>
                        </header>
                        <div className="group-body">
                            <ul className="list">
                                <li className="item item-input">
                                    <div className="item-main">
                                        <label className="field-container">
                                            <span className="field-label">缴费时间：</span>
                                            <input type="date" name="date" value={this.state.data.date} onChange={this.handleChange} className="field" required/>
                                        </label>
                                    </div>
                                </li>
                                <li className="item item-input">
                                    <div className="item-main">
                                        <label className="field-container">
                                            <span className="field-label">缴费金额：</span>
                                            <input type="number" min="0" step="0.01" name="amount" value={this.state.data.amount} onChange={this.handleChange} placeholder="请输入消费金额" className="field" required/>
                                        </label>
                                    </div>
                                </li>
                                <li className="item item-input">
                                    <div className="item-main">
                                        <label className="field-container">
                                            <span className="field-label" style={{minHeight:'5rem',paddingTop:'0.45rem'}}>备　　注：</span>
                                            <textarea name="remark" value={this.state.data.remark} onChange={this.handleChange} placeholder="备注内容" className="field"/>
                                        </label>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {
                        this.state.isNew ? (
                            <div className="margin-xs text-center group">
                                <div className="group-body">
                                    <button type="submit" className="btn btn-primary btn-sm btn-hollow">提交</button>
                                </div>
                            </div>
                        ) : (
                            <div className="margin-xs text-center group">
                                <div className="group-body">
                                    <button type="button" onClick={this.handleDelete} className="btn btn-alert btn-sm btn-hollow">删除</button>
                                    <button type="submit" className="btn btn-secondary btn-sm btn-hollow">保存</button>
                                </div>
                            </div>
                        )
                    }
                </form>
            )
        }
    }
});