var express = require('express');
var service = require('../../service');
var http = require ('http');
var request = require('request');
var adviceController = express.Router();
var request = require('request');
var moment = require('moment');
var datetime = require('node-datetime');
var config = require('../../config/config.json'); //goi toi file cau hinh duong dan
//,service.ensureAuthenticated them vao giua get de yeu cau chung thuc

adviceController.get("/danhsachloikhuyen",service.ensureAuthenticated, function(req, res) {
  	var url = config.urladdress + '/api/advice/getall';
    var adviceData;
  	var options = {
  		url: url,
  		headers:{
	  		'Content-Type' : 'application/x-www-form-urlencoded',
  			'authorization': config.securitycode + req.session.token
  		}
  	};
  	service.get(options,function(error,data){
  		if(error){
  			return error;
  		}
  		var adData = JSON.parse(data);
  		adviceData = adData.data;
  		res.render("expert/loikhuyen/danhsachloikhuyen", {title: 'Xem danh sách lời khuyên',adviceData:adviceData,moment:moment,secu:config.securitycode,conf:config.urladdress,token:req.session.token,userid:req.session.userid,username:req.session.username});
  	});
});
adviceController.get("/themloikhuyen",service.ensureAuthenticated,function(req,res){
    res.render("expert/loikhuyen/themloikhuyen",{title: 'Thêm lời khuyên',secu:config.securitycode,conf:config.urladdress,token:req.session.token,userid:req.session.userid,username:req.session.username})
});
adviceController.post("/themloikhuyen",function(req,res){
    var datenow = datetime.create();
    var formatted = datenow.format('Y-m-d H:M:S');
    var user_id = req.body.user_id;
    var threshold_id = req.body.threshold_id;
    var advice_message = req.body.advice_message;
    var advice_createdDate = formatted;
    var options = {
      url: config.urladdress+'/api/advice/create/',
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'authorization': config.securitycode + req.session.token
      },
      form:{
        user_id: user_id,
        threshold_id: threshold_id,
        advice_message: advice_message,
        advice_createdDate: advice_createdDate
      }
    };
    service.post(options,function(error,body){
      if(error){
        return error;
      }
      res.redirect('/chuyengia/loikhuyen/danhsachloikhuyen');
    });
});
adviceController.get("/capnhatloikhuyen/:id",service.ensureAuthenticated,function(req,res){
    var id = req.params.id;
    var adviceData;
    var options = {
      url: config.urladdress+'/api/advice/getbyid/' + id,
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'authorization': config.securitycode + req.session.token },
    };
    service.get(options,function(error,data){
      if(error){
        return error;
      }
      else{
        AvData = JSON.parse(data);
        adviceData = AvData.data;
        res.render("expert/loikhuyen/capnhatloikhuyen",{title: 'Cập nhật lời khuyên',secu:config.securitycode,conf:config.urladdress,token:req.session.token,userid:req.session.userid,username:req.session.username,adviceData:adviceData});
      }
    });
});
adviceController.post('/capnhatloikhuyen/', function(req, res) {
    var advice_id = req.body.advice_id;
    var datenow = datetime.create();
    var formatted = datenow.format('Y-m-d H:M:S');
    var user_id = req.body.user_id;
    var threshold_id = req.body.threshold_id;
    var advice_message = req.body.advice_message;
    var advice_createdDate = formatted;
    var address = config.urladdress + "/api/advice/update/" + advice_id;
    var token = config.securitycode + req.session.token;
    var options = {
      method: 'PUT',
      url: address,
      headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        'authorization': token
      },
      form: {
        user_id: user_id,
        threshold_id: threshold_id,
        advice_message: advice_message,
        advice_createdDate: advice_createdDate
      }
    };
    service.put(options,function(error,data){
      if (error){
        throw new Error(error);
      }
      res.redirect('/chuyengia/loikhuyen/danhsachloikhuyen');
    });
});
module.exports = adviceController;