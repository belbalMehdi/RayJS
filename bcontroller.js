app.controller('myController',function($scope,bService,dataService){
	$scope.hay = "hayController";
	dataService.numero = 5;
	dataService.setNum(100);
	var scripts = document.getElementsByTagName('script');
	var script = "";
	for(i in scripts){
		script += scripts[i].innerHTML;
	}
	function download(data, filename, type) {
	    var a = document.createElement("a"),
	        file = new Blob([data], {type: type});
	        var url = URL.createObjectURL(file);
	        a.href = url;
	        a.download = filename;
	        document.body.appendChild(a);
	        a.click(); 
	}
	//download(script,"hum.js",'js');
});