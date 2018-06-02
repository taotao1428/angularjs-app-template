!(function(window, angular){
	var extend   = angular.extend,
		isObject = angular.isObject,
		forEach  = angular.forEach;


	function inherit(parent, extra) {
		return extend(new (extend(function(){}, {prototype: parent}))(), extra);
	}


	apiServiceProvider.$inject = [];

	angular.module('Common').provider('apiService', apiServiceProvider);

	function apiServiceProvider() {
		var apiServiceInfo = {}, //用于储存api数据
			serverUrl = window.origin, // 用于请求的基准api
			defaultConfig = {}, // 默认的配置
			successCode = 1; // 统一的成功码，用于判断请求的数据是否成功得到

		/**
		 * 注册api信息
		 * @param  {string} name   为api的名称，在apiService[name]可调用注册后的方法
		 * @param  {string} api    api的路径
		 * @param  {string} method 请求的方式，默认为GET
		 * @param  {object} config 默认的配置，参考$http的config
		 * @return {this}
		 */
		this.register = function(name, api, method, config) {
			// 检查api名称没有被注册
			if (name in apiServiceInfo) {
				throw new Error('name(\'' + name + '\')已经注册了！');
			}

			var info = isObject(api) ? api : {api: api, method: method, config: config};

			// 默认方法为GET
			info.method = (info.method || 'GET').toUpperCase();
			// 不支持jonsp方法
			if (info.method == 'JONSP') {
				throw new Error('暂时不支持jsonp方法');
			}
			apiServiceInfo[name] = info;

			return this; //链式
		}

		/**
		 * 设置默认的配置，在真正注册的时候会使用该方法
		 * @param {string|object} name  单个设置或者批量设置
		 * @param {any}           value 设置的值
		 */
		this.setDefaultConfig = function(name, value) {
			if (isObject(name)) {
				extend(defaultConfig, name);
			} else {
				defaultConfig[name] = value;
			}
			return this;
		}
		/**
		 * 设置基准url
		 */
		this.setServerUrl = function (url) {
			serverUrl = url;
			return this;
		}
		/**
		 * 设置成功码，默认为1
		 */
		this.setSuccessCode = function(code) {
			successCode = code;
			return this;
		}

		this.$get = $get;

		$get.$inject = ['$http', '$q'];

		function $get($http, $q) {
			var apiService = {};

			registerApiFunction(apiService);

			return apiService

			function registerApiFunction(apiService) {
				forEach(apiServiceInfo, function(info, name) {
					apiService[name] = createApi(info);
				})
			}

			function createApi(info) {
				var url = buildUrl(info.api);

				var options = extend({}, defaultConfig, {method: info.method, url: url}, info.config || {});

				if (needDataMethod(info.method)) {
					return function (data, config) {
						extend(options, config || {});
						options.data = inherit(options.data||{}, data);
						return httpPromise(options);
					}
				} else {
					return function (config) {
						extend(options, config || {});
						return httpPromise(options);
					}
				}
			}

			function needDataMethod(method) {
				return ['POST', 'PUT', 'PATCH'].indexOf(method) > -1;
			}

			function httpPromise(options) {
				return $http(options).then(successHandler, errHandler);
			}

			function successHandler(resp) {
				var data = resp.data;
				if (data.status != successCode) {
					return $q.reject(data.msg);
				} else {
					return $q.resolve(data.data);
				}
			}

			function errHandler(resp) {
				return $q.reject('服务器或网络错误');
			}

			function buildUrl(api) {
				if (api[0] != '/') {
					api = '/' + api;
				}
				return serverUrl + api;
			}
		}
	}
})(window, angular)

 