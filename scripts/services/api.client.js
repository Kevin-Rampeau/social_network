app.service('ApiClient', function($http,SocketIo,$localStorage,$state,GetUsersObject){
  var apiClient = {};

	apiClient.socket = SocketIo.socket;
	
	/*******************************************
	*************GET ALL USERS******************
	*******************************************/
	
	apiClient.getUsers = function(){
		
		$http.post('/getUsers').
			
			success(function(res) {
				apiClient.returnUsers(res);
			}).
			error(function(res) {
					console.error("error in posting");
			})
	}
	
	/*******************************************
	******************REGISTER******************
	*******************************************/
	
	apiClient.register = function(user,photo){

		$http.post('/register',{user:user,photo:photo}).
			
			success(function(res) {
				apiClient.checkEmail(res.emailUsed);
			}).
			error(function(res) {
					console.error("error in posting");
			})
	}
	
	/*******************************************
	******************CONNECTION****************
	*******************************************/
	
	apiClient.connection = function(user){
	
		$http.post('/connection',user).
	
			success(function(res) {
				apiClient.checkConnection(res);
				apiClient.socket.emit('init');
			}).
			error(function(res) {
				console.error("error in posting");
			})
	}
	


	
	/*******************************************
	**************DISCONNECTION*****************
	*******************************************/
	
	apiClient.disconnect = function(){
		
		$http.post('/disconnect',$localStorage).
	
			success(function(res) {
			
				$state.go('main');
				apiClient.socket.emit('init');
				$localStorage.$reset();
				apiClient.init();
				
			}).
			error(function(res) {
				console.error("error in posting");
			})
	}
	

	
	
	/*******************************************
	******************FRIENDS*******************
	*******************************************/
	
	/****************FRIEND REQUEST************/
	
	apiClient.friendRequest = function(userRequest){
		$http.post('/friendRequest',{userRequest:userRequest,localUser:$localStorage}).
	
			success(function(res) {
					apiClient.showFriendRequestAlreadySent = true;
					apiClient.showFriendRequestAlreadyReceived = false;					
					apiClient.showRequestFriend = false;	
					apiClient.socket.emit('init');
			}).
			error(function(res) {
				console.error("error in posting");
			})	
	}
	
	/***************GET FRIENDS*****************/
	
	apiClient.getFriends =  function(){
		$http.post('/getFriends',$localStorage).
	
			success(function(res) {

				apiClient.getFriendsRequestReceived();
				apiClient.getFriendsRequestSent();
				apiClient.getFriendsRecommended();
				apiClient.returnFriends(res);
				
			}).
			error(function(res) {
				console.error("error in posting");
			})	
	}
	
	/***********GET FRIENDS REQUEST RECEIVED****/
	
	apiClient.getFriendsRequestReceived =  function(){
		$http.post('/getFriendsRequestReceived',$localStorage).
			
			success(function(res) {

				apiClient.returnFriendsRequestReceived(res);
				
			}).
			error(function(res) {
				console.error("error in posting");
			})	
	}
	
	/**********GET FRIENDS REQUEST SENT***/
	
	apiClient.getFriendsRequestSent =  function(){
		$http.post('/getFriendsRequestSent',$localStorage).
	
			success(function(res) {
				
				apiClient.returnFriendsRequestSent(res);
				
			}).
			error(function(res) {
				console.error("error in posting");
			})	
	}	

	/******GET FRIENDS RECOMMENDED*******/
	
	apiClient.getFriendsRecommended =  function(){
		$http.post('/getFriendsRecommended',$localStorage).
	
			success(function(res) {
				
				apiClient.returnFriendsRequestRecommended(res);
				
			}).
			error(function(res) {
				console.error("error in posting");
			})	
	}	
	
	

	
	/*******ACCEPTE FRIENDS REQUEST*****/
	
	apiClient.acceptFriendRequest = function(user){
		
		$http.post('/acceptFriendsRequest',{localUser:$localStorage,userAccept:user}).
	
			success(function(res) {
				console.log('get')
				apiClient.getFriendsRequestReceived();
				apiClient.getFriendsRequestSent();
				apiClient.getFriends();
				apiClient.getFriendsRecommended();
				apiClient.socket.emit('init');

			}).
			error(function(res) {
				console.error("error in posting");
			})		
	}
	
	/********REFUSE FRIENDS REQUEST******/
	
	apiClient.refuseFriendRequest = function(user){
		
		$http.post('/refuseFriendsRequest',{localUser:$localStorage,userRefused:user}).
	
			success(function(res) {
				apiClient.getFriendsRequestReceived();
				apiClient.socket.emit('init');

			}).
			error(function(res) {
				console.error("error in posting");
			})		
	}
	
	/********REFUSE RECOMMENDATION********/
	
	apiClient.refuseRecommendation = function(user){
		
		$http.post('/refuseRecommendation',{localUser:$localStorage,userRefused:user}).
	
			success(function(res) {
				apiClient.getFriendsRecommended();
				apiClient.socket.emit('init');

			}).
			error(function(res) {
				console.error("error in posting");
			})		
	}

	/*********ACCEPTE RECOMMENDATION******/
	
	apiClient.acceptFriendRecommendation = function(user){
		
		$http.post('/acceptFriendsRecommeded',{localUser:$localStorage,userRecommended:user}).
	
			success(function(res) {
				apiClient.getFriendsRequestReceived();
				apiClient.getFriendsRequestSent();
				apiClient.getFriends();
				apiClient.getFriendsRecommended();
				apiClient.socket.emit('init');

			}).
			error(function(res) {
				console.error("error in posting");
			})		
	}
	
	/*******************DELETE FRIEND******/
	
	apiClient.deleteFriend = function(user){
		$http.post('/deleteFriend',{localUser:$localStorage,userDelete:user}).
	
			success(function(res) {
				apiClient.getFriendsRequestReceived();
				apiClient.getFriendsRequestSent();
				apiClient.getFriends();
				apiClient.socket.emit('init');

			}).
			error(function(res) {
				console.error("error in posting");
			})				
	}
	
	/*****************RECOMMEND FRIEND********/
	
	apiClient.recommend = function(user){
		$http.post('/recommend',{localUser:$localStorage,friend:$localStorage.friend, userRecommended:user}).
				success(function(res) {
					console.log(res)
					apiClient.socket.emit('init');
			}).
			error(function(res) {
				console.error("error in posting");
			})			
	}
	
	
	
	/*******************************************
	******************PROFILE*******************
	*******************************************/

	/**************CONSULT PROFILE*************/
	
	apiClient.consultProfile = function(consultUser){
		
		 if(consultUser.email == $localStorage.email){
			 $state.go('users')
		 } else{
			$http.post('/consultProfile',{consultUser:consultUser,localUser:$localStorage}).
	
			success(function(res) {
				$localStorage.friend = consultUser;
				
				// Get the statu with the profile consulted
				if(res.friendRequestAlreadySent){
					
					$localStorage.showFriendRequestAlreadySent = true;
					$localStorage.showFriendRequestAlreadyReceived = false;
					$localStorage.showRequestFriend = false;
					$localStorage.showDeleteFriendsList = false;
	
				} else if(res.friendRequestAlreadyReceived){
					
					$localStorage.showFriendRequestAlreadyReceived = true;
					$localStorage.showFriendRequestAlreadySent = false;
					$localStorage.showRequestFriend = false;
					$localStorage.showDeleteFriendsList = false;
					
					
				} else if(res.consultFriend){
					$localStorage.showFriendRequestAlreadySent = false;
					$localStorage.showFriendRequestAlreadyReceived = false;					
					$localStorage.showRequestFriend = false;	
					$localStorage.showDeleteFriendsList = true;
					

					
				} else if(res.friendRequest){
					$localStorage.showFriendRequestAlreadySent = false;
					$localStorage.showFriendRequestAlreadyReceived = false;					
					$localStorage.showRequestFriend = true;
					$localStorage.showDeleteFriendsList = false;
					
				}
					$state.go('friend')
					//Get object of friends's friends
					GetUsersObject.getObject4($localStorage.friend.friends);
	
			}).
			error(function(res) {
				console.error("error in posting");
			})
		 }
	}
	
	/********************EDIT PROFILE********/
	
	
	apiClient.editProfile = function(editProfileObject){
		$http.post('/editProfile',editProfileObject).
		
			success(function(res) {

			}).
			error(function(res) {
				console.error("error in posting");
			})		
	}
	
	
	/*******************************************
	******************DISCUSSION****************
	*******************************************/
	
	/************GET DISCUSSION LIST***********/
	apiClient.getDiscussionList = function(){
		
		$http.post('/getDiscussionList',$localStorage).
	
			success(function(res) {
				apiClient.returnGetDiscussionList(res);
				
			}).
			error(function(res) {
				console.error("error in posting");
			})		
	}
	
	
	/****************SEND PRIVATE MESSAGES*******/

	apiClient.sendPrivateMessage = function(user,message,date){
		
		$http.post('/sendPrivateMessage',{localUser:$localStorage,user:user, message:message, date:date}).
	
			success(function(res) {
				apiClient.getDiscussionList();
				apiClient.socket.emit('init');
			}).
			error(function(res) {
				console.error("error in posting");
			})		
	}	
	
	/*******************************************
	*******DISCUSSION SUBJECT (NOT ENDED)*******
	*******************************************/
	
	/*********CREATE A DISCUSSION SUBJECT******/
	
	apiClient.subjectDiscussion = function(subject){
		$http.post('/subjectDiscussion',{localUser: $localStorage, subject:subject}).
		
			success(function(res) {
				apiClient.getDiscussionSubjects();
				apiClient.socket.emit('init');
			}).
			error(function(res) {
				console.error("error in posting");
			})	
	}		
	
	/******************GET DISCUSSION SUBJECTS**/
	
	apiClient.getDiscussionSubjects = function(subject){
		$http.post('/getDiscussionSubjects',$localStorage).
		
			success(function(res) {
				apiClient.returnGetDiscussionSubjects(res);
			}).
			error(function(res) {
				console.error("error in posting");
			})	
	}	
	
	/************SEND MESSAGE IN SUBJECTS********/
	
	apiClient.sendMessageSubject = function(message,date,id){
		$http.post('/sendMessageSubject',{localUser:$localStorage,message:message,date:date,id:id}).
		
			success(function(res) {
				apiClient.getDiscussionSubjects();
				apiClient.socket.emit('init');
				
			}).
			error(function(res) {
				console.error("error in posting");
			})	
	}			
	
	
	
	
	/*******************************************
	******************POSTS*********************
	*******************************************/	
	
	/****************TO POST*******************/
	apiClient.sendPost = function(post,photo,date){
		
		$http.post('/sendPost',{localUser:$localStorage,post:post,photo:photo,date:date}).
		
			success(function(res) {
				apiClient.socket.emit('init');
			}).
			error(function(res) {
				console.error("error in posting");
			})	
	}
	
	/******************GET POSTS****************/
	
	apiClient.getPost = function(){
		$http.post('/getPosts',$localStorage).
		
			success(function(res) {
				var arrayPost = res.reverse();
				apiClient.returnGetPosts(arrayPost);
				
			}).
			error(function(res) {
				console.error("error in posting");
			})	
	}
	
	/*************COMMENTS'S POST****************/
	
	apiClient.functionComments = function(comment,id,date){
		$http.post('/comment',{localUser:$localStorage, comment:comment ,id:id, date:date}).
		
			success(function(res) {
				apiClient.socket.emit('init');
				apiClient.getPost();
			}).
			error(function(res) {
				console.error("error in posting");
			})	
	}
	
	/**************DELETE POSTS*********************/
	
	apiClient.deletePost = function(id){
		
		$http.post('/deletePost',{localUser: $localStorage, id:id}).
		
			success(function(res) {
				apiClient.socket.emit('init');
				apiClient.getPost();
			}).
			error(function(res) {
				console.error("error in posting");
			})				
		
	}
	
	/*******************************************
	************RECOVER PASSWORD****************
	*******************************************/
	
	apiClient.recoverPassword = function(email){
		$http.post('/recoverPassword',{email:email}).
			
			success(function(res) {
			}).
			error(function(res) {
				console.error("error in posting");
			})	
	}
	return apiClient;

})