# angularjs-app-template
根据自己的开发习惯做的angularjs应用开发脚手架。这个应用使用ui-router做路由，基于angular-boostrap库构建了layer服务，也搭建了一个apiService服务。


## 整体介绍
为了实现模块化的设计思想，在文件的结构设计上采用模块组装的形式，每个路由代表一个模块，每个模块可以嵌入子模块。
每个模块的结构
```txt
模块
|--modules      // 子模块
|----sub-module1
|----sub-module2

|--controller   // 控制器文件
|----xxxxCtrl.js
|----xxxxCtrl2.js

|--service      // 服务文件
|----xxxx1.js
|----xxxx2.js

|--directive    // 指令文件
|----xxxx3.js

|--css // css文件
|----xxxx3.scss 

|--index.html   // 模块主页
|--module.js    // 模块定义文件
```
## layer服务介绍
因为弹出框是网页必不可少的元素，可以作为确认框，提示框，登录框以及更加复杂的弹出框。layer服务是借助angular-boostrap的模态框实现的。为了让各个模块可以根据自己的需求注册弹出框。我将layer服务写成provider的形式，这样每个模块就可以通过layerProvider注册自己的模块。

### 需要配置的参数
* `templateUrl`: {string} **必须**弹出框的模板文件
* `controller`: {string|function} 弹出框的控制器名或控制器，默认为`name + 'ModalCtrl'`。例如注册名为`tips`, 那默认控制器为`tipsModalCtrl`
* `modalParams`: {object} 会注入到控制器的变量，默认为`{}`
* `size`: 'sm','md', 'lg' 弹出框的尺寸，默认为`sm`
* `windowClass`: {string} 在弹出框上加的类名，方便写样式
* 其他的可以参考[angular-bootstrap](http://angular-ui.github.io/bootstrap/)

### 注册的实现代码
```javascript
/**
 * 添加模态框
 * @param {string}          name   模态框的名称，方便后面调用
 * @param {object|function} config 配置，或者一个能返回配置的函数
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
```
### 注册的案例
```javascript
!(function(angular){
  angular.module('Common', ['ui.bootstrap'])
  .config(function(layerProvider) {

    var templateBaseUrl = 'modules/common/tpl/';
    layerProvider
    // 添加确定框
    .add('confirm', function(question) {
      return {
        templateUrl: templateBaseUrl + 'modal/confirm.html',
        modalParams: {question: question}
      };
    })
  })
})(angular)
```

### 使用方法
```javascript
!(function(angular) {
  angular.module('Home')
  .controller('homeCtrl', function($scope, layer) {

    var confirm = layer.confirm("是否继续？");
    confirm.result.then(function(){
      console.log("确定继续");
    }, function(){
      console.log("取消");
    });
  })
})(angular)
```

## apiSevice介绍
前后端分离后，api层是网站必不可少的一部分。同样为能让每个模块方便的注册自己的api，我也是使用`provider`的方式注册`apiService`。因为我一般在后台设计的接口中，如果请求被服务器接收，但是因为提交的数据有问题，或者数据库操作错误，我返回的json数据中给定一个状态码，和一个错误信息字段。  

返回数据如下：  
```json
{
  "status" : -1,
  "msg" : "用户名已存在",
  "data" : {}
}
```
由于没有使用http协议的状态码，所以$http不能根据json数据中的status判断是否正确的获得了数据，所以我在$http的resolve中进一步处理结果。这样，如果请求成功，并且成功得到结果，apiService将可以直接resolve到数据；如果是请求失败或者请求没有成功得到结果，apiService将reject失败的原因。这样可以避免每次调用apiService时都要处理resp才能得到data；
```
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
```

### 注册api
在每个模块的config函数中
```javascript
!(function(angular){
  angular.module('Home', ['Common'])
  .config(function(apiServiceProvider){
    apiServiceProvider
    .register('getBlogs', 'blog/list')
    .register('addBlog', 'blog/add', 'post');
    
    // apiServiceProvider.setSuccessCode(100); // 可以设置成功码，默认为1
    // apiServiceProvider.setDefaultConfig(config) // 设置默认的config
   })
})(angular)
```
register的参数说明
```javascript
/**
 * 注册api信息
 * @param  {string} name   为api的名称，在apiService[name]可调用注册后的方法
 * @param  {string} api    api的路径，或者是参数对象
 * @param  {string} method 请求的方式，默认为GET
 * @param  {object} config 默认的配置，参考$http的config，默认为{}
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
```
### 使用方法
```javascript
!(function(angular) {
  angular.module('Home')
  .controller('homeCtrl', function($scope, apiService) {

    apiService.getBlogs().then(function(blog){
      console.log(blog);
    }, function(msg){
      console.log('获取数据失败，原因：' + msg);
    });
    apiService.addBlog({title: '我是博客'});
  })
})(angular)
```
