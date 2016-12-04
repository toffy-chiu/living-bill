webpackJsonp([3],{31:function(e,t){function a(e){function t(e,t){var a=arguments.callee;t||(t={});for(var n in e){var r=Object.prototype.toString.call(e[n]);"[object Object]"===r?a(e[n],t[n]):"[object Array]"===r?t[n]=e[n].concat():"object"!=typeof e[n]&&(t[n]=e[n])}}var a=Object.prototype.toString.call(e);if("[object Object]"!==a)throw new Error("函数objectAssign(obj,...)，参数必须为对象类型，当前类型："+a);if(arguments.length>1)for(var n=1;n<=arguments.length-1;n++)t(arguments[n],e);return e}e.exports=a},34:function(e,t,a){e.exports={DB_NAME:"living-bill",DB_VERSION:1}},35:function(e,t,a){function n(){this.TABLE_BILL="bill"}var r=a(31),o=a(34);n.prototype.index_date=["date"],n.prototype.index_type="type",n.prototype.keyRange={atMonth:function(e){return IDBKeyRange.bound([e[0]+"-01"],[e[0]+"-31"])},inType:function(e){return IDBKeyRange.only(e)}},n.prototype.open=function(e){var t=this,a=window.indexedDB.open(o.DB_NAME,o.DB_VERSION);a.onerror=function(e){console.log(e.currentTarget.error.message)},a.onsuccess=function(t){var a=t.target.result;e(a)},a.onupgradeneeded=function(e){var a,n=e.target.result;if(n.objectStoreNames.contains(t.TABLE_BILL)){var r=e.target.transaction;a=r.objectStore(t.TABLE_BILL);for(var i=a.indexNames,s=0;s<i.length;s++)a.deleteIndex(i[s])}else a=n.createObjectStore(t.TABLE_BILL,{autoIncrement:!0});a.createIndex("index_date",t.index_date,{unique:!1}),a.createIndex("index_type",t.index_type,{unique:!1}),console.log("DB version changed to "+o.DB_VERSION)}},n.prototype.add=function(e,t){this.open(function(a){var n=a.transaction(e,"readwrite"),r=n.objectStore(e);"[object Array]"===Object.prototype.toString.apply(t)?t.forEach(function(e){r.add(e)}):r.add(t),a.close()})},n.prototype.save=function(e,t,a){this.open(function(n){var o=n.transaction(e,"readwrite"),i=o.objectStore(e),s=i.get(+t);s.onsuccess=function(e){var n=e.target.result;r(n,a),i.put(n,+t)}})},n.prototype.del=function(e,t){this.open(function(a){var n=a.transaction(e,"readwrite"),r=n.objectStore(e);t?r["delete"](+t):r.clear()})},n.prototype.get=function(e,t,a){this.open(function(n){var r=n.transaction(e,"readonly"),o=r.objectStore(e),i=o.get(+t);i.onsuccess=function(e){var t=e.target.result;a(t)}})},n.prototype.getList=function(e,t,a,n){this.open(function(r){var o,i=r.transaction(e,"readonly"),s=i.objectStore(e);if(a&&n){"string"!=typeof a&&(a=a.join("_"));var l=s.index("index_"+a);o=l.openCursor(n)}else o=s.openCursor();var c=[];o.onsuccess=function(e){var a=e.target.result;if(a){var n=a.value;n.id=a.primaryKey,c.push(n),a["continue"]()}else t(c),r.close()}})},e.exports=new n},51:function(e,t,a){(function(t){var a=t.createClass({displayName:"Loader",render:function(){return t.createElement("div",{className:"loading"},t.createElement("div",{className:"loader loader-primary loader-rounded"},t.createElement("div",{className:"loader-bounce1"}),t.createElement("div",{className:"loader-bounce2"}),t.createElement("div",{className:"loader-bounce3"})))}});e.exports=a}).call(t,a(3))},295:function(e,t,a){(function(t){var n=a(52),r=a(51),o=a(33),i=a(414),s=a(35),l=a(53);e.exports=t.createClass({displayName:"module.exports",getInitialState:function(){return{loading:!0,isNew:!0,data:{}}},componentWillMount:function(){var e=this.props.params.id;e?s.get(s.TABLE_BILL,e,function(t){t.id=e,this.setState({isNew:!1,loading:!1,data:t})}.bind(this)):this.setState({loading:!1,data:{type:this.props.params.type,date:i(new Date,"yyyy-MM-dd"),amount:"",remark:""}})},handleChange:function(e){var t=e.target,a=this.state.data;a[t.name]=t.value,this.setState({data:a})},handleSubmit:function(e){e.preventDefault(),this.state.data.amount>0?(this.state.isNew?s.add(s.TABLE_BILL,this.state.data):s.save(s.TABLE_BILL,this.props.params.id,this.state.data),location.hash="/detail/"+this.props.params.type):alert("请输入合法的消费金额")},handleDelete:function(){confirm("确定要删除该记录吗？")&&(s.del(s.TABLE_BILL,this.props.params.id),location.hash="/detail/"+this.props.params.type)},render:function(){if(this.state.loading)return t.createElement(r,null);var e=l[this.props.params.type];return t.createElement("form",{onSubmit:this.handleSubmit,className:"container container-fill container-column"},t.createElement(n,{title:this.state.isNew?"新增记录":"编辑记录",leftNav:{href:"/detail/"+this.props.params.type}}),t.createElement("div",{className:"group group-no-padded margin-0"},t.createElement("header",{className:"group-header"},t.createElement(o,{name:e.icon,color:e.color,style:{marginBottom:-6}}),t.createElement("span",{style:{color:e.color,fontSize:"1.2rem"}},e.name)),t.createElement("div",{className:"group-body"},t.createElement("ul",{className:"list"},t.createElement("li",{className:"item item-input"},t.createElement("div",{className:"item-main"},t.createElement("label",{className:"field-container"},t.createElement("span",{className:"field-label"},"缴费时间："),t.createElement("input",{type:"date",name:"date",value:this.state.data.date,onChange:this.handleChange,className:"field",required:!0})))),t.createElement("li",{className:"item item-input"},t.createElement("div",{className:"item-main"},t.createElement("label",{className:"field-container"},t.createElement("span",{className:"field-label"},"缴费金额："),t.createElement("input",{type:"number",min:"0",step:"0.01",name:"amount",value:this.state.data.amount,onChange:this.handleChange,placeholder:"请输入消费金额",className:"field",required:!0})))),t.createElement("li",{className:"item item-input"},t.createElement("div",{className:"item-main"},t.createElement("label",{className:"field-container"},t.createElement("span",{className:"field-label",style:{minHeight:"5rem",paddingTop:"0.45rem"}},"备　　注："),t.createElement("textarea",{name:"remark",value:this.state.data.remark,onChange:this.handleChange,placeholder:"备注内容",className:"field"}))))))),this.state.isNew?t.createElement("div",{className:"margin-xs text-center group"},t.createElement("div",{className:"group-body"},t.createElement("button",{type:"submit",className:"btn btn-primary btn-sm btn-hollow"},"提交"))):t.createElement("div",{className:"margin-xs text-center group"},t.createElement("div",{className:"group-body"},t.createElement("button",{type:"button",onClick:this.handleDelete,className:"btn btn-alert btn-sm btn-hollow"},"删除"),t.createElement("button",{type:"submit",className:"btn btn-secondary btn-sm btn-hollow"},"保存"))))}})}).call(t,a(3))},414:function(e,t){function a(e){return e<10&&(e="0"+e),e}function n(e,t){var n=e,r=n.getFullYear(),o=a(n.getMonth()+1),i=a(n.getDate()),s=a(n.getHours()),l=a(n.getMinutes()),c=a(n.getSeconds());return t.replace("yyyy",r).replace("MM",o).replace("dd",i).replace("HH",s).replace("mm",l).replace("ss",c)}e.exports=n}});