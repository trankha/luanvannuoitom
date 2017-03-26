class RealTime{
	constructor(input){
		// gán giá trị tham số truyền vào cho các thuộc tính của đối tượng
		this.idStation = input.idStation;
		this.dataTypes = input.dataTypes;
		this.idPond = input.idPond;
		this.idRiver = input.idRiver;
		this.StationNode = input.StationNode;
		this.conf = input.conf;
		this.token = input.token;
		this.secu = input.secu;
		// this.socket = io.connect("http://khaitran.xyz:3000");
		this.socket = input.sockt; //truyen ket noi socket tu ngoai vao file xemdodo.ejs
		// Khai báo phương thức cho đối tượng
		if(this.idStation != -1){
			console.log("class is created with idStation: " + this.idStation);
			this.realTime();
		}
		else if(this.idPond != -1){
			console.log("class is created with idPond: " + this.idPond);
			this.realTime1();
		}
		else{
			console.log("class is created with idRiver: " + this.idRiver);
			this.realTime2();
		}
	}
	//Ham realTime de nghe socket cua tram
	//ham realTime1 de nghe socket cua ao
	// Định nghĩa phương thức
	realTime(){
		// Khai báo mảng _arrDtType gán giá trị của thuộc tích dataTypes của đối tượng vào
		// lý do để không gây hiểu lầm khi sử dụng this.dataType bên trong this.socket gây mất giá trị
		var _arrDtType = this.dataTypes;
		var _stationid = this.idStation;
		var StationNode = this.StationNode;
		this.socket.on("station_data_1_" + _stationid, function(data){	
			var html = "";
			var datecreated;
			var _arrData = [],
				data_value;
			// chuẩn bị mảng json kết quả nhận dc từ sự kiện socket
			for (i in data){ 
				_arrData[data[i].datatype_id] = data[i];
				
				console.log("Data type: "+data[i].datatype_id+" - Data value:" +data[i].data_value + " - Threshsold: " +data[i].threshold_level);
			}
			/* Duyệt qua từng loại dữ liệu để lấy giá trị*/
			for(i in StationNode){
				html+="<tr>";
				_arrDtType[StationNode[i]].forEach(function(arrdatatype,index){
					if(_arrData.hasOwnProperty(StationNode[i])){
						data_value = _arrData[StationNode[i]].data_value;
						if(arrDataforCharts.length != 1){
							arrDataforCharts[StationNode[i]].shift();
							arrDataforCharts[StationNode[i]].push({date_create: moment(_arrData[StationNode[i]].data_createdDate).utc().format("YYYY-MM-DD HH:mm:ss"),data_value:_arrData[StationNode[i]].data_value});
						}
						datecreated = moment(_arrData[StationNode[i]].data_createdDate).utc().format('DD-MM-YYYY, h:mm');
						//ham if kiem tra neu qua nguong thi doi mau
						if(_arrData[StationNode[i]].threshold_level == 1){
							html+= "<td style='color:#D0461F;'>" + arrdatatype.datatype_name +
							"</td>";
							html += "<td style='font-weight:bold;color:#D0461F;'>";
							html += data_value;
							html += "</td>";
							html+= "<td style='color:#D0461F;'>" + arrdatatype.datatype_unit +
							"</td>";
							html += "<td style='color:#D0461F;'>";
							html += datecreated + "</td>";
						}
						else if(_arrData[StationNode[i]].threshold_level == 2){
							html+= "<td style='color:#C42D2D;'>" + arrdatatype.datatype_name +
							"</td>";
							html += "<td style='font-weight:bold;color:#C42D2D;'>";
							html += data_value;
							html += "</td>";
							html+= "<td style='color:#C42D2D;'>" + arrdatatype.datatype_unit +
							"</td>";
							html += "<td style='color:#C42D2D;'>";
							html += datecreated + "</td>";
						}
						else if(_arrData[StationNode[i]].threshold_level == 3){
							html+= "<td style='color:#CC2C2C;'>" + arrdatatype.datatype_name +
							"</td>";
							html += "<td style='font-weight:bold;color:#CC2C2C;'>";
							html += data_value
							html += "</td>";
							html+= "<td style='color:#CC2C2C;'>" + arrdatatype.datatype_unit +
							"</td>";
							html += "<td style='color:#CC2C2C;'>";
							html += datecreated + "</td>";
						}
						else if(_arrData[StationNode[i]].threshold_level == 4){
							html+= "<td style='color:#D90505;'>" + arrdatatype.datatype_name +
							"</td>";
							html += "<td style='font-weight:bold;color:#D90505;'>";
							html += data_value
							html += "</td>";
							html+= "<td style='color:#D90505;'>" + arrdatatype.datatype_unit +
							"</td>";
							html += "<td style='color:#D90505;'>";
							html += datecreated + "</td>";
						}
						else{
							html+= "<td style='color:black;'>" + arrdatatype.datatype_name +
							"</td>";
							html += "<td style='font-weight:bold;color:black;'>" + data_value + "</td>";
							html+= "<td style='font-size:18px;color:black;'>" + arrdatatype.datatype_unit +
							"</td>";
							html += "<td style='color:black;'>";
							html += datecreated + "</td>";
						}
					}
					else{
						html+= "<td style='color:black;'>" + arrdatatype.datatype_name +
							"</td>";
						html += "<td style='font-weight:bold;color:black;'>- -</td>";
						html+= "<td style='font-size:18px;color:black;'>" + arrdatatype.datatype_unit +
						"</td>";
						html += "<td style='color:black;'>";
						html += "- -</td>";
					}
					html+="</tr>";
				});
			}
			if(_stationid == $("#selectSTATION1").val() || _stationid == $("#selectSTATION2").val() || _stationid == $("#selectSTATION3").val() || _stationid == $("#selectSTATION").val()){
				console.log(drawCrt);
				$("#hienthi").html(html);
				if(arrDataforCharts.length != 1){
					//Kiem tra neu dang load du lieu ve bieu do thi chờ 1 giây mới vẽ tiếp
					if(drawCrt == 1){
						setInterval(function(){
							initChart();
						}, 1000);
					}
					else{
						initChart();
					}	
				}
			}
		});	
	}
	realTime1(){
		// Khai báo mảng _arrDtType gán giá trị của thuộc tích dataTypes của đối tượng vào
		// lý do để không gây hiểu lầm khi sử dụng this.dataType bên trong this.socket gây mất giá trị
		var _arrDtType = this.dataTypes;
		var _pondid = this.idPond;
		var datecreated;
		this.socket.on("station_data_0_" + _pondid, function(data){	
			var html = "";
			var _arrData = [],
				data_value;
			// chuẩn bị mảng json kết quả nhận dc từ sự kiện socket
			// chuẩn bị mảng json kết quả nhận dc từ sự kiện socket
			for (i in data){ 
				_arrData[data[i].datatype_id] = data[i];
				
				console.log("Data type: "+data[i].datatype_id+" - Data value:" +data[i].data_value + " - Threshsold: " +data[i].threshold_level);
			}
			// Duyệt qua từng loại dữ liệu để lấy giá trị
			for(i in StationNode){
				html+="<tr>";
				_arrDtType[StationNode[i]].forEach(function(arrdatatype,index){
					if(_arrData.hasOwnProperty(StationNode[i])){
						data_value = _arrData[StationNode[i]].data_value;
						if(arrDataforCharts.length != 1){
							arrDataforCharts[StationNode[i]].shift();
							arrDataforCharts[StationNode[i]].push({date_create: moment(_arrData[StationNode[i]].data_createdDate).utc().format("YYYY-MM-DD HH:mm:ss"),data_value:_arrData[StationNode[i]].data_value});
						}
						datecreated = moment(_arrData[StationNode[i]].data_createdDate).utc().format('DD-MM-YYYY, h:mm a');
						//ham if kiem tra neu qua nguong thi doi mau
						if(_arrData[StationNode[i]].threshold_level == 1){
							html+= "<td style='font-weight:bold;font-size:18px;color:#D0461F;'>" + arrdatatype.datatype_name +
							"</td>";
							html += "<td style='font-weight:bold;font-size:18px;color:#D0461F;'>";
							html += "<img src='/dist/img/icwarning2.png' title='icon'>"+ data_value;
							html += "</td>";
							html+= "<td style='font-weight:bold;font-size:18px;color:#D0461F;'>" + arrdatatype.datatype_unit +
							"</td>";
							html += "<td style='font-weight:bold;font-size:18px;color:#D0461F;'>";
							html += datecreated + "</td>";
						}
						else if(_arrData[StationNode[i]].threshold_level == 2){
							html+= "<td style='font-weight:bold;font-size:18px;color:#C42D2D;'>" + arrdatatype.datatype_name +
							"</td>";
							html += "<td style='font-weight:bold;font-size:18px;color:#C42D2D;'>";
							html += "<img src='/dist/img/icwarning2.png' title='icon'>" + data_value;
							html += "</td>";
							html+= "<td style='font-weight:bold;font-size:18px;color:#C42D2D;'>" + arrdatatype.datatype_unit +
							"</td>";
							html += "<td style='font-weight:bold;font-size:18px;color:#C42D2D;'>";
							html += datecreated + "</td>";
						}
						else if(_arrData[StationNode[i]].threshold_level == 3){
							html+= "<td style='font-weight:bold;font-size:18px;color:#CC2C2C;'>" + arrdatatype.datatype_name +
							"</td>";
							html += "<td style='font-weight:bold;font-size:18px;color:#CC2C2C;'>";
							html += "<img src='/dist/img/icwarning2.png' title='icon'>" + data_value
							html += "</td>";
							html+= "<td style='font-weight:bold;font-size:18px;color:#CC2C2C;'>" + arrdatatype.datatype_unit +
							"</td>";
							html += "<td style='font-weight:bold;font-size:18px;color:#CC2C2C;'>";
							html += datecreated + "</td>";
						}
						else if(_arrData[StationNode[i]].threshold_level == 4){
							html+= "<td style='font-weight:bold;font-size:18px;color:#D90505;'>" + arrdatatype.datatype_name +
							"</td>";
							html += "<td style='font-weight:bold;font-size:18px;color:#D90505;'>";
							html += "<img src='/dist/img/icwarning2.png' title='icon'>"+ data_value
							html += "</td>";
							html+= "<td style='font-weight:bold;font-size:18px;color:#D90505;'>" + arrdatatype.datatype_unit +
							"</td>";
							html += "<td style='font-weight:bold;font-size:18px;color:#D90505;'>";
							html += datecreated + "</td>";
						}
						else{
							html+= "<td style='font-weight:bold;font-size:18px;color:black;'>" + arrdatatype.datatype_name +
							"</td>";
							html += "<td style='font-weight:bold;font-size:18px;color:black;'>" + data_value + "</td>";
							html+= "<td style='font-weight:bold;font-size:18px;color:black;'>" + arrdatatype.datatype_unit +
							"</td>";
							html += "<td style='font-weight:bold;font-size:18px;color:black;'>";
							html += datecreated + "</td>";
						}
					}
					else{
						html+= "<td style='font-weight:bold;font-size:18px;color:black;'>" + arrdatatype.datatype_name +
							"</td>";
						html += "<td style='font-weight:bold;font-size:18px;color:black;'>- -</td>";
						html+= "<td style='font-weight:bold;font-size:18px;color:black;'>" + arrdatatype.datatype_unit +
						"</td>";
						html += "<td style='font-weight:bold;font-size:18px;color:black;'>";
						html += "- -</td>";
					}
					html+="</tr>";
				});
			}
			if(_pondid == $("#selectPOND1").val() || _pondid == $("#selectPOND2").val() || _pondid == $("#selectPOND3").val() || _pondid == $("#selectPOND").val()){
				$("#hienthi").html(html);
				console.log(drawCrt);
				if(arrDataforCharts.length != 1){
					if(drawCrt != 1){
						initChart();
					}	
				}
			}
		});
	}
	realTime2(){
		// Khai báo mảng _arrDtType gán giá trị của thuộc tích dataTypes của đối tượng vào
		// lý do để không gây hiểu lầm khi sử dụng this.dataType bên trong this.socket gây mất giá trị
		var _arrDtType = this.dataTypes;
		var _riverid = this.idRiver;
		this.socket.on("station_data_2_" + _riverid, function(data){	
			var html = "";
			var _arrData = [],
				data_value;
			// chuẩn bị mảng json kết quả nhận dc từ sự kiện socket
			// chuẩn bị mảng json kết quả nhận dc từ sự kiện socket
			for (i in data){ 
				_arrData[data[i].datatype_id] = data[i];
				
				console.log("Data type: "+data[i].datatype_id+" - Data value:" +data[i].data_value + " - Threshsold: " +data[i].threshold_level);
			}
			// Duyệt qua từng loại dữ liệu để lấy giá trị
			for(i in StationNode){
				html+="<tr>";
				_arrDtType[StationNode[i]].forEach(function(arrdatatype,index){
					if(_arrData.hasOwnProperty(StationNode[i])){
						data_value = _arrData[StationNode[i]].data_value;
						if(arrDataforCharts.length != 1){
							arrDataforCharts[StationNode[i]].shift();
							arrDataforCharts[StationNode[i]].push({date_create: moment(_arrData[StationNode[i]].data_createdDate).utc().format("YYYY-MM-DD HH:mm:ss"),data_value:_arrData[StationNode[i]].data_value});
						}
						datecreated = moment(_arrData[StationNode[i]].data_createdDate).utc().format('DD-MM-YYYY, h:mm a');
						//ham if kiem tra neu qua nguong thi doi mau
						if(_arrData[StationNode[i]].threshold_level == 1){
							html+= "<td style='font-weight:bold;font-size:18px;color:#D0461F;'>" + arrdatatype.datatype_name +
							"</td>";
							html += "<td style='font-weight:bold;font-size:18px;color:#D0461F;'>";
							html += "<img src='/dist/img/icwarning2.png' title='icon'>"+ data_value;
							html += "</td>";
							html+= "<td style='font-weight:bold;font-size:18px;color:#D0461F;'>" + arrdatatype.datatype_unit +
							"</td>";
							html += "<td style='font-weight:bold;font-size:18px;color:#D0461F;'>";
							html += datecreated + "</td>";
						}
						else if(_arrData[StationNode[i]].threshold_level == 2){
							html+= "<td style='font-weight:bold;font-size:18px;color:#C42D2D;'>" + arrdatatype.datatype_name +
							"</td>";
							html += "<td style='font-weight:bold;font-size:18px;color:#C42D2D;'>";
							html += "<img src='/dist/img/icwarning2.png' title='icon'>" + data_value;
							html += "</td>";
							html+= "<td style='font-weight:bold;font-size:18px;color:#C42D2D;'>" + arrdatatype.datatype_unit +
							"</td>";
							html += "<td style='font-weight:bold;font-size:18px;color:#C42D2D;'>";
							html += datecreated + "</td>";
						}
						else if(_arrData[StationNode[i]].threshold_level == 3){
							html+= "<td style='font-weight:bold;font-size:18px;color:#CC2C2C;'>" + arrdatatype.datatype_name +
							"</td>";
							html += "<td style='font-weight:bold;font-size:18px;color:#CC2C2C;'>";
							html += "<img src='/dist/img/icwarning2.png' title='icon'>" + data_value
							html += "</td>";
							html+= "<td style='font-weight:bold;font-size:18px;color:#CC2C2C;'>" + arrdatatype.datatype_unit +
							"</td>";
							html += "<td style='font-weight:bold;font-size:18px;color:#CC2C2C;'>";
							html += datecreated + "</td>";
						}
						else if(_arrData[StationNode[i]].threshold_level == 4){
							html+= "<td style='font-weight:bold;font-size:18px;color:#D90505;'>" + arrdatatype.datatype_name +
							"</td>";
							html += "<td style='font-weight:bold;font-size:18px;color:#D90505;'>";
							html += "<img src='/dist/img/icwarning2.png' title='icon'>"+ data_value
							html += "</td>";
							html+= "<td style='font-weight:bold;font-size:18px;color:#D90505;'>" + arrdatatype.datatype_unit +
							"</td>";
							html += "<td style='font-weight:bold;font-size:18px;color:#D90505;'>";
							html += datecreated + "</td>";
						}
						else{
							html+= "<td style='font-weight:bold;font-size:18px;color:black;'>" + arrdatatype.datatype_name +
							"</td>";
							html += "<td style='font-weight:bold;font-size:18px;color:black;'>" + data_value + "</td>";
							html+= "<td style='font-weight:bold;font-size:18px;color:black;'>" + arrdatatype.datatype_unit +
							"</td>";
							html += "<td style='font-weight:bold;font-size:18px;color:black;'>";
							html += datecreated + "</td>";
						}
					}
					else{
						html+= "<td style='font-weight:bold;font-size:18px;color:black;'>" + arrdatatype.datatype_name +
							"</td>";
						html += "<td style='font-weight:bold;font-size:18px;color:black;'>- -</td>";
						html+= "<td style='font-weight:bold;font-size:18px;color:black;'>" + arrdatatype.datatype_unit +
						"</td>";
						html += "<td style='font-weight:bold;font-size:18px;color:black;'>";
						html += "- -</td>";
					}
					html+="</tr>";
				});
			}
			if(_riverid == $("#selectRIVER1").val() || _riverid == $("#selectRIVER2").val() || _riverid == $("#selectRIVER3").val() || _riverid == $("#selectRIVER").val()){
				$("#hienthi").html(html);
				if(drawCrt != 1){
					initChart();
				}	
			}
		});
	}
}
// Lop RealTimePushNotification chua ham  realTimePushNotification thuc hien viec nghe socket tat ca
class RealTimePushNotificationForStation{
	constructor(input){
		this.socket = input.sockt; //truyen ket noi socket tu ngoai vao file xemdodo.ejs
		// Khai báo phương thức cho đối tượng
		this.arrStation = input.arrStation2;
		this.conf = input.conf;
		this.token = input.token;
		this.secu = input.secu;
		this.realTimePushNotificationForStation();
		console.log("Đã bật realtime thông báo ngưỡng cho trạm");
	}

	// Định nghĩa phương thức
	realTimePushNotificationForStation(){
		//nghe vượt ngưỡng của sông
		var arrStation = this.arrStation;
		var conf = this.conf;
		var token = this.token;
		var secu = this.secu;
		//duyet qua mang cac tram
		/*Đã xử lý chưa test*/
		for(i in arrStation2){
			this.socket.on("notifi_data_" + arrStation2[i], function(dataresult){
				console.log(dataresult);
				processDataForNotiStation(conf,token,secu,dataresult.data_id,dataresult.threshold_id,dataresult.threshold_level,dataresult.notif_title,dataresult.notif_id,dataresult.region_id,dataresult.notif_createdDate);
			});
		}
	}
}