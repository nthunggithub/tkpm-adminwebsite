var express = require('express');
var router = express.Router();
var ProductController=require('../controllers/productController');
var book=require('../controllers/BookController');
var UserController=require('../controllers/usercontroller');
var Upload=require('../config/UploadFile');
var middleware = require('../config/middleware');
var bill = require('../controllers/bill');
var orders=require('../controllers/orders');
var bookentry=require('../controllers/BookEntry');
/* GET home page. */
router.get('/', middleware.isAuthenticated,book.ThongKe);

router.get('/BookManagement',middleware.isAuthenticated,book.managerBook);

router.get('/manager-order',middleware.isAuthenticated,orders.managementOrder);

router.get('/product-orders', middleware.isAuthenticated, orders.productOrders);

router.post('/UpdateOrder/:id', middleware.isAuthenticated, orders.UpdateStatus);

router.get('/UpdateOrder/:id', middleware.isAuthenticated, orders.UpdateOrder);

router.get('/products',middleware.isAuthenticated, ProductController.products);

router.get('/product-detail/:id',middleware.isAuthenticated, book.productDetail);

//router.post('/product-detail/:id',middleware.isAuthenticated, ProductController.deleteproduct);

router.post('/edit-product/:id',middleware.isAuthenticated, Upload.postImage);

router.get('/edit-product/:id',middleware.isAuthenticated, book.EditProduct);

router.get('/addProduct',middleware.isAuthenticated, ProductController.addProduct);

router.post('/addProduct',middleware.isAuthenticated, Upload.AddPostProduct);

router.post('/DeleteOrder/:id',middleware.isAuthenticated,orders.deleteOrder);

router.get('/BillManagement',middleware.isAuthenticated,bill.BillManagement);

router.get('/BillDetail/:id',middleware.isAuthenticated,bill.BillDetail);

router.post('/DeleteBill/:id',middleware.isAuthenticated,bill.DeleteBill);

router.get('/addBill',middleware.isAuthenticated,bill.renderFormAddBill);

router.post('/addBill',middleware.isAuthenticated,bill.addBill)

router.post('/BillDetail/:id',middleware.isAuthenticated,bill.EditBill)

router.get('/BookEntryManagement',middleware.isAuthenticated,bookentry.BookEntryManagement);

router.get('/BookEntryDetail/:id',middleware.isAuthenticated,bookentry.BookEntryDetail);

router.get('/UpdateRegulation',middleware.isAuthenticated,ProductController.RenderRegulation);

router.post('/UpdateRegulation',middleware.isAuthenticated,ProductController.UpdateRegulation);

router.get('/AddBookEntry',middleware.isAuthenticated,bookentry.AddBookEntry);

router.post('/AddBookEntry',middleware.isAuthenticated,bookentry.AddBookEntry2);

//module.exports = router;
module.exports = function (passport) {
  router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
  }), async function (req, res) {
    res.redirect('/');
  });
  return router;
};
