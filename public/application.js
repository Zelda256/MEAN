'use strict';

// 应用主模块名
let mainApplicationModuleName = 'mean';
// 创建应用主模块
let mainApplicationModule = angular.module(mainApplicationModuleName, ['ngResource', 'ngRoute', 'users', 'example', 'articles']);

// 配置URL模式
mainApplicationModule.config(['$locationProvider', 
  ($locationProvider) => {
    $locationProvider.hashPrefix('!');
  }
]);

// 修复Facebook跳转bug
if (window.location.hash === '#_=_') window.location.hash = '#!';

// 运用angular对象jqLite的功能对文档加载完成事件进行绑定
angular.element(document).ready(() => {
  // 通过执行angular.bootstrap方法来使刚刚创建的应用主模块对新创建的AngularJS应用进行初始化
  angular.bootstrap(document, [mainApplicationModuleName]);
});
