var Order = require('../models/order');
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/backshopping')

var orders = [new Order({
    // user: 
    cart:['Product #1'],
    address:"Binh Duong",
    name:"don hang 1",
    value:500000,
    status:1,
    phonenumber: "0123456789",
    methodpay:0,
    date:"21/1/2020",
}),
    new Order({
        // user: 
        cart:['Product #1'],
        address:"Ha Noi",
        name:"don hang 2",
        value:1000000,
        status:1,
        phonenumber: "0123456789",
        methodpay:0,
        date:"1/1/2020"
    }),
]
var done = 0;

for(var i=0; i< orders.length; i++){
    orders[i].save((err, result)=>{
        done++;
        if(done === orders.length){
            mongoose.disconnect();
        }
    })
};