app.controller('usersCtrl',function($scope,$state,SocketIo,$localStorage,ApiClient,Constants,GetUsersObject){
	
	
		$scope.apiClient = ApiClient;
		$scope.getUsersObject = GetUsersObject;
		$scope.localStorage = $localStorage;
		$scope.socket = SocketIo.socket;
		$scope.constants = Constants;
		$scope.$state = $state;
		$scope.a = {};		

		/*****************INIT*******************/
		$scope.init = function(){

			$scope.showComments = false;
			$scope.showDisconnect = true;
			$scope.showSearchBar = true;

			//Block page for visitors
			if($scope.localStorage.email == undefined ){
				$state.go('main')
			}else{
				$scope.apiClient.getUsers();
				$scope.apiClient.getFriendsRequestReceived();
				$scope.apiClient.getFriendsRequestSent();
				$scope.apiClient.getFriends();
				$scope.apiClient.getFriendsRecommended();	
				$scope.apiClient.getPost();
			}
		}	
		$scope.init();
		//Socket for to get element without to refresh page		
		$scope.socket.on('returnInit', function(){
			$scope.init();
		})
		
		/**************GET ALL USERS************/
		
		$scope.apiClient.returnUsers = function(users){
			$scope.constants.users = users;
		}
		/******************DISCONNECT***********/
		
		$scope.disconnect = function(){
			
			$scope.apiClient.disconnect();
		}	

		/******************CONSULT PROFILE*********/
	
		$scope.consultProfile = function(consultUser){
		
			$scope.apiClient.consultProfile(consultUser);
		}
		
		/*******************SHOW MENU WHEN XS**********/
		$scope.showMenu = function(){
			$('#navbar').collapse('toggle')
		}
		
		
		/***********************************************
		********************FRIENDS*********************
		***********************************************/
		
		/************GET FRIENDS***********************/
		
		$scope.apiClient.returnFriends = function(res){
			// Transform email in object
			$scope.getUsersObject.getObject3(res);
			
		}
		
		/************GET FRIENDS REQUEST RECEIVED*******/
		
		$scope.apiClient.returnFriendsRequestReceived = function(res){
			// Transform email in object
			$scope.getUsersObject.getObject(res);
			
		}
		
		/************GET FRIENDS REQUEST SENT***********/
		
		$scope.apiClient.returnFriendsRequestSent = function(res){
			// Transform email in object
			$scope.getUsersObject.getObject2(res);
			
		}
		
		/************GET FRIENDS RECOMMENDED************/
		
		$scope.apiClient.returnFriendsRequestRecommended = function(res){
			
			// Transform email in object
			$scope.getUsersObject.getObject5(res);
			
		}
		
		/************ACCEPTE OR REFUSE FRIENDS REQUEST***/
		
		$scope.acceptOrRefuseFriendRequest = function(user){
			$scope.user = user;
		}
	
		
		/************ACCEPTE FRIENDS REQUEST *************/
		$scope.acceptFriendRequest = function(user){
			$scope.apiClient.acceptFriendRequest(user);
			
		}
		
		/************REFUSE FRIENDS REQUEST ***************/
		$scope.refuseFriendRequest = function(user){
			$scope.apiClient.refuseFriendRequest(user);
			
		}
		
		/************ACCEPTE FRIENDS RECOMMENDATION *******/
		$scope.acceptFriendRecommendation = function(user){
			$scope.apiClient.acceptFriendRecommendation(user);
			$scope.apiClient.friendRequest(user);

		}
		
		/************REFUSE RECOMMENDATION *****************/
		$scope.refuseRecommendation = function(user){
			$scope.apiClient.refuseRecommendation(user);

		}		
		
		/*******************************************************
		**********************PROFILE***************************
		*******************************************************/
		
		/********************EDIT PROFILE***********************/
		
		//Get clone of localstorage for edit
		$scope.showModalEditProfile = function(){
			
			$scope.editProfileObject = Object.assign({},$scope.localStorage);
		}
		
		$scope.editProfile = function(){
			
			$scope.apiClient.editProfile($scope.editProfileObject);
			
			$scope.localStorage.firstname = $scope.editProfileObject.firstname;
			$scope.localStorage.name = $scope.editProfileObject.name;
			$scope.localStorage.pseudo = $scope.editProfileObject.pseudo;
			$scope.localStorage.age = $scope.editProfileObject.age;
			
			
		}
		
		/*******************************************************
		**********************POSTS****************************
		*******************************************************/		
		
		/*****************TO POST******************************/
		
		$('#formPost').submit(function(e){
			
			//Block the change page
			e.preventDefault();

			//POST PHOTO	
			var img = new FormData(this);
			
			$.ajax({
				type: 'POST',
				url: '/photo',
				contentType: false,
				processData: false,
				data: img
			}).done(function(data) {
					//Link's photo
					$scope.photoPost = 'pictures/photo_profile/'+ data;
					$scope.sendPost();
			});
			
			
			$scope.sendPost = function(){
				
			
				if($scope.post || $scope.photoPost){
					var photo = $scope.photoPost;
					//Get date
					var dateUs = new Date();
					var date = dateUs.toLocaleDateString();
					var hour =  dateUs.getHours();
					var min =  dateUs.getMinutes();
					date = date + ' ' + hour + 'h' + min;
					
					$scope.apiClient.sendPost($scope.post,photo,date);
					$scope.apiClient.getPost($scope.post,photo,date);
					$scope.socket.emit('init');
					//Clear input
					$scope.post = '';
				}
			}
			if(($('#postPhoto').val()) == ''){
				$scope.sendPost();
			}

		})
		
		/************GET POSTS*********************************/
		
		$scope.apiClient.returnGetPosts = function(res){
			// POST IN LOCALSTORAGE
			$scope.getUsersObject.getObject6(res);
			
		}
		
		
		/*************COMMENTS*********************************/
		
		$scope.functionComments = function(comment,id){
			
			if(comment){
				//Get date
				var dateUs = new Date()
				var date = dateUs.toLocaleDateString();
				var hour =  dateUs.getHours();
				var min =  (dateUs.getMinutes()<10?'0':'') + dateUs.getMinutes()
				date = date + ' ' + hour + 'h' + min;
				$scope.apiClient.functionComments(comment,id,date)
				$scope.a.comment='';
				
			}

		}
		
		/*******************DELETE POST************************/
		
		$scope.deletePost = function(id){
			$scope.apiClient.deletePost(id)
		}

		
});