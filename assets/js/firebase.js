// Initialize Firebase
  // TODO: Replace with your project's customized code snippet
  const config = {
    apiKey: "AIzaSyCWcPshquCZB_HSWlK7xkFOH_DNvidpAJg",
    authDomain: "rpsmp-81e87.firebaseapp.com",
    databaseURL: "https://rpsmp-81e87.firebaseio.com"
  };
  
firebase.initializeApp(config);

firebase.auth().signOut();

var firebaseUser;
var localVal;

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

function submitName(){
	firebaseUser = $("#username").val();
	firebase.auth().signInAnonymously();
	// localStorage.setItem("uid", firebaseUser.uid)
}

function createUser(){
	
	var query;

	privateId = private();
	firebase.database().ref('users/' + firebaseUser.uid).set({
		privateid: privateId,
		username: firebaseUser.displayName
	});
}

function createGame(){

	query = firebase.database().ref("games");
		query.once("value")
		.then(function(snapshot){
			
		if(snapshot.hasChildren()){

		}else{
			var gamePId = private();

			joinGame(gamePId);

			firebase.database().ref('opengames/').set({
				id : gamePId 
			});
		}
	});

}	

function joinGame(id){
	firebase.database().ref('games/' + id).update({
		[firebaseUser.uid] : {
			name: firebaseUser.displayName,
			weapon: "none",
			wins: 0
		}
	});
}

function loggedIn(){
	
	if(localStorage.getItem("uid")){
			return true;
	}
}

function private(){
	var date = new Date();
   var time = date.getTime();
   var privateId = time.toString();
   var key = "";
   var letter ="";
   
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
	
	query = firebase.database().ref().child("opengames");
	query.once("value")
	.then(function(snapshot){
		if(snapshot.hasChild("id")){
			joinGame(snapshot.val().id);
		}else{
			createGame();
		}
	});
});

$(document).on("click", ".weapon", function(){

	var updates = {};
	updates['/users/' + localStorage.getItem("uid") + "/weapon"] = $(this).attr("id");

	firebase.database().ref().update(updates);

});