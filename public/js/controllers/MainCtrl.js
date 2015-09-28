angular.module('MainCtrl', ['CookieService']).controller('MainController', function($rootScope, $scope, $window, $http, $routeParams, cookie) {
    // if cookie is there, set application root scoped vars for my info
    if (cookie.read('user_id') !== null) {
        $rootScope.my_id = cookie.read('user_id');
        $http.get('/api/users/' + $rootScope.my_id).success(function(user) {
            console.log(user);
            $rootScope.my_avatar_url = user.avatar_url;
            $rootScope.my_username = user.username;
            $rootScope.myCourses = user.saved_course_ids;
            console.log($rootScope.myCourses);
        });

        $http.put('/api/users/' + $rootScope.my_id, { last_logged_on: Date.now() })
        .then(function(res) {});

        $http.get('/api/messages/top').success(function(res) {
            $scope.topPosts = res;
        });

        heartbeat();
    }


    // user's heartbeat, beats every 60 seconds
    function heartbeat() {
        pingServer();
        window.setInterval(function() {
            pingServer();
        },60000);
    }

    // user's heartbeat
    function pingServer() {
        $http.put('/api/users/' + $rootScope.my_id, { last_ping_from_user: Date.now() })
        .then(function(res) {});
    }


});
