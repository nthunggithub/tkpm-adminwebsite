var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/shopping');
mongoose.connect('mongodb+srv://admin:adminpassword@tanhung-o7d5l.mongodb.net/shopping?retryWrites=true&w=majority', {useUnifiedTopology: true});
var Schema = mongoose.Schema;

var schema=new Schema({
    name:{type:String,required:true},
    date:{type:String},
})

module.exports = mongoose.model('Stall', schema);