// Initialize Firebase
  // TODO: Replace with your project's customized code snippet
  const config = {
    apiKey: "AIzaSyCWcPshquCZB_HSWlK7xkFOH_DNvidpAJg",
    authDomain: "rpsmp-81e87.firebaseapp.com",
    databaseURL: "https://rpsmp-81e87.firebaseio.com"
  };
  
  firebase.initializeApp(config);

firebase.auth().signOut();

var user ="";

firebase.auth().onAuthStateChanged(firebaseUser => {
		 console.log(firebaseUser);
		 console.log(user);
	if(firebaseUser && !loggedIn()){
		firebase.database().ref('users/' + firebaseUser.uid).set({
			username: user,
			weapon: "none",
			wins: 0
		});
		localStorage.setItem("uid", firebaseUser.uid)
	}
});


function submitName(){
	user = $("#username").val();
	varinfo = firebase.auth().signInAnonymously();
}

function loggedIn(){
	
	if(localStorage.getItem("uid")){
			return true;
	}
}
		// var ref = firebase.database().ref("users/" + localStorage.getItem("uid"));
			// ref.once("value")
			// 	.then(function(snapshot){
			// 		console.log("snap1: " + snapshot);
			// 		console.log("snap: " + JSON.stringify(snapshot));
			// 		var name = snapshot.child("username").val();
			// 		console.log("Name: " + name);

			// 	})

$(document).on("click", ".weapon", function(){

	var updates = {};
	updates['/users/' + localStorage.getItem("uid") + "/weapon"] = $(this).attr("id");

	firebase.database().ref().update(updates);

});