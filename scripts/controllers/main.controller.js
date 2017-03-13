app.controller('mainCtrl',function($scope,$state,SocketIo,Constants,$localStorage,ApiClient,Constants,GetUsersObject){
	
		$scope.apiClient = ApiClient;
		$scope.localStorage = $localStorage;
		$scope.socket = SocketIo.socket;
		$scope.constants = Constants;
		$scope.getUsersObject = GetUsersObject;
		$scope.$state = $state;
		$scope.arrayFriends = [];
		
		//I create this object because i use a ng-repeat in an other ng-repeat
		$scope.a = {};		
	
		/*****************INIT*******************/

		$scope.init = function(){
			//Show element in terms of status's user
			if($scope.localStorage.email == undefined){
				//user disconected
				$scope.showConnection = true;
				$scope.showDisconnect = false;
				$scope.showRegistration = true;
				$scope.showSearchBar = false;
				
			} else{
				//user connected
				$scope.showComments = false;
				$scope.showConnection = false;
				$scope.showDisconnect = true;
				$scope.showRegistration = false;
				$scope.showSearchBar = true;
				//Get post
				$scope.apiClient.getPost();
				//Get all users
				$scope.apiClient.getUsers();
				
			}
			//$scope.localStorage.$reset();
		};
		$scope.init();
		
		//Socket for to get element without to refresh page
		$scope.socket.on('returnInit', function(){
			$scope.init();
		})
		
		/**************GET ALL USERS**************/
		
		$scope.apiClient.returnUsers = function(res){
			$scope.constants.users = res;
			$scope.membersConnected();
		}
		
		/**************MEMBERS CONNECTED**********/
		
		$scope.membersConnected = function(){
			$scope.numberMembersConnected = 0;
			$scope.constants.users.forEach(function(elt){
				if(elt.status == 'connected'){
					$scope.numberMembersConnected ++;
				}
			})
		}
		
		
		/**************REGISTRATION***************/
		
		$scope.registration = function(){
			$state.go('register');
		}
		
		/**************CONNECTION*****************/
		
		$scope.submit = function(user){
			$scope.apiClient.connection(user);
		}
		
		$scope.apiClient.checkConnection = function(res){
			//Email undefined
			if(res.emailUndefined == true){
				$scope.formInvalid = "E-mail inconnu";
			//Password incorrect	
			}else if(res.passIncorrect == true){
				$scope.formInvalid = "Le mot de passe est incorrect";
			//Connection OK	init the localStorage
			} else{
				
				$scope.formInvalid ="";
				$scope.localStorage.firstname = res.user[0].firstname;
				$scope.localStorage.name = res.user[0].name;
				$scope.localStorage.pseudo = res.user[0].pseudo;
				$scope.localStorage.age = res.user[0].age;
				$scope.localStorage.sex = res.user[0].sex;
				$scope.localStorage.email = res.user[0].email;
				$scope.localStorage.phone = res.user[0].phone;
				$scope.localStorage.pass = res.user[0].pass;
				$scope.localStorage.type = res.user[0].type;
				$scope.localStorage.presentation = res.user[0].presentation;
				$scope.localStorage.photo = res.user[0].photo;
				$state.go('users');
			}
		};
		
		
		/******************DISCONNECT*********************/
		
		$scope.disconnect = function(){
			$scope.apiClient.disconnect();
		}	

		$scope.apiClient.init = function(){
			$scope.init();
		}
		
		
		/******************CONSULT PROFILE****************/
	
		$scope.consultProfile = function(consultUser){
			
			$scope.apiClient.consultProfile(consultUser);
		}

		/********SHOW MENU HEADER WHEN XS***************/
		$scope.showMenu = function(){
			$('#navbar').collapse('toggle')
		}
		
		/*************************************************
		*******************POSTS**************************
		*************************************************/
		
		/***********SHOW POSTS***************************/
		
		$scope.showPost = function(){
			if($scope.localStorage.email!= undefined){

				$scope.localStorage.friends.forEach(function(elt){
					
					$scope.arrayFriends.push(elt.email)
					
				})
		
			}
		}
		$scope.showPost()
		
		/************GET POSTS***************************/
		
		$scope.apiClient.returnGetPosts = function(res){
			//Post in localStorage
			$scope.getUsersObject.getObject6(res);
			
		}
		
		/*************COMMENTS***************************/
		
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
		
		/*******************DELETE POST*****************/
		
		$scope.deletePost = function(id){
			$scope.apiClient.deletePost(id)
		}
		

		/***************************************************
		*******************RECOVER PASSWORD*****************
		***************************************************/

		$scope.recoverPassword = function(email){
			if(email){
				$('#password').modal('hide');
				$scope.apiClient.recoverPassword(email)
			} else{
				$scope.errorPass = "Mot de passe invalide"
			}
			
		}	
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
});