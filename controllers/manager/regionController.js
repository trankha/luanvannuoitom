var express = require('express');
var regionController = express.Router();
var request = require("request");
var service = require('../../service');
var config = require('../../config/config.json');
/* Them vung. */
regionController.get('/themvung',service.ensureAuthenticated, function(req, res) {
	res.render("manager/vung/themvung",{title:'Thêm vùng mới',navi:"vung  >  themvung",secu:config.securitycode,conf:config.urladdress,token:req.session.token,userid:req.session.userid,username:req.session.username});
});
regionController.post('/themvung', function(req, res) {
	var regid = req.body.region_id;
	var regname = req.body.region_name;
	var regdescription = req.body.region_description;
	var wardid = req.body.selectWARD;
	var options = {
		url: config.urladdress+'/api/region/create/',
		headers: {'Content-Type' : 'application/x-www-form-urlencoded',
		'authorization': config.securitycode + req.session.token },
		form:{
			region_id: regid,
			region_name: regname,
			region_description: regdescription,
			ward_id: wardid
		}
	};
	service.post(options,function(error,body){
		if(error){
			return error;
		}
		// console.log(body);
		res.redirect('/quanly/vung/danhsachvung');
		// res.render("danhsachvung");
	});

});
regionController.get('/danhsachvung',service.ensureAuthenticated, function(req, res) {
	var token = config.securitycode + req.session.token;
	var url = config.urladdress+'/api/region/getall/';
	var options = {
		method: 'GET', //loai xu ly du lieu get,post,put
		url: url, //duong dan se lay du lieu
		headers: {'Content-Type' : 'application/x-www-form-urlencoded',
		'Authorization': token} //set headers
	};
	service.get(options,function(error,data){
		if(error){
			return error; //tra ve loi khi bi loi
			console.log(error);
		}
		else{
			dt = JSON.parse(data); //convert dữ liệu về dạng JSON
			regionData = dt.data;
			// console.log(regionData);
			res.render("manager/vung/danhsachvung",{title:'Danh sách vùng',navi:"vung  >  danhsachvung",regiondt:regionData,secu:config.securitycode,conf:config.urladdress,token:req.session.token,userid:req.session.userid,username:req.session.username});
		}
	});
	// console.log(url);
});
/*Cap nhat vung*/
regionController.get('/capnhatvung/:id',service.ensureAuthenticated, function(req, res) {
	var token = config.securitycode + req.session.token;
	var id = req.params.id;
	var url = config.urladdress+'/api/region/getbyid/'+id;
	var options = service.setGetHeader(url,{'Authorization':token});
	// console.log(url);
	service.get(options,function(error,data){
		if(error){
			return error;
		}
		else{
			rData = JSON.parse(data);
			regionData = rData.data;
			res.render("manager/vung/capnhatvung",{title:'Cập nhật vùng mới',navi:"vung  >  capnhatvung",regData:regionData,regid:id,wardid:regionData.ward_id,secu:config.securitycode,conf:config.urladdress,token:req.session.token,userid:req.session.userid,username:req.session.username});
		}
	});
});
regionController.post('/capnhatvung/', function(req, res) {
	var regid = req.body.region_id;
	var regname = req.body.region_name;
	var regdescription = req.body.region_description;
	var wardid = req.body.selectWARD;
	var address = config.urladdress + "/api/region/update/"+regid;
	var token = config.securitycode + req.session.token;
	var options = {
		method: 'PUT',
		url: address,
		headers: 
		{ 
			'content-type': 'application/x-www-form-urlencoded',
			'authorization': token
		},
		form: 
		{
			region_name: regname,
			region_description: regdescription,
			ward_id: wardid 
		}
	};
	console.log(options);
	service.put(options,function(error,data){
		if (error){
	  		throw new Error(error);
	  	}
		res.redirect('/quanly/vung/danhsachvung');
	});
});
module.exports = regionController;
