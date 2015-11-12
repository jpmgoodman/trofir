angular.module('ChatroomCtrl', ['CookieService']).controller('ChatroomController', function($compile, $rootScope, $window, $scope, $http, $routeParams, cookie) {

    var courseId = $routeParams.course_id;
    var princetonId = '55d8565c54696be3d6f7cde6';
    var typing = false;
    var timeout = undefined;
    $rootScope.schoolId = princetonId;
    $rootScope.savedURL = '/#/princeton/' + courseId;
    $rootScope.courseId = courseId;

    if (cookie.read('user_id') === null) {
        $window.location.href = '/#/login';
    }
    else {

        console.log('in here');
        var socket = io.connect('', { forceNew: true });
        console.log('in new chatroom');
        $http.put('/api/users/' + $rootScope.my_id, { current_course_id: $rootScope.courseId })
        .then(function(res) {
            $http.get('/api/courses/' + courseId + '/users').success(function(res) {
                $scope.courseUsers = res;
            });
        });

        // tell course that it is active, change updated at field
        $http.put('/api/courses/' + courseId, {}).then(function(res) {
        });

        $http.get('/api/courses/' + courseId).success(function(res) {
            $scope.course = res;
        });

        // should go in main controller!
        $http.get('/api/courses').success(function(res) {
            $scope.allCourses = res;
        });

        $http.get('/api/courses/' + courseId + '/messages').success(function(res) {
            $scope.allMessages = res;
        });

        function timeoutFunction() {
            console.log('in timeout function');
            typing = false;
            socket.emit('user-typing-end', $rootScope.my_username, $rootScope.my_id, $rootScope.courseId);
        }

        $('.message-form > .send-message').keydown(function(e) {
            // don't do anything if not alphanumeric key
            if (!(e.keyCode >= 48 && e.keyCode <= 57) && !(e.keyCode >= 65 && e.keyCode <= 90))
            return;

            if (typing == false) {
                typing = true;
                socket.emit('user-typing-start', $rootScope.my_username, $rootScope.my_id, $rootScope.courseId);
                timeout = setTimeout(timeoutFunction, 3000);
            }
            else {
                clearTimeout(timeout);
                timeout = setTimeout(timeoutFunction, 3000);
            }
        });


        socket.on('user-typing-start', function(username, userID){
            console.log('got user typing start');

            $('.users-typing').show();
            var numTyping = $('.users-typing li').length;
            if (numTyping == 0) {
                $('.users-typing').prepend('<li data-id=' + userID + '>' + username + '</li>');
                $('.users-typing-suffix').show();
                $('.to-be.is').show();
            }
            else if (numTyping == 1) {
                $('.users-typing').prepend('<span class="conjunction"> and </span>')
                $('.users-typing').prepend('<li data-id=' + userID + '>' + username + '</li>');
                $('.to-be.is').hide();
                $('.to-be.are').show();
            }
            else {
                $('.users-typing').prepend('<li data-id=' + userID + '>' + username + '</li>, ');
            }

            var $chatBox = $('.chat-box');
            $chatBox.scrollTop($chatBox[0].scrollHeight);
        });

        socket.on('user-typing-end', function(username, userID) {
            console.log('typing over');

            $('ul.users-typing').find('[data-id="' + userID + '"]').remove();

            // must reorganize list elements
            var numTyping = $('ul.users-typing li').length;
            if (numTyping == 0)
            $('.users-typing-suffix').hide();
            else if (numTyping < 2) {
                $('.users-typing > .conjunction').remove();
                $('.to-be.are').hide();
                $('.to-be.is').show();
            }
            else {
                $('.to-be.is').hide();
                $('.to-be.are').show();
            }

            var reformatted = '';
            for (var i = 0; i < numTyping; i++) {
                var currUsername = $('ul.users-typing li')[i].innerHTML;
                var currUserID = $('ul.users-typing li')[i].dataset.id;
                var listEl = '<li data-id=' + currUserID + '>' + currUsername + '</li>';

                if (i < numTyping - 2)
                listEl += ', '
                else if (i == numTyping - 2)
                listEl += ' <span class="conjunction"> and </span> '

                reformatted += listEl;
            }

            $('ul.users-typing').html(reformatted);
        });


        $scope.newCourseSelect = function(course) {

            for (var i = 0; i < $rootScope.myCourses.length; i++) {
                if ($rootScope.myCourses[i]._id == course._id)
                return;
            }

            $rootScope.myCourses.unshift(course);
            $rootScope.myCourses.splice(-1,1);
            var myCourseIds = $rootScope.myCourses.map(function(obj) {
                return obj._id;
            });

            $http.put('/api/users/' + $rootScope.my_id, { saved_course_ids: myCourseIds })
            .then(function(res) {
                console.log(res);
            });
        }

        $scope.likeMessage = function(m_id, unlike) {
            console.log(unlike);
            var incAmt = 0;
            // like post
            if (!unlike) {
                $rootScope.myLikes.push(m_id);
                incAmt = 1;
            }
            // unlike post
            else {
                $rootScope.myLikes.splice($rootScope.myLikes.indexOf(m_id), 1);
                incAmt = -1;
            }

            $http.put('/api/users/' + $rootScope.my_id, { liked_message_ids: $rootScope.myLikes })
            .then(function(res) {
                console.log(res);
            });

            $http.put('/api/messages/' + m_id, { inc_amt: incAmt })
            .then(function(res) {
                console.log(res);
            })
        }



        // process the form
        $scope.sendMessage = function() {

            var message = $('.message-form > .send-message').val().trim();
            if (message.length < 1)
            return;

            clearTimeout(timeout);
            timeoutFunction();

            $('.message-form > .send-message').val('');

            $('.chat-box > .messages-container').append('\
            <div class="message clearfix">\
            <div class="message-avatar">\
            <img src=' + $rootScope.my_avatar_url + '>\
            </div>\
            <div class="message-content">\
            <div class="message-header">\
            <div class="username">' + $rootScope.my_username + '</div>\
            <div class="time">' + unixTimeToText(Date.now()) + '</div>\
            </div>\
            <div class="message-text">' + message + '</div>\
            </div>\
            </div>\
            ');

            // $('.chat-box > .messages-container').append('\
            // <div class="message clearfix">\
            // <div class="message-avatar">\
            // <img src=' + $rootScope.my_avatar_url + '>\
            // </div>\
            // <div class="message-content">\
            // <div class="message-header">\
            // <div class="username">' + $rootScope.my_username + '</div>\
            // <div class="time">' + unixTimeToText(Date.now()) + '</div>\
            // </div>\
            // <div class="message-text">' + message + '</div>\
            // </div>\
            // <div class="upvote">\
            // <i class="fa fa-heart"></i>\
            // <div class="score">0</div>\
            // </div>\
            // </div>\
            // ');

            var messageJSON =   {   content: $scope.messageData.content,
                user_id: $rootScope.my_id,
                course_id: $rootScope.courseId,
                school_id: $rootScope.schoolId
            };

            $http.post('/api/messages', messageJSON).then(function(res) {
                var date = new Date();
                var unixTime = date.getTime();
                console.log('posted this:');
                console.log(res.data.message._id);
                var msgObj = {
                    username: $rootScope.my_username,
                    avatar_url: $rootScope.my_avatar_url,
                    content: message,
                    time: unixTime,
                    msg_id: res.data.message._id
                };

                socket.emit('chat message', msgObj, courseId);
            });
        };

        socket.emit('add-user', courseId);

        socket.on('chat message', function(msgObj){

            // fb style tab notifications of new messages
            if (document.hidden) {
                document.title = "New message";
                var short = true;
                var interval = window.setInterval(function() {
                    document.title = short ? "(1) Trofir" : "New message";
                    short = !short;

                    if (!document.hidden) {
                        document.title = "Trofir";
                        window.clearInterval(interval);
                    }

                }, 3000);
            }


            var message = {
                _id: msgObj.msg_id,
                user_id: {
                    avatar_url: msgObj.avatar_url,
                    username: msgObj.username
                },
                created_at: msgObj.time,
                content: msgObj.content,
                score: 0
            }

            // $scope.message = message;
            //
            // $('.chat-box > .messages-container').append($compile('<chat-msg message="message"></chat-msg>')($scope));
            // $scope.$apply();

            $('.chat-box > .messages-container').append('\
            <div class="message clearfix" data-id=' + message._id +'>\
            <div class="message-avatar">\
                <img src=' + message.user_id.avatar_url +'>\
            </div>\
            <div class="message-content">\
                <div class="message-header">\
                    <div class="username">' + message.user_id.username + '</div>\
                    <div class="time">' + unixTimeToText(message.created_at) + '</div>\
                </div>\
                <div class="message-text">' + message.content +'</div>\
            </div>\
            </div>');

            var $chatBox = $('.chat-box');
            $chatBox.scrollTop($chatBox[0].scrollHeight);

        });



        // converts unix timestamp to text
        function unixTimeToText(unix_timestamp) {
            var date = new Date(unix_timestamp);
            var hours = date.getHours();

            var suffix = "AM";
            if (hours >= 12) {
                suffix = "PM";
                hours -= 12;
            }
            if (hours == 0) {
                hours = 12;
            }

            var minutes = "0" + date.getMinutes();
            var formattedTime = hours + ':' + minutes.substr(-2) + " " + suffix;

            return formattedTime;
        }



        $scope.$on("$destroy", function() {
            socket.emit('remove user', courseId);
        });
        window.onbeforeunload = function (event) {
            clearTimeout(timeout);
            timeoutFunction();
        }
    }



});
