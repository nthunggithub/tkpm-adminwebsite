var passport = require("passport");
var multer=require('multer');
var Product=require("../models/product");
var Order=require("../models/Order");
var Stall=require("../models/Stall");
const util = require('util');
var db=require("../models/db")
class book
{
    static async managerBook(req,res,next){

        const query = util.promisify(db.query).bind(db);
        var perpage=10;
        var page=req.query.page||1;
        var offset=10*(page-1);
        var data2=await query('SELECT * FROM book');
        var data=await query('SELECT * FROM book Limit ? OFFSET ?',[perpage,offset]);
        res.render('BookManagement',{data:data,currentpage:page,total_page:Math.ceil(data2.length/perpage)});
    }
    static async EditProduct(req,res,next)
    {
        const query = util.promisify(db.query).bind(db);
        var result1=await query('SELECT * FROM book WHERE ID_Book = ?',[req.params.id]);
        var result2=await query('SELECT * FROM category');
        var result3=await query('SELECT * FROM publisher');
        var result4=await query('SELECT * FROM author ');
        res.render('edit-product',{data:result1[0],data2:result2,data3:result3,data4:result4});
    }
    static async ThongKe(req,res,next)
    {
        var productChuck = [];
    var chucksize = 1;
    const query = util.promisify(db.query).bind(db);
    
    const products = await query("SELECT * FROM book");  
    
 //   let data=await Order.find({},{date:1, cart:1, _id:0});
    const data = await query("SELECT * FROM Orders");  
    console.log(data);
    //console.log(data[0].cart);
    var RevenueYear=0;
    var RevenueMonth=0;
    var RevenueDay=0;
    var RevenueQuarter=0;
   for (var i=0;i<data.length;i++)
   {
       var Day=data[i].DateCreated.getDate();
       var Month=data[i].DateCreated.getMonth()+1;
       var Year=data[i].DateCreated.getFullYear();
        var currentdate=new Date();
        var currentDay=currentDate.getDate();
        var currentMonth=currentDate.getMonth()+1;
        var currentYear=currentDate.getFullYear();
        var Quarter=Math.floor((currentdate.getMonth()+1)/3);
        console.log(Quarter);
        var mod=(currentdate.getMonth()+1)%3;
        if(mod>0)
            Quarter++;
       if(currentdate.getFullYear()===Year)
           RevenueYear+=data[i].Amount;
       if((currentdate.getMonth()+1)===Month&&currentdate.getFullYear()===Year)
           RevenueMonth+=data[i].Amount;
       if(Month>=(Quarter-1)*3+1&&Month<=(Quarter-1)*3+3 && currentdate.getFullYear()===Year)
           RevenueQuarter+=data[i].Amount
       if(currentdate.getDate()===Day&&currentdate.getFullYear()===Year&&currentdate.getMonth()+1===Month)
           RevenueDay+=data[i].Amount;
   }   
    res.render('index', { title: 'Express',data:products,RevenueQuarter:RevenueQuarter,RevenueDay:RevenueDay,RevenueMonth:RevenueMonth,RevenueYear:RevenueYear,Day:currentDay,Quarter:Quarter,Month:currentMonth,Year:currentYear});
    }
    static async productDetail(req,res,next)
    {
        const query = util.promisify(db.query).bind(db);
        var result1=await query('SELECT * FROM book WHERE ID_Book = ?',[req.params.id]);
        var result2=await query('SELECT * FROM category WHERE ID_Category = ?',[result1[0].ID_Category]);
        var result3=await query('SELECT * FROM publisher WHERE ID_Publisher = ?',[result1[0].ID_Publisher]);
        var result4=await query('SELECT * FROM author WHERE ID_Author = ?',[result1[0].ID_Author]);
        res.render('product-detail',{data:result1[0],data2:result2[0],data3:result3[0],data4:result4[0]});
    }
}
module.exports=book;