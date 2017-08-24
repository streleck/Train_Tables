// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAmaFqUzFQrMLanfbtlrGTkaKMBQQ79Zlw",
    authDomain: "train-tables.firebaseapp.com",
    databaseURL: "https://train-tables.firebaseio.com",
    projectId: "train-tables",
    storageBucket: "train-tables.appspot.com",
    messagingSenderId: "61607102759"
  };
  firebase.initializeApp(config);

var database = firebase.database();

//when the submit button is clicked
$(".btn").on("click", function(event){

	//make sure the page doesn't immediately refresh
	event.preventDefault();

	//get values from input fields
	trainName = $("#train-name").val().trim();
	destination = $("#destination").val().trim();
	firstTrain = $("#first-train").val().trim();
	frequency = $("#frequency").val().trim();

	//if train start time is properly formatted, enter object into database
	if ((firstTrain[2] === ":") && (firstTrain.length === 5)){
		database.ref().push({
			trainName: trainName,
			destination: destination,
			firstTrain: firstTrain,
			frequency: frequency,
			dateAdded: firebase.database.ServerValue.TIMESTAMP,
		})
	}
	else{
		alert("//Time must be entered in 'HH:MM', military time")
	}
});

//when a new entry is added to the database, calculate times and display in table
database.ref().on("child_added", function(snapshot){
	
	//use moment() to put date onto firstTrain for mathing
	var firstTrainFormat = moment().format("MM/DD/YY") + " " +snapshot.val().firstTrain;
		
	//get int for time elapsed since first train
	var timeSinceFirst = parseInt(moment().diff(firstTrainFormat, "minutes"));
	
	//if train hasn't started running yet, set next arrival at start time
	 if(timeSinceFirst < 0){
		var arrivalTime = snapshot.val().firstTrain;
		var nextTrain = -(timeSinceFirst)

	}
	else{
		//remainder divide that by the frequency, telling you how long ago the last arrival was
		var lastTrain = timeSinceFirst % parseInt(snapshot.val().frequency);
		//subtract that from frequency to get time until next train
		var nextTrain = parseInt(snapshot.val().frequency) - lastTrain;
		//add that to current time to get next arrival time
		var arrivalTime = moment().add(nextTrain, "minutes").format("HH:mm");
	}

	$("#tablebody").append(
		$("<tr><td>" + snapshot.val().trainName + "</td>" +
		"<td>" + snapshot.val().destination + "</td>" +
		"<td>" + snapshot.val().firstTrain + "</td>" +
		"<td>" + snapshot.val().frequency + "</td>" +
		"<td>" + arrivalTime + "</td>" +
		"<td>" + nextTrain + "</td></tr>")
		);
})

