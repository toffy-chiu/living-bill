var Link=require('react-router').Link;
var typeInfo=require('../../config/typeInfo');
var Icon=require('../../components/Icon');

var TypeNav = React.createClass({
    render: function() {
        //获取所有type名称
        var types=[];
        for(types[types.length] in typeInfo);

        return (
            <div className="padding-sm">
                <div className="g g-avg-2">
                    {
                        types.map(function(type, i){
                            return (
                                <Link key={i} to={`/detail/${type}`} className="col padding-xs">
                                    <div className="nav-badge" style={{background:'#444',color:typeInfo[type].color}}>
                                        <Icon name={typeInfo[type].icon} color={typeInfo[type].color} style={{verticalAlign:'top'}}/>
                                        <span className="nav-badge-label">{typeInfo[type].name}</span>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
});

module.exports = TypeNav;