
var tenxa = ""; //de gan ten xa hien len panel-heading
var arrRegion2 = []; //duoc dung khi nguoi dung la quan ly cấp vùng
var arrStation = []; //luu mang cac tram
var arrStation2 = []; //tao mang de chua tat ca cac tram
var arrCheckStation = []; //luu cac tram de xoa socket khi doi vung
var arrDataType = []; //luu danh sach cac loai du lieu de chon xem bieu do
var StationNode = []; //Luu danh sach cac station node trong thong tin tram de so sanh realtime
var arrPond = []; //luu mang cac ao
var arrPond2 = [];
var arrDataTypeUnit = []; //Mảng chứa các đơn vị đo (đang kiểm tra)
var arrdttypeForRadio = []; //Mảng chứa các id datatype
var arrDataTypeOfId = []; //Mảng chứa id và name của data type
var typeLocation; //Cap quan ly
var arrRiver = []; //luu danh sach cac tram o song
var queue = []; //Mảng để chờ load dữ liệu
var queue2 = []; //Mảng để chờ load dữ liệu
var queue3 = []; //Mảng chờ load dữ liệu default
var drawCrt = 0; //0 la đang xem bình thường - 1 là đang vẽ
var arrStationName = []; //Lưu danh sách tên trạm để realtime báo ngưỡng
var arrBlockStation = []; //Mảng những trạm bị chặn thông báo
var arrPondDescription = []; //Lưu danh sách tên trạm để realtime báo ngưỡng
var config = '';
var tokend= '';
var security = '';
var user_ID = 0;
var arrDataforCharts = [0]; //luu mang du lieu theo tung loai cho bieu do - gan mac dinh phan tu 0 de kiem tra 
//neu khong co xem bieu do truoc do thi khong goi ham initchart()
//dua vao datecurrent va datenow de lay du lieu khoang 2 ngay
//Ham duoc goi dau tien khi load giao dien xemdodo len.
function loadFIRST(conf,token,secu,userid,sock){
	config = conf;
	tokend = token;
	security = secu;
	user_ID = userid;
	var _objListenerForStation;
	var arrProvince = [];
	var arrDistrict = [];
	var arrWard = [];
	var arrRegion = [];
	var settings = {
	  	"async": true,
	  	"crossDomain": true,
	  	"url": conf + "/api/locationmanager/getlistbyuser/" + userid,
	  	"method": "GET",
	  	"dataType": "json",
	  	"contentType": "application/json; charset=utf-8",
	  	"headers": {
		    "authorization": secu + token
	  	}
	}
	setDefaultDisplayDate();
	blockContent();
	blockFormChart();
	$("#displayChart").css("display","none");
	$.ajax(settings).done(function (resultdata) {
		typeLocation = resultdata.data.typeLocation;
		if(resultdata.data.typeLocation == "Province"){
			$('#selectPROVINCE').find('option').remove();
			$('#selectPROVINCE').append($("<option></option>").attr("value",-1).text("Chọn tỉnh/TP"));
		}
		else if(resultdata.data.typeLocation == "District"){
			$('#selectDISTRICT').find('option').remove();
			$('#selectDISTRICT').append($("<option></option>").attr("value",-1).text("Chọn quận/huyện"));
		}
		else if(resultdata.data.typeLocation == "Ward"){
			$('#selectWARD').find('option').remove();
			$('#selectWARD').append($("<option></option>").attr("value",-1).text("Chọn xã/phường"));
		}
		else{
			$('#selectREG3').find('option').remove();
			$('#selectREG3').append($("<option></option>").attr("value",-1).text("Chọn vùng"));
		}	
		for(i in resultdata.data.data){
			if(resultdata.data.typeLocation == "Province"){
				arrProvince.push({province_id:resultdata.data.data[i].province_id,province_name:resultdata.data.data[i].province_name});
			}
			else if(resultdata.data.typeLocation == "District"){
				arrDistrict.push({district_id:resultdata.data.data[i].district_id,district_name:resultdata.data.data[i].district_name});
			}
			else if(resultdata.data.typeLocation == "Ward"){
				arrWard.push({ward_id:resultdata.data.data[i].ward_id,ward_name:resultdata.data.data[i].ward_name});
			}
			else{
				/*Mảng arrRegion lưu để push data cho thẻ select*/
				arrRegion.push({region_id:resultdata.data.data[i].region_id,region_name:resultdata.data.data[i].region_name});
				arrRegion2.push(resultdata.data.data[i].region_id); /*Lưu để load realtime*/
			}
		}
		loadDataForNoti(resultdata.data.typeLocation,arrRegion2,conf,token,secu,userid);
	}).complete(function(){
		var arrayProvince = sortByKey(arrProvince,"province_id");
		var arrayDistrict = sortByKey(arrDistrict,"district_id");
		console.log(arrDistrict);
		var arrayWard = sortByKey(arrWard,"ward_id");
		var arrayRegion = sortByKey(arrRegion,"region_id");
		pushDatatoSelect(arrayProvince,arrayDistrict,arrayWard,arrayRegion,typeLocation,conf,token,secu,sock);
	});
	$.ajax().error(function(jqXHR,status,error){
		displayError("Lỗi ! Không thể tải dữ liệu. Vui lòng tải lại trang");
	});
}
/*Hàm sắp xếp phần tử dựa trên  khóa đầu vào*/
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
//Hàm push data vào select
function pushDatatoSelect(arrayProvince,arrayDistrict,arrayWard,arrayRegion,typeLocation,conf,token,secu,sock){
	if(typeLocation == "Province"){
		arrayProvince.forEach(function(data,index){
			$('#selectPROVINCE').append($("<option></option>").attr("value",data.province_id).text(data.province_name));
			$("#selectPROVINCE").css("display", "block");
		});
	}
	else if(typeLocation == "District"){
		arrayDistrict.forEach(function(data,index){
			$('#selectDISTRICT').append($("<option></option>").attr("value",data.district_id).text(data.district_name));
			$("#selectDISTRICT").css("display", "block");
		});
	}
	else if(typeLocation == "Ward"){
		arrayWard.forEach(function(data,index){
			$('#selectWARD').append($("<option></option>").attr("value",data.ward_id).text(data.ward_name));
			$("#selectWARD").css("display", "block");
		});
	}
	else{
		arrayRegion.forEach(function(data,index){
			$('#selectREG3').append($("<option></option>").attr("value",data.region_id).text(data.region_name));
			$("#selectREG3").css("display", "block");
		});
	}
	setDefaultSelected(conf,token,secu,typeLocation,sock);
}
//Ham set default khi vua vao trang xemdodo
function setDefaultSelected(conf,token,secu,typeLocation,sock){
	if(typeLocation == "Province"){
		$("#selectPROVINCE").prop("selectedIndex", 2);
		loadDISTRICT(conf,token,secu,sock,1);
	}
	else if(typeLocation == "District"){
		$("#selectDISTRICT").prop("selectedIndex", 2);
		loadWARD1(conf,token,secu,sock,1);
	}
	else if(typeLocation == "Ward"){
		$("#selectWARD").prop("selectedIndex", 3);
		loadREG1(conf,token,secu,sock,1);
	}
	else{
		$("#selectREG3").prop("selectedIndex", 1);
		loadSTATION1(conf,token,secu,sock,1);
	}	
}
//goi ham tong the de realtime
function loadRealTime(conf,token,secu,userid,sock){
	var _objListenerForStation;
	var settings = {
	  	"async": true,
	  	"crossDomain": true,
	  	"url": conf + "/api/locationmanager/getlistbyuser/" + userid,
	  	"method": "GET",
	  	"dataType": "json",
	  	"contentType": "application/json; charset=utf-8",
	  	"headers": {
		    "authorization": secu + token
	  	}
	}
	$.ajax(settings).done(function (resultdata) {
		for(i in resultdata.data.data){
			if(resultdata.data.typeLocation == "Region"){
				arrRegion2.push(resultdata.data.data[i].region_id);
			}
		}
		loadDataForNoti(resultdata.data.typeLocation,arrRegion2,conf,token,secu,userid);
	});
}
//Ham de load realtime thông báo quá ngưỡng
function loadDataForNoti(typeLocation,arrRegion2,conf,token,secu,userid){
	if(typeLocation == "Region"){
		getAllStationByRegionId(arrRegion2,conf,token,secu);
		// getAllPondByRegionId(arrRegion2,conf,token,secu);
	}
	else{
		getAllRegionByUserId(conf,token,secu,userid);
	}
}
/*Hàm lấy về danh sách 10 thông báo mới nhất chưa đọc dựa trên userid của người quản lý*/
function getNotification(conf,token,secu,userid,index,size){
	// showModalNoti(conf,token,secu,threshold_level,datatype_name,datatype_id,data_value,notif_title,stationid,datecreated,threshold_message,notif_id)
	var html = "";
	jQuery.ajax({
		url: conf + '/api/notification/getbymanager/'+ userid + '?index=' + index + '&size=' + size,
		type: 'GET',
		headers: {'Authorization': secu + token},
		contentType: 'application/json; charset=utf-8',
		success: function(resultdata){
			resultdata.data.forEach(function(data,index){
				if(data.notif_readState == 0){
					html += '<li class="bg-info">';
				}
				else{
					html += '<li>';
				}
				/*Thông báo chưa đọc hiện màu xanh. Đọc rồi hiện trắng*/
				html += '<a href="#" onclick="showModalNoti('+ "'" + config + "'" + ',' + "'" + tokend + "'" + ',' + "'" + security + "'" + ',' + data.data_id + ',' + data.threshold_id + ',' + "'" + data.notif_title + "'" + ',' + data.notif_id +','+ data.region_id + ',' + "'" + data.notif_createdDate + "'" + ',' + data.notif_readState +')">';			
				html +=    '<i class="fa fa-users text-aqua"></i>' + data.notif_title + '</a>';
				html += '</li>';
			});
			$("#listNotification").html(html);
		},
		error: function(jqXHR,error,errorThrown){
      		// displayError("Lỗi ! Không thể tải danh sách cách sensor. Vui lòng tải lại trang");
  		},
	});
	
}
/*Hàm lấy về số thông báo dựa trên userid của người quản lý*/
function countNotification(sock,userid){
	var html = '';
	sock.emit('login',userid);
    sock.on('login_notification',function(data){
        data.forEach(function(dt){
          	html += dt.notif_totalRow;
          	$("#countmessage").html(html);
          	$("#titlemessage").html(html + " thông báo chưa đọc");
        });
    });
}
//ham lay ve danh sach vung dua tren id user
function getAllRegionByUserId(conf,token,secu,userid){
	queue.push(1);
	jQuery.ajax({
		url : conf + '/api/region/getbyuser/' + userid,
		type: 'GET',
		headers: {'Authorization':secu + token},
		contentType: 'application/json; charset=utf-8',
		success: function(resultdata){
			resultdata.data.forEach(function(item, index) {
				if(arrRegion2.indexOf(item.region_id)  == -1){
					arrRegion2.push(item.region_id);
				}
			});
		},
		error: function(jqXHR,textStatus,errorThrown){
			displayError("Lỗi ! Không thể tải dữ liệu của vùng. Vui lòng tải lại trang");
		},
	}).complete(function() {
		queue.pop();
		if (queue.length == 0) {
			getAllStationByRegionId(arrRegion2,conf,token,secu,userid);
			
		}
	});
}
//Ham lay danh sach tat ca cac tram
function getAllStationByRegionId(arrRegion2,conf,token,secu,userid){
	for(i in arrRegion2){
		queue.push(1);
		getStation(arrRegion2[i],conf,token,secu,userid);
	}
}
//ham lay ve danh sach tram dua tren id vung
function getStation(regionid,conf,token,secu,userid){
	jQuery.ajax({
		url : conf + '/api/station/getbyregion/'+regionid,
		type: 'GET',
		headers: {'Authorization':secu + token},
		contentType: 'application/json; charset=utf-8',
		success: function(resultdata){
			resultdata.data.forEach(function(item, index) {
				if(arrStation2.indexOf(item.station_id)  == -1){
					arrStation2.push(item.station_id);
					arrStationName[item.station_id] = [];
					arrStationName[item.station_id] = item.station_name;
				}
			});
		},
		error: function(jqXHR,textStatus,errorThrown){
			displayError("Lỗi ! Không thể lấy được dữ liệu của trạm. Vui lòng tải lại trang");
		},
	}).complete(function() {
		queue.pop();
		/*Gọi hàm load danh sách trạm chặn lên*/
		if(queue.length == 0){
			var _objListenerForStation;
			_objListenerForStation = new RealTimePushNotificationForStation({arrStation:arrStation2,sockt: sock,conf:conf,token:token,secu:secu});
			getBlockStationByUserId(conf,token,secu,user_ID);
		}
	});
}

/*Hàm lấy về danh sách trạm bị chặn thông báo theo userid*/
function getBlockStationByUserId(conf,token,secu,userid){
	jQuery.ajax({
		url: conf + "/api/blocknotification/getlistbyuser/" + userid,
		type: 'GET',
		headers: {'Authorization': secu + token},
		contentType: 'application/json; charset=utf-8',
		success: function(resultdata){
			resultdata.data.forEach(function(data){
				arrBlockStation.push(data.station_id);
			});
		},
		error:function(jqXHR,textStatus,errorThrown){
			displayError("Lỗi ! Không thể lấy được dữ liệu của trạm bị chặn. Vui lòng tải lại trang");
		},
	}).complete(function(){
		queue2.pop();
		if(queue2.length == 0){
			showBlockStation();
		}
	})
}
/*Hàm xử lý mở / khóa thông báo trạm*/
function processStationblock(object,stationid){
	/*CODING*/
	/*object là đối tượng checkbox để kiểm tra xem input có được check hay không*/
	if(object.checked){
		blockStation(config,tokend,security,user_ID,stationid); /*Khóa thông báo trạm*/
	}
	else{
		unblockStation(config,tokend,security,user_ID,stationid); /*Mở khóa thông báo trạm*/
	}
	// CODING
}
/*Hàm khóa thông báo trạm*/
function blockStation(config,tokend,security,user_ID,stationid){
	queue2.push(1);
	jQuery.ajax({
		url : config + '/api/blocknotification/create?user_id='+user_ID+'&station_id='+stationid,
		type: 'POST',
		headers: {'Authorization':security + tokend},
		contentType: 'application/json; charset=utf-8',
		success: function(response){
			$("#thongbao").html("Đã khóa thành công");
			$("#thongbaokhoatram").css("display","block");
			setTimeout(function() {
				$("#thongbaokhoatram").css("display","none");
			}, 3000);
		},
		error: function(jqXHR,textStatus,errorThrown){
			arrBlockStation = [];
			getBlockStationByUserId(config,tokend,security,user_ID);
			displayError("Lỗi ! Không thể khóa thông báo trạm. Vui lòng tải lại trang");
		},
	}).complete(function() {
		queue2.pop();
		if(queue2.length == 0){
			arrBlockStation = [];
			getBlockStationByUserId(config,tokend,security,user_ID);
		}
	});
}
/*Mở khóa thông báo trạm*/
function unblockStation(config,tokend,security,user_ID,stationid){
	queue3.push(1);
	jQuery.ajax({
		url : config + '/api/blocknotification/delete?user_id='+user_ID+'&station_id='+stationid,
		type: 'DELETE',
		headers: {'Authorization':security + tokend},
		contentType: 'application/json; charset=utf-8',
		success: function(response){
			$("#thongbao").html("Đã mở khóa thành công");
			$("#thongbaokhoatram").css("display","block");
			setTimeout(function() {
				$("#thongbaokhoatram").css("display","none");
			}, 3000);
		},
		error: function(jqXHR,textStatus,errorThrown){
			arrBlockStation = [];
			getBlockStationByUserId(config,tokend,security,user_ID);
			displayError("Lỗi ! Không thể mở khóa thông báo trạm. Vui lòng tải lại trang");
		},
	}).complete(function() {
		queue3.pop();
		if(queue3.length == 0){
			arrBlockStation = [];
			getBlockStationByUserId(config,tokend,security,user_ID);
		}
	});
}
/*Hàm hiển thị các trạm đã tắt trạm*/
function showBlockStation(){
	var html = '';
	arrStation2.forEach(function(station_id,index){
		html +='<div class="form-group">';
        html +='<label class="control-sidebar-subheading">';
        html += arrStationName[station_id];
		if(arrBlockStation.indexOf(station_id) == -1){
			html += '<input type="checkbox" id="cbKhoaTram" name="cbKhoaTram" value="' + station_id + '" class="pull-right" onchange="processStationblock(this,'+station_id+')">';
		}
		else{
			html += '<input type="checkbox" id="cbKhoaTram" name="cbKhoaTram" checked value="' + station_id + '" class="pull-right" onchange="processStationblock(this,'+station_id+')">';
		}
		html +='</label>';
        html +='</div>';
	});
	$("#select-tattram").html(html);
}
//Ham lay danh sach tat ca cac ao
function getAllPondByRegionId(arrRegion2,conf,token,secu){
	for(i in arrRegion2){
		queue2.push(1);
		getPond(arrRegion2[i],conf,token,secu);
	}
}
//ham lay ve danh sach tram dua tren id vung
function getPond(regionid,conf,token,secu){
	jQuery.ajax({
		url : conf + '/api/pond/getbyregion/'+regionid,
		type: 'GET',
		headers: {'Authorization':secu + token},
		contentType: 'application/json; charset=utf-8',
		success: function(resultdata){
			resultdata.data.forEach(function(item, index) {
				if(arrPond2.indexOf(item.pond_id)  == -1){
					arrPond2.push(item.pond_id);
					arrPondDescription[item.pond_id] = [];
					arrPondDescription[item.pond_id] = item.pond_description;
				}
			});
		},
		error: function(jqXHR,textStatus,errorThrown){
			displayError("Lỗi ! Không thể lấy được dữ liệu của trạm. Vui lòng tải lại trang");
		},
	}).complete(function() {
		queue2.pop();
	});
}
// Được gọi khi người dùng chọn selectPROVINCE -->
function loadDISTRICT(conf,token,secu,sock,state){ //state chi trang thai load 1: default 0: thuong
	resetWhenSelectedProvince();
	queue3.push(1);
	$('#selectDISTRICT1').find('option').remove();
	$('#selectDISTRICT1').append($("<option></option>").attr("value",-1).text("Chọn quận/huyện"));
	provinceId = document.getElementById("selectPROVINCE").value;
	jQuery.ajax({
		url: conf + '/api/location/getdistrictbyprovince/' + provinceId,
		type: 'GET',
		contentType: 'application/json; charset=utf-8',
		success: function(resultdata){
			// var option ='';
			// option += "<option value='" + -1 +"'>Chọn quận/huyện</option>";
			for(i in resultdata.data){
				// option += "<option value='" + resultdata.data[i].district_id +"'>" + resultdata.data[i].district_name +"</option>";
				$('#selectDISTRICT1').append($("<option></option>").attr("value",resultdata.data[i].district_id).text(resultdata.data[i].district_name));
				$("#selectDISTRICT1").css("display", "block");
			}
		},
		error: function(jqXHR,textStatus,errorThrown){
			displayError("Lỗi ! Không thể tải dữ liệu của huyện. Vui lòng tải lại trang");
		},
	}).complete(function() {
		queue3.pop();
		if (queue3.length == 0) {
			if(state == 1){
				$("#selectDISTRICT1").prop("selectedIndex",11); //chon option 11 cho huyen
				loadWARD1(conf,token,secu,sock,1); //goi ham chon xa
			}
		}
	});
}
// Được gọi khi người dùng chọn selectDISTRICT,selectDISTRICT1 -->
function loadWARD1(conf,token,secu,sock,state){
	resetWhenSelectedDistrict();
	queue3.push(1);
	resetALLSELECT1();
	$("#selectWARD2").find('option').remove();
	$("#selectWARD1").find('option').remove();
	var iddis = -1;
	var iddis1 = -1;
	iddis1 = document.getElementById("selectDISTRICT1").value;
	iddis = document.getElementById("selectDISTRICT").value;
	if(iddis1 != ""){
		$('#selectWARD2').append($("<option></option>").attr("value",-1).text("Chọn xã/phường"));
		districtId = document.getElementById("selectDISTRICT1").value;
	}
	else{
		districtId = document.getElementById("selectDISTRICT").value;
		$('#selectWARD1').append($("<option></option>").attr("value",-1).text("Chọn xã/phường"));
	}
	// districtId = document.getElementById("selectDISTRICT").value;
	jQuery.ajax({
		url: conf + '/api/location/getwardbydistrict/' + districtId,
		type: 'GET',
		contentType: 'application/json; charset=utf-8',
		success: function(resultdata){
			for(i in resultdata.data){
				if(iddis1 != ""){
					$('#selectWARD2').append($("<option></option>").attr("value",resultdata.data[i].ward_id).text(resultdata.data[i].ward_name));
					$("#selectWARD2").css("display", "block");
				}
				else{
					$('#selectWARD1').append($("<option></option>").attr("value",resultdata.data[i].ward_id).text(resultdata.data[i].ward_name));
					$("#selectWARD1").css("display", "block");
				}
			}
		},
		error: function(jqXHR,textStatus,errorThrown){
			displayError("Lỗi ! Không thể tải dữ liệu của xã. Vui lòng tải lại trang");
		},
	}).complete(function() {
		queue3.pop();
		if (queue3.length == 0) {
			if(iddis1 != ""){
				if(state == 1){
					$('#selectWARD2').prop("selectedIndex",8);
					loadREG1(conf,token,secu,sock,1);
				}
			}
			else{
				if(state == 1){
					$('#selectWARD1').prop("selectedIndex",8);
					loadREG1(conf,token,secu,sock,1);
				}
			}
		}
	});
}
//ham tra ve ward id
function wardSELECTED(){
	var idw = -1;
	var idw1 = -1;
	var idw2 = -1;
	var idward1;
	idw1 = document.getElementById("selectWARD2").value;
	idw = document.getElementById("selectWARD1").value;
	idw2 = document.getElementById("selectWARD").value;
	if(idw1 != ""){
		idward1 = document.getElementById("selectWARD2").value;
	}
	else  if(idw != ""){
		idward1 = document.getElementById("selectWARD1").value;
	}
	else{
		idward1 = document.getElementById("selectWARD").value;
	}
	return idward1;
}
// Được gọi khi người dùng chọn selectWARD1 -->
function loadREG1(conf,token,secu,sock,state){
	resetWhenSelectedWard();
	queue3.push(1);
	var idw = -1;
	var idw1 = -1;
	var idward1;
	idw1 = document.getElementById("selectWARD2").value;
	idw = document.getElementById("selectWARD1").value;
	idw2 = document.getElementById("selectWARD").value;
	idward1 = wardSELECTED();
	var option ='';
	jQuery.ajax({
		
		url : conf + '/api/region/getlistbyward/'+idward1,
		type: 'GET',
		headers: {'Authorization':secu+token},
		contentType: 'application/json; charset=utf-8',
		success: function(resultdata){
			option += "<option value='" + -1 +"'>Chọn vùng</option>";
			for(i in resultdata.data){
				option += "<option value='" + resultdata.data[i].region_id +"'>" + resultdata.data[i].region_name +"</option>";
			}
		},
		error: function(jqXHR,textStatus,errorThrown){
			displayError("Lỗi ! Không thể tải dữ liệu của vùng. Vui lòng tải lại trang");
		},
	}).complete(function() {
		queue3.pop();
		if (queue3.length == 0) {
			if(idw1 != ""){
				$("#selectREG2").html(option);
				$("#selectREG2").css("display", "block");
				if(state == 1){
					$('#selectREG2').prop("selectedIndex",1);
					loadSTATION1(conf,token,secu,sock,1);
				}
			}
			else if(idw != ""){
				$("#selectREG1").html(option);
				$("#selectREG1").css("display", "block");
				if(state == 1){
					$('#selectREG1').prop("selectedIndex",1);
					loadSTATION1(conf,token,secu,sock,1);
				}
			}
			else{
				$("#selectREG").html(option);
				$("#selectREG").css("display", "block");
				if(state == 1){
					$('#selectREG').prop("selectedIndex",1);
					loadSTATION1(conf,token,secu,sock,1);
				}
			}
		}
	});
}
// Được gọi khi người dùng chọn selectREG1 -->
function loadSTATION1(conf,token,secu,socket,state){
	var idreg2 = -1;
	var idreg1 = -1;
	var regionid;
	resetSELECTEDpondriver();
	// var _objListenerForStation;
	idreg2 = document.getElementById("selectREG2").value;
	idreg1 = document.getElementById("selectREG1").value;
	idreg = document.getElementById("selectREG").value;
	regionid = regionSELECTED();
	turnOffChart();
	$("#btnDisplayChart").prop("disabled", true);
	var option ='';
	jQuery.ajax({
		url:  conf + '/api/station/getbyregion/'+regionid,
		type: 'GET',
		headers: {'Authorization':secu + token},
		contentType: 'application/json; charset=utf-8',
		success: function(resultdata) {
			// blockContent();
			option += "<option value='" + -1 +"'>Chọn trạm</option>";
			for(i in resultdata.data){
				if((resultdata.data[i].river_id != null) || (resultdata.data[i].pond_id != null)){
					option += "<option value='" + resultdata.data[i].station_id +"'>" + resultdata.data[i].station_name +"</option>";
				}
			}
			option += "<option value='" + 0 +"'>Trạm cầm tay</option>";
		},
		error: function(jqXHR,textStatus,errorThrown) {
			displayError("Lỗi ! Không thể tải dữ liệu của trạm. Vui lòng tải lại trang");
		},
	}).complete(function() {
		queue3.pop();
		if (queue3.length == 0) {
			if(idreg1 != -1){
				$('#selectSTATION1').html(option);
				$('#selectSTATION1').css("display", "block");
				if(state == 1){
					$('#selectSTATION1').prop("selectedIndex",1);
					loadDATA(conf,token,secu,sock);
				}
			}
			else if(idreg2 != -1){
				$('#selectSTATION2').html(option);
				$('#selectSTATION2').css("display", "block");
				if(state == 1){
					$('#selectSTATION2').prop("selectedIndex",1);
					loadDATA(conf,token,secu,sock);
				}
			}
			else if(idreg != -1){
				$('#selectSTATION').html(option);
				$("#selectSTATION").css("display", "block");
				if(state == 1){
					$('#selectSTATION').prop("selectedIndex",1);
					loadDATA(conf,token,secu,sock);
				}
			}
			else{
				$('#selectSTATION3').html(option);
				$("#selectSTATION3").css("display", "block");
				if(state == 1){
					$('#selectSTATION3').prop("selectedIndex",1);
					loadDATA(conf,token,secu,sock);
				}
			}
		}
	});
}
function turnOffChart(){
	$("#btnDisplayChart").bootstrapToggle('off');
}
//duoc goi khi loadstation1 hoad loadpond1
function loadDATA(conf,token,secu,sock){
	//socket.removeListener('tenlistener');
	turnOffChart();
	resetPONDselected1();
	var _objStationListener;
	var stationid = -1;
	var pondid = -1;
	var regionname = regionnameSELECTED();
	var notf = "";
	var address;
	var stationname;
	stationname = stationnameSELECTED();
	stationid = stationSELECTED();
	//Kiem tra xem tram duoc chon co phai tram cam tay hay khong
	//Neu khong phai thi do lieu - Neu phai thi load vi tri can xem
	if(stationid != 0 && stationid != -1){
		getAllStationNode(conf,token,secu,stationid);
		address = conf + '/api/data/gettopbystation/' + stationid;
		notf = stationname;
		blockSELECTEDstationDynamic();
		getTOPdatabyStaion(address,conf,secu,token,regionname,notf,stationid,pondid,sock);
	}
	else{
		loadLOCATION(conf,token,secu);
		$("#hienthi").html('');
		$("#displayChart").css("display","none"); //Neu chọn trạm cầm tay thì phải ẩn xem biểu đồ đi
	}
	displayStateChart = true;
	// NProgress.done();
}
//Ham lay ve data moi nhat cua tram
function getTOPdatabyStaion(address,conf,secu,token,regionname,notf,stationid,pondid,sock){
	var riverid = -1;
	jQuery.ajax({
		url : address,
		type: 'GET',
		headers: {'Authorization':secu + token},
		contentType: 'application/json; charset=utf-8',
		success: function(resultdata){
			var arrResult = [];
			var dttId;
			for(i in resultdata.data){
				// kiem tra loai da co trong mang ket qua hay chua
				// chua co thi them vao mang ket qua
				dttId = resultdata.data[i].datatype_id;
				if(arrResult[dttId] == null){
					arrResult[dttId] = resultdata.data[i];
				}
			}
			compareData(conf,token,secu,arrResult,regionname,notf,stationid,pondid,riverid,sock);
		},
		error: function(jqXHR,textStatus,errorThrown){
			displayError("Lỗi ! Không thể tải dữ liệu số đo của trạm. Vui lòng tải lại trang");
		},
	});
}
//Lấy ddataa khi load SelectPOND
function loadDATAbyPOND(conf,token,secu,sock){
	var _objStationListener;
	var stationid = -1;
	var pondid;
	var pondname;
	var regionid;
	var notf = "";
	var address;
	turnOffChart();
	// regionid = regionSELECTED();
	regionname = regionnameSELECTED();
	pondid = pondSELECTED();
	pondname = pondnameSELECTED();
	address = conf + '/api/data/gettopbyponddynamic/' + pondid;
	notf = pondname;
	getTOPdatabyPOND(address,conf,secu,token,regionname,notf,stationid,pondid,sock); //Ham lay ve gia tri do moi nhat
}
function getTOPdatabyPOND(address,conf,secu,token,regionname,notf,stationid,pondid,sock){
	var riverid = -1;
	jQuery.ajax({
		url : address,
		type: 'GET',
		headers: {'Authorization':secu + token},
		contentType: 'application/json; charset=utf-8',
		success: function(resultdata){
			var arrResult = [];
			var _today = new Date();
			var dttId,
				_dayOfResult,
				_dayOfData;
			for(i in resultdata.data){
				// kiem tra loai da co trong mang ket qua hay chua
				// chua co thi them vao mang ket qua
				dttId = resultdata.data[i].datatype_id;
				if(arrResult[dttId] == null){
					arrResult[dttId] = resultdata.data[i];
				}
				// else{
				// 	_dayOfResult = new Date(arrResult[dttId].data_createdDate);
				// 	_dayOfData = new Date(resultdata.data[i].data_createdDate);
				// 	if( (_today - _dayOfData) < (_today - _dayOfResult)){
				// 		arrResult[dttId] = resultdata.data[i];
				// 	}
				// }
			}
			compareData(conf,token,secu,arrResult,regionname,notf,stationid,pondid,riverid,sock);
		},
		error: function(jqXHR,textStatus,errorThrown){
			displayError("Lỗi ! Không thể tải dữ liệu số đo của ao. Vui lòng tải lại trang");
		},
	});
}
//duoc goi khi loadstation1 hoad loadpond1
function loadDATAbyRIVER(conf,token,secu,sock){
	//socket.removeListener('tenlistener');
	turnOffChart();
	var _objStationListener;
	var stationid = -1;
	var pondid = -1;
	var riverid;
	var rivername;
	var regionname = regionnameSELECTED();
	riverid = riverSELECTED();
	rivername = rivernameSELECTED();
	var notf = "";
	var address;
	//Kiem tra xem tram duoc chon co phai tram cam tay hay khong
	//Neu khong phai thi do lieu - Neu phai thi load vi tri can xem
	address = conf + '/api/data/gettopbyriverdynamic/' + riverid;
	notf = rivername;
	getTOPdatabyRIVER(address,conf,secu,token,regionname,notf,stationid,pondid,riverid,sock);
}
//load data khi chon load du lieu cam tay tren song
function getTOPdatabyRIVER(address,conf,secu,token,regionname,notf,stationid,pondid,riverid,sock){
	jQuery.ajax({
		url : address,
		type: 'GET',
		headers: {'Authorization':secu + token},
		contentType: 'application/json; charset=utf-8',
		success: function(resultdata){
			var arrResult = [];
			var _today = new Date();
			var dttId,
				_dayOfResult,
				_dayOfData;
			for(i in resultdata.data){
				// kiem tra loai da co trong mang ket qua hay chua
				// chua co thi them vao mang ket qua
				dttId = resultdata.data[i].datatype_id;
				if(arrResult[dttId] == null){
					arrResult[dttId] = resultdata.data[i];
				}
			}
			compareData(conf,token,secu,arrResult,regionname,notf,stationid,pondid,riverid,sock);
		},
		error: function(jqXHR,textStatus,errorThrown){
			displayError("Lỗi ! Không thể tải dữ liệu số đo của sông. Vui lòng tải lại trang");
		},
	});
}

function resetSTATIONselected(){
	$('#selectSTATION').prop('selectedIndex', 0);
}
//ham reset khi selectSTATION duoc chon
function resetPONDselected(){
	$('#selectPOND').prop('selectedIndex', 0);
}
//ham reset select cua station khi pond2 duoc chon
function resetSTATIONseletected2(){
	$('#selectSTATION2').prop('selectedIndex', 0);
}
//ham reset select cua pond khi station2 duoc chon
function resetPONDselected2(){
	$('#selectPOND2').prop('selectedIndex', 0);
}
//Ham lay ra river
function riverSELECTED(){
	var riverid;
	var riid = -1,
		riid1 = -1,
		riid2 = -1,
		riid3 = -1;
	var riid = document.getElementById('selectRIVER').value;
	var riid1 = document.getElementById('selectRIVER1').value;
	var riid2 = document.getElementById('selectRIVER2').value;
	var riid3 = document.getElementById('selectRIVER3').value;
	if(riid != -1){
		riverid = riid;
	}
	else if(riid1 != -1){
		riverid = riid1;
	}
	else if(riid2 != -1){
		riverid = riid2;
	}
	else {
		riverid = riid3;
	}
	return riverid;
}
function rivernameSELECTED(){
	var rivername;
	var riid = -1,
		riid1 = -1,
		riid2 = -1,
		riid3 = -1;
	var riid = document.getElementById('selectRIVER').value;
	var riid1 = document.getElementById('selectRIVER1').value;
	var riid2 = document.getElementById('selectRIVER2').value;
	var riid3 = document.getElementById('selectRIVER3').value;
	if(riid != -1){
		rivername = document.getElementById('selectRIVER').options[document.getElementById('selectRIVER').selectedIndex].text;
	}
	else if(riid1 != -1){
		rivername = document.getElementById('selectRIVER1').options[document.getElementById('selectRIVER1').selectedIndex].text;
	}
	else if(riid2 != -1){
		rivername = document.getElementById('selectRIVER2').options[document.getElementById('selectRIVER2').selectedIndex].text;
	}
	else {
		rivername = document.getElementById('selectRIVER3').options[document.getElementById('selectRIVER3').selectedIndex].text;
	}
	return rivername;
}
//Ham lay ra regionid
function regionSELECTED(){
	var regionid;
	var regid = -1,
		regid1 = -1,
		regid2 = -1,
		regid3 = -1;
	var regid = document.getElementById('selectREG').value;
	var regid1 = document.getElementById('selectREG1').value;
	var regid2 = document.getElementById('selectREG2').value;
	var regid3 = document.getElementById('selectREG3').value;
	if(regid != -1){
		regionid = regid;
	}
	else if(regid1 != -1){
		regionid = regid1;
	}
	else if(regid2 != -1){
		regionid = regid2;
	}
	else {
		regionid = regid3;
	}
	return regionid;
}
//ham lay ve ten cua vung
function regionnameSELECTED() {
	var region_name;
	var regid = -1,
		regid1 = -1,
		regid2 = -1,
		regid3 = -1;
	var regid = document.getElementById('selectREG').value;
	var regid1 = document.getElementById('selectREG1').value;
	var regid2 = document.getElementById('selectREG2').value;
	var regid3 = document.getElementById('selectREG3').value;
	if(regid != -1){
		region_name = document.getElementById('selectREG').options[document.getElementById('selectREG').selectedIndex].text;
	}
	else if(regid1 != -1){
		region_name = document.getElementById('selectREG1').options[document.getElementById('selectREG1').selectedIndex].text;
	}
	else if(regid2 != -1){
		region_name = document.getElementById('selectREG2').options[document.getElementById('selectREG2').selectedIndex].text;
	}
	else {
		region_name = document.getElementById('selectREG3').options[document.getElementById('selectREG3').selectedIndex].text;
	}
	return region_name;
}
//Ham lay ra pondid
function pondSELECTED(){
	var pondid;
	var poid = -1,
		poid1 = -1,
		poid2 = -1,
		poid3 = -1;
	poid = document.getElementById('selectPOND').value;
	poid1 = document.getElementById('selectPOND1').value;
	poid2 = document.getElementById('selectPOND2').value;
	poid3 = document.getElementById('selectPOND3').value;
	if(poid != -1){
		pondid = poid;
	}
	else if(poid1 != -1){
		pondid = poid1;
	}
	else if(poid2 != -1){
		pondid = poid2;
	}
	else {
		pondid = poid3;
	}
	return pondid;
}
//ham lay ten ao
function pondnameSELECTED(){
	var pondname;
	var poid = -1,
		poid1 = -1,
		poid2 = -1,
		poid3 = -1;
	poid = document.getElementById('selectPOND').value;
	poid1 = document.getElementById('selectPOND1').value;
	poid2 = document.getElementById('selectPOND2').value;
	poid3 = document.getElementById('selectPOND3').value;
	if(poid != -1){
		pondname = document.getElementById('selectPOND').options[document.getElementById('selectPOND').selectedIndex].text;
	}
	else if(poid1 != -1){
		pondname = document.getElementById('selectPOND1').options[document.getElementById('selectPOND1').selectedIndex].text;
	}
	else if(poid2 != -1){
		pondname = document.getElementById('selectPOND2').options[document.getElementById('selectPOND2').selectedIndex].text;
	}
	else {
		pondname = document.getElementById('selectPOND3').options[document.getElementById('selectPOND3').selectedIndex].text;
	}
	return pondname;
}
//Ham lay ve id cua station
function stationSELECTED(){
	var stationid;
	var staid = -1,
		staid1 = -1,
		staid2 = -1,
		staid3 = -1;
	staid = document.getElementById('selectSTATION').value;
	staid1 = document.getElementById('selectSTATION1').value;
	staid2 = document.getElementById('selectSTATION2').value;
	staid3 = document.getElementById('selectSTATION3').value;
	if(staid != -1){
		stationid = staid;
	}
	else if(staid1 != -1){
		stationid = staid1;
	}
	else if(staid2 != -1){
		stationid = staid2;
	}
	else {
		stationid = staid3;
	}
	return stationid;
}
//Ham lay ve name cua station
function stationnameSELECTED(){
	var stationname;
	var staid = -1,
		staid1 = -1,
		staid2 = -1,
		staid3 = -1;
	staid = document.getElementById('selectSTATION').value;
	staid1 = document.getElementById('selectSTATION1').value;
	staid2 = document.getElementById('selectSTATION2').value;
	staid3 = document.getElementById('selectSTATION3').value;
	if(staid != -1){
		stationname = document.getElementById('selectSTATION').options[document.getElementById('selectSTATION').selectedIndex].text;
	}
	else if(staid1 != -1){
		stationname = document.getElementById('selectSTATION1').options[document.getElementById('selectSTATION1').selectedIndex].text;
	}
	else if(staid2 != -1){
		stationname = document.getElementById('selectSTATION2').options[document.getElementById('selectSTATION2').selectedIndex].text;
	}
	else {
		stationname = document.getElementById('selectSTATION3').options[document.getElementById('selectSTATION3').selectedIndex].text;
	}
	return stationname;
}
/*
* Việc sử dụng callback trong hàm và gọi lại callback để khi gọi hàm ta
* có thể sử dụng trực tiếp dữ liệu của chính hàm đó
*/
/*Hàm lấy thông tin của vùng theo id*/
function getRegionById(conf,token,secu,region_id,callback){
	jQuery.ajax({
		url: conf + '/api/region/getbyid/'+region_id,
		type: 'GET',
		headers:{'Authorization': secu + token},
		contentType: 'application/json; charset=utf-8',
		success: function(resultdt){
			callback(resultdt.data);
		},
		error:function(jqXHR,error){
			displayError("Lỗi ! Không thể tải dữ liệu theo region id. Vui lòng tải lại trang");
		},
	});
}
/*Hàm lấy dữ liệu theo data id gọi callback để sử dụng*/
function getDataById(conf,token,secu,dataid,callback){
	jQuery.ajax({
		url: conf + '/api/data/getbyid/'+dataid,
		type: 'GET',
		headers:{'Authorization': secu + token},
		contentType: 'application/json; charset=utf-8',
		success: function(resultdt){
			callback(resultdt.data);
		},
		error:function(jqXHR,error){
			displayError("Lỗi ! Không thể tải dữ liệu theo data id. Vui lòng tải lại trang");
		},
	});
}

var queue5 = [];
/*Hàm lấy về thông tin của ngưỡng gọi callback để sử dụng*/
function getInfoThresholdById(conf,token,secu,threshold_id,callback){
	jQuery.ajax({
		url: conf + '/api/threshold/getbyid/' + threshold_id,
		contentType: 'application/json',
		headers:{'Authorization': secu + token},
		success: function(resultdata){
			callback(resultdata.data);
		},
		error: function(jqXHR,textStatus,errorThrown){
			displayError("Lỗi không thể tải dữ liệu theo ngưỡng id. Vui lòng tải lại trang web");
		}
	});
}
/*Hàm lấy về lời khuyên gọi callback để sử dụng*/
function getAdviceByThresholdId(conf,token,secu,threshold_id,callback){
	jQuery.ajax({
		url: conf + '/api/advice/getbythreshold/' + threshold_id,
		contentType: 'application/json',
		headers:{'Authorization': secu + token},
		success: function(resultdata){
			callback(resultdata.data);
		},
		error: function(jqXHR,textStatus,errorThrown){
			displayError("Lỗi không thể load dữ liệu lời khuyên theo id. Vui lòng tải lại trang web");
		}
	});
}
/*Hàm hiển thị modal xem chi tiết dữ liệu*/
function showModalNoti(conf,token,secu,data_id,threshold_id,notif_title,notif_id,region_id,notif_createdDate,notif_readState){
	checkReadNotifi(conf,token,secu,notif_id); /*Gọi hàm đổi trạng thái đọc thông báo*/
	
	var datatype_id = 0;
	var DataTypeName = '';
	var max_value_date = 0;
	var advice_message = '';
	var region_name = '';
	getAdviceByThresholdId(conf,token,secu,threshold_id,function(result){
		result.forEach(function(items){
			/*So sánh lấy lời khuyên mới nhất*/
			if(max_value_date < moment(items.advice_createdDate).utc().valueOf()){
				advice_message = items.advice_message;
				max_value_date = moment(items.advice_createdDate).utc().valueOf();
			}
		});
		$(".AdviceMessage").text(advice_message);
	});
	getRegionById(conf,token,secu,region_id,function(result){
		$(".RegionName").text("Vùng: " + result.region_name);
	});
	getDataById(conf,token,secu,data_id,function(result){
		$(".DataValue").text("Giá trị: " + result.data_value);
		var StationName = "Vị trí đo: " + arrStationName[result.station_id];
		$(".StationName").text(StationName);
		datatype_id = result.datatype_id;
		arrDataTypeOfId[datatype_id].forEach(function(datatype){
			$(".DataTypeName").text("Loại dữ liệu: " + datatype.datatype_name);
		});
	});
	getInfoThresholdById(conf,token,secu,threshold_id,function(result){
		$(".ThresholdLevel").text("Cấp độ: " + result.threshold_level);
		$(".ThresholdMessage").text("Ngưỡng: " + result.threshold_message);
	});
	$("#modal-title").text(notif_title);
	var DateCreated = "Thời gian đo: " + moment(notif_createdDate).utc().format('DD-MM-YYYY, HH:mm');
	if((parseInt($("#countmessage").text())) > 0){
		if(notif_readState == 0){
			$("#countmessage").html(parseInt($("#countmessage").text()) - 1);
			$("#titlemessage").html((parseInt($("#titlemessage").text()) - 1) + " thông báo chưa đọc");
		}
	}
	$(".DateCreated").text(DateCreated);	
	$("#modalNotifi").modal('show');
}
/*Hàm xử lý dữ liệu cho thông báo các trạm ở sông*/
function processDataForNotiStation(conf,token,secu,data_id,threshold_id,threshold_level,notif_title,notif_id,region_id,notif_createdDate){
	var dtvalue = 0;
	var datatypeid = '';
	var stationid = 0;
	var datecreated = '';
	$("#countmessage").html(parseInt($("#countmessage").text()) + 1);
	$("#titlemessage").html((parseInt($("#titlemessage").text()) + 1) + " thông báo chưa đọc");
	// getAdviceByThresholdId(conf,token,secu,threshold_id);
	queue5.push(1);
	jQuery.ajax({
		url: conf + '/api/data/getbyid/' + data_id,
		contentType: 'application/json',
		headers:{'Authorization': secu + token},
		success: function(resultdata){
			dtvalue = resultdata.data.data_value;
			datatypeid = resultdata.data.datatype_id;
			stationid = resultdata.data.station_id;
		},
		error: function(jqXHR,textStatus,errorThrown){
			displayError("Lỗi không thể load dữ liệu theo id. Vui lòng tải lại trang web");
		}
	}).complete(function(){
		queue5.pop();
		if(queue5.length == 0){
			if(arrBlockStation.indexOf(stationid)  == -1){
				PushNotificationForStation(conf,token,secu,data_id,threshold_id,threshold_level,datatypeid,dtvalue,notif_title,stationid,notif_id,region_id,notif_createdDate);	
			}
		}
	});
}
//Ham thông báo khi vượt ngưỡng duoc goi khi dung socket cua lop RealTimePushNotificationForStation
function PushNotificationForStation(conf,token,secu,data_id,threshold_id,threshold_level,datatype_id,data_value,notif_title,stationid,notif_id,region_id,notif_createdDate){
	if(threshold_level > 0){
		var datatype_name;
		getNotification(conf,token,secu,user_ID,0,10); /*Load lại thông báo*/
	 	var audio = new Audio('/audio/alarmfrenzy.mp3');
    	audio.play();  
    	/*Đang test để 10 giây*/
	 	/*Để ajax load trong hàm vì khi tách hàm thì không gọi api kịp*/
	    jQuery.ajax({
			url: conf + '/api/datatype/getbyid/'+datatype_id,
			type: 'GET',
			headers:{'Authorization': secu + token},
			contentType: 'application/json; charset=utf-8',
			success: function(resultdt){
				datatype_name = resultdt.data.datatype_name;
				Push.create(notif_title, {
					body: "Độ đo " + resultdt.data.datatype_name + " có giá trị đo " + data_value + " vượt ngưỡng " + threshold_level + ". Chọn để xem chi tiết",
					icon: {
				        x16: '/dist/img/icwarn2.png',
				        x32: '/dist/img/icwarn1.png'
				    },
					timeout: 10000,
					onClick: function () {
						window.focus();
						this.close();
						showModalNoti(conf,token,secu,data_id,threshold_id,notif_title,notif_id,region_id,notif_createdDate,0);
					}
				});
			},
			error:function(jqXHR,error){
				displayError("Lỗi ! Không thể tải dữ liệu của các loại dữ liệu đo. Vui lòng tải lại trang");
			},
		});
	}
}
/*Hàm để chuyển trạng thái đọc thông báo notif_readState từ false thành true*/
function checkReadNotifi(conf,token,secu,notif_id){
	queue2.push(1);
	jQuery.ajax({
		url: conf + '/api/notification/getbyid?user_id=' + user_ID + '&notif_id=' +  notif_id,
		type: 'GET',
		headers:{'Authorization': secu + token},
		contentType: 'application/json; charset=utf-8',
		success: function(resultdt){
			console.log("Đã đọc thông báo ngưỡng");
		},
		error:function(jqXHR,error){
			displayError("Lỗi ! Không thể chạy hàm đọc thông báo ngưỡng. Vui lòng tải lại trang");
		},
	}).complete(function(){
		queue2.pop();
		if(queue2.length == 0){
			getNotification(conf,token,secu,user_ID,0,10);
		}
	});
}


/**Viết hàm xử lý check đọc thông báo*/
//ham load Station node
function getAllStationNode(conf,token,secu,idStation){
	var _stationnode;
	jQuery.ajax({
		url: conf + '/api/station/getbyid/' + idStation,
		type: 'GET',
		headers: {'Authorization':secu + token},
		contentType: 'application/json; charset=utf-8',
		success: function(resultdata){
			_stationnode = resultdata.data.station_node;
			StationNode = _stationnode.split('|');
		},
		error: function(jqXHR,error,errorThrown){
			displayError("Lỗi ! Không thể tải danh sách cách sensor. Vui lòng tải lại trang");
		},
	});
}
//ham tat lua chon vi tri xem tram cam tay khi khong chon xem tram cam tay
function blockSELECTEDstationDynamic(){
	$("#selectLOCATION").css("display", "none");
	$("#selectLOCATION1").css("display", "none");
	$("#selectLOCATION2").css("display", "none");
	$("#selectLOCATION3").css("display", "none");
	$("#selectPOND").css("display", "none");
	$("#selectPOND1").css("display", "none");
	$("#selectPOND2").css("display", "none");
	$("#selectPOND3").css("display", "none");
	$("#selectRIVER").css("display", "none");
	$("#selectRIVER1").css("display", "none");
	$("#selectRIVER2").css("display", "none");
	$("#selectRIVER3").css("display", "none");
}

/*Hàm trả về ngày mới nhất*/
//Ham so sanh data va tra ve gia tri
function compareData(conf,token,secu,arrResult,regionname,notf,stationid,pondid,riverid,sock){
	var data_value;
	// var _dataType;
	var datecreated;
	var arrDataTypeName = [];
	var arrdttype = [];
	var html = "";
	var html2 = "";
	var max_date = '',max_value_date = 0;
	jQuery.ajax({
		url: conf + '/api/datatype/getall/',
		type: 'GET',
		headers:{'Authorization': secu + token},
		contentType: 'application/json; charset=utf-8',
		success: function(resultdt){
			arrDataType = resultdt.data;
			resultdt.data.forEach(function(data,index){
				arrdttype.push(data.datatype_id); /*Lưu mảng id để load data*/
				arrDataTypeName[data.datatype_id] = [];
				arrDataTypeOfId[data.datatype_id] = []; //khai bao kiểu mảng chứa dữ liệu
				arrDataTypeOfId[data.datatype_id].unshift({datatype_id:data.datatype_id,datatype_name:data.datatype_name,datatype_unit:data.datatype_unit});
				arrDataTypeName[data.datatype_id].push(data.datatype_name);
				arrDataTypeUnit[data.datatype_id] = []; //khai bao kiểu mảng chứa dữ liệu
				arrDataTypeUnit[data.datatype_id].push(data.datatype_unit);
				/*Điều kiện if lấy về ngày mới nhất lấy dữ liệu*/
				if(arrResult.hasOwnProperty(data.datatype_id)){
					if(max_value_date < moment(arrResult[data.datatype_id].data_createdDate).utc().valueOf()){
						max_date = moment(arrResult[data.datatype_id].data_createdDate).utc().format('DD-MM-YYYY, HH:mm');
					}
				}
			});
			arrdttype.sort(); /*Sắp xếp các datatype_id theo thứ tự tăng dần*/
			arrdttypeForRadio = arrdttype;
		},
		error: function(jqXHR,textStatus,errorThrown){
			displayError("Lỗi ! Không thể tải dữ liệu để hiện thị số đo. Vui lòng tải lại trang");
		}
	}).complete(function(){
		arrdttype.forEach(function(data,index){
			html += "<tr>";
			// Cho nay can them dieu kien if neu du lieu cua ao khong du so thuoc tinh can thiet - neu khong kiem tra thi khi khong du so thuoc tinh se bi loi
			if(arrResult.hasOwnProperty(data)){
				data_value = arrResult[data].data_value;
				datecreated = moment(arrResult[data].data_createdDate).utc().format('DD-MM-YYYY, HH:mm');
				/*Kiểm tra nếu như ngày của dữ liệu không trùng và cũ hơn so với ngày mới nhất thì gạch*/
				if(max_date != datecreated){
					html+= "<td style='color:black;'>" + arrDataTypeName[data] +
					"</td>";
					html += "<td style='font-weight:bold;color:black;'>- -</td>";
					html += "<td style='color:black'>";
					html += arrDataTypeUnit[data] + "</td>";
					html += "<td style='color:black;'>";
					html += "- -</td>";
				}
				else{
					if(arrResult[data].threshold_level == 1){
						html += "<td style='color:#D0461F;'>" + arrDataTypeName[data] +
						"</td>";
						html += "<td style='font-weight:bold;color:#D0461F;'>";
						html += data_value;
						html += "</td>";
						html += "<td style='color:#D0461F;'>";
						html += arrDataTypeUnit[data] + "</td>";
						html += "<td style='color:#D0461F;'>";
						html += datecreated + "</td>";
					}
					else if(arrResult[data].threshold_level == 2){
						html+= "<td style='color:#C42D2D;'>" + arrDataTypeName[data] +
						"</td>";
						html += "<td style='font-weight:bold;color:#C42D2D;'>";
						html += data_value;
						html += "</td>";
						html += "<td style='color:#C42D2D;'>";
						html += arrDataTypeUnit[data] + "</td>";
						html += "<td style='color:#C42D2D;'>";
						html += datecreated + "</td>";
					}
					else if(arrResult[data].threshold_level == 3){
						html+= "<td style='color:#CC2C2C;'>" + arrDataTypeName[data] +
						"</td>";
						html += "<td style='font-weight:bold;color:#CC2C2C;'>";
						html += data_value
						html += "</td>";
						html += "<td style='color:#CC2C2C;'>";
						html += arrDataTypeName[data] + "</td>";
						html += "<td style='color:#CC2C2C;'>";
						html += datecreated + "</td>";
					}
					else if(arrResult[data].threshold_level == 4){
						html+= "<td style='color:#D90505;'>" + arrDataTypeName[data] +
						"</td>";
						html += "<td style='font-weight:bold;color:#D90505;'>";
						html += data_value;
						html += "</td>";
						html += "<td style='color:#D90505;'>";
						html += arrDataTypeUnit[data] + "</td>";
						html += "<td style='color:#D90505;'>";
						html += datecreated + "</td>";
					}
					else{

						html+= "<td style='color:black;'>" + arrDataTypeName[data] +
						"</td>";
						html += "<td style='font-weight:bold;color:black;'>" + data_value + "</td>";
						html+= "<td style='color:black;'>" + arrDataTypeUnit[data] +
						"</td>";
						html += "<td style='color:black;'>";
						html += datecreated + "</td>";
					}
				}
			}
			//ham if(arrResult.hasOwnProperty(data.datatype_id)) kiem tra phan tu arrResult co ton tai trong data.datatype_id hay khong
			else{
				html+= "<td style='color:black;'>" + arrDataTypeName[data] +
					"</td>";
				html += "<td style='font-weight:bold;color:black;'>- -</td>";
				html += "<td style='color:black'>";
				html += arrDataTypeUnit[data] + "</td>";
				html += "<td style='color:black;'>";
				html += "- -</td>";
			}
			html += "</tr>";
		});
			
		html2 = "Số liệu đo của " + regionname + " - " + notf;
		$("#hienthi").html(html);
		$("#tieude").html(html2);
		showRadioDataType();
			// loadDATAforDrawCharts(conf,token,secu,moment($("#start_date").val()).format('L'),moment($("#end_date").val()).format('L'));
			//kiem tra neu idstation da ton tai thi xoa socket.on cua idstation
		unblockContent();
		_objStationListener = null;
		_objStationListener = new RealTime({idStation: stationid, idPond: pondid, StationNode: StationNode, idRiver:riverid, dataTypes: arrDataTypeOfId,sockt: sock,conf: conf,token: token,secu: secu});
	});
}
function setDefaultDisplayDate(){
	var dateEnd = new Date();
    var dateStart = new Date(dateEnd.getTime() - (1*86400000));// lay thoi gian hien tai tru di 1 ngay
    $("#end_date" ).datetimepicker({
    	format: 'DD/MM/YYYY HH:mm',
    	defaultDate: dateEnd,
    	locale: 'vi'
    });
    $("#start_date" ).datetimepicker({
    	format: 'DD/MM/YYYY HH:mm',
    	defaultDate: dateStart,
    	locale: 'vi'
    });
}
//Ham hien thi vi tri can xem du lieu cua tram cam tay
function loadLOCATION(conf,token,secu){
	if(typeLocation == "Province"){
		$("#selectLOCATION").prop("selectedIndex",0);
		$("#selectLOCATION").css("display", "block");
	}
	else if(typeLocation == "District"){
		$("#selectLOCATION1").prop("selectedIndex",0);
		$("#selectLOCATION1").css("display", "block");
	}
	else if(typeLocation == "Ward"){
		$("#selectLOCATION2").prop("selectedIndex",0);
		$("#selectLOCATION2").css("display", "block");
	}
	else{
		$("#selectLOCATION3").prop("selectedIndex",0);
		$("#selectLOCATION3").css("display", "block");
	}
	
}
function loadSELECTEDLOCATION(conf,token,secu){
	var idloca = -1,
		idloca1 = -1,
		idloca2 = -1,
		idloca3 = -1;
	var id;
	turnOffChart();
	idloca = document.getElementById("selectLOCATION").value;
	idloca1 = document.getElementById("selectLOCATION1").value;
	idloca2 = document.getElementById("selectLOCATION2").value;
	idloca3 = document.getElementById("selectLOCATION3").value;
	if (idloca != -1){
		id = idloca;
	}
	else if (idloca1 != -1){
		id = idloca1;
	}
	else if (idloca2 != -1){
		id = idloca2;
	}
	else {
		id = idloca3;
	}
	// blockSELECTEDstationDynamic();
	if(id == 1){
		loadPOND1(conf,token,secu);
		$("#selectRIVER").css("display", "none");
		$("#selectRIVER1").css("display", "none");
		$("#selectRIVER2").css("display", "none");
		$("#selectRIVER3").css("display", "none");
	}
	else{
		loadRiver(conf,token,secu);
		$("#selectPOND").css("display", "none");
		$("#selectPOND1").css("display", "none");
		$("#selectPOND2").css("display", "none");
		$("#selectPOND3").css("display", "none");
	}
}
//load danh sach cac tram o song
function loadRiver(conf,token,secu){
	var regionid = regionSELECTED();
	resetRiver();
	jQuery.ajax({
		url: conf + '/api/river/getbyregion/' + regionid,
		type: 'GET',
		headers: {'Authorization':secu + token},
		contentType: 'application/json; charset=utf-8',
		success: function(resultdata) {
			for(i in resultdata.data){
				arrRiver[i] = resultdata.data[i].river_id;
				if(typeLocation == "Province"){

					$('#selectRIVER').append($("<option></option>").attr("value",resultdata.data[i].river_id).text(resultdata.data[i].river_name));
					$("#selectRIVER").css("display", "block");
				}
				else if(typeLocation == "District"){
					$('#selectRIVER1').append($("<option></option>").attr("value",resultdata.data[i].river_id).text(resultdata.data[i].river_name));
					$("#selectRIVER1").css("display", "block");
				}
				else if(typeLocation == "Ward"){
					$('#selectRIVER2').append($("<option></option>").attr("value",resultdata.data[i].river_id).text(resultdata.data[i].river_name));
					$("#selectRIVER2").css("display", "block");
				}
				else{
					$('#selectRIVER3').append($("<option></option>").attr("value",resultdata.data[i].river_id).text(resultdata.data[i].river_name));
					$("#selectRIVER3").css("display", "block");
				}
			}
			// _objListenerForRiver = null;
			// _objListenerForRiver = new RealTimePushNotificationForStation({arrRiver:arrRiver,sockt: sock,conf:conf,token:token,secu:secu});
		},
		error: function(jqXHR,textStatus,errorThrown) {
			displayError("Lỗi ! Không thể tải dữ liệu của sông. Vui lòng tải lại trang");
		},
	});
}
//reset chon river
function resetRiver(){
	$('#selectRIVER1').find('option').remove();
	$('#selectRIVER1').append($("<option></option>").attr("value",-1).text("Chọn vị trí trên sông"));
	$('#selectRIVER2').find('option').remove();
	$('#selectRIVER2').append($("<option></option>").attr("value",-1).text("Chọn vị trí trên sông"));
	$('#selectRIVER3').find('option').remove();
	$('#selectRIVER3').append($("<option></option>").attr("value",-1).text("Chọn vị trí trên sông"));
	$('#selectRIVER').find('option').remove();
	$('#selectRIVER').append($("<option></option>").attr("value",-1).text("Chọn vị trí trên sông"));
}
//reset chọn ao 
function resetPOND(){
	$('#selectPOND1').find('option').remove();
	$('#selectPOND1').append($("<option></option>").attr("value",-1).text("Chọn ao"));
	$('#selectPOND2').find('option').remove();
	$('#selectPOND2').append($("<option></option>").attr("value",-1).text("Chọn ao"));
	$('#selectPOND').find('option').remove();
	$('#selectPOND').append($("<option></option>").attr("value",-1).text("Chọn ao"));
	$('#selectPOND3').find('option').remove();
	$('#selectPOND3').append($("<option></option>").attr("value",-1).text("Chọn ao"));
}
// Được gọi khi người dùng chọn vùng-->
function loadPOND1(conf,token,secu){
	$('#hienthi').html('');
	resetPOND();
	var idregion;
	var idreg2 = -1;
	var idreg1 = -1;
	var idreg = -1;
	idreg2 = document.getElementById("selectREG2").value;
	idreg1 = document.getElementById("selectREG1").value;
	idreg = document.getElementById("selectREG").value;
	idregion = regionSELECTED();
	$('#selectPOND1').find('option').remove();
	$('#selectPOND1').append($("<option></option>").attr("value",-1).text("Chọn ao"));
	jQuery.ajax({
		url: conf + '/api/pond/getbyregion/' + idregion,
		type: 'GET',
		headers: {'Authorization':secu + token},
		contentType: 'application/json; charset=utf-8',
		success: function(resultdata) {
			for(i in resultdata.data){
				if(idreg1 != -1){
					$('#selectPOND1').append($("<option></option>").attr("value",resultdata.data[i].pond_id).text(resultdata.data[i].pond_description));
					$("#selectPOND1").css("display", "block");
				}
				else if(idreg2 != -1){
					$('#selectPOND2').append($("<option></option>").attr("value",resultdata.data[i].pond_id).text(resultdata.data[i].pond_description));
					$("#selectPOND2").css("display", "block");
				}
				else if(idreg != -1){
					$('#selectPOND').append($("<option></option>").attr("value",resultdata.data[i].pond_id).text(resultdata.data[i].pond_description));
					$("#selectPOND").css("display", "block");
				}
				else{
					$('#selectPOND3').append($("<option></option>").attr("value",resultdata.data[i].pond_id).text(resultdata.data[i].pond_description));
					$("#selectPOND3").css("display", "block");
				}
			}
		},
		error: function(jqXHR,textStatus,errorThrown) {
			displayError("Lỗi ! Không thể tải dữ liệu của ao. Vui lòng tải lại trang");
		},
	});
}
//duoc goi khi can reset tat ca lua chon
function resetALLSELECT1(){
	$('#selectREG1').find('option').remove();
	$('#selectREG1').append($("<option></option>").attr("value",-1).text("Chọn vùng"));
	$('#selectSTATION1').find('option').remove();
	$('#selectSTATION1').append($("<option></option>").attr("value",-1).text("Chọn trạm"));
	$('#selectPOND1').find('option').remove();
	$('#selectPOND1').append($("<option></option>").attr("value",-1).text("Chọn ao"));
	
}
//An cac tuy chon khac khi chon tinh
function resetWhenSelectedProvince(){
	$("#selectWARD2").css("display","none");
	$("#selectREG2").css("display","none");
	$("#selectSTATION2").css("display","none");
	$("#tieude").html('Số liệu đo');
	resetSELECTEDpondriver();
	turnOffChart();
	$("#btnDisplayChart").prop("disabled", true);
	$("#hienthi").html('');
}
function resetWhenSelectedDistrict(){
	$("#selectREG2").css("display","none");
	$("#selectSTATION2").css("display","none");
	$("#selectREG1").css("display","none");
	$("#selectSTATION1").css("display","none");
	$("#tieude").html('Số liệu đo');
	resetSELECTEDpondriver();
	turnOffChart();
	$("#btnDisplayChart").prop("disabled", true);
	$("#hienthi").html('');
}
function resetWhenSelectedWard(){
	$("#selectSTATION2").css("display","none");
	$("#selectSTATION1").css("display","none");
	$("#selectSTATION").css("display","none");
	$("#btnDisplayChart").prop("disabled", true);
	$("#tieude").html('Số liệu đo');
	resetSELECTEDpondriver();
	turnOffChart();
}
function resetSELECTEDpondriver(){
	$("#selectLOCATION3").css("display","none");
	$("#selectLOCATION2").css("display","none");
	$("#selectLOCATION1").css("display","none");
	$("#selectLOCATION").css("display","none");
	$('#selectPOND1').css("display","none");
	$('#selectPOND').css("display","none");
	$('#selectPOND2').css("display","none");
	$('#selectPOND3').css("display","none");
	$('#selectRIVER').css("display","none");
	$('#selectRIVER1').css("display","none");
	$('#selectRIVER2').css("display","none");
	$('#selectRIVER3').css("display","none");
	$("#hienthi").html('');
}
//ham reset select cua selectPOND1 duoc chon
function resetSTATIONselected1(){
	$('#selectSTATION1').prop('selectedIndex', 0);
}
//ham reset khi selectSTATION1 duoc chon
function resetPONDselected1(){
	$('#selectPOND1').prop('selectedIndex', 0);
}
//ham reset select cua selectPOND4 duoc chon
function resetSTATIONselected4(){
	$('#selectSTATION3').prop('selectedIndex', 0);
}
//ham reset khi selectSTATION4 duoc chon
function resetPONDselected4(){
	$('#selectPOND3').prop('selectedIndex', 0);
}
//Danh sách hàm của trang thêm vùng
var lastedid = 0;
function loadlastid(conf,token,secu){
	jQuery.ajax({
		type: 'GET',
		url: conf + '/api/region/getall/',
		headers: {'Authorization':secu + token},
		contentType: 'application/json; charset=utf-8',
		success: function(resultData){
			lastedid = resultData.data[resultData.length-1].region_id;
			document.getElementById("region_id").value = lastedid+1;
		},
		error: function(jqXHR,textStatus,errorThrown){
			displayError("Lỗi ! Không thể tải dữ liệu vùng. Vui lòng tải lại trang");
		}
	});
}
//goi ham loadWARD o tren
function loadWARDSELECTED(conf,wardid){
	$('#selectWARD').find('option').remove();
    //set tham thoi thong so cua ward la 30700
	// $('#selectWARD').append($("<option></option>").attr("value",-1).text("Chọn xã/phường"));
	jQuery.ajax({
		url: conf + '/api/location/getwardbydistrict/894',
		type: 'GET',
		contentType: 'application/json; charset=utf-8',
		success: function(resultdata){
			for(i in resultdata.data){
				$('#selectWARD').append($("<option></option>").attr("value",resultdata.data[i].ward_id).text(resultdata.data[i].ward_name));
				$("#selectWARD option[value='wardid']").prop('selected', true); //set option mac dinh dua vao value
			}	
		},
		error: function(jqXHR,textStatus,errorThrown){
			displayError("Lỗi ! Không thể tải dữ liệu để hiển thị cho biểu đồ. Vui lòng tải lại trang");
		},
	});
}
//ham ben trang capnhatvung
function loadUPDATEVUNG(conf,regid,token,secu){
	jQuery.ajax({
		url: url = conf + '/api/region/getbyid/' + regid,
		type: 'GET',
		contentType: 'application/json; charset=utf-8',
		headers: {'Authorization': secu + token},
		success: function(resultdata){
			$("#region_id").val(resultdata.data.region_id);
			$("#region_name").val(resultdata.data.region_name);
			$("#region_description").val(resultdata.data.region_description); //set du lieu vao the input text
		},
		error: function(jqXHR,textStatus,errorThrown){
			displayError("Lỗi ! Không thể tải dữ liệu vùng dựa trên id vùng. Vui lòng tải lại trang");
		},
	});
}

//Hien thi lua chon radio o loai du lieu nao de hien du lieu
function showRadioDataType(){
	var html = '';
	var i = 0;
	html +="<label>Loại dữ liệu</label>";
	arrdttypeForRadio.forEach(function(data){
		arrDataTypeOfId[data].forEach(function(arrDataType){
	    	//Chọn loại dữ liệu đầu tiên để checked làm mặc định xem dữ liệu.
	    	if(i == 0){
	    		html +=
		        '<div class="radio">'+
		            '<label name="radName">'+
		                '<input type="radio" name="radDataType" value="'+ arrDataType.datatype_id +'" checked onclick="initChart()">' +
		                arrDataType.datatype_name +
		            '</label>'+
		        '</div>';
	    	}
	    	else{
	    		html +=
		        '<div class="radio">'+
		            '<label name="radName">'+
		                '<input type="radio" name="radDataType" value="'+ arrDataType.datatype_id +'" onclick="initChart()">' +
		                arrDataType.datatype_name +
		            '</label>'+
		        '</div>';
	    	}
	    	i++;
	    });
	});
    $('#radioDataType').html(html);

}
function drawChart() {
    var rdchecked;
    var rdText;
    var options;
    for(var i = 0 ; i < document.getElementsByName("radDataType").length ; i++){
        if(document.getElementsByName("radDataType")[i].checked){
            rdchecked = document.getElementsByName("radDataType")[i].value;
            rdText = document.getElementsByName('radName')[i].textContent;
        }
    }
    console.log("Xem biểu đồ của " + rdchecked);
    // var data = new google.visualization.DataTable();
    var dtforchart = [];
    dtforchart.push([{label: 'Ngày', type: 'date'},{label: rdText , type: 'number'}]);
    arrDataforCharts[rdchecked].forEach(function(dataitems){
        dtforchart.push([new Date(dataitems.date_create),dataitems.data_value]);
        /*Cần thêm giờ vào thời gian xem trên biểu đồ*/
    });
    if(dtforchart.length == 1){
    	var html = '';
    	html += "<strong>" + rdText + " không có dữ liệu đo trong thời gian này </strong>";
    	$("#displayerror").html(html);
		$("#displayerror").css("display","block");
    }
	var data = google.visualization.arrayToDataTable(dtforchart);
	options = {
        title: 'Biểu đồ theo dõi ' + rdText,
        vAxis: {
            title: arrDataTypeUnit[rdchecked]
        },
        height: 400,
        hAxis: {
            title: "Thời gian" ,
            gridlines: {
                count: -1,
                units: {
                  days: {format: ['MMM dd']},
                  hours: {format: ['HH:mm', 'ha']},
                }
            },
            minorGridlines: {
                units: {
                  hours: {format: ['hh:mm:ss a', 'ha']},
                  minutes: {format: ['HH:mm a Z', ':mm']}
                }
            }  
        }
    };
    var chart = new google.visualization.LineChart(document.getElementById('chart'));
    chart.draw(data, options);
}
//Ham block cac thanh phan khi load data
function blockContent(){
	$("#selectPROVINCE").prop("disabled", true);
	$("#selectDISTRICT1").prop("disabled", true);
	$("#selectDISTRICT").prop("disabled", true);
	$("#selectSTATION").prop("disabled", true);
	$("#selectSTATION1").prop("disabled", true);
	$("#selectSTATION2").prop("disabled", true);
	$("#selectSTATION3").prop("disabled", true);
	$("#selectWARD").prop("disabled", true);
	$("#selectWARD1").prop("disabled", true);
	$("#selectWARD2").prop("disabled", true);
	$("#selectREG2").prop("disabled", true);
	$("#selectREG").prop("disabled", true);
	$("#selectREG1").prop("disabled", true);
	$("#selectREG3").prop("disabled", true);
	$("#btnDisplayChart").prop("disabled", true);
}
function blockFormChart(){
	$("#start_date").prop("disabled", true);
	$("#end_date").prop("disabled", true);
	$("#btnXemBieuDo").prop("disabled", true);
	$("input[type=radio]").attr('disabled', true);

}
//Ham unblock cac thanh phan khi load xong data
function unblockContent(){
	$("#selectPROVINCE").prop("disabled", false);
	$("#selectDISTRICT1").prop("disabled", false);
	$("#selectDISTRICT").prop("disabled", false);
	$("#selectSTATION").prop("disabled", false);
	$("#selectSTATION1").prop("disabled", false);
	$("#selectSTATION2").prop("disabled", false);
	$("#selectSTATION3").prop("disabled", false);
	$("#selectWARD").prop("disabled", false);
	$("#selectWARD1").prop("disabled", false);
	$("#selectWARD2").prop("disabled", false);
	$("#selectREG2").prop("disabled", false);
	$("#selectREG").prop("disabled", false);
	$("#selectREG1").prop("disabled", false);
	$("#selectREG3").prop("disabled", false);
	$("#btnDisplayChart").prop("disabled", false); //Mở khóa nút xem biểu đồ
}
//Ham unblock khi load xong du lieu bieu do
function unblockFormChart(){
	$("#start_date").prop("disabled", false);
	$("#end_date").prop("disabled", false);
	$("#btnXemBieuDo").prop("disabled", false);
	$("input[type=radio]").attr('disabled', false);
}
//Ham dua gia tri vao bieu do
function initChart(){
	$("#displayerror").css("display","none"); //Khi chon loai du lieu khac thi tat thong bao loi
    google.charts.load('current', {'packages':['corechart'],'language': 'vi'});
    google.charts.setOnLoadCallback(drawChart);
}
//Ham de lay du lieu ve bieu do
function loadDATAforDrawCharts(conf,token,secu,start_date,end_date){ //state chi trang thai load 1: default 0: thuong
	var stationid = -1
		, pondid = -1
		,riverid = -1
		,address = '';
	stationid = stationSELECTED();
	drawCrt = 1;
	pondid = pondSELECTED();
	riverid = riverSELECTED();
	if(stationid != -1 && stationid != 0){
		address = conf + '/api/data/getbystation/' + stationid +'?dateStart=' + start_date + '&dateEnd=' + end_date;
		stationid = -1;
	}
	else if(pondid != -1  && stationid == 0){
		address = conf + '/api/data/getbyponddynamic/' + pondid +'?dateStart=' + start_date + '&dateEnd=' + end_date;
		pondid = -1;
	}
	else{
		address = conf + '/api/data/getbyriverdynamic/' + riverid +'?dateStart=' + start_date + '&dateEnd=' + end_date;
		riverid = -1;
	}
	jQuery.ajax({
		url: address,
		type: 'GET',
		headers: {'Authorization':secu + token},
		contentType: 'application/json; charset=utf-8',
		success: function(resultdata){
			arrDataType.forEach(function(dttt){
				arrDataforCharts.splice(0,1); //Ham splice go bo phan tu o vi tri 0 go di 1 phan tu
				arrDataforCharts[dttt.datatype_id] = [];
				resultdata.data.forEach(function(dta){
					if(dttt.datatype_id==dta.datatype_id){
						//Luu du lieu vao mang theo tung loai du lieu - ham unshift de them du lieu vao mang sap xep theo id
						moment.locale('vi');
						arrDataforCharts[dttt.datatype_id].unshift({date_create: moment(dta.data_createdDate).utc().format("MMMM D, YYYY HH:mm"),data_value:dta.data_value});
					}
				});	
			});
			console.log(arrDataforCharts);
			initChart(); //Goi ham ve bieu do
			drawCrt = 0;
			unblockFormChart();
			unblockContent();		
		},
		error: function(jqXHR,textStatus,errorThrown){
			displayError("Lỗi ! Không thể tải dữ liệu để hiển thị cho biểu đồ. Vui lòng tải lại trang");
		},
	});
}
//Ham thay doi khi thay loi lua chon xem bieu do.
function changeOnOffChart(conf,token,secu){
	if($("#btnDisplayChart").prop('checked')){ //Kiem tra neu nhu button toggle duoc chon la bat thi thuc hien
		setDefaultDisplayDate();
		showRadioDataType();
		var start_date,
			end_date;
		start_date = $("#start_date").data("DateTimePicker").date(); //Lấy dữ liệu từ input
		end_date = $("#end_date").data("DateTimePicker").date(); //Lấy dữ liệu từ input
		if((start_date == null) && (end_date == null)){
			end_date = new Date();/*Khởi tạo giá trị ngày hiện tại*/
	        start_date = new Date(end_date.getTime() - (1*86400000));  /*Khởi tạo giá trị ngày hiện tại cách ngày kết thúc 1 ngày*/
	        $("#end_date").datetimepicker('defaultDate',end_date); /*Set giá trị cho input nhập dữ liệu*/
	        $("#start_date").datetimepicker('defaultDate',start_date); /*Set giá trị cho input nhập dữ liệu*/
		}
		$("#displayChart").css("display","block");
		 //Hien thi xem bieu do
		$("input[type=radio]").attr('disabled', false);
		viewdependenceDate(conf,token,secu); //Goi ham ve bieu do
	}
	else{
		$("input[type=radio]").attr('disabled', true);
		$("#displayChart").css("display", "none");
		$('#start_date').datetimepicker('clear');
        $('#end_date').datetimepicker('clear');
	}
}
function viewdependenceDate(conf,token,secu){
	var start_date,
		end_date;
	/*
	* Khi thời gian xem dữ liệu không hợp lệ ta tiến hành gán lại thời gian xem dữ liệu
	* Cách 2 ngày kể từ ngày hiện tại
	*/
	start_date = $("#start_date").data("DateTimePicker").date(); //Lấy dữ liệu từ input
	end_date = $("#end_date").data("DateTimePicker").date(); //Lấy dữ liệu từ input
   	/*	Kiểm tra khi ngày bắt đầu và kết thúc rỗng	*/
    if((start_date == null) && (end_date == null)){
        end_date = new Date();/*Khởi tạo giá trị ngày hiện tại*/
        start_date = new Date(end_date.getTime() - (1*86400000));  /*Khởi tạo giá trị ngày hiện tại cách ngày kết thúc 1 ngày*/
        $("#end_date").datetimepicker('defaultDate',end_date); /*Set giá trị cho input nhập dữ liệu*/
        $("#start_date").datetimepicker('defaultDate',start_date); /*Set giá trị cho input nhập dữ liệu*/
        $("#displayerror").html("Ngày bắt đầu và ngày kết thúc rỗng");
        $("#displayerror").css("display","block");
    }
    else if(start_date == null){
        end_date = new Date(end_date); /*Convert ngày kết thúc trong input*/
        start_date = new Date(end_date.getTime() - (1*86400000));/*Khởi tạo giá trị ngày hiện tại cách ngày kết thúc 1 ngày*/
        $("#start_date").datetimepicker('defaultDate',start_date); /*Set giá trị cho input nhập dữ liệu*/
    	$("#displayerror").html("Ngày bắt đầu rỗng");
        $("#displayerror").css("display","block");
    }
    else if(end_date == null){
        end_date = new Date();/*Khởi tạo giá trị ngày hiện tại*/
        start_date = new Date(start_date); /*Convert ngày bắt đầu trong input*/
        $("#end_date").datetimepicker('defaultDate',end_date); /*Set giá trị cho input nhập dữ liệu*/
       	$("#displayerror").html("Ngày kết thúc rỗng");
      	$("#displayerror").css("display","block");
    }
    else if(start_date - end_date > 0){
    	end_date = new Date();/*Khởi tạo giá trị ngày hiện tại*/
        start_date = new Date(end_date.getTime() - (1*86400000));  /*Khởi tạo giá trị ngày hiện tại cách ngày kết thúc 1 ngày*/
        $("#end_date").datetimepicker('defaultDate',end_date); /*Set giá trị cho input nhập dữ liệu*/
        $("#start_date").datetimepicker('defaultDate',start_date); /*Set giá trị cho input nhập dữ liệu*/
    	$("#displayerror").html("Ngày không hợp lệ. Ngày bắt đầu không thể lớn hơn ngày kết thúc.");
      	$("#displayerror").css("display","block");
    }
    /*Kiểm tra nếu thời gian chọn xem dữ liệu lớn hơn 7 ngày thì thông báo chờ*/
    else if(end_date - start_date >= (7*86400000)){
    	start_date = new Date(start_date);
		end_date = new Date(end_date);
    	$("#displayerror").html("Thời gian bạn chọn xem dữ liệu quá lâu. Vui lòng chờ giây lát trong lúc tải dữ liệu");
    	$("#displayerror").css("display","block");
    	setTimeout(function() {
    		$("#displayerror").css("display","none");
    	}, 3000);
    }
    else{
        end_date = new Date(end_date);/*Convert ngày kết thúc trong input*/
        start_date = new Date(start_date);/*Convert ngày bắt đầu trong input*/
    }


    start_date = start_date.getFullYear() +"-"+ (start_date.getMonth()+1) + "-" + start_date.getDate() +" " + start_date.getHours() + ":" + start_date.getMinutes() + ":"+ start_date.getSeconds();
    end_date = end_date.getFullYear() +"-"+ (end_date.getMonth()+1) + "-" + end_date.getDate() +" " + end_date.getHours() + ":" + end_date.getMinutes() + ":"+ end_date.getSeconds();
	blockFormChart();
	blockContent();
	loadDATAforDrawCharts(conf,token,secu,start_date,end_date);
}
function displayError(stringText){
	$("#ErrorMessage").html(stringText);
	$("#ErrorMessage").css("display","block");
}
/******************CÁC HÀM SỬ DỤNG CHO ROUTES CHUYÊN GIA******************/