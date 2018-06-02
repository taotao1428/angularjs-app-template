!(function(angular){

	var isObject    = angular.isObject,
		forEach     = angular.forEach,
		extend      = angular.extend,
		isFunction  = angular.isFunction,
		isUndefined = angular.isUndefined;

	layerProvider.$inject = [];

	angular.module('Common').provider('layer', layerProvider);

	function layerProvider() {
		var layerInfo = {},
			defaultConfig = {
				animation: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				size: 'sm',
				backdrop: true
			};
		/**
		 * 添加模态框
		 * @param {string}          name   模态框的名称，方便后面调用
		 * @param {object|function} config 配置，或者一个函数
		 */
		this.add = function(name, config) {
			if (isObject(name)) {
				config = name;
				name = config.name;
			}
			if (name in layerInfo) {
				throw new Error('模态框(\'' + name + '\')已经注册');
			}
			layerInfo[name] = config;
			return this;
		}

		this.setDefaultConfig = function(name, value) {
			if (isObject(name)) {
				extend(defaultConfig, name);
			} else {
				defaultConfig[name] = value;
			}
			return this;
		}

		this.$get = $get;
		$get.$inject = ['$uibModal'];

		function $get($uibModal) {
			var layer = {};

			registerModal(layerInfo);

			return layer;

			function registerModal(layerInfo) {
				forEach(layerInfo, function(config, name) {
					layer[name] = createModalFunction(name, config);
				})
			}

			function createModalFunction(name, config) {
				return function() {
					config = !isFunction(config) ? config : config.apply(undefined, arguments);
					config = extend({}, defaultConfig, {controller: name + 'ModalCtrl', windowClass: name + 'Modal'}, config);
					config.resolve = extend(config.resolve||{}, {modalParams: config.modalParams || {}});
					return $uibModal.open(config);
				}
			}
		}
	}
})(angular)

