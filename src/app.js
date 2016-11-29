var ReactDOM=require('react-dom');
var ReactRouter=require('react-router'),
    //withRouter=ReactRouter.withRouter,
    hashHistory=ReactRouter.hashHistory,
    //browserHistory=ReactRouter.browserHistory,
    IndexRoute=ReactRouter.IndexRoute,
    Route=ReactRouter.Route,
    Router=ReactRouter.Router;
require('./utils/iconfont');
require('./css/amazeui.touch.min.css');
require('./css/app.css');

//首页
var Main=require('./pages/Main');

//编辑页
var Edit=function(location, cb){
    require.ensure([], function(require){
        //cb(error, value);
        cb(null, require('./pages/Edit'));
    }, 'edit');
};

//当月明细
var Detail=function(location, cb){
    require.ensure([], function(require){
        //cb(error, value);
        cb(null, require('./pages/Detail'));
    }, 'detail');
};

//花销总览
var Overview=function(location, cb){
    require.ensure([], function(require){
        //cb(error, value);
        cb(null, require('./pages/Overview'));
    }, 'overview');
};

//设置
var Setting=function(location, cb){
    require.ensure([], function(require){
        //cb(error, value);
        cb(null, require('./pages/Setting'));
    }, 'setting');
};

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/">
            <IndexRoute component={Main}/>
            <Route path="/index" component={Main}/>
            <Route path="/edit/:type(/:id)" getComponent={Edit}/>
            <Route path="/detail/:type" getComponent={Detail}/>
            <Route path="/overview" getComponent={Overview}/>
            <Route path="/setting" getComponent={Setting}/>
        </Route>
    </Router>
    ,
    document.getElementById('container')
);