!(function(angular){
	angular.module('About', ['Common', 'ui.router'])
	.config(function($stateProvider, $urlRouterProvider){
		$stateProvider
		.state({
			name: 'about',
			url: '/about',
			templateUrl: 'modules/about/index.html'
		})
	})
})(angular)