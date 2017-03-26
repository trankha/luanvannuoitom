var express = require('express');
var managerRouter = express.Router();

var regionController = require('../controllers/manager/regionController');
var dataController = require('../controllers/manager/dataController');
var datatypeController = require('../controllers/manager/datatypeController');
var ageController = require('../controllers/manager/ageController');
var speciesController = require('../controllers/manager/speciesController');
var config = require('../config/config.json'); //goi toi file cau hinh duong dan
managerRouter.get('/',function(req,res){
	res.render('managerLayout', { title: 'Trang chủ',secu:config.securitycode,conf:config.urladdress,token:req.session.token,userid:req.session.userid,username:req.session.username});
});
//region controller
managerRouter.use('/vung', regionController);
managerRouter.use('/dulieu', dataController);
managerRouter.use('/loaidulieu', datatypeController);
managerRouter.use('/dotuoi', ageController);
managerRouter.use('/loaithanuoi', speciesController);
module.exports = managerRouter;
