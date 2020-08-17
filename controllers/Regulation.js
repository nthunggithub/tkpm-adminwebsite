var passport = require("passport");
var multer=require('multer');
var Product=require("../models/product");
var Order=require("../models/Order");
var Stall=require("../models/Stall");
const util = require('util');
var db=require("../models/db")
class Regulation
{
   static async RenderRegulation(req,res,next)
   {
    const query = util.promisify(db.query).bind(db);
    var data=await query('SELECT * FROM regulation');
    res.render('UpdateRegulation',{data:data[0],errors : req.flash("FailToUpdataRegulation")});
   }
   static async UpdateRegulation(req,res,next)
   {
    const query = util.promisify(db.query).bind(db);
    var min=req.body.minquality;
    var max=req.body.maxquality;
    var errors="";
    if(parseInt(min)>=parseInt(max))
    {
            errors="Thong tin quy dinh khong hop le";
            req.flash("FailToUpdataRegulation",errors);
            res.redirect('/UpdateRegulation');
    }
    else
    {
        var d= new Date();
        var status=await query('UPDATE regulation SET ID_Admin = ? , minquality = ?,maxquality = ?, DateUpdate = ? WHERE ID_Regulation = ?',[req.user.ID_Admin,parseInt(min),parseInt(max),d,1]);
        res.redirect('/UpdateRegulation');
    }
   }
}