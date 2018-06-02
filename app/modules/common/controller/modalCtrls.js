!(function(angular){
	angular.module('Common')
	.controller('tipModalCtrl', function($scope, $uibModalInstance, modalParams, $timeout){
		$scope.tip = modalParams.tip;
		$scope.type = modalParams.type;
		$scope.close = function() {
			$uibModalInstance.close();
		};
		if($scope.type == 0){
			$timeout($scope.close, modalParams.time);
		}
	})
	.controller('confirmModalCtrl', function($scope, $uibModalInstance, modalParams, $timeout) {
		$scope.question = modalParams.question;
		$scope.sure = function() {
			$uibModalInstance.close();
		}

		$scope.close = function() {
			$uibModalInstance.dismiss();
		}
	})
	.controller('loadingModalCtrl', function($scope, modalParams){
		$scope.tips = modalParams.tips;
		console.log(modalParams.tips)
	})
})(angular)
