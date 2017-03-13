app.controller('privateMessagesCtrl',function($scope,$state,SocketIo,$localStorage,ApiClient,Constants,GetUsersObject,$timeout){
	
		$scope.$state = $state;
		$scope.apiClient = ApiClient;
		$scope.getUsersObject = GetUsersObject;
		$scope.localStorage = $localStorage;
		$scope.socket = SocketIo.socket;
		$scope.constants = Constants;
		var showFriend = true;
		console.log($localStorage)
		/*****************INIT***********************/
		$scope.init = function(){
			$scope.showDisconnect = true;
			$scope.showSearchBar = true;
			
			//Block page for visitors
			if($scope.localStorage.email == undefined ){
				$state.go('main')
			}else{
				

				$scope.apiClient.getUsers();
				$scope.apiClient.getDiscussionList();
				$scope.apiClient.getDiscussionSubjects();
			}
		

		}
		$scope.showDiscussion = false;
		$scope.showSubjects = false;
		$scope.init();
		
		//Socket for to get element without to refresh page
		$scope.socket.on('returnInit', function(){
			$scope.init();
		})	
		
		/**************GET ALL USERS*******************/
		
		$scope.apiClient.returnUsers = function(users){
			$scope.constants.users = users;
		}
		/******************DISCONNECT******************/
		
		$scope.disconnect = function(){
			
			$scope.apiClient.disconnect();
		}	
		/******************CONSULT PROFILE*************/
	
		$scope.consultProfile = function(consultUser){
		
			$scope.apiClient.consultProfile(consultUser);

		}
		
		/******************GET DISCUSSION LIST********/
		
		$scope.apiClient.returnGetDiscussionList = function(discussionList){
			
			$localStorage.discussionList = discussionList
			
		}
		
		/********SHOW MENU HEADER WHEN XS**************/
		$scope.showMenu = function(){
			$('#navbar').collapse('toggle')
		}

		
		/***********************************************
		***************PRIVATE MESSAGES*****************
		***********************************************/
		
	
		/******************SEND PRIVATE MESSAGE********/
		
		$scope.sendPrivateMessage = function(user,message){
			
			if(message){
				//Get date
				var dateUs = new Date()
				var date = dateUs.toLocaleDateString();
				var hour =  dateUs.getHours();
				var min =  dateUs.getMinutes();
				date = date + ' ' + hour + 'h' + min;
				
				$scope.apiClient.sendPrivateMessage(user,message,date)
				$scope.message = "";
				
				// Scroll bottom
				$timeout(function(){
					$('#scroll').scrollTop(100000000);
				},1000)
			}
			
		}
		
		/***************SHOW PRIVATE MESSAGE***********/
		
		$scope.showMessages = function(user){
			
	
			// Scroll bottom
			$timeout(function(){
				$('#scroll').scrollTop(100000000);
			},10)
			
			$scope.showDiscussion = true;
			$scope.showSubjects = false;
			$scope.user = user;
		}
		
		/****************SHOW FRIEND XS****************/
		$scope.showFriends = function(){
			if(showFriend == true){
				$('.ms-menu').css('display','none');
				showFriend = false;
			}else{
				
				$('.ms-menu').css('display','block');
				showFriend = true;
			}
		}
		 
		/***********************************************
		***************DISCUSSION SUBJECT***************
		***********************************************/
		
		/***********CREATE A DISCUSSION SUBJECT********/
		
		$scope.subjectDiscussion = function(subject){
			$scope.subject = '';
			if(subject!=undefined){
				$scope.apiClient.subjectDiscussion(subject);
			}
			
		}
		
		/******************GET DISCUSSION SUBJECTS*****/
		
		$scope.apiClient.returnGetDiscussionSubjects = function(listDiscussionSubjects){
			$localStorage.listDiscussionSubjects = listDiscussionSubjects;
			console.log($localStorage.listDiscussionSubjects)
			
			
		}
		/***************SHOW SUBJECTS******************/
		
		$scope.functionShowSubject = function(discussion){
			
			$scope.showDiscussion = false;
			$scope.showSubjects = true;
			$scope.discussion= discussion;
			$scope.discussionId = discussion._id;
		}
		
		/************SEND MESSAGE IN SUBJECTS********/
		
		$scope.sendMessageSubject = function(message){
			
			if(message){
				
				//GET DATE
				var dateUs = new Date()
				var date = dateUs.toLocaleDateString();
				var hour =  dateUs.getHours();
				var min =  (dateUs.getMinutes()<10?'0':'') + dateUs.getMinutes()
				date = date + ' ' + hour + 'h' + min;
				
				$scope.apiClient.sendMessageSubject(message,date,$scope.discussionId)
				$scope.messageSubject = "";
			}
		}
		
		
});