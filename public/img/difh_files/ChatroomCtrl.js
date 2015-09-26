angular.module('ChatroomCtrl', []).controller('ChatroomController', function($scope, $http) {

    $http.get('/api/users').success(function(res) {
        $scope.courseUsers = res;
    });

    $http.get('/api/courses').success(function(res) {
        $scope.allCourses = res;
    });

    $http.get('/api/messages').success(function(res) {
        $scope.allMessages = res;

        // HACK - delete and replace with angular directive
        var $chatBox = $('.chat-box');
        window.setTimeout(function() {
            $chatBox.scrollTop($chatBox[0].scrollHeight);
        },1)
    });

    // process the form
    $scope.sendMessage = function() {
        var messageJSON = JSON.stringify($scope.messageData);
        console.log('sending this: ' + messageJSON);
        $http.post('/api/messages', messageJSON).success(function(res) {
            console.log(res);

            var date = new Date();
    		var unixTime = date.getTime();
    		var message = $('.message-form > .send-message').val();
    		var msgObj = {
    			content: message,
    			time: unixTime
    		};
    		$('.message-form > .send-message').val('');
    		socket.emit('chat message', msgObj);

        });
    };

});
