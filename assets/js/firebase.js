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

var fbu;
var privateId;
var channelId;

firebase.auth().onAuthStateChanged(function(user) {

	if (user) {

	  	user.updateProfile({
			displayName: fbu
		}).then(function() {
		  fbu = firebase.auth().currentUser;
		  createUser();
		}).catch(function(error) {
		
		});
	}


});

function loggedIn(){
	
	if(fbu){
			return true;
	}
}

function submitName(){
	fbu = $("#username").val();
	firebase.auth().signInAnonymously();
}

function createUser(){

	privateId = private();
	fdb.ref('users/' + fbu.uid).set({
		privateid: privateId,
		username: fbu.displayName
	});
}

function createGame(){
	channelId = private();

	fdb.ref('opengames/').set({
		[channelId] : channelId
	});
}

function checkCapacity(gameId){
	var counter = 0;
	query = fdb.ref("games/" + gameId);
	query.once("value")
	.then(function(snapshot){
		snapshot.forEach(function(child){
			counter++;
		});
		if(counter < 2){
			channelId = gameId;
			joinGame("player2");
		}else{
			alert("Room Full");
		}
	});
}

function joinGame(player){
	startHandler();
	fdb.ref("games/" + channelId).update({
		[player] :{
			player: player,
			id : fbu.uid,
			name: fbu.displayName,
			weapon: "none",
			wins: 0
		}
	});
}

function deleteGame(table, gameId){
	fdb.ref(table).child(channelId).remove();
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
	
	fdb.ref().child("opengames")
	.limitToFirst(1)
	.once("value")
	.then(function(snapshot){
		
		if(snapshot.val() !== null){
			checkCapacity(Object.keys(snapshot.val())[0]);
		}else{
			createGame();
			joinGame("player1");
		}
		
	});

	
});

$(document).on("click", ".weapon", function(){

	var updates = {};
	updates['/users/' + localStorage.getItem("uid") + "/weapon"] = $(this).attr("id");

	fdb.ref().update(updates);

});

function startHandler(){
	var counter = 0;
	fdb.ref("games/" + channelId).on("child_added", function(snapshot){
		snap = snapshot.val();
		counter++;
		
		if(snap.player === "player2" && snap.id !== fbu.uid){
			deleteGame("opengames", channelId);
			$('.modal').modal('hide');
		}else if(snap.player === "player1" && snap.id === fbu.uid){
			$('.modal').modal({backdrop: "static"});
		}
	});
}













