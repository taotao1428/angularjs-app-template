!(function(angular){
	angular.module('Contact', ['Common', 'ui.router'])
	.config(function($stateProvider, $urlRouterProvider){
		$stateProvider
		.state({
			name: 'contact',
			url: '/contact',
			templateUrl: 'modules/contact/index.html'
		})
	})
})(angular)