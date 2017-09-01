$(document).ready(function(){

	$("#play").on("click", function(){
		$("#gameboard").empty();
		if(!loggedIn()){
			$("#gameboard").html("<form id='nameform'><input id='username' type='text' placeholder='name'></input><input id='submit' type='submit' value='Submit'></input></form>");
		}else{
			displayRPS();
		}
	});


	$(document).on("submit", function(event){
		event.preventDefault();
		submitName();
		findGame();
		//displayRPS(event);
	});

	function waitingForPlayer(){
		$("#gameboard").html("<h1>Waiting for Opponent</h1>");
	}

	function displayRPS(event){

		timeOut("Rock", 1000);
		timeOut("Paper", 2000);
		timeOut("Scissor", 3000);
		timeOut("<div id='rock' class='weapon d-inline-block'> </div><div id='paper' class='weapon d-inline-block'> </div><div id='scissor' class='weapon d-inline-block'></div>",
			4000);
		timeOut("Shoot!", 7000);

		showRound();

		return null
	}

	function findGame(){
		$("#gameboard").html("<button id='findGame'>Find Game</button>");
	}

	// $(document).on("weapon","click", function(){

	// // Upload weapon to database

	// });

	function timeOut(printOut, time){
		setTimeout(function(){
			$("#gameboard").html(printOut);
		}, time);

		return null
	}


	function showRound(){
		

		$("#gameboard").html("<div class='weapon d-inline-block' data-weapon=''><div class='weapon d-inline-block' data-weapon=''>")
	}

});

