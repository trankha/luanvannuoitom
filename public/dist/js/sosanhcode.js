/*Hàm hiển thị modal xem chi tiết dữ liệu*/
function showModalNoti(conf,token,secu,threshold_level,datatype_name,datatype_id,data_value,notif_title,stationid,datecreated,threshold_message,notif_id){
	checkReadNotifi(conf,token,secu,notif_id); /*Gọi hàm đổi trạng thái đọc thông báo*/
	$("#modal-title").text(notif_title);
	 
	
	var DateCreated = "Thời gian đo: " + moment(datecreated).utc().format('DD-MM-YYYY, HH:mm');
	var StationName = "Vị trí đo: " + arrStationName[stationid];
	var DataTypeName = "Loại dữ liệu: " + datatype_name;
	var DataValue = "Giá trị đo: " + data_value;
	var ThresholdLevel = "Ngưỡng: " + threshold_level;
	var ThresholdMessage = "Mô tả mức độ: " + threshold_message;
	$(".DateCreated").text(DateCreated);
	$(".StationName").text(StationName);
	$(".DataTypeName").text(DataTypeName);
	$(".DataValue").text(DataValue);
	$(".ThresholdLevel").text(ThresholdLevel);
	$(".ThresholdMessage").text(ThresholdMessage);
	$(".AdviceMessage").text(advice_message);
	$("#modalNotifi").modal('show');
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
		
		"notif_id": 4016,
      "threshold_id": 6,
      "data_id": 186440,
      "user_id": 4,
      "notif_title": "Test ngưỡng 6",
      "notif_createdDate": "2017-03-23T00:30:01.000Z",
      "region_id": 1,
      "notif_type": 0,
		
		success: function(resultdata){
			resultdata.data.forEach(function(data,index){
				html += '<li>';
				html +=  '<a href="" onclick='+showModalNoti(conf,token,secu,threshold_level,datatype_name,datatype_id,data_value,notif_title,stationid,datecreated,threshold_message,notif_id);+'>';
				html +=    '<i class="fa fa-users text-aqua"></i>' + data.notif_title + '</a>';
				html += '</li>';
			});
			$("#listNotification").html(html);
		},
		error: function(jqXHR,error,errorThrown){
      		// displayError("Lỗi ! Không thể tải danh sách cách sensor. Vui lòng tải lại trang");
  		},
	});
	$("#titlemessage").text(size + " thông báo mới nhất chưa đọc");
}