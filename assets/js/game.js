// Handles non-firebase logic and can pass information to firebase
$(document).ready(function(){

	// When play button is clicked check loggedIn function in firebase.js ..../
	// If not logged in then display the name form goto ..../
	$("#play").on("click", function(){
		$("#gameboard").empty();
		if(!loggedIn()){
			$("#gameboard").html("<form id='nameform'><input id='username' type='text' placeholder='name'></input><input id='namesubmit' type='submit' value='Submit'></input></form>");
		}
	});

	// After name is submitted call submitName in firebase.js ..../
	// call findGame function in this file ..../
	$(document).on("click", "#namesubmit", function(event){
		event.preventDefault();
		submitName();
		findGame();
	});

	$(document).on("click", "#chatsubmit", function(event){
		event.preventDefault();
		chat();
		$("#chattext").val("");
		
	});

	// Display the find game button to search for games
	// click function can be found in firebase.js on ..../
	function findGame(){
		$("#gameboard").html("<button id='findGame'>Find Game</button>");
	}

	
	$("#leaveGame").on("click", function(){
		
		chat(fbu.displayName + " has left the game");
		fdb.ref("games/" + channelId  + "/game").off();
		fdb.ref("games/" + channelId  + "/chat").off();

		$("#player1").addClass("hide");
		$("#player2").addClass("hide");
		$("#channelties").addClass("hide");
		$("#chatbox").addClass("hide");
		$("#leaveGame").addClass("hide");
		$("#player1name").text("");
		$("#player2name").text("");
		$("#player1score").text("");
		$("#player2score").text("");
		$("#channel").text("");
		$("#ties").text("");

		$("#chatwindow").text("");
		$("#chattext").text("");

		//make or send to function to remove
		deleteGame("player");

		findGame();
	
});

});