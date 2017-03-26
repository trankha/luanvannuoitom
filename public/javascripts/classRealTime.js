class RealTime(){
	constructor(input){
		this.idStation = input.idStation;
		// this.data = $(input).data;

		this.realTime();
		console.log("class is created!");
	}

	realTime(){
		socket.on("station_data_" + this.idStation, function(data){	
			console.log(this.idStation);
			console.log(data);
		});
	}
}