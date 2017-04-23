app.service('dataService',function($http){
	var numero = 0;
	var setNum = function(n){numero=n};
	var getNum = function(){return numero};

	return{
		getAman : function(call){
			return $http.get('data.json',call);
		},
		setNum : setNum,
		getNum : getNum
	}
});