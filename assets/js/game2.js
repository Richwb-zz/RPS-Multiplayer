var weapons = "";
var weaponsarray = []
var timer = 0;
var intervalId;

function startGame(){
	$("#startgame").html("<button id='startgame'></button>")
}

// Handles non-firebase logic passed from firebase

function time(event){

	intervalId = setInterval(showRPS, 1000);

	return null
}

function displayRPS(){
	timer++;

	if(timer === 1){
		$("#gameboard").html("Rock");
	}else if(timer === 2){
		$("#gameboard").html("Paper");
	}else if(timer === 3){
		$("#gameboard").html("Scissor");
	}else if(timer === 4){
		$("#gameboard").html("<div id='rock' class='weapon d-inline-block'><img src='assets/images/rock.png'></div><div id='paper' class='weapon d-inline-block'><img src='assets/images/paper.png'></div><div id='scissor' class='weapon d-inline-block'><img src='assets/images/scissors.png'></div>");
	}else if(timer === 7){
		$("#gameboard").html("Shoot!");
	}else if(timer === 8){
		clearInterval(intervalId);
		showWeapons();
		$("#gameboard").html(weaponsArray[0] + weaponsArray[1]);
	}

	return null
}

function showWeapons(){
	
	fdb.ref("games/" + channelId)
	.once("value", function(snapshot){

	if(snapshot.val().player1.id === fbu.uid ){
		weaponsArray[0] = "<div id='yourweapon' class='weapon d-inline-block'><img src='assets/images/" + snapshot.val().player1.weapon + ".png'></image></div>";
	}else{
		weaponsArray[1] = "<div id='thereweapon' class='weapon d-inline-block'><img src='assets/images/" + snapshot.val().player1.weapon + ".png'></image></div>";
	}


	if(snapshot.val().player2.id === fbu.uid){	
		weaponsArray[0] = "<div id='yourweapon' class='weapond-inline-block'><img src='assets/images/" + snapshot.val().player2.weapon + ".png'></image></div>";
	}else{
		weaponsArray[1] = "<div id='thereweapon' class='weapon d-inline-block'><img src='assets/images/" + snapshot.val().player2.weapon + ".png'></image></div>";
	}

});

	return weaponsarray[0];
}

$(document).on("click", "#findGame", function(){
	getARoom();
});