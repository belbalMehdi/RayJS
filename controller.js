app.controller('ccl',function($scope,dataService){

	console.log(dataService.getNum());
	$scope.data = dataService.getAman(function(data){
				$scope.data = data.name;
			});

	$scope.khra = {};
});