angular.module('chat').config(['$routeProvider', ($routeProvider) => {
  $routeProvider.when('/chat', {
    templateUrl: 'chat/views/chat.client.view.html'
  });
}]);