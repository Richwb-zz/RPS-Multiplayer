// Handles non-firebase logic passed from firebase

$(document).on("click", ".weapon", function(){

	var updates = {};
	updates['/users/' + localStorage.getItem("uid") + "/weapon"] = $(this).attr("id");

	fdb.ref().update(updates);

});

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