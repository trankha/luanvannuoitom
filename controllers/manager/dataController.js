var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var service = require('../../service');
var http = require ('http');
var request = require('request');
var dataController = express.Router();
var request = require('request');
var config = require('../../config/config.json'); //goi toi file cau hinh duong dan
//,service.ensureAuthenticated them vao giua get de yeu cau chung thuc


dataController.get("/xemdodo",service.ensureAuthenticated, function(req, res) {
  res.render("manager/dulieu/xemdodo", {title: 'Xem độ đo',navi:"dulieu  >  xemdodo",secu:config.securitycode,conf:config.urladdress,token:req.session.token,userid:req.session.userid,username:req.session.username});
});

module.exports = dataController;