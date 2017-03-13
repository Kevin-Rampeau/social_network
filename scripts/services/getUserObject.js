app.service('GetUsersObject', function(Constants,$localStorage){
	
	
	//This service let me to recover the complet objects of users
	var getUsersObject = {}
	
	/*********friendsRequestReceived*********/
	
	getUsersObject.getObject = function(arrayEmail){
		getUsersObject.usersReceived = [];

		
		for(var i=0;arrayEmail[i];i++){
			
			Constants.users.forEach(function(elt){
				
				if(arrayEmail[i] == elt.email){
					getUsersObject.usersReceived.push(elt);
				}
			});
		}
		
		$localStorage.friendsRequestReceived = getUsersObject.usersReceived;
	}
	
	/********friendsRequestSent*****************/
	getUsersObject.getObject2 = function(arrayEmail){
		getUsersObject.usersSent = [];

		
		for(var i=0;arrayEmail[i];i++){
			
			Constants.users.forEach(function(elt){
				
				if(arrayEmail[i] == elt.email){
					getUsersObject.usersSent.push(elt);
				}
			});
		}
		$localStorage.friendsRequestSent = getUsersObject.usersSent;
		
	}	
	/*****************friends**********************/
	getUsersObject.getObject3 = function(arrayEmail){
		getUsersObject.friends = [];

		
		for(var i=0;arrayEmail[i];i++){
			
			Constants.users.forEach(function(elt){
				
				if(arrayEmail[i] == elt.email){
					getUsersObject.friends.push(elt);
				}
			});
		}
		$localStorage.friends = getUsersObject.friends;
		
	}	
	
	/***********friendsOfFriend********************/
	getUsersObject.getObject4 = function(arrayEmail){
		getUsersObject.friendsOfFriend = [];

		
		for(var i=0;arrayEmail[i];i++){
			
			Constants.users.forEach(function(elt){
				
				if(arrayEmail[i] == elt.email){
					getUsersObject.friendsOfFriend.push(elt);
				}
			});
		}
		$localStorage.friendsOfFriend = getUsersObject.friendsOfFriend;
		
	}	
	
	/***********friendsRecommended********************/
	getUsersObject.getObject5 = function(arrayEmail){
		getUsersObject.usersRecommended = [];

		
		for(var i=0;arrayEmail[i];i++){
			
			Constants.users.forEach(function(elt){
				
				if(arrayEmail[i].my_friend == elt.email){
					
					Constants.users.forEach(function(elt2){
						if(arrayEmail[i].user_recommended == elt2.email){
							
							getUsersObject.usersRecommended.push({myFriend:elt,userRecommended:elt2})
						}
					});
					
				}
			});
		}

		
		$localStorage.recommendation = getUsersObject.usersRecommended;
		
	}
	/***********POSTS IN LOCALSTORAGE********************/
	
	getUsersObject.getObject6 = function(posts){
		$localStorage.posts = posts;
	}
	

	
	return getUsersObject;
})