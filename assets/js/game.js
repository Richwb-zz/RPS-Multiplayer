// Handles non-firebase logic and can pass information to firebase
$(document).ready(function(){

	// When play button is clicked check loggedIn function in firebase.js ..../
	// If not logged in then display the name form goto ..../
	$("#play").on("click", function(){
		$("#gameboard").empty();
		if(!loggedIn()){
			$("#gameboard").html("<form id='nameform'><input id='username' type='text' placeholder='name'></input><input id='submit' type='submit' value='Submit'></input></form>");
		}
	});

	// After name is submitted call submitName in firebase.js ..../
	// call findGame function in this file ..../
	$(document).on("submit", function(event){
		event.preventDefault();
		submitName();
		findGame();
	});

	// Display the find game button to search for games
	// click function can be found in firebase.js on ..../
	function findGame(){
		$("#gameboard").html("<button id='findGame'>Find Game</button>");
	}

});