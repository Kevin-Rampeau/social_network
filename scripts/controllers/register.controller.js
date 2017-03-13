app.controller('registerCtrl',function($scope,$state,SocketIo,Constants,ApiClient,upload,$http){

		$scope.constants = Constants
		$scope.socketIo = SocketIo;
		$scope.socket = SocketIo.socket;
		$scope.apiClient = ApiClient;
		
		/***************CHECK FORM*********************/
		
		$scope.showForm = true;
		
		
		$('#myForm').submit(function(e) {
			
			$scope.formInvalid = "SAISI INCORRECT";
			e.preventDefault();
		
			//Data for profile photo
			var img = new FormData(this);
			
			
			$.ajax({
				type: 'POST',
				url: '/photo',
				contentType: false,
				processData: false,
				data: img
			}).done(function( data ) {

				if(data == undefined){
					console.log('if')
					$scope.photo = false;
					
				} else{
					console.log('else')
					$scope.photo = true;
					
					$('#imgProfil').attr('src', 'pictures/photo_profile/'+ data)

					//Link's photo
					$scope.pathPhoto = 'pictures/photo_profile/'+ data;
					
					//FORM INVALID
					if($scope.myForm.$valid == false){
						$scope.formInvalid = "SAISI INCORRECT";
						$scope.passInvalid = "";
					}
					//SEX INVALID	
					if($scope.user.sex == undefined && $scope.myForm.$valid == true){
						$scope.formInvalid = "SAISI INCORRECT";
						$scope.sexInvalid = "Veuillez saisir le genre";
					}
					//PASS DIFFERENTS
					if($scope.user.pass != $scope.user.pass2)	{
						$scope.formInvalid = "SAISI INCORRECT";
						$scope.sexInvalid = "";
						$scope.passInvalid = "Les mots de passe saisi ne sont pas identiques";
					}
					
					//FORM VALID
					if($scope.myForm.$valid == true && $scope.user.sex != undefined && $scope.user.pass == $scope.user.pass2){
						
						$scope.apiClient.register($scope.user,$scope.pathPhoto);
						
					}	
					
					//CHECK MAIL
					$scope.apiClient.checkEmail = function(emailUsed){
						//Email used
						if(emailUsed == true){
							$scope.formInvalid = "";
							$scope.passInvalid = "";
							$scope.sexInvalid = "";
							
							$scope.apiClient.emailUsed = emailUsed;
						//Email dont used ,OK!	
						}else{
							$scope.apiClient.emailUsed = false;
							$scope.mainLink = true;
							$scope.showForm = false;
							$scope.formInvalid = "";
							$scope.passInvalid = "";
							$scope.sexInvalid = "";
							$scope.textFormValid = "Inscription reussi, vous pouvez à présent vous connecter";
							
						}
					}
				}
			})
		});
		
		$scope.goMain = function(){
			$state.go('main');
		}
	});