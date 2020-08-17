var passport = require("passport");
var multer=require('multer');
var Product=require("../models/product");
var Order=require("../models/Order");
var Stall=require("../models/Stall");
const util = require('util');
var db=require("../models/db")
class orders
{
    static async managementOrder(req,res,next)
    {
        const query = util.promisify(db.query).bind(db);
        var perpage=10;
        var page=req.query.page||1;
        var offset=10*(page-1);
        var sql ='SELECT * FROM orders Limit ? OFFSET ?';
        var data2=await query('SELECT * FROM orders');
        const data=await query(sql,[perpage,offset]);
        res.render('manager-order',{data:data,currentpage:page,total_page:Math.ceil(data2.length/perpage)});
    }
     
    static async UpdateOrder(req,res,next)
    {
        const query = util.promisify(db.query).bind(db);
        var sql="SELECT * FROM orders WHERE ID_Order = ?";
        var data = await query(sql,[req.params.id]);
        var data2=await query('SELECT * FROM detail_order WHERE ID_Order = ?',[req.params.id]);
        var ListBook=[];
        var i
        for(i=0;i<data2.length;i++)
        {
            var Book=await query('SELECT NameBook FROM book WHERE ID_Book = ?',data2[i].ID_Book);
            ListBook.push(Book[0].NameBook);
        }
        res.render('UpdateOrder',{data:data[0],ListBook:ListBook});
    }
    // Thay đỗi trạng thái đơn đặt hàng
    static async UpdateStatus(req,res,next)
    {
        const query = util.promisify(db.query).bind(db);
        var status=query('UPDATE orders SET Status = ? ',[req.body.StatusSelect]);
        res.redirect("/UpdateOrder/"+req.params.id);
    }
    static async deleteOrder(req,res,next)
    {
        const query = util.promisify(db.query).bind(db);
        var status = await query('DELETE FROM bill WHERE ID_Order = ?',req.params.id);
        var status2=await query('DELETE FROM detail_order WHERE ID_Order = ?',req.params.id);
        var status3= await query('DELETE FROM orders WHERE ID_Order = ?',req.params.id);
        res.redirect('/manager-order');
    }
    static async productOrders(req,res,next)
    {
        res.render('product-orders');
    }
}
module.exports=orders;