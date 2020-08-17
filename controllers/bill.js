var passport = require("passport");
var multer=require('multer');
var Product=require("../models/product");
var Order=require("../models/Order");
var Stall=require("../models/Stall");
const util = require('util');
var db=require("../models/db")
class bill
{
   static async BillManagement(req,res,next)
   {
    const query = util.promisify(db.query).bind(db);
    var perpage=10;
    var page=req.query.page||1;
    var offset=10*(page-1);
    var data2=await query('SELECT * FROM bill');
    var data=await query('SELECT * FROM bill Limit ? OFFSET ?',[perpage,offset]);
    res.render('BillManagement',{data:data,currentpage:page,total_page:Math.ceil(data2.length/perpage)});
   }
   static async BillDetail(req,res,next)
   {
    const query = util.promisify(db.query).bind(db);
    var data=await query('SELECT * FROM bill WHERE ID_Bill = ?',[req.params.id]);
    var month = (1 + data[0].DatePayment.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = data[0].DatePayment.getDate().toString();
    day = day.length > 1 ? day : '0' + day;  
    var birthday=(data[0].DatePayment.getYear()+1900).toString()+'-'+month+'-'+day;
    res.render('BillDetail',{data:data[0],birthday:birthday,errors:req.flash("FailToEditBill")});
   }
   static async renderFormAddBill(req,res,next)
   {
    res.render('addBill',{errors:req.flash("FailToAddBill")})
   }
   static async addBill(req,res,next)
   {
    const query = util.promisify(db.query).bind(db);
    var errors="";
    var check=true;
    var doc = await query('SELECT * FROM orders WHERE ID_Order = ?',[req.body.ID_Order]);
    if(req.body.Name==="")
        {
            errors="Bạn chưa nhập tên người thu tiền";
            check=false
        }
    else if(req.body.date==="")
        {
            errors="Bạn chưa nhập ngày thu tiền";
            check=false;
        }
    else if(doc.length===0)
        {
            errors="ID hóa đơn không có";
            check=false;
        }
    if(check===true) 
        {
            var sql = "INSERT INTO bill(ID_Order,DatePayment,Name) VALUES (?,?,?)";
            try{
                var status = await query(sql,[req.body.ID_Order,req.body.date,req.body.Name]);
            }catch(err)
            {
                console.log(err);
            }      
            res.redirect('/BillManagement'); 
        }
    else{
        req.flash("FailToAddBill", errors)
        res.redirect('/addBill');
    }
   }
   static async DeleteBill(req,res,next)
   {
    const query = util.promisify(db.query).bind(db);
    var status = await query('DELETE FROM bill WHERE ID_Bill = ?',[req.params.id]);
    res.redirect('/BillManagement');
   }
   static async EditBill(req,res,next)
   {
    const query = util.promisify(db.query).bind(db);
    var ID_Order=req.body.ID_Order;
    var errors="";
    var data = await query("SELECT * FROM orders WHERE ID_Order = ?",[ID_Order]);
    if(data.length===0)
    {
        errors="ID Order ko tồn tại";
        req.flash("FailToEditBill",errors);
        res.redirect('/BillDetail/'+req.params.id);
    }
    else{
        var status = await query("UPDATE bill SET ID_Order = ? , DatePayment = ? ,Name = ?",[ID_Order,req.body.date,req.body.name]);
        res.redirect('/BillDetail/'+req.params.id);
    }
   }
}
module.exports=bill;