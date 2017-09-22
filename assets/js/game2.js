var weapons = "";

var timer = 0;
var intervalId;

function modal(status){
	if(status === "hide"){
		$('.modal').modal('hide');
	}else if(status === "static"){
		$('.modal').modal({backdrop: "static"});
	}
}

function readyButton(){
	$("#gameboard").html("<button id='readytoplay'>Ready</button>");
}

// Handles non-firebase logic passed from firebase

function time(event){
	intervalId = setInterval(displayRPS, 1000);
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
		$("#gameboard").html("<div id='rock' class='weapon d-inline-block'><img src='assets/images/rock.png'></div><div id='paper' class='weapon d-inline-block'><img src='assets/images/paper.png'></div><div id='scissors' class='weapon d-inline-block'><img src='assets/images/scissors.png'></div>");
	}else if(timer === 7){
		$("#gameboard").html("Shoot!");
	}else if(timer === 8){
		clearInterval(intervalId);
		timer = 0;
		readyButton();
		$("#gameboard").html($("#gameboard").html() + weaponsArray[0] + weaponsArray[1]);
		;
	}
}

function processRound(snap){
	console.log("snap " + JSON.stringify(snap));
	var weaponone = snap.player1.weapon;
	var weapontwo = snap.player2.weapon;
	var scoreone = snap.player1.wins;
	var scoretwo = snap.player2.wins;
	var ties = snap.ties;

	
	if(snap.player1.id === fbu.uid ){
		weaponsArray[0] = "<div id='yourweapon' class='weapon d-inline-block'><img src='assets/images/" + weaponone + ".png'></image></div>";
	}else{
		weaponsArray[1] = "<div id='thereweapon' class='weapon d-inline-block'><img src='assets/images/" + weaponone + ".png'></image></div>";
	}


	if(snap.player2.id === fbu.uid){	
		weaponsArray[0] = "<div id='yourweapon' class='weapond-inline-block'><img src='assets/images/" + weapontwo + ".png'></image></div>";
	}else{
		weaponsArray[1] = "<div id='thereweapon' class='weapon d-inline-block'><img src='assets/images/" + weapontwo + ".png'></image></div>";
	}


	if(weaponone === weapontwo){
		ties++;
	}else if(weaponone === "rock"){

		if(weapontwo === "scissors"){
			scoreone++;
		}else if(weapontwo === "paper"){
			scoretwo++;
		}
	}else if(weaponone === "paper"){

		if(weapontwo === "rock"){
			scoreone++;
		}else if(weapontwo === "scissors"){
			scoretwo++;
		}
	}else if(weaponone === "scissors"){

		if(weapontwo === "paper"){
			scoreone++;
		}else if(weapontwo === "rock"){
			scoretwo++;
		}
	}
	
	if(scoreone > snap.player1.wins){
		return ["player1" ,scoreone];
	}else if(scoretwo > snap.player2.wins){
		return ["player2", scoretwo];
	}else if(ties > snap.ties){
		return ["ties", scoretwo];
		
	}
};

$(document).on("click", "#findGame", function(){
	getARoom();
});