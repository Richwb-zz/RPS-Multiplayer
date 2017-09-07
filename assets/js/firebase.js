// Firebase handling Script 
// Can recieve from games.js
// Can pass to game2.js

// Initialize Firebase
  // TODO: Replace with your project's customized code snippet
  const config = {
    apiKey: "AIzaSyCWcPshquCZB_HSWlK7xkFOH_DNvidpAJg",
    authDomain: "rpsmp-81e87.firebaseapp.com",
    databaseURL: "https://rpsmp-81e87.firebaseio.com"
  };
  
firebase.initializeApp(config);

firebase.auth().signOut();

// Connect to database
fdb = firebase.database();

// user id
var fbu;
// channel id 
var channelId;

var playerpos;

var weaponsArray = [];


// When user is authenticated 
// Update their profile info to include their username
// Create the user in database ..../
firebase.auth().onAuthStateChanged(function(user) {

	if (user) {

	  	user.updateProfile({
			displayName: fbu
		}).then(function() {
		  fbu = firebase.auth().currentUser;
		  createUser();
		}).catch(function(error) {
			console.log(error);
		});
	}
});

// if variable fbu is set then person is logged in
function loggedIn(){
	
	if(fbu){
			return true;
	}else{
		return false;
	}
}

// Assign the username to fbu global variable
// Sign in to firebase as an anonamous user
function submitName(){
	fbu = $("#username").val();
	firebase.auth().signInAnonymously();
}

// Adds users to users table and includes private Id and display name
function createUser(){
	fdb.ref('users/' + fbu.uid).set({
			privateid: private(),
			username: fbu.displayName
	});
}


function getARoom(){

	var action = "";
	var player = "";

	fdb.ref().child("opengames")
	.limitToFirst(1)
	.once("value")
	.then(function(snapshot){

		if(snapshot.val() !== null){
			
			channelId =  Object.keys(snapshot.val())[0];
			
			deleteGame("opengames");
			
			checkCapacity(Object.keys(snapshot.val())[0]);
			
			action = "update";
			player = "player2";
		
		}else{
			action = "set";
			player = "player1";
			setOpenGame();
		}
		
		startHandler();
		joinGame(player, action);
		

	});

}

// Checks how many people are in the game to ensure that more then 2 do not join
// calls games table and searches for gameid and gets number of children
// If return is less then 2 then 
//		set global variable channelId to the gameid
// If return is 2 or more then alert that room is full
function checkCapacity(gameId){
	var counter = 0;
	
	query = fdb.ref("games/" + gameId);
	query.once("value")
	.then(function(snapshot){
		snapshot.forEach(function(child){
			counter++;
		});
		if(counter === 2){
			alert("Room Full");
		}
	});
}


// Generate game idea from private function ..../
// Add game to opengames table
function setOpenGame(){
	channelId = private();

	fdb.ref('opengames/').set({
		[channelId] : channelId
	});
}

// Adds passed player to the channelId game
// Clear the Gameboard
// Initiates event handlers for players game ..../
function joinGame(player, dbAction){
	playerpos = player;

	var objPlayer = {}; 
	objPlayer[player] = {
		id : fbu.uid,
		name: fbu.displayName,
		weapon: "none",
		wins: 0,
		ready: 0
	};

	if(dbAction === "set"){

		fdb.ref("games/" + channelId).set(objPlayer)
		.catch(function(error) {
			console.log(error);
		});
	
	}else if(dbAction == "update"){
		fdb.ref("games/" + channelId).update(objPlayer)
		.catch(function(error) {
			console.log(error);
		});
	}
	
	$("#gameboard").html("");
}

// Deletes element from table with table and gameid as parameter
function deleteGame(table){
	fdb.ref(table).child(channelId).remove();
}

function resetReady(){
	fdb.ref("games/" + channelId)
	.child(playerpos)
	.update({
		ready:0
	});
}

// Generates unique id for game using epoch time as base
// Chooses randomized locations in string to place characters and how long string will be
// Uses Randomizer to set if each character will be upper or lower case
// Adds randomized string to that location
// Repeats 4 times
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

// Starts all handlers for game
// Child added
// 	If player is 1st show modal until 2nd player has joined then hide 
function startHandler(){
	var counter = 0;
	var snap;

	fdb.ref("games/")
	.child(channelId)
	.on("child_added", function(snapshot){
		snap = snapshot.val();

		counter++;
		if(snapshot.key === "player2" && snap.id !== fbu.uid){
			$('.modal').modal('hide');
		}else if(snapshot.key === "player1" && snap.id === fbu.uid){
			$('.modal').modal({backdrop: "static"});
		}

		if(counter === 2){
			$("#gameboard").html("<button id='readytoplay'>Ready</button>");
			counter = 0;
		}
	});

	fdb.ref("games/" + channelId)
	.on("value", function(snapshot){
		if(snapshot.val().player1.ready === 1 && snapshot.val().player2.ready === 1){
			resetReady();
			displayRPS();
		}
		
	});
}

$(document).on("click", "#readytoplay", function(){
	fdb.ref("games/" + channelId)
	.child(playerpos)
	.update({
		ready: 1
	})

});

$(document).on("click", ".weapon", function(){

	fdb.ref("games/" + channelId)
	.child(playerpos)
	.update({
		weapon : $(this).attr("id")
	});
});