var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var User = mongoose.Schema;

var User = new User({
    username: {type: String, require: true},
    password: {type: String, require: true},
    email: {type: String, require: true},
    firstname:{type:String,require:true},
    lastname:{type:String,require:true},
    company:{type:String},
});

User.methods.hashPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

User.methods.comparePassword = function(password, hash){
    return bcrypt.compareSync(password, hash )};

module.exports = mongoose.model("Admin", User, "Admin");
