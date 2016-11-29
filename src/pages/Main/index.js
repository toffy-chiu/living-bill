var Link=require('react-router').Link;
var NavBar=require('../../components/NavBar');
var Icon=require('../../components/Icon');
var TypeNav = require('./TypeNav');

var Main=React.createClass({
    render:function(){
        var navList=[
            {url:'/overview', icon:'order', name:'总览'},
            {url:'/setting', icon:'setting', name:'设置'}
        ];
        return (
            <div className="container container-fill container-column">
                <div className="views">
                    <NavBar title="生活缴费" />
                    <TypeNav />
                </div>
                <nav className="tabbar tabbar-dark padding-h-0">
                    {
                        navList.map(function(o, i){
                            return (
                                <Link key={i} to={o.url} className="tabbar-item">
                                    <Icon name={o.icon} color="white" style={{marginBottom:-3}}/>
                                    <span className="tabbar-label">{o.name}</span>
                                </Link>
                            )
                        })
                    }
                </nav>
            </div>
        )
    }
});

module.exports = Main;