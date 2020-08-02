var Stall = require('../models/Stall');
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/shopping');
mongoose.connect('mongodb+srv://admin:adminpassword@tanhung-o7d5l.mongodb.net/shopping?retryWrites=true&w=majority', {useUnifiedTopology: true});
var stall=[new Stall({
    name:"Gian hang 1",
    date: "4/1/2020"
}),
    new Stall({
        name:"Gian hang 2",
        date: "5/1/2020"
    }),
    new Stall({
        name:"Gian hang 3",
        date: "3/1/2020"
    }),
]
console.log(stall.length);
var done = 0;
for(var i=0; i< stall.length; i++){
    stall[i].save((err, result)=>{
        done++;
        if(done === Stall.length){
            mongoose.disconnect();
        }

    })
};
