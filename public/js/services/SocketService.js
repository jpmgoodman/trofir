// singleton wrapper for socket.io
angular.module('SocketService', []).factory('socket', function($rootScope) {
    console.log('IN SOCKET SERVICE');
    var socket = io.connect();
    console.log(socket);
    return {
        on: function(eventName, callback) {
            console.log("---GOT MESSAGE---")
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, data, callback) {
            console.log("---EMIT MESSAGE---")
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});
