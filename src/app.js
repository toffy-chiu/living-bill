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
var Edit=require('./pages/Edit');
var Detail=require('./pages/Detail');
var Overview=require('./pages/Overview');
var Setting=require('./pages/Setting');

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/">
            <IndexRoute component={Main}/>
            <Route path="/index" component={Main}/>
            <Route path="/edit/:type(/:id)" component={Edit}/>
            <Route path="/detail/:type" component={Detail}/>
            <Route path="/overview" component={Overview}/>
            <Route path="/setting" component={Setting}/>
        </Route>
    </Router>
    ,
    document.getElementById('container')
);