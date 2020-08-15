var passport = require("passport");
var multer=require('multer');
var Product=require("../models/product");
var Order=require("../models/Order");
var Stall=require("../models/Stall");
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

module.exports.deleteproduct= function(req,res,next){
        const id=req.params.id;
        Product.findById(id, (err, product)=>{
            Product.deleteOne({_id:id},(err, data)=>{
                res.redirect('/stall-detail/'+ product.IDSTall);
        })
       
})};    

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
       if(String(currentdate.getFullYear())===Year)
           RevenueYear+=data[i].Amount;
       if(String(currentdate.getMonth()+1)===Month&&String(currentdate.getFullYear())===Year)
           RevenueMonth+=data[i].Amount;
       if(parseInt(Month)>=(Quarter-1)*3+1&&parseInt(Month)<=(Quarter-1)*3+3)
           RevenueQuarter+=data[i].Amount
       if(String(currentdate.getDate())===Day&&String(currentdate.getFullYear()===Year)&&String(currentdate.getMonth()+1===Month))
           RevenueDay+=data[i].cart.Amount;
   }   
    res.render('index', { title: 'Express',data:products,RevenueQuarter:RevenueQuarter,RevenueDay:RevenueDay,RevenueMonth:RevenueMonth,RevenueYear:RevenueYear,Day:currentdate.getDate(),Quarter:Quarter,Month:currentdate.getMonth()+1,Year:currentdate.getFullYear()});
};
module.exports.StallDetail= async function(req,res,next)
{
    let result =  await  Stall.findOne({_id:req.params.id});
    let result2=await Product.find({IDSTall:req.params.id}).limit(10).sort({qtysold:-1});
    const perpage=5;
    let page=req.query.page||1;
    Product.find({IDSTall:req.params.id}).skip(perpage*(page-1)).limit(perpage).exec((err,data)=>{
        Product.find({IDSTall: req.params.id}).count().exec((err,count)=>{
            if(err)
            {
                throw(err);
            }
            else
            {
                res.render("stall-detail",{data:data,top10:result2,doc:result,currentpage:page,total_page:Math.ceil(count/perpage)});
            }})
    })
};
//danh sach don dat hang
module.exports.managementOrder=function(req,res,next)
{
    var product=Order.find((err,data)=>{
      res.render('manager-order',{data:data});
    })
};
module.exports.managerStall=async function(req,res,next){

    var stall=Stall.find((err,data)=>{
        res.render('manager-stall',{data:data});
    })
}

module.exports.managerBook=async function(req,res,next){

    const query = util.promisify(db.query).bind(db);
    let perpage=10;
    let Page=req.query.page||1;
    let offset=10*(Page-1);
    var data=await query('SELECT * FROM book Limit ? OFFSET ?',[perpage,offset]);
    res.render('BookManagement',{data:data,currentpage:Page,total_page:Math.ceil(data.length/perpage)});
    
}

//Don dat hang
module.exports.productOrders= function(req, res, next) {
    res.render('product-orders');
  };

//Hien thi thong tin don dat hang
module.exports.UpdateOrder=function(req,res,next)
{
    var product=Order.findOne({_id:req.params.id},(err,data)=>{
        res.render('UpdateOrder',{data:data});
    });
};

//Thay doi trang thai don dat hang
exports.UpdateStatus=function(req,res,next)
{
    
    Order.updateOne({_id:req.params.id},{$set:{status:parseInt(req.body.StatusSelect)}},function(err,res,next) {
        if(err)
        {
            throw(err);
        }
    });
   res.redirect("/manager-order");
};
module.exports.AddStall1=function(req,res,next){
    res.render('addStall');
}
exports.AddStall=async function(req,res,next){
    let check=true;
    let errors="";
    if(req.body.name==="")
    {
        check=false;
        errors="Bạn chưa nhập tên gian hàng";
    }
    if(check===true)
    {
        var stall=new Stall();
        let date=new Date();
        stall.date= date.getDate()+'/'+ (date.getMonth() +1) + '/' + date.getFullYear();
        stall.name=req.body.stallname;
        console.log(stall);
        await stall.save((err,next)=>{
            res.redirect('manager-stall');
        });
    }
}

exports.deleteStall = async function(req, res, next){
    var idstall = req.params.id;
    await Stall.deleteOne({_id: idstall});
    await Product.deleteMany({IDSTall : idstall});
    res.redirect('/manager-stall');
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

//Lay thong tin san pham
module.exports.EditProduct=async function(req,res,next)
{
    const query = util.promisify(db.query).bind(db);
    result1=await query('SELECT * FROM book WHERE ID_Book = ?',[req.params.id]);
    result2=await query('SELECT * FROM category WHERE ID_Category = ?',[result1[0].ID_Category]);
    result3=await query('SELECT * FROM publisher WHERE ID_Publisher != ?',[result1[0].ID_Publisher]);
    result4=await query('SELECT * FROM author WHERE ID_Author = ?',[result1[0].ID_Author]);
    res.render('edit-product',{data:result1[0],data2:result2[0],data3:result3,data4:result4[0]});
};



//Them mot san pham
module.exports.addProduct=function(req,res,next)
{
    res.render('addProduct', {errors : req.flash("errorsaddProduct")});
};

