var Admin = require('../models/admin');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
//mongoose.connect('mongodb://localhost/shopping')
//mongoose.connect('mongodb+srv://admin:adminpassword@tanhung-o7d5l.mongodb.net/shopping?retryWrites=true&w=majority', { useUnifiedTopology: true});
var admins = [new Admin({

    username:"123456789",
    password: bcrypt.hashSync("123456789", bcrypt.genSaltSync(10)),
    email:"1234567@gmail.com",
    lastname:"Nguyen",
    firstname:"Admin",
}),
]

var done = 0;

for(var i=0; i< admins.length; i++){
    admins[i].save((err, result)=>{
        done++;
        if(done === admins.length){
            mongoose.disconnect();
        }
    })
};