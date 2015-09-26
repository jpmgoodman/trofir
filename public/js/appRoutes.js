angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider
		.when('/', {
			templateUrl: 'views/splash.html'
		})
		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'LoginController'
		})
		.when('/princeton/:course_id', {
			templateUrl: 'views/chatroom2.html',
			controller: 'ChatroomController'
		})
		.otherwise({ redirectTo: '/' });

	// $locationProvider.html5Mode(true);

}]);
