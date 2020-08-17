var express = require('express');
var router = express.Router();
var UserController=require('../controllers/usercontroller');
var CustomerManager=require('../controllers/CustomerManager');
var middleware = require('../config/middleware');
/* GET users listing. */
router.get('/',middleware.isAuthenticated, CustomerManager.login);

router.get('/login',middleware.isNotAuthenticated, CustomerManager.login)

router.get('/logout',middleware.isAuthenticated, CustomerManager.logout);

router.get('/manager-user',middleware.isAuthenticated, CustomerManager.ManagerUser);

router.post('/edit-customer-profile/:id',middleware.isAuthenticated, CustomerManager.editProfileCustomer);

router.get('/edit-customer-profile/:id',middleware.isAuthenticated, CustomerManager.editCustomer);

router.post('/DeleteCustomer/:id',middleware.isAuthenticated, CustomerManager.DeleteCustomer);


module.exports = router;
