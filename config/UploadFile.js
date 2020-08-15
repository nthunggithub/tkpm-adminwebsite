var multer=require('multer');
var Stall=require("../models/Stall");
var Product=require("../models/product");

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

var storage=multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,'./public/plugins/images');
    },
    filename:function (req,file,callback) {
        callback(null,file.originalname);
    }
});


var upload=multer({storage:storage}).single('myfile');
exports.postImage=async function(req,res,next){
    if(req.body.BookName===undefined)
    {
        upload(req,res,async function(err){
        if(err){
            check=false;
            errors="Cannot upload image product";
        }
        if(req.file!==undefined)
        {
            const query = util.promisify(db.query).bind(db);
            a='../plugins/images/'+req.file.path.substring(22,req.file.path.length);
            const State = await query("UPDATE book SET imagePath = ? WHERE ID_Book = ?",[a,req.params.id]);
            res.redirect('/product-detail/'+ req.params.id);
        }
    })
    }
    else
    {
        let check=true;
            
            let a=req.body.BookName;

            let b=req.body.Price;

            let c=req.body.Publisher;

            let d=req.body.Category;

            let e = req.body.Author;

            let f=req.body.Description;
            const query = util.promisify(db.query).bind(db);
            const State = await query("UPDATE book SET NameBook = ? , Price = ? , ID_Publisher = ? , ID_Category = ? , ID_Author = ?  , Description = ? WHERE ID_Book = ?",[a,b,c,d,e,f,req.params.id]);
            res.redirect('/product-detail/'+ req.params.id);
    }
};
exports.AddPostProduct=async function(req,res,next)
{
            let errors="";
            let check=true;
            products=new Product();
            products.IDSTall=req.params.id;
            products.productname=req.body.productname;
            products.oldprice=req.body.oldprice;
            products.saleoff=req.body.saleoff;
            products.price=req.body.price;
            products.cat=req.body.cat;
            products.gender=req.body.gender;
            products.producer=req.body.producer;
            products.availability=req.body.availability;
            if(req.body.productname==="")
            {
                check=false;
                errors="Bạn chưa nhập tên sản phẩm";
            }
             if(req.body.oldprice==="")
            {
                check=false;
                errors="Bạn chưa nhập giá gốc sản phẩm";
            }
            if(req.body.saleoff==="")
            {
                check=false;
                errors="Bạn chưa nhập khuyến mãi";
            }
            if(req.body.price==="")
            {
                check=false;
                errors="Bạn chưa nhập giá sản phẩm";
            }
            if(req.body.cat==="")
            {
                check=false;
                errors="Bạn chưa nhập loại sản phẩm";
            }
            if(req.body.gender==="")
            {
                check=false;
                errors="Bạn chưa nhập giới tính";
            }
            if(req.body.producer==="")
            {
                check=false;
                errors="Bạn chưa nhập nhà sản xuất";
            }
            
            if(check===true)
            {
                await products.save((err,next)=>{
                    res.redirect('/stall-detail/'+ req.params.id);
                });
            }
            else
            {
                req.flash("errorsaddProduct", errors)
                res.redirect('/addProduct/'+ req.params.id);
            }
};