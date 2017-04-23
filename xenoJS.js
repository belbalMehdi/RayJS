var xenoJS = function(appName,dependencies){
	var include = function(dependencies){
			let event = new Event('jsLoaded');
			let nbrDependencies = dependencies.length;
			let dependenciesCounter = 0;
			let currentScript = document.currentScript;

			for(i in dependencies){
				let scriptXhr = new XMLHttpRequest();
				scriptXhr.open('GET',dependencies[i]+'.js');
				scriptXhr.addEventListener('load',function(){
					let dynamicScript = document.createElement('script');		
					let sc = document.createTextNode(scriptXhr.response);
					dynamicScript.appendChild(sc);
					document.body.insertBefore(dynamicScript,currentScript);
					dependenciesCounter++;
					if(dependenciesCounter>=nbrDependencies){
						a = document.dispatchEvent(event);
					}
				});
				scriptXhr.send(null);
			}
			return this;
	}

// Ajax Methods
	var $http = (function(){
		$get = function(url,callback,errorCallback=function(){}){
			var ajax = new XMLHttpRequest();
			ajax.open("get",url,true);
			ajax.addEventListener("load", function(){callback(JSON.parse(ajax.responseText))});
			ajax.addEventListener("error", function(){errorCallback(ajax.status)});
			ajax.send(null);
		}

		$post = function(url,data,callback,errorCallback=function(){}){
			var ajax = new XMLHttpRequest();
			ajax.open("post",url,true);
			ajax.setRequestHeader("Content-Type", "application/json");
			ajax.addEventListener("load", function(){callback(JSON.parse(ajax.responseText))});
			ajax.addEventListener("error", function(){errorCallback(ajax.status)});
			ajax.send(data);
		}

		$put = function(url,data,callback,errorCallback=function(){}){
			var ajax = new XMLHttpRequest();
			ajax.open("put",url,true);
			ajax.addEventListener("load", function(){callback(JSON.parse(ajax.responseText))});
			ajax.addEventListener("error", function(){errorCallback(ajax.status)});
			ajax.setRequestHeader("Content-Type", "application/json");
			ajax.send(data);
		}

		$delete = function(url,callback,errorCallback=function(){}){
			var ajax = new XMLHttpRequest();
			ajax.open("delete",url,true);
			ajax.addEventListener("load", function(){callback(JSON.parse(ajax.responseText))});
			ajax.addEventListener("error", function(){errorCallback(ajax.status)});
			ajax.setRequestHeader("Content-Type", "application/json");
			ajax.send(null);
		}

		return{
			'get' : $get,
			'post': $post,
			'put' : $put,
			'delete' : $delete
		}
	})();

	var $rootScope = [];

	var bind = function(controller)
	{
		$rootScope[controller] = [];
		var handler = {
			set : function(obj,prop,value){
					$rootScope[controller][prop] = value;
		    try {
		    	var o = document.querySelector("[x-controller="+controller+"]");
				o = o.querySelector("v[p="+prop+"]");
		    } catch (e) {
		    	console.log(e);
		    	console.error('binder '+prop+' in x-controller '+controller+' not found');
		    }
				if(o!=undefined)o.innerHTML = value;
				obj[prop] = value;
			},
			get : function(obj,prop){
				return obj[prop];
			}
		};
		var $scope = new Proxy({},handler);
		var v = document.querySelector("[x-controller="+controller+"]");
		if(v!=null) v = v.querySelectorAll("input[v]");
		if(v!=null){
			for(var i=0;i<v.length;i++)
			{
				v[i].addEventListener('keyup', function(e){
					$scope[e.target.getAttribute('v')] = e.target.value;
				})
			}
		}

		return{
			'$scope':$scope
		}
	};

	var router = (function()
	{
		var load = function(url){
			var xhr = new XMLHttpRequest();
			xhr.open('GET',url);
			xhr.addEventListener('load', function(){
				document.querySelector("ui").innerHTML = xhr.response;
			});
			xhr.send(null);
		}

		var defaultStateUrl = '';
		var states = [];

		var goState = function(state){
			for(i in states){
				if(state==states[i].state) window.location.hash = states[i].url;
			}
		}
		var state = function(pState){
			if(pState.hasOwnProperty('state')&&pState.hasOwnProperty('url')&&pState.hasOwnProperty('templateUrl'))
			states.push(pState);
			return this;
		}
		var defaultState = function(pDefaultState){
			defaultStateUrl = pDefaultState;
		}
		window.addEventListener('hashchange',function(e){
			for(p in states){
				if(window.location.hash == "#"+states[p].url) load(states[p].templateUrl);
			}
		});
		window.addEventListener('load',function(e){
			if(window.location.hash=='')goState(defaultStateUrl);
			else{			
				for(p in states){
					if(window.location.hash == "#"+states[p].url) load(states[p].templateUrl);
				}
			}
		});
		return{
			'state' : state,
			'defaultState' : defaultState,
			'goState' : goState,
			'load' : load
		}
	})();


	var $controllers = []; 
		var $injector = {
		'$scope' : bind.$scope,
		'$router' : router,
		'$http' : $http,
		'$rootScope' : $rootScope
		}
	var processInjector = function(callback,controllerScope){
		$injector.$scope = controllerScope;
		var params = [];
		fct = callback.toString()
		a = fct.indexOf('(',0);
		b = fct.indexOf(')',0);
		p = fct.substring(a+1, b);
		p = p.split(',');
		var call = '';
		if(p.length>0&&p[0]!="")
		{
			for(var i=0;i<p.length;i++)
			{
				call += '$injector.'+p[i];
				if(i<p.length-1) call += ',';
			}
		}
		return call;
	}
	var config = function(nom,callback){
		document.addEventListener('jsLoaded', function(){
				call = processInjector(callback);
				eval("callback("+call+")");
		})
		return this;
	}
	var service = function(nom,callback){
		document.addEventListener('jsLoaded', function(){
				call = processInjector(callback);
				$injector[nom] = eval("callback("+call+")");
		})
		return this;
	}
	var controller = function(nom,callback){
		document.addEventListener('jsLoaded', function(){
				$controllers[nom] = new bind(nom);
				call = processInjector(callback,$controllers[nom].$scope);
				eval("callback("+call+")");
		})
		return this;
	}

	return {
		config : config,
		controller : controller,
		service : service,
		include : include,
		$http : $http
	}
};