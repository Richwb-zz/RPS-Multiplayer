// Initialize Firebase
  // TODO: Replace with your project's customized code snippet
  const config = {
    apiKey: "AIzaSyCWcPshquCZB_HSWlK7xkFOH_DNvidpAJg",
    authDomain: "rpsmp-81e87.firebaseapp.com",
    databaseURL: "https://rpsmp-81e87.firebaseio.com"
  };
  
firebase.initializeApp(config);

firebase.auth().signOut();

fdb = firebase.database();

var firebaseUser;
var privateId;
var channelId;

firebase.auth().onAuthStateChanged(function(user) {

	if (user) {

	  	user.updateProfile({
			displayName: firebaseUser
		}).then(function() {
		  firebaseUser = firebase.auth().currentUser;
		  createUser();
		}).catch(function(error) {
		});
	}


});

function loggedIn(){
	
	if(firebaseUser){
			return true;
	}
}

function submitName(){
	firebaseUser = $("#username").val();
	firebase.auth().signInAnonymously();
}

function createUser(){

	privateId = private();
	fdb.ref('users/' + firebaseUser.uid).set({
		privateid: privateId,
		username: firebaseUser.displayName
	});
}

function createGame(){
	channelId = private();

	fdb.ref('opengames/').set({
		id : channelId
	});
}	

function joinGame(){
	startHandler();
	fdb.ref('games/' + channelId).update({
		[firebaseUser.uid] : {
			name: firebaseUser.displayName,
			weapon: "none",
			wins: 0
		}
	});

	//waitingForPlayer();
}

function private(){
	var date = new Date();
   var time = date.getTime();
   var key = "";
   var letter ="";

   privateId = time.toString();
   
   for (var i = 0; i < 4; i++) {
   	var position = Math.round(Math.random() * privateId.length);
   	var length =  Math.round(Math.random() * 3 + 1);

   	for (var j = 0; j <= length; j++) {
   		var caps = Math.round(Math.random());
   		
   		if(caps === 0){
   			letter = String.fromCharCode(Math.round(Math.random() * (90-65)) + 65);
   		}else{
   			letter = String.fromCharCode(Math.round(Math.random() * (122-97)) + 97);
   		}

   		key += letter;
   
   	}
   	
		privateId = [privateId.slice(0, position), key, privateId.slice(position)].join('');

		key = "";
   }

   return privateId;
}

$(document).on("click", "#findGame", function(){
	
	query = fdb.ref().child("opengames");
	query.once("value")
	.then(function(snapshot){
		if(snapshot.hasChild("id")){
			console.log("yes");
			channelId = snapshot.val().id;
		}else{
			createGame();
		}
		joinGame();
	});

	
});

$(document).on("click", ".weapon", function(){

	var updates = {};
	updates['/users/' + localStorage.getItem("uid") + "/weapon"] = $(this).attr("id");

	fdb.ref().update(updates);

});

function startHandler(){

fdb.ref("games/" + channelId.toString()).on("value", function(snapshot){

	console.log(snapshot.val().name);


});
}