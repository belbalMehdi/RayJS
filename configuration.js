app.config('conf',function($router) {
	$router.state({
		state:'app',
		url:'/app',
		templateUrl:'views/app.html'
	}).state({
		state:'home',
		url:'/home',
		templateUrl:'views/home.html'
	}).state({
		state:'act',
		url:'/act',
		templateUrl:'views/act.html'
	}).defaultState('app');
});