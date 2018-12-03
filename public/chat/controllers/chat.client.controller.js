angular.module('chat').controller('ChatController', ['$scope', 'Socket', 
  ($scope, Socket) => {
    $scope.messages = [];
    Socket.on('chatMessage', (message) => {
      $scope.messages.push(message);
    });

    $scope.sendMessage = function() {
      const message = {
        text: this.messageText,
      };
      Socket.emit('chatMessage', message);
      this.messageText = '';
    };

    $scope.$on('$destroy', () => {
      Socket.removeListener('chatMessage');
    });
  }
]);