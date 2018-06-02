!(function(){
	angular.module('MyApp', [
		'ngAnimate',
		'Home',
		'About',
		'Contact'
	])
	.config(function($stateProvider, $urlRouterProvider, $compileProvider, layerProvider){
		$urlRouterProvider.otherwise('/home');
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
		console.log(layerProvider);
	})
})()