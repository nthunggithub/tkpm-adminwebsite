var passport = require('passport');
var bcrypt = require('bcrypt-nodejs')
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/admin');
var mysql=require('mysql');
const util = require('util');
var db=mysql.createConnection({
    host :  'localhost',
    user :  'root',  
    password : '0905172825',
    database : 'shopping'
  });
  db.connect((err)=>{

    if(err){
        throw err;
    }
    console.log('Mysql Connected')
})
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    console.log(id);
    db.query("SELECT * FROM admin WHERE ID_Admin = ?",[id], function (err, result) {
        console.log(result);
        done(err,result[0])
      });
});

var loggedIn=false;
passport.use(new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'username', 
    passwordField: 'password',
}, async function (req, username, password, done) {

    const query = util.promisify(db.query).bind(db);
    
    const user = await query("SELECT * FROM admin WHERE UserName = ?",[username]);  
    
    //tim user
    // console.log(user);
    if (user.length) {
       
        //so sanh password       
        const match = await bcrypt.compareSync(password, user[0].PassWord);
        // if(user.password===password)
        //     match=true;
        // else
        //     match=false;
        if (match) {
            loggedIn=true;
            return done(null, {
                id: user[0].ID_Admin
            });
        }
        if (loggedIn)
        {
            console.log("welcome");
        }
    }
    req.flash('error', 'Tên tài khoản của bạn hoặc Mật khẩu không đúng, vui lòng thử lại');
    return done(null, false);   
}));
