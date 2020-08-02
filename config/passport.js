var passport = require('passport');
var bcrypt = require('bcrypt-nodejs')
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/admin');



passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

var loggedIn=false;
passport.use(new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'username', 
    passwordField: 'password',
}, async function (req, username, password, done) {

    //tim user
    const user  = await User.findOne({ username: username });
    // console.log(user);
    if (user && user._id) {
       
        //so sanh password       
        const match = await bcrypt.compareSync(password, user.password);
        // if(user.password===password)
        //     match=true;
        // else
        //     match=false;
        if (match) {
            loggedIn=true;
            return done(null, {
                id: user._id
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
