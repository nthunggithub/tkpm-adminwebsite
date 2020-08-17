var passport = require("passport");
var multer=require('multer');
var Product=require("../models/product");
var Order=require("../models/Order");
var Stall=require("../models/Stall");
var mysql=require('mysql');
const util = require('util');
const { query } = require("express");
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

module.exports.deleteproduct= async function(req,res,next){
        const id=req.params.id;
        var sql = "DELETE FROM book WHERE ID_Book = ?";
        const query = util.promisify(db.query).bind(db);
        let status=query(sql,[id]);
             
};    

//giao dien chinh
module.exports.Index=async function(req,res,next){
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
        currentdate=new Date();
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
    res.render('index', { title: 'Express',data:products,RevenueQuarter:RevenueQuarter,RevenueDay:RevenueDay,RevenueMonth:RevenueMonth,RevenueYear:RevenueYear,Day:currentdate.getDate(),Quarter:Quarter,Month:currentdate.getMonth()+1,Year:currentdate.getFullYear()});
};
//danh sach don dat hang
module.exports.managementOrder=async function(req,res,next)
{
    const query = util.promisify(db.query).bind(db);
    var perpage=10;
    var page=req.query.page||1;
    var offset=10*(page-1);
    var sql ='SELECT * FROM orders Limit ? OFFSET ?';
    var data2=await query('SELECT * FROM orders');
    const data=await query(sql,[perpage,offset]);
    res.render('manager-order',{data:data,currentpage:page,total_page:Math.ceil(data2.length/perpage)});
};

module.exports.managerBook=async function(req,res,next){

    const query = util.promisify(db.query).bind(db);
    var perpage=10;
    var page=req.query.page||1;
    var offset=10*(page-1);
    var data2=await query('SELECT * FROM book');
    var data=await query('SELECT * FROM book Limit ? OFFSET ?',[perpage,offset]);
    res.render('BookManagement',{data:data,currentpage:page,total_page:Math.ceil(data2.length/perpage)});
    
}

//Don dat hang
module.exports.productOrders= function(req, res, next) {
    res.render('product-orders');
  };

//Hien thi thong tin don dat hang
module.exports.UpdateOrder=async function(req,res,next)
{
    const query = util.promisify(db.query).bind(db);
    var sql="SELECT * FROM orders WHERE ID_Order = ?";
    var data = await query(sql,[req.params.id]);
    var data2=await query('SELECT * FROM detail_order WHERE ID_Order = ?',[req.params.id]);
    var ListBook=[];
    for(i=0;i<data2.length;i++)
    {
        var Book=await query('SELECT NameBook FROM book WHERE ID_Book = ?',data2[i].ID_Book);
        ListBook.push(Book[0].NameBook);
    }
    res.render('UpdateOrder',{data:data[0],ListBook:ListBook});
};

//Thay doi trang thai don dat hang
exports.UpdateStatus=function(req,res,next)
{
    const query = util.promisify(db.query).bind(db);
    var status=query('UPDATE orders SET Status = ? ',[req.body.StatusSelect]);
   res.redirect("/UpdateOrder/"+req.params.id);
};
exports.BillManagement=async function(req,res,next){
    const query = util.promisify(db.query).bind(db);
    var perpage=10;
    var page=req.query.page||1;
    var offset=10*(page-1);
    var data2=await query('SELECT * FROM bill');
    var data=await query('SELECT * FROM bill Limit ? OFFSET ?',[perpage,offset]);
    res.render('BillManagement',{data:data,currentpage:page,total_page:Math.ceil(data2.length/perpage)});

}
exports.BillDetail=async function(req,res,next){
    const query = util.promisify(db.query).bind(db);
    var data=await query('SELECT * FROM bill WHERE ID_Bill = ?',[req.params.id]);
    var month = (1 + data[0].DatePayment.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = data[0].DatePayment.getDate().toString();
    day = day.length > 1 ? day : '0' + day;  
    var birthday=(data[0].DatePayment.getYear()+1900).toString()+'-'+month+'-'+day;
    res.render('BillDetail',{data:data[0],birthday:birthday,errors:req.flash("FailToEditBill")});
}
exports.deleteOrder= async function(req,res,next){
    const query = util.promisify(db.query).bind(db);
    var status = await query('DELETE FROM bill WHERE ID_Order = ?',req.params.id);
    var status2=await query('DELETE FROM detail_order WHERE ID_Order = ?',req.params.id);
    var status3= await query('DELETE FROM orders WHERE ID_Order = ?',req.params.id);
    res.redirect('/manager-order');
}

exports.renderFormAddBill = async function(req,res,next)
{
    res.render('addBill',{errors:req.flash("FailToAddBill")})
}

exports.addBill = async function(req,res,next){
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

//danh sach san pham
module.exports.products=function(req,res,next)
{
    const perpage=5;
    let page=req.query.page||1;

    Product.find().skip(perpage*(page-1)).limit(perpage).exec((err,data)=>{
        Product.find().count().exec((err,count)=>{
            if(err)
            {
                throw(err);
            }
            else
            {
                res.render("products",{data:data ,currentpage:page,total_page:Math.ceil(count/perpage)});
            }})
    })
};

module.exports.DeleteBill = async function(req,res,next)
{
    const query = util.promisify(db.query).bind(db);
    var status = await query('DELETE FROM bill WHERE ID_Bill = ?',[req.params.id]);
    res.redirect('/BillManagement');
}

//trang thong tin san pham
module.exports.productDetail=async function(req,res,next)
{    
    const query = util.promisify(db.query).bind(db);
    result1=await query('SELECT * FROM book WHERE ID_Book = ?',[req.params.id]);
    result2=await query('SELECT * FROM category WHERE ID_Category = ?',[result1[0].ID_Category]);
    result3=await query('SELECT * FROM publisher WHERE ID_Publisher = ?',[result1[0].ID_Publisher]);
    result4=await query('SELECT * FROM author WHERE ID_Author = ?',[result1[0].ID_Author]);
    res.render('product-detail',{data:result1[0],data2:result2[0],data3:result3[0],data4:result4[0]});
};

module.exports.BookEntryManagement=async function(req,res,next){
    const query = util.promisify(db.query).bind(db);
    var perpage=10;
    var page=req.query.page||1;
    var offset = perpage*(page-1);
    var data2=await query('SELECT * FROM bookentry');
    var data =await query('SELECT * FROM bookentry Limit ? OFFSET ?',[perpage,offset]);
    res.render('BookEntryManagement',{data:data,currentpage:page,total_page:Math.ceil(data2.length/perpage)});
}

module.exports.RenderRegulation = async function(req,res,next)
{
    const query = util.promisify(db.query).bind(db);
    var data=await query('SELECT * FROM regulation');
    res.render('UpdateRegulation',{data:data[0],errors : req.flash("FailToUpdataRegulation")});
}

module.exports.UpdateRegulation= async function(req,res,next)
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

module.exports.BookEntryDetail=async function(req,res,next){
    const query=util.promisify(db.query).bind(db);
    var data=await query('SELECT * FROM bookentry WHERE ID_BookEntry = ?',[req.params.id]);
    var data2=await query('SELECT db.Quantity,b.NameBook FROM detail_bookentry as db INNER JOIN book as b WHERE db.ID_BookEntry= ? AND db.ID_Book=b.ID_Book',[req.params.id]);
    var data3= await query('SELECT * FROM admin WHERE ID_Admin = ? ',[data[0].ID_Admin]);
    res.render('BookEntryDetail',{data:data[0],data2:data2,data3:data3[0]});
}
//Lay thong tin san pham
module.exports.EditProduct=async function(req,res,next)
{
    const query = util.promisify(db.query).bind(db);
    result1=await query('SELECT * FROM book WHERE ID_Book = ?',[req.params.id]);
    result2=await query('SELECT * FROM category');
    result3=await query('SELECT * FROM publisher');
    result4=await query('SELECT * FROM author ');
    res.render('edit-product',{data:result1[0],data2:result2,data3:result3,data4:result4});
};

module.exports.AddBookEntry=async function(req,res,next)
{
    const query = util.promisify(db.query).bind(db);
    var Perpage=10;
    var page=req.query.page||1
    var offset=Perpage*(page-1);
    var result1=await query('SELECT * FROM book Limit ? OFFSET ?',[Perpage,offset]);
    var result2=await query('SELECT * FROM regulation ');
    var min = result2[0].minquality;
    var max=result2[0].maxquality;
    res.render('AddBookEntry',{data:result1,min,max,currentpage:page,total_page:Math.ceil(result1.length/Perpage)});
}

module.exports.AddBookEntry2=async function(req,res,next)
{
    const query = util.promisify(db.query).bind(db);
    var result=await query('SELECT * FROM book');
    check=false;
    var d=new Date();
    var data = await query('INSERT INTO bookentry(ID_Admin,DateCreated) VALUES (?,?)',[req.user.ID_Admin,d]);
    for(i =0 ;i<result.length;i++)
    {
        if(req.body[result[i].ID_Book]!=="" && req.body[result[i].ID_Book]!==undefined)
            {
                check=true;
                var status = await query('INSERT INTO detail_bookentry(ID_BookEntry,ID_Book,Quantity) VALUES (?,?,?)',[data.insertId,result[i].ID_Book,req.body[result[i].ID_Book]])
            }
    }
    res.redirect('/BookEntryManagement');
}

module.exports.EditBill= async function(req,res,next)
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

//Them mot san pham
module.exports.addProduct=async function(req,res,next)
{
    const query = util.promisify(db.query).bind(db);
    var data2=await query('SELECT * FROM category');
    var data1=await query('SELECT * FROM author');
    var data3=await query('SELECT * FROM publisher')
    res.render('addProduct', {data1:data1,data2:data2,data3:data3,errors : req.flash("errorsaddProduct")});
};

