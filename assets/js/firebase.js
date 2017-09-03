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
// join channel id 
var channelId;

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
		privateid: privateId,
		username: fbu.displayName
	});
}

// Generate game idea from private function ..../
// Add game to opengames table
function setOpenGame(){

	fdb.ref('opengames/').set({
		[channelId] : channelId
	});
}

// Checks how many people are in the game to ensure that more then 2 do not join
// calls games table and searches for gameid and gets number of children
// If return is less then 2 then set global variable channelId to the gameid
//		Then call joingame function ..../ this person will always be player 2
// If return is 2 or more then alert that room is full
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

// Adds passed player to the channelId game
// Initiates event handlers for players game ..../
function joinGame(player){
	privateId = private();

	fdb.ref("games/" + channelId).update({
		[player] :{
			player: player,
			id : fbu.uid,
			name: fbu.displayName,
			weapon: "none",
			wins: 0
		}
	});

	startHandler();
}

// Deletes element from table with table and gameid as parameter
function deleteGame(table, gameId){
	fdb.ref(table).child(channelId).remove();
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

//	Checks against the opengames table to see if any games are awaiting a second player 
// If game found 
//		Deletes available game for syncronous error handling, this file line .../
//			takes in table name and game ID	
// checks how many people are in game encase someone got in prior to deletion .../
// If game is not found 
// 	Adds player to game as player 1 .../
//		Calls function to set game as open for player 2 ..../
$(document).on("click", "#findGame", function(){
	
	fdb.ref().child("opengames")
	.limitToFirst(1)
	.once("value")
	.then(function(snapshot){
		
		if(snapshot.val() !== null){
			deleteGame("opengames", snapshot.val());
			checkCapacity(snapshot.val());
		}else{
			joinGame("player1");
			setOpenGame();
		}
		
	});

	
});

$(document).on("click", ".weapon", function(){

	var updates = {};
	updates['/users/' + localStorage.getItem("uid") + "/weapon"] = $(this).attr("id");

	fdb.ref().update(updates);

});


// Starts all handlers for game
// Child added
// 	If player is 1st show modal until 2nd player has joined then hide 
function startHandler(){
	var counter = 0;
	fdb.ref("games/" + channelId).on("child_added", function(snapshot){
		snap = snapshot.val();
		counter++;
		
		if(snap.player === "player2" && snap.id !== fbu.uid){
			$('.modal').modal('hide');
		}else if(snap.player === "player1" && snap.id === fbu.uid){
			$('.modal').modal({backdrop: "static"});
		}
	});
}













