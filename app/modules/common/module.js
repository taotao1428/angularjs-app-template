!(function(angular){
	angular.module('Common', ['ui.bootstrap'])
	.config(function(layerProvider) {

		var templateBaseUrl = 'modules/common/tpl/',
			defaultTipsConfig = {
				templateUrl: templateBaseUrl + 'modal/tip.html', 
				controller: 'tipModalCtrl'
			},
			extend = angular.extend;

		function inherit(parent, extra) {
			return extend({}, parent, extra);
		}

		layerProvider
		// 添加确定框
		.add('confirm', function(question) {
			return {
				templateUrl: templateBaseUrl + 'modal/confirm.html',
				modalParams: {question: question}
			};
		})
		// 添加提示框
		.add('autoCloseTips', function(tip, time){
			time = time || 1000;
			return inherit(defaultTipsConfig, {modalParams: {tip: tip, type: 0, time: time}});
		})
		// 添加提示框
		.add('closableTips', function(tip){
			return inherit(defaultTipsConfig, {modalParams: {tip: tip, type: 1}});
		})
		// 添加提示框
		.add('fixedTips', function(tip){
			return inherit(defaultTipsConfig, {modalParams: {tip: tip, type: 2}});
		})
	})
})(angular)
