//Ham thông báo khi vượt ngưỡng duoc goi khi dung socket cua lop RealTimePushNotificationForStation
function PushNotification(conf,token,secu,threshold_level,datatype_id,data_value,idStation){
	if(threshold_level > 0){
	 	var audio = new Audio('/audio/alarm-frenzy.mp3');
    	audio.play();
	 	/*Để ajax load trong hàm vì khi tách hàm thì không gọi api kịp*/
	    jQuery.ajax({
			url: conf + '/api/datatype/getbyid/'+datatype_id,
			type: 'GET',
			headers:{'Authorization': secu + token},
			contentType: 'application/json; charset=utf-8',
			success: function(resultdt){
				Push.create("CẢNH BÁO VƯỢT NGƯỠNG TẠI " + arrStationName[idStation], {
					body: "Độ đo " + resultdt.data.datatype_description + " có giá trị đo " + data_value + " vượt ngưỡng " + threshold_level,
					icon: {
				        x16: '/dist/img/icwarn2.png',
				        x32: '/dist/img/icwarn1.png'
				    },
					timeout: 4000,
					onClick: function () {
						window.focus();
						this.close();
					}
				});
			},
			error:function(jqXHR,error){
				displayError("Lỗi ! Không thể tải dữ liệu của các loại dữ liệu đo. Vui lòng tải lại trang");
			},
		});
	}
}

//Ham thông báo khi vượt ngưỡng duoc goi khi dung socket cua lop RealTimePushNotificationForPond
function PushNotificationForPond(conf,token,secu,threshold_level,datatype_id,data_value,idPond,notif_title){
	if(threshold_level > 0){
	 	var audio = new Audio('/audio/alarm-frenzy.mp3');
    	audio.play();  
	 	/*Để ajax load trong hàm vì khi tách hàm thì không gọi api kịp*/
	    jQuery.ajax({
			url: conf + '/api/datatype/getbyid/'+datatype_id,
			type: 'GET',
			headers:{'Authorization': secu + token},
			contentType: 'application/json; charset=utf-8',
			success: function(resultdt){
				Push.create(notif_title +  " TẠI " + arrPondDescription[idPond], {
					body: "Độ đo " + resultdt.data.datatype_description + " có giá trị đo " + data_value + " vượt ngưỡng " + threshold_level,
					icon: {
				        x16: '/dist/img/icwarn2.png',
				        x32: '/dist/img/icwarn1.png'
				    },
					timeout: 4000,
					onClick: function () {
						window.focus();
						this.close();
					}
				});
			},
			error:function(jqXHR,error){
				displayError("Lỗi ! Không thể tải dữ liệu của các loại dữ liệu đo. Vui lòng tải lại trang");
			},
		});
	}
}
/*Hàm xử lý dữ liệu cho thông báo các trạm ở ao*/
function processDataForNotiPond(conf,token,secu,data_id,threshold_level,notif_title){
	var dtvalue = 0;
	var datatypeid = '';
	var pondid = 0;
	queue.push(1);
	jQuery.ajax({
		url: conf + '/api/data/getbyid/' + data_id,
		contentType: 'application/json',
		headers:{'Authorization': secu + token},
		success: function(resultdata){
			dtvalue = resultdata.data.data_value;
			datatypeid = resultdata.data.datatype_id;
			pondid = resultdata.data.pond_id;
		},
		error: function(jqXHR,textStatus,errorThrown){
			displayError("Lỗi không thể load dữ liệu theo id. Vui lòng tải lại trang web");
		}
	}).complete(function(){
		queue.pop();
		if(queue.length == 0){
			console.log("Bật socket notifi_data_userid");
			PushNotificationForPond(conf,token,secu,threshold_level,datatypeid,dtvalue,pondid,notif_title);
		}
	});
}
/*Hàm trong lớp realtime*/
// cac tram va hien thong bao khi co tram nao do vuot nguong
class RealTimePushNotificationForStation{
	constructor(input){
		this.socket = input.sockt; //truyen ket noi socket tu ngoai vao file xemdodo.ejs
		// Khai báo phương thức cho đối tượng
		this.arrStation = input.arrSta;
		this.conf = input.conf;
		this.token = input.token;
		this.secu = input.secu;
		this.realTimePushNotification();
		console.log("Đã bật realtime thông báo ngưỡng cho trạm");
	}

	// Định nghĩa phương thức
	realTimePushNotification(){
		var _arrstt = this.arrStation;
		var _conf = this.conf;
		var _token = this.token;
		var _secu = this.secu;
		//duyet qua mang cac tram
		for(i in _arrstt){
			// console.log("Bình thường: "+_arrstt[i]);
			if(arrBlockStation.indexOf(_arrstt[i])  == -1){
				// console.log("Điều kiện if: " + _arrstt[i]);
				this.socket.on("station_data_1_" + _arrstt[i], function(dataresult){
					for (i in dataresult){
						PushNotification(_conf,_token,_secu,dataresult[i].threshold_level,dataresult[i].datatype_id,dataresult[i].data_value,dataresult[i].station_id);
					}
				});
			}
		}
		//ham PushNotification de hien thong bao
	}
}
//Lop thong bao cho ao qua nguong
class RealTimePushNotificationForPond{
	constructor(input){
		this.socket = input.sockt; //truyen ket noi socket tu ngoai vao file xemdodo.ejs
		// Khai báo phương thức cho đối tượng
		this.arrPond = input.arrPond;
		this.conf = input.conf;
		this.token = input.token;
		this.secu = input.secu;
		this.realTimePushNotificationForPond();
		console.log("Đã bật realtime thông báo ngưỡng cho ao");
	}

	// Định nghĩa phương thức
	realTimePushNotificationForPond(){
		var _arrpond = this.arrPond;
		var _conf = this.conf;
		var _token = this.token;
		var _secu = this.secu;
		//duyet qua mang cac tram
		for(i in _arrpond){
			this.socket.on("station_data_0_" + _arrpond[i], function(dataresult){
				for (i in dataresult){ 
					// PushNotificationForPond(_conf,_token,_secu,dataresult[i].threshold_level,dataresult[i].datatype_id,dataresult[i].data_value,dataresult[i].pond_id);
				}
			});
		}
		//ham PushNotification de hien thong bao
	}
}