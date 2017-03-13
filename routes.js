app.config(function($stateProvider,$urlRouterProvider){
	
	$stateProvider
		
		.state('main', {
			url: '/main',
			templateUrl: '/views/main.html',
			controller: 'mainCtrl',
			cache: false,
		})
		
		.state('users', {
			url: '/users',
			templateUrl: '/views/users.html',
			controller: 'usersCtrl',
			cache: false,
		})
		
		.state('register', {
			url: '/register',
			templateUrl: '/views/register.html',
			controller: 'registerCtrl',
			cache: false,
		})
		
		.state('friend', {
			url: '/friend',
			templateUrl: '/views/friend.html',
			controller: 'friendCtrl',
			cache: false,
		})
		
		.state('privateMessages', {
			url: '/private_messages',
			templateUrl: '/views/privateMessages.html',
			controller: 'privateMessagesCtrl',
			cache: false,
		})
		
		
		$urlRouterProvider.otherwise('/main')
				

});	