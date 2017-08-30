// Initialize Firebase
  // TODO: Replace with your project's customized code snippet
  const config = {
    apiKey: "AIzaSyCWcPshquCZB_HSWlK7xkFOH_DNvidpAJg",
    authDomain: "rpsmp-81e87.firebaseapp.com",
    databaseURL: "https://rpsmp-81e87.firebaseio.com"
  };
  
  firebase.initializeApp(config);

var user ="";

firebase.auth().onAuthStateChanged(firebaseUser => {
		 console.log(firebaseUser);
		 console.log(user);
	if(firebaseUser){
		firebase.database().ref('users/' + firebaseUser.uid).set({
			username: user,
			weapon: "none",
			wins: 0
		});
	}
});


function submitName(){
	user = $("#username").val();
	varinfo = firebase.auth().signInAnonymously();
}

