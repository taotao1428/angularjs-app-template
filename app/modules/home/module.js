!(function(angular){
	angular.module('Home', ['Common', 'ui.router', 'ngResource'])
	.config(function($stateProvider, $urlRouterProvider, apiServiceProvider){
		$stateProvider
		.state({
			name: 'home',
			url: '/home',
			templateUrl: 'modules/home/index.html'
		});

		apiServiceProvider
		.register('getBlogs', 'blog/list')
		.register('addBlog', 'blog/add', 'post');
	})
})(angular)