'use strict';

// 创建新的配置块
angular.module('example').config(['$routeProvider', ($routeProvider) => {
  // 创建路由
  $routeProvider
    .when('/', {
      templateUrl: '/example/views/example.client.view.html'
    })
    .otherwise({
      redirectTo: '/'
    });
}
]);