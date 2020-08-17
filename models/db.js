var mysql=require('mysql');
var db=mysql.createConnection({
    host :  'localhost',
    user :  'root',  
    password : 'khiemkhiem841999',
    database : 'shopping'
  });
  db.connect((err)=>{

    if(err){
        throw err;
    }
    console.log('Mysql Connected')
})

module.exports=db;