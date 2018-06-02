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
* `templateUrl`: {string} 弹出框的模板文件
* `controller`: {string|function} 弹出框的控制器名或控制器，
* `modalParams`: {object} 会注入到控制器的变量
* `size`: 'sm','md', 'lg' 弹出框的尺寸
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
```
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
