var handlebars = require('handlebars');

handlebars.registerHelper('ConvertStatus',function(v1){
    let Cstatus="";
    if(v1===0)
        Cstatus="Chờ lấy hàng";
    else if (v1===1)
        Cstatus="Đang giao";
    else if (v1===2)
        Cstatus="Đã nhận hàng";
    else
        Cstatus="Hủy";
    return Cstatus;
})
handlebars.registerHelper('for', function(n, block) {
    var allblock = '';
    for(var i = 1; i <= n; ++i) {
        block.data.index = i;
        allblock += block.fn(this);
    }
    return allblock;
});
handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});