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
            const State = await query("UPDATE book SET NameBook = ? , Price = ? , ID_Publisher = ? , ID_Category = ? , ID_Author = ?  , Description = ? , Discount = ? WHERE ID_Book = ?",[a,b,c,d,e,f,req.body.Discount,req.params.id]);
            res.redirect('/product-detail/'+ req.params.id);
    }
};
exports.AddPostProduct=async function(req,res,next)
{
            let errors="";
            let check=true;
            console.log("Debug");
            if(req.body.BookName==="")
            {
                check=false;
                errors="Bạn chưa nhập tên sản phẩm";
            }
             if(req.body.Price==="")
            {
                check=false;
                errors="Bạn chưa nhập giá sản phẩm";
            }
            if(req.body.Description==="")
            {
                check=false;
                errors="Bạn chưa nhập mô tả";
            }
            if(req.body.Quantity==="")
            {
                check=false;
                errors="Bạn chưa nhập số lượng sản phẩm";
            }
                      
            if(check===true)
            {
                const query = util.promisify(db.query).bind(db);
                let sql ="INSERT INTO book(NameBook,ID_Category,Price,ID_Author,ID_Publisher,Quantity_Book,Description,imagePath,Discount) VALUES (?,?,?,?,?,?,?,?,?)";
                let values=[req.body.BookName,req.body.Category,req.body.Price,req.body.Author,req.body.Publisher,req.body.Quantity,req.body.Description,'../plugins/images/default.jpg',req.body.Discount];
                const State = await query(sql,values);
                res.redirect('/BookManagement');
            }
            else
            {
                req.flash("errorsaddProduct", errors)
                res.redirect('/addProduct');
            }
};