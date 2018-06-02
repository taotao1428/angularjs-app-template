!(function(angular) {
	angular.module('Home')
	.controller('homeCtrl', function($scope, apiService, layer, $resource) {

		//apiService.getBlogs();
		//apiService.addBlog({title: '我是博客'});

		$scope.open = function () {
			layer.autoCloseTips('aa');
		}

		$scope.confirm = function() {
			var confirm = layer.confirm('dakai');
			confirm.result.then(function(){console.log('queding')}, function(){console.log('quxiao')});
		}

		var blog = $resource('blog/:id');
		blog.get({id: 10}).$promise.then(function(resp){
			console.log(resp);
		}, function(resp) {
			console.log(resp);
		})
	})
})(angular)