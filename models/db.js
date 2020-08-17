var mysql=require('mysql');
var db=mysql.createConnection({
    host :  'b6whrbiyfe1vv30hph1q-mysql.services.clever-cloud.com',
    user :  'uhxdb7afxbxdary3',  
    password : 'AN66OVeDJx7NvXUk2WOD',
    database : 'b6whrbiyfe1vv30hph1q'
  });
  db.connect((err)=>{

    if(err){
        throw err;
    }
    console.log('Mysql Connected')
})

module.exports=db;