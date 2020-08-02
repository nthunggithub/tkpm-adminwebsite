var multer=require('multer');
var Stall=require("../models/Stall");
var Product=require("../models/product");
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
    if(req.body.productname===undefined)
    {
        upload(req,res,function(err){
        if(err){
            check=false;
            errors="Cannot upload image product";
        }
        if(req.file!==undefined)
        {
            a='../plugins/images/'+req.file.path.substring(22,req.file.path.length);
            console.log(a);
            Product.updateOne({_id:req.params.id},{$set:{imagePath:a}},(err,next)=> {
             if(err)
             {
                 res.end('error');
             }
             res.redirect('/product-detail/'+ req.params.id);
         });
        }
    })
    }
    else
    {
        let check=true;
            let a="";
            let b="";
            let c="";
            let d="";
            let e="";
            let f="";
            let g="";
            if(req.body.productname.length===2)
                a=req.body.productname[1];
            else
                a=req.body.productname;

            if(req.body.oldprice.length===2)
                b=req.oldprice.price[1];
            else
                b=req.body.oldprice;

            if(req.body.saleoff.length===2)
                c=req.body.saleoff[1];
            else
                c=req.body.saleoff;

            if(req.body.price.length===2)
                d=req.body.price[1];
            else
                d=req.body.price;

            if(req.body.cat.length===2)
                e=req.body.cat[1];
            else
                e=req.body.cat;

            f=req.body.GenderSelect;

            if(req.body.producer.length===2)
                g=req.body.producer[1];
            else
                g=req.body.producer;
            console.log(a);
            console.log(b);
            console.log(c);
            console.log(d);
            console.log(e);
            console.log(f);
            console.log(g);
            Product.updateOne({_id:req.params.id},{$set:{productname:a,oldprice:b,saleoff:c,price:d,cat:e,gender:f,producer:g}},(err,next)=> {
                res.redirect('/manager-stall');
            });
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