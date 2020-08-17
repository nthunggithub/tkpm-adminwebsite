var passport = require("passport");
var multer=require('multer');
var Product=require("../models/product");
var Order=require("../models/Order");
var Stall=require("../models/Stall");
const util = require('util');
var db=require("../models/db")
class BookEntry
{
    static async BookEntryDetail(req,res,next)
    {
        const query=util.promisify(db.query).bind(db);
        var data=await query('SELECT * FROM bookentry WHERE ID_BookEntry = ?',[req.params.id]);
        var data2=await query('SELECT db.Quantity,b.NameBook FROM detail_bookentry as db INNER JOIN book as b WHERE db.ID_BookEntry= ? AND db.ID_Book=b.ID_Book',[req.params.id]);
        var data3= await query('SELECT * FROM admin WHERE ID_Admin = ? ',[data[0].ID_Admin]);
        res.render('BookEntryDetail',{data:data[0],data2:data2,data3:data3[0]});
    }
    static async AddBookEntry(req,res,next)
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
    static async AddBookEntry2(req,res,next)
    {
        const query = util.promisify(db.query).bind(db);
        var result=await query('SELECT * FROM book');
        var check=false;
        var d=new Date();
        var data = await query('INSERT INTO bookentry(ID_Admin,DateCreated) VALUES (?,?)',[req.user.ID_Admin,d]);
        var i;
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
    static async BookEntryManagement(req,res,next)
    {
        const query = util.promisify(db.query).bind(db);
        var perpage=10;
        var page=req.query.page||1;
        var offset = perpage*(page-1);
        var data2=await query('SELECT * FROM bookentry');
        var data =await query('SELECT * FROM bookentry Limit ? OFFSET ?',[perpage,offset]);
        res.render('BookEntryManagement',{data:data,currentpage:page,total_page:Math.ceil(data2.length/perpage)});
    }
}
module.exports=BookEntry;