var express = require('express');
var router = express.Router();
var UserController=require('../controllers/usercontroller');
var middleware = require('../config/middleware');
/* GET users listing. */
router.get('/',middleware.isAuthenticated, UserController.login);

router.get('/login',middleware.isNotAuthenticated, UserController.login)

router.get('/logout',middleware.isAuthenticated, UserController.logout);

router.get('/manager-user',middleware.isAuthenticated, UserController.ManagerUser);

router.get('/profile-edit/:id',middleware.isAuthenticated, UserController.getProfile);

router.post('/profile-edit/:id',middleware.isAuthenticated, UserController.EditProfile);

router.post('/edit-customer-profile/:id',middleware.isAuthenticated, UserController.editProfileCustomer);

router.get('/edit-customer-profile/:id',middleware.isAuthenticated, UserController.editCustomer);


module.exports = router;
