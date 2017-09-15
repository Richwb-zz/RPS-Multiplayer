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

var playerPos = "";

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

	fdb.ref("opengames")

	.limitToFirst(1)
	.once("value")
	.then(function(snapshot){
		if(snapshot.val() !== null){
			
			snapshot.forEach(function(opensnapshot){
				channelId = opensnapshot.val().channel;
				playerPos = opensnapshot.val().position;
			});
			console.log(channelId);
			deleteGame(Object.keys(snapshot.val())[0]);
			checkCapacity(channelId);
			
			action = "update";
		}else{
			channelId = private();
			console.log("test");
			setOpenGame();
			playerPos = "player1";
			action = "set";
			join = true;
		}

		startHandler();
		joinGame(playerPos, action);

	});
}

function setOpenGame(){
	if(playerPos === "player1" || playerPos === ""){
		openPos = "player2";
	}else if (playerPos === "player2"){
		openPos = "player1";
	}
	
	fdb.ref('opengames').push({
			channel : channelId,
			position: openPos
	});
}

// Checks how many people are in the game to ensure that more then 2 do not join
// calls games table and searches for gameid and gets number of children
// If return is less then 2 then 
//		set global variable channelId to the gameid
// If return is 2 or more then alert that room is full
function checkCapacity(gameId){
	var counter = 0;
	
	query = fdb.ref("games/" + gameId + "game");
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

// Adds passed player to the channelId game
// Clear the Gameboard
// Initiates event handlers for players game ..../
function joinGame(player, dbAction){
	var objPlayer = {};
	
	objPlayer = {
		ties: 0
	}

	objPlayer[player] = {
		id : fbu.uid,
		name: fbu.displayName,
		weapon: "none",
		wins: 0,
		ready: 0,
	};

	if(dbAction === "set"){

		fdb.ref("games/" + channelId + "/game").set(objPlayer)
		.catch(function(error) {
			console.log(error);
		});
	
	}else if(dbAction == "update"){
		fdb.ref("games/" + channelId  + "/game").update(objPlayer)
		.catch(function(error) {
			console.log(error);
		});
	}
		
	chat(fbu.displayName + " has joined the game");
}

function chat(message = "", sender = ""){
	
	if($("#chattext").val() !=""){
		var message = $("#chattext").val();
		var sender = fbu.displayName
	}

	fdb.ref("games/" + channelId + "/chat").push({
		time: firebase.database.ServerValue.TIMESTAMP,
		sender : sender,
		message : message
	});
}

// Deletes element from table with table and gameid as parameter
function deleteGame(toDelete){
	console.log("player " + playerPos);
	var path = "";
	console.log("delete " + toDelete);
	if(toDelete === "player"){
		path = "games/" + channelId + "/game/" + playerPos;
	}else {
		path = "opengames/" + toDelete;
	}

	fdb.ref(path).remove();
}

function resetReady(){
	fdb.ref("games/" + channelId  + "/game")
	.child(playerPos)
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

	fdb.ref("games/" + channelId)
	.child("game")
	.on("child_added", function(snapshot){

		snap = snapshot.val();
		$("#" + snapshot.key + "name").text(snap.name);
		$("#" + snapshot.key + "score").text("0");
		$("#" + snapshot.key).removeClass("hide");
		$("#" + snapshot.key + "channelties").removeClass("hide");
		$("#channel").html(channelId);

		counter++;
		// if(snapshot.key === "player2" && snap.id !== fbu.uid){
		// 	modal("hide");
		// }else if(snapshot.key === "player1" && snap.id === fbu.uid){
		// 	modal("static");
		// }

		if(counter == 2){
			readyButton();
			counter = 0;
		}
	});

	fdb.ref("games/" + channelId  + "/game")
	.on("value", function(snapshot){
		snap = snapshot.val();
		
		if(snapshot.hasChild("player1")){
			$("#player1score").text(snap.player1.wins);
		}

		if(snapshot.hasChild("player2")){
			$("#player2score").text(snap.player2.wins);
		}

		if(snapshot.hasChild("ties")){
			$("#ties").text(snap.ties);
		}
		
		if(snapshot.hasChild("player1") && snapshot.hasChild("player2")) {
			
			modal("hide");



			if(snap.player1 && snap.player2){
				if(snap.player1.ready === 1 && snap.player2.ready === 1){
					resetReady();
					time();
				}

				if(snap.player1.weapon !== "none" && snap.player2.weapon !== "none"){

					var results = processRound(snap);

					fdb.ref("games/" + channelId + "/game")
						.child("player1")
						.update({
							weapon: "none"
					})

					fdb.ref("games/" + channelId + "/game")
						.child("player2")
						.update({
							weapon: "none"
					})

					if(results[0]){
						fdb.ref("games/" + channelId + "/game")
						.child(results[0])
						.update({
							wins: results[1]
						})
					}
				}
			}
		}else{
			modal("static");
		}
	});

	fdb.ref("games/" + channelId + "/game")
	.on("child_removed", function(){
		chat(fbu.displayName + " has left the game");
		modal("static");
		console.log("test");
		setOpenGame();
	});

	fdb.ref("games/" + channelId)
	.child("chat")
	.on("child_added", function(snapshot){
		var snap = snapshot.val();
		var time = moment(snap.time).format("H:mm:ss");

		$("#chatwindow").html($("#chatwindow").html() + time + " " + snap.sender + ": " + snap.message + "<br>");
	});
}

$(document).on("click", "#readytoplay", function(){
	console.log("pos" + playerPos);
	fdb.ref("games/" + channelId + "/game")
	.child(playerPos)
	.update({
		ready: 1
	})

});

$(document).on("click", ".weapon", function(){

	fdb.ref("games/" + channelId + "/game")
	.child(playerPos)
	.update({
		weapon : $(this).attr("id")
	});
});