var User = require('../models/User');
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/backshopping')
var users = [new User({
    username:"customer1",
    password:"customer1",
    email:"customer1@gmail.com",
    active:true,
    secretToken: "xxx",
    name: "khiem",
    nickname: "",
    phonenumber: "",
    gender: -1,
    date: "",
    age: ""
}),
    new User({
    username:"customer2",
    password:"customer2",
    email:"customer21@gmail.com",
    active:true,
    secretToken: "xxx",
    name: "kha",
    nickname: "",
    phonenumber: "",
    gender: -1,
    date: "",
    age: ""
    }),

]

var done = 0;

for(var i=0; i< users.length; i++){
    users[i].save((err, result)=>{
        done++;
        if(done === users.length){
            mongoose.disconnect();
        }
    })
};