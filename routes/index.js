var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();
var service = require('../service');
var http = require ('http');
var request = require('request');
var bcrypt = require('bcrypt-nodejs');
var config = require('../config/config.json'); //goi toi file cau hinh duong dan
//Trang chu
router.get('/', service.ensureAuthenticated,function(req, res) {
  	res.render('managerLayout', { title: 'Trang chủ',secu:config.securitycode,conf:config.urladdress,token:req.session.token,userid:req.session.userid,username:req.session.username});
});
//Login
router.get('/login', function(req, res) {
  res.render('login', { title: 'Đăng nhập hệ thống'});
});


passport.serializeUser(function(user, done) {
  done(null, user.name);
});

passport.deserializeUser(function(name, done){
	done(null,{username:name});
});


//Ban token
passport.use(new LocalStrategy({passReqToCallback:true},
  	function(req,username, password, done) {
  		var data = "username=" + username+"&password="+password+"&grant_type=password";
		var options = service.setPostHeader(config.urladdress + '/api/auth/token',{
					  'Content-Type': 'application/x-www-form-urlencoded'
					  },data);
		service.post(options,function(error,body){
			if(error){
				return error;
			}else{
				var userData = JSON.parse(body);
				if(userData.status){
					req.flash('success_msg',userData.message)
					return done(null,false);
				}else{
					req.session.token = userData.accessToken;
					req.session.role = userData.role;
					req.session.userid = userData.user_id;
					req.session.username = userData.username;
					return done(null,{name:userData.username});
				}
			}
		});
  	}));

router.post('/login',
  passport.authenticate('local',{successRedirect: '/', failureRedirect: '/login', failureFlash:true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res) {
  delete req.session.token;
  delete req.session.role;
  req.logout();
  res.redirect('/login');
});


module.exports = router;
