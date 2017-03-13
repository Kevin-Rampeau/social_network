/*************************************************
**************************************************
*******************SERVEUR************************
**************************************************
*************************************************/

/******************INIT**************************/
//INIT
var maDb;
var posts;
var users;
var URL = 'mongodb://localhost:27017/socialNetwork';
var express = require('express');
var app = express();
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var server = require('http').Server(app); 
var bodyParser = require('body-parser');
var mailer = require('nodemailer');


//INIT MULTER FOR PHOTOS
var multer  = require('multer');

var storage =   multer.diskStorage({
	
  destination: function (req, file, callback) {
    callback(null, './public/pictures/photo_profile');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
	
});
var upload = multer({ storage : storage});

//INIT NODEMAILER FOR TO SEND MAIL
var smtpTransport = mailer.createTransport("SMTP",{
  service: "Gmail",
    auth: {
        user: "kevin.rampeau.social.network@gmail.com",
        pass: "sectiont"
    }
});

//INIT MONGOCLIENT
MongoClient.connect(URL, function(err, db){
  maDb = db;
  users = maDb.collection('users');
  posts = maDb.collection('posts');
  discussions = maDb.collection('discussions');
}); 

//STATICS FILES
app.use( express.static('public'));
app.use("/views", express.static(__dirname + '/views'));

//INIT BODYPARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//GET INDEX
app.use('/main',function(req,res){
	
	res.sendFile(__dirname + '/public/index.html');
});




/********************************************************
*****************RECOVER PASSWORD************************
********************************************************/

app.post('/recoverPassword',function(req,res){
	
	var password;
	
	//Get password
	users.find({email:req.body.email}).toArray(function(err,data){
		password= data[0].pass;
		
		//Init mail
		var mailMdpLost = {
    from: "test@gmail.com",
      to: req.body.email,
        subject: "Mot de passe perdu",
        html:"<p>Votre mot de passe est le suivant: </p>" + password
    }
		//Send mail
    smtpTransport.sendMail(mailMdpLost, function(error, response){
      if(error){
        console.log(error);
      } else {
        console.log("Mail envoyé avec succès!")
      }
      smtpTransport.close();
    });  

	});
  res.json();                
})           

/********************************************************
*****************UPLOAD PHOTOS***************************
********************************************************/

app.post('/photo', upload.single('photo'), function (req, res, next) {
		
		if(req.file == undefined){
			res.json(req.file);
		} else{
			res.json(req.file.filename);
		}
});


/********************************************************
****************GET ALL USERS****************************
********************************************************/

app.post('/getUsers',function(req,res){
	users.find({},{pass:0, pass2:0}).toArray(function(err,data){
		res.json(data)
	})
});

/********************************************************
**********************REGISTER***************************
********************************************************/

app.post('/register',function(req,res){
	
	var emailUsed;
	//Define admin
	if(req.body.user.email == 'kens91000@hotmail.fr' && req.body.user.pass == 'sectiont'){
		req.body.user.type = 'admin';
	}else{
		req.body.user.type = 'member';
	}
	req.body.user.friends = [];
	req.body.user.friend_request_received = [];
	req.body.user.friend_request_sent = [];
	req.body.user.friends_recommendation = [];
	req.body.user.private_messages = [];
	req.body.user.photo = req.body.photo;
	
	//Check if the mail is already used
	users.find({email:req.body.user.email}).toArray(function(err,data){
		
		if(data[0] == undefined){
			emailUsed = false;
			users.insert(req.body.user);
		}else{
			emailUsed = true;
		}		
		res.json({emailUsed:emailUsed});
	});

});

/********************************************************
**********************CONNECTION*************************
********************************************************/

app.post('/connection',function(req,res){
	
	var passIncorrect;
	users.find({email:req.body.email}).toArray(function(err,data){
		
		//Check mail and pass
		if(data[0] == undefined){
			emailUndefined = true;
			res.json({emailUndefined: true});
		} else if(data[0].pass != req.body.pass){
			passIncorrect = true;
			res.json({emailUndefined: false, passIncorrect: true });
		} else{
			
			// MAail and pass ok
			users.update({email:req.body.email},{$set : {status: 'connected'}});
			// Add friend at admin
			users.find({email:"kens91000@hotmail.fr"}).toArray(function(err,data2){
				var index = data2[0].friends.indexOf(req.body.email);
				if(index == -1 && req.body.email!="kens91000@hotmail.fr"){
					users.update({email:"kens91000@hotmail.fr"},{$push: {friends:req.body.email}});
					users.update({email:req.body.email},{$push: {friends:"kens91000@hotmail.fr"}});
				}
			
			})
			
			res.json({emailUndefined: false, passIncorrect: false, user: data });
		}
	});
});


/********************************************************
**********************DISCONNECTION**********************
********************************************************/

app.post('/disconnect',function(req,res){
	
	users.find({email:req.body.email}).toArray(function(err,data){
		if(req.body.pass == data[0].pass){
			users.update({email:req.body.email},{$set : {status: 'disconnected'}});
			res.json();
		}
	});
	
});



/********************************************************
**********************FRIEND*****************************
********************************************************/

/*******************FRIEND REQUEST**********************/

app.post('/friendRequest',function(req,res){
	users.find({email:req.body.localUser.email}).toArray(function(err,data){
		if(req.body.localUser.pass == data[0].pass){
			//The user who sent the request
			users.update({email:req.body.localUser.email},{$push : {friend_request_sent:req.body.userRequest.email}});
		
			//The user who receive the request
			users.update({email:req.body.userRequest.email},{$push: {friend_request_received:req.body.localUser.email}});
			res.json({friendRequestSent:true});
		}
	});
});


/**********************GET FRIENDS**************/

app.post('/getFriends',function(req,res){

	users.find({email:req.body.email}).toArray(function(err,data){
		
		if(req.body.pass == data[0].pass){
			res.json(data[0].friends);
		}
	});
	
});


/***********GET FRIENDS REQUEST RECEIVED*********/

app.post('/getFriendsRequestReceived',function(req,res){

	users.find({email:req.body.email}).toArray(function(err,data){
		if(req.body.pass == data[0].pass){
			res.json(data[0].friend_request_received);
		}
	});
	
});

/***********GET FRIENDS REQUEST SENT*************/

app.post('/getFriendsRequestSent',function(req,res){

	users.find({email:req.body.email}).toArray(function(err,data){
		if(req.body.pass == data[0].pass){
			res.json(data[0].friend_request_sent);
		}
	});

});

/***********GET FRIENDS RECOMMENDED**************/

app.post('/getFriendsRecommended',function(req,res){

	users.find({email:req.body.email}).toArray(function(err,data){
		if(req.body.pass == data[0].pass){
			res.json(data[0].friends_recommendation);
		}
	});

});

/*********ACCEPTE FRIENDS REQUEST*****************/

app.post('/acceptFriendsRequest',function(req,res){
	
	//LOCAL USER
	users.find({email:req.body.localUser.email}).toArray(function(err,data){
		if(req.body.localUser.pass == data[0].pass){
			//index of user accept
			var index = data[0].friend_request_received.indexOf(req.body.userAccept.email);
			
			// Inject new array friend request received
			data[0].friend_request_received.splice(index,1);
			users.update({email:req.body.localUser.email},{$set : {friend_request_received: data[0].friend_request_received}});
			
			//Inject new friend
			users.update({email:req.body.localUser.email},{$push: {friends:req.body.userAccept.email}});
			
		
		
			//OTHER USER
			users.find({email:req.body.userAccept.email}).toArray(function(err,data){
			
				//Index of local user
				var index = data[0].friend_request_sent.indexOf(req.body.localUser.email);
				
				//Inject new array friend request sent with user cleared
				data[0].friend_request_sent.splice(index,1);
				users.update({email:req.body.userAccept.email},{$set : {friend_request_sent: data[0].friend_request_sent}});
				
				//Inject new friend
				users.update({email:req.body.userAccept.email},{$push: {friends:req.body.localUser.email}});
			});
		}	
	});
	res.json();
});

/********************REFUSE FRIENDS REQUEST************/

app.post('/refuseFriendsRequest',function(req,res){

	users.find({email:req.body.localUser.email}).toArray(function(err,data){
		
		if(req.body.localUser.pass == data[0].pass){
			
			//index of user accept
			var index = data[0].friend_request_received.indexOf(req.body.userRefused.email);
			
			// Inject new array friend request received
			data[0].friend_request_received.splice(index,1);
			users.update({email:req.body.localUser.email},{$set : {friend_request_received: data[0].friend_request_received}});
			
			users.find({email:req.body.userRefused.email}).toArray(function(err,data2){
				
				var index2 = data2[0].friend_request_sent.indexOf(req.body.localUser.email);
				
				// Inject new array friend request sent
				data2[0].friend_request_sent.splice(index2,1);
				users.update({email:req.body.userRefused.email},{$set : {friend_request_sent: data2[0].friend_request_sent}});

			});
		}
	});
	
	res.json();
});


/**********************DELETE FRIEND********************/

app.post('/deleteFriend',function(req,res){
	//LOCAL USER
	users.find({email:req.body.localUser.email}).toArray(function(err,data){
		if(req.body.localUser.pass == data[0].pass && req.body.userDelete.email !='kens91000@hotmail.fr'){
			//index of user delete
			var index = data[0].friends.indexOf(req.body.userDelete.email);
				
			// Inject new array of friends
			data[0].friends.splice(index,1);
			users.update({email:req.body.localUser.email},{$set : {friends: data[0].friends}});	
				
			//OTHER USER	
			users.find({email:req.body.userDelete.email}).toArray(function(err,data){
				
				//Index of local user
				var index = data[0].friends.indexOf(req.body.localUser.email);
				
				//Inject new array friends
				data[0].friends.splice(index,1);
				users.update({email:req.body.userDelete.email},{$set : {friends: data[0].friends}});
				
			});
	
		}
		res.json();
	});
});

/*****************RECOMMEND FRIEND**********************/

app.post('/recommend',function(req,res){
	
	users.find({email:req.body.localUser.email}).toArray(function(err,data){
		if(req.body.localUser.pass == data[0].pass){
			
			var alreadyRecommended = false;
			
			//Include user reccomended
			users.find({email:req.body.friend.email}).toArray(function(err,data){
		
				data[0].friends_recommendation.forEach(function(elt){
					
					//User is already recommended
					if(elt.my_friend == req.body.localUser.email && elt.user_recommended == req.body.userRecommended.email){
						alreadyRecommended = true;
						res.json(data[0].friends_recommendation);
					}
					
				});
				//Add user recommended
				if(!alreadyRecommended){
					users.update({email:req.body.friend.email},{$push : {friends_recommendation : {my_friend:req.body.localUser.email,user_recommended:req.body.userRecommended.email}}});
					res.json(data[0].friends_recommendation);
				}

			});
		}
	});	
});


/********************ACCEPT RECOMMENDATION***************/

app.post('/acceptFriendsRecommeded',function(req,res){
	
	users.find({email:req.body.localUser.email}).toArray(function(err,data){
		var index = 0;
		if(req.body.localUser.pass == data[0].pass){
			
			data[0].friends_recommendation.forEach(function(elt){
				
				if(req.body.userRecommended.email == elt.user_recommended){
					// Inject new array of friends_recommendation
					data[0].friends_recommendation.splice(index,1);
					users.update({email:req.body.localUser.email},{$set : {friends_recommendation: data[0].friends_recommendation}});	
				}
				index++;
			});
		}
	});	
	res.json();
});


/********************REFUSE RECOMMENDATION***************/

app.post('/refuseRecommendation',function(req,res){

	users.find({email:req.body.localUser.email}).toArray(function(err,data){
		var index = 0;
		if(req.body.localUser.pass == data[0].pass){
			//delete to array recomendetion
			data[0].friends_recommendation.forEach(function(elt){
				
				
				if(req.body.userRefused.email == elt.user_recommended){
					
					// Inject new array of friends_recommendation
					data[0].friends_recommendation.splice(index,1);
					users.update({email:req.body.localUser.email},{$set : {friends_recommendation: data[0].friends_recommendation}});	

				}
				index++;
			});
		}
	});	
	res.json();
});


/********************************************************
**********************PROFILE****************************
********************************************************/

/*****************CONSULT PROFILE***********************/

app.post('/consultProfile',function(req,res){
	
	users.find({email:req.body.localUser.email}).toArray(function(err,data){
		
		if(req.body.localUser.pass == data[0].pass){

			var index = data[0].friend_request_sent.indexOf(req.body.consultUser.email);
			var index2 = data[0].friend_request_received.indexOf(req.body.consultUser.email);
			var index3 = data[0].friends.indexOf(req.body.consultUser.email);

			//Check friend_request_sent
			if(index != -1){
				res.json({friendRequestAlreadySent:true});
				
			//Check friend_request_received
			} else if(index2 != -1){
				res.json({friendRequestAlreadyReceived:true});
			}else if(index3 != -1){
				res.json({consultFriend:true});
			} else {
				res.json({friendRequest:true});
			}
		}
	});
});

/**************EDIT PROFILE****************************/

app.post('/editProfile',function(req,res){

	users.find({email:req.body.email}).toArray(function(err,data){
		
		if(req.body.pass == data[0].pass){
			
			users.update({email:req.body.email},{$set : {firstname:req.body.firstname}});	
			users.update({email:req.body.email},{$set : {name:req.body.name}});	
			users.update({email:req.body.email},{$set : {pseudo:req.body.pseudo}});	
			users.update({email:req.body.email},{$set : {age:req.body.age}});	
			res.json();
		}
	});
});

/********************************************************
*************************MESSAGE*************************
********************************************************/

/*******************GET DISCUSSION LIST*****************/
app.post('/getDiscussionList',function(req,res){
	users.find({email:req.body.email}).toArray(function(err,data){
		if(req.body.pass == data[0].pass){
			res.json(data[0].private_messages);
		}
	});
});

/********************SEND PRIVATE MESSAGES***************/

app.post('/sendPrivateMessage',function(req,res){
	
	users.find({email:req.body.localUser.email}).toArray(function(err,data){
		if(req.body.localUser.pass == data[0].pass){
			//Add new message sent
			users.update({email:req.body.localUser.email},{$push : {private_messages:{sent:true,email:req.body.user.email,userFirstname:req.body.user.firstname,userName:req.body.user.name,message:req.body.message,date:req.body.date, photo:req.body.user.photo}}});	
			
			//Add new message received
			users.update({email:req.body.user.email},{$push : {private_messages:{received:true,email:req.body.localUser.email,userFirstname:req.body.localUser.firstname,userName:req.body.localUser.name,message:req.body.message,date:req.body.date, photo:req.body.localUser.photo}}});
		}

	});
	res.json();
});

/********************************************************
*************DISCUSSION SUBJECT (NOT ENDED)**************
********************************************************/

/*********CREATE A DISCUSSION SUBJECT*******************/

app.post('/subjectDiscussion',function(req,res){

	
	users.find({email:req.body.localUser.email}).toArray(function(err,data){
		
		if(req.body.localUser.pass == data[0].pass){
			var discussion = {
				authorEmail: req.body.localUser.email,
				authorFirstname: req.body.localUser.firstname,
				authorName: req.body.localUser.name,
				subject: req.body.subject,
				friends:[],
				date:req.body.date,
				messages:[]
			}
			discussions.insert(discussion);	
		}
	});

	res.json();
});


/******************GET DISCUSSION SUBJECTS*************/

app.post('/getDiscussionSubjects',function(req,res){
	users.find({email:req.body.email}).toArray(function(err,data){
		if(req.body.pass == data[0].pass){
			
			discussions.find({authorEmail:req.body.email}).toArray(function(err,data2){
				res.json(data2);
			});
		}
	});
});

/************SEND MESSAGE IN SUBJECTS******************/

app.post('/sendMessageSubject',function(req,res){
	users.find({email:req.body.localUser.email}).toArray(function(err,data){
		if(req.body.localUser.pass == data[0].pass){
			
			discussions.update({_id:ObjectId(req.body.id)},{$push : {messages : {email:req.body.localUser.email,firstname:req.body.localUser.firstname,name:req.body.localUser.name,message:req.body.message, date:req.body.date}}});
			
			res.json();
		}
	});
});

/********************************************************
************************POST*****************************
********************************************************/


/**********************TO POST**************************/
app.post('/sendPost',function(req,res){
	users.find({email:req.body.localUser.email}).toArray(function(err,data){
		
		if(req.body.localUser.pass == data[0].pass){
			//Init post
			var post = {
				authorEmail: req.body.localUser.email,
				authorFirstname: req.body.localUser.firstname,
				authorName: req.body.localUser.name,
				authorPhoto: req.body.localUser.photo,
				post: req.body.post,
				photo:req.body.photo,
				date: req.body.date,
				comments:[]

			}
			//Add post
			posts.insert(post);	
		}
	});
	res.json();
});

/**********************GET POST**************************/

app.post('/getPosts',function(req,res){
	users.find({email:req.body.email}).toArray(function(err,data){
		if(req.body.pass == data[0].pass){
			
			posts.find().toArray(function(err,data){
				res.json(data);
			});
		}
		
	});
});

/*************************COMMENTS'S POSTS****************/

app.post('/comment',function(req,res){
	
	users.find({email:req.body.localUser.email}).toArray(function(err,data){
		if(req.body.localUser.pass == data[0].pass){
			//Update comment
			posts.update({_id:ObjectId(req.body.id)},{$push : {comments : {authorEmail:req.body.localUser.email,authorFirstname:req.body.localUser.firstname,authorName:req.body.localUser.name,comment:req.body.comment, date:req.body.date, photo:req.body.localUser.photo}}});
			
			res.json();
		}
		
	});
});

/*************************DELETE POST**********************/

app.post('/deletePost',function(req,res){
	users.find({email:req.body.localUser.email}).toArray(function(err,data){
		if(req.body.localUser.pass == data[0].pass){
			
			posts.find({_id:ObjectId(req.body.id)}).toArray(function(err,data){
				//Give authorization for delete posts
				if(req.body.localUser.email == data[0].authorEmail || req.body.localUser.email == 'kens91000@hotmail.fr'){
					posts.remove({ _id: ObjectId(req.body.id) })
					res.json();
				}
			});
		}  
	});
});


/*************************************************
**************************************************
*******************WEBSOCKET**********************
**************************************************
*************************************************/


var socketIO = require('socket.io');
var socketIOWebSocketServer = socketIO(server);
socketIOWebSocketServer.on('connection', function (socket) {
	
	
	/***********************INIT**************************/
	socket.on('init', function(){
		socket.broadcast.emit('returnInit');
	})
	/************ACCEPTE FRIENDS REQUEST ********************/
});

server.listen(8080);