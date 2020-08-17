var passport = require("passport");
var multer = require('multer');
var User = require("../models/admin");
var User2 = require("../models/User");
var UserCustomer = require("../models/User")
var bcrypt = require('bcrypt-nodejs');
const util = require('util');
var db = require('../models/db')
class CustomerManger
{
   static async Process(req,res,next)
   {
    var user = new User()
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    //const confirm=req.body.confirm;
    var check = true;
    var errors = null;
    var success = null;
    var checkbox = req.body.checkbox;

    if (!checkbox) {
        errors = "Bạn chưa nhấn đồng ý";
        check = false;
    }
    else if (user.password != req.body.confirm) {
        // console.log("error");
        errors = "Mật khẩu xác nhận của bạn không đúng";
        check = false;
    }
    else if (user.password == req.body.confirm) {
        user.password = user.hashPassword(user.password);
    }
    // Email có tồn tại trong database hay ko
    try {
        let result = await User.findOne({ email: req.body.email });
        if (result) {
            console.log("Email đã tồn tại")
            check = false;
            errors = "Email đã tồn tại";
        }
        else {
            console.log("oke");
        }
    }
    catch (err) {
        console.log(err);
    }
    try {
        let result = await User.findOne({ username: req.body.username });
        if (result) {
            check = false;
            errors = "Tên tài khoản đã tồn tại";
        }
        else {
            console.log("oke");
        }
    }
    catch (err) {
        console.log(err);
    }
    if (check === false) {
        success = false;
    }
    if (check === true) {
        success = true;
        user.save((err, doc) => {
            if (!err) {
                res.redirect('/');

            }
            else {
                res.render('account/sign-up', { layout: 'layout-account.hbs', check: false, errors: 'Không thể đăng kí' })
            }
        })
    }
    if (check === false) {
        res.render('account/sign-up', { layout: 'layout-account.hbs', check: check, errors: errors })
    }
   }
   
   static async login(req,res,next)
   {
    var errors = req.flash('error');
    res.render('account/login', { errors: errors, layout: 'layout-account.hbs' });
   }
   static async editProfileCustomer(req,res,next)
   {
    let check = true;
    const query = util.promisify(db.query).bind(db);
    var sql="UPDATE customer SET status = ? WHERE ID_Customer = ?"
    const status =query(sql,[req.body.status,req.params.id]);
    res.redirect('/edit-customer-profile/'+req.params.id);
   }
   static async editCustomer(req,res,next)
   {
    const query = util.promisify(db.query).bind(db);
    let data = await query('SELECT * FROM customer WHERE ID_Customer = ?',[req.params.id]);
    var month = (1 + data[0].Birthday.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = data[0].Birthday.getDate().toString();
    day = day.length > 1 ? day : '0' + day;  
    var birthday=(data[0].Birthday.getYear()+1900).toString()+'-'+month+'-'+day;
    res.render("edit-customer-profile",{data:data[0],BornDay:birthday});
   }
   static async DeleteCustomer(req,res,next)
   {
    const query = util.promisify(db.query).bind(db);
    var status = await query('DELETE FROM comment WHERE ID_Customer = ?',[req.params.id]);
    var data = await query('SELECT * FROM orders WHERE ID_Customer = ?',[req.params.id]);
    if(data.length>0)
    {
        var status3=await query('DELETE FROM detail_order WHERE ID_Order =?',[data[0].ID_Order]);
        var status4=await query('DELETE FROM bill WHERE ID_Order=?',[data[0].ID_Order]);
    }
    var status2= await query('DELETE FROM orders WHERE ID_Customer = ?',[req.params.id]);
    var status0=await query('DELETE FROM customer WHERE ID_Customer = ?',[req.params.id]);
    res.redirect('/manager-user');
   }
   static async ManagerUser(req,res,next)
   {
    const query = util.promisify(db.query).bind(db);
    let perpage=10;
    let page=req.query.page||1;
    let offset=10*(page-1);
    var data2=await query('SELECT * FROM customer');
    var data=await query('SELECT * FROM customer Limit ? OFFSET ?',[perpage,offset]);
    res.render('manager-user',{data:data,currentpage:page,total_page:Math.ceil(data2.length/perpage)});
   }
   static async logout(req,res,next)
   {
    req.logout();
    req.session.destroy();
    res.redirect('/');
   }
}
module.exports=CustomerManger;