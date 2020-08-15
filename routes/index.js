var express = require('express');
var router = express.Router();
var ProductController=require('../controllers/productController');
var Upload=require('../config/UploadFile');
var middleware = require('../config/middleware');
/* GET home page. */
router.get('/', middleware.isAuthenticated, ProductController.Index);

router.get('/stall-detail/:id',middleware.isAuthenticated,ProductController.StallDetail);

router.get('/BookManagement',middleware.isAuthenticated,ProductController.managerBook);

router.post('/stall-detail/:id', middleware.isAuthenticated, ProductController.deleteStall);

router.get('/addStall',middleware.isAuthenticated,ProductController.AddStall1);

router.post('/addStall',middleware.isAuthenticated,ProductController.AddStall);

router.get('/manager-stall',middleware.isAuthenticated,ProductController.managerStall);

router.get('/manager-order',middleware.isAuthenticated,ProductController.managementOrder);

router.get('/product-orders', middleware.isAuthenticated, ProductController.productOrders);

router.post('/UpdateOrder/:id', middleware.isAuthenticated, ProductController.UpdateStatus);

router.get('/UpdateOrder/:id', middleware.isAuthenticated, ProductController.UpdateOrder);

router.get('/products',middleware.isAuthenticated, ProductController.products);

router.get('/product-detail/:id',middleware.isAuthenticated, ProductController.productDetail);

//router.post('/product-detail/:id',middleware.isAuthenticated, ProductController.deleteproduct);

router.post('/edit-product/:id',middleware.isAuthenticated, Upload.postImage);

router.get('/edit-product/:id',middleware.isAuthenticated, ProductController.EditProduct);

router.get('/addProduct',middleware.isAuthenticated, ProductController.addProduct);

router.post('/addProduct',middleware.isAuthenticated, Upload.AddPostProduct);

router.post('/DeleteOrder/:id',middleware.isAuthenticated,ProductController.deleteOrder);

router.get('/BillManagement',middleware.isAuthenticated,ProductController.BillManagement);

router.get('/BillDetail/:id',middleware.isAuthenticated,ProductController.BillDetail);

router.post('/DeleteBill/:id',middleware.isAuthenticated,ProductController.DeleteBill);
//router.post('deleteproduct/:id',middleware.isAuthenticated, ProductController.deleteStall);

//module.exports = router;
module.exports = function (passport) {
  router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
  }), async function (req, res) {
    res.redirect('/');
  });
  return router;
};
