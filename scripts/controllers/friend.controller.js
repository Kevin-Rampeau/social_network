app.controller('friendCtrl',function($scope,$state,SocketIo,$localStorage,ApiClient,Constants,GetUsersObject,$state){
	
		$scope.$state = $state;
		$scope.apiClient = ApiClient;
		$scope.getUsersObject = GetUsersObject;
		$scope.localStorage = $localStorage;
		$scope.socket = SocketIo.socket;
		$scope.constants = Constants;
		console.log($localStorage)
		$scope.a = {};
		$scope.arrayFriends = [];
		
		/*****************INIT*******************/
		$scope.init = function(){
			$scope.showComments = false;
			$scope.showDisconnect = true;
			$scope.showSearchBar = true;
			
			//BLOCK PAGE FOR VISITOR
			if($scope.localStorage.email == undefined ){
				$state.go('main')
			}else{

				//GET ALL USERS
				$scope.apiClient.getUsers();
				$scope.apiClient.getPost();

			}

		}
		
		$scope.init();
		//GET INFO IN REAL TIME
		$scope.socket.on('returnInit', function(){
			$scope.init();
		})		
		/**************GET ALL USERS************/
		
		$scope.apiClient.returnUsers = function(users){
			$scope.constants.users = users;
		}
		/******************DISCONNECT*********************/
		
		$scope.disconnect = function(){
			
			$scope.apiClient.disconnect();
		}	


		
		
		/******************CONSULT PROFILE**************/
	
		$scope.consultProfile = function(consultUser){
		
			$scope.apiClient.consultProfile(consultUser);
			console.log($localStorage)

		}
		
		/*******************SHOW MENU WHEN XS**********/
		$scope.showMenu = function(){
			$('#navbar').collapse('toggle')
		}

		/***********************************************
		********************FRIENDS*********************
		***********************************************/
		
		
		/******************FRIEND REQUEST**************/	
	
		$scope.friendRequest = function(userRequest){
			$localStorage.showFriendRequestAlreadySent = true;
			$localStorage.showRequestFriend = false;
			$scope.apiClient.friendRequest(userRequest);
		}
		
		

		
		/************ACCEPTE FRIENDS REQUEST ********************/
		$scope.acceptFriendRequest = function(user){
			$localStorage.showFriendRequestAlreadyReceived = false;
			$localStorage.showFriendRequestAlreadySent = false;
			$localStorage.showRequestFriend = false;
			$localStorage.showDeleteFriendsList = true;
			$scope.apiClient.acceptFriendRequest(user);

		}
		
		/***********DELETE FRIEND********************************/
		
		$scope.deleteFriend = function(user){
			$localStorage.showFriendRequestAlreadyReceived = false;
			$localStorage.showFriendRequestAlreadySent = false;
			$localStorage.showRequestFriend = true;
			$localStorage.showDeleteFriendsList = false;
			$scope.apiClient.deleteFriend(user);

		}
		
		/******************RECOMMEND FRIEND**********************/
		
		$scope.recommend = function(user){
			$scope.apiClient.recommend(user)
		}
		/***********************************************
		***************PRIVATE MESSAGES*****************
		***********************************************/
		
	
		/******************SEND PRIVATE MESSAGE**************/
		
		$scope.sendPrivateMessage = function(user,message){
			$scope.apiClient.sendPrivateMessage(user,message)
		}
		
		/***********************************************
		***************POSTS****************************
		***********************************************/
		
		/************GET POSTS*********************************/
		
		$scope.apiClient.returnGetPosts = function(res){
			// POST IN LOCALSTORAGE
			$scope.getUsersObject.getObject6(res);
			console.log($scope.localStorage.posts)
		}
		
		
		/*************COMMENTS*************************/
		
		$scope.functionComments = function(comment,id){
			
			if(comment){
				//GET DATE
				var dateUs = new Date()
				var date = dateUs.toLocaleDateString();
				var hour =  dateUs.getHours();
				var min =  (dateUs.getMinutes()<10?'0':'') + dateUs.getMinutes()
				date = date + ' ' + hour + 'h' + min;
				$scope.apiClient.functionComments(comment,id,date)
				$scope.a.comment='';
				
			}

		}
		
		/*******************DELETE POST*************/
		
		$scope.deletePost = function(id){
			
			$scope.apiClient.deletePost(id)
		}
		
		/***********SHOW POSTS**************************/
		
		$scope.showPost = function(){
			if($scope.localStorage.email!= undefined){

				$scope.localStorage.friends.forEach(function(elt){
					
					$scope.arrayFriends.push(elt.email)
					
				})
		
			}
		}
		$scope.showPost()
		
		
		
});
		