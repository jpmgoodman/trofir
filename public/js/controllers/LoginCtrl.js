angular.module('LoginCtrl', ['CookieService']).controller('LoginController', function($rootScope, $window, $http, cookie) {

    $('input').focus();

    var redirectURL = $rootScope.savedURL;
    if (redirectURL === null) redirectURL = '/#/princeton';

    var school_id = $rootScope.schoolId;
    if (school_id === null) school_id = '55d8565c54696be3d6f7cde6';

    var current_course_id = $rootScope.courseId;
    if (current_course_id === null) current_course_id = '55de97b81945292f11ea96cb';

    $('form').submit(function() {
        var username = $('input').val();

        if (username.trim().length < 1)
        return;

        $('input').attr('disabled', 'true');
        username = username.trim();

        $http.get('/api/courses/active').success(function(res) {
            var active_course_ids = [];
            for (var i = 0; i < res.length; i++) {
                active_course_ids.push(res[i]._id);
            }

            var userJSON = { username: username, school_id: school_id,
                current_course_id: current_course_id,
                saved_course_ids: active_course_ids };

                $http.post('/api/users', userJSON).then(function(res) {

                    console.log(res.data);
                    cookie.set('user_id', res.data.user._id);
                    $rootScope.my_id = res.data.user._id;
                    $rootScope.my_username = res.data.user.username;
                    $rootScope.my_avatar_url = res.data.user.avatar_url;
                    $rootScope.myCourses = res.data.saved_course_ids;
                    $rootScope.myLikes = [];
                    heartbeat();
                    $window.location.href = redirectURL;


                });
            });
        });


        // PUT INTO SERVICE!!!
        // user's heartbeat, beats every 60 seconds
        function heartbeat() {
            pingServer();
            window.setInterval(function() {
                pingServer();
            },60000)
        }

        // user's heartbeat
        function pingServer() {
            $http.put('/api/users/' + $rootScope.my_id, { last_ping_from_user: Date.now() })
            .then(function(res) {});
        }


    });
