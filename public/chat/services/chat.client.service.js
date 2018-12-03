angular.module('chat').service('Socket', ['Authentication', '$location', '$timeout', 
  function (Authentication, $lcoation, $timeout){
    if (Authentication.user) {
      this.socket = io();
    } else {
      $lcoation.path('/');
    }

    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, (data) => {
          $timeout(() => {
            callback(data);
          });
        });
      }
    };

    this.emit = function(eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    this.removeListener = function(eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }]
);