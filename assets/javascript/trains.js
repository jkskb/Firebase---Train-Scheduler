// Initialize Firebase
var config = {
apiKey: "AIzaSyB0_XMs5QHYNVNodFCVn_Ab2U2f3jWCkmo",
authDomain: "trainscheduler-70557.firebaseapp.com",
databaseURL: "https://trainscheduler-70557.firebaseio.com",
projectId: "trainscheduler-70557",
storageBucket: "trainscheduler-70557.appspot.com",
messagingSenderId: "771996164484"
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// Initial Values

var now = moment();
console.log("CURRENT TIME: " + moment(now).format("hh:mm a"));

//timer- Clock located in header
$("#timer").text(now.format("hh:mm a"));

//sound to play train whistle on submit-- does not function. Left in to fiddle with it
//var audio = new Audio('assets/images/allaboard.mp3');
//$('.btn').click( audio.play );

//add train on click
$("#add-train").on("click", function(event) {
    event.preventDefault();

    // Grab user input
    var trainName = $("#add-name").val().trim();
    var trainDest = $("#add-dest").val().trim();
    var trainNext = $("#add-next").val().trim();
    var trainFreq = $("#add-freq").val().trim();

    //temp object for holding train data
    var newTrain = {
        name: trainName,
        dest: trainDest,
        next: trainNext,
        freq: trainFreq,
    };

    // Upload train data to the database
    database.ref().push(newTrain);


    // Log train data to console
    console.log(newTrain.name);
    console.log(newTrain.dest);
    console.log(newTrain.next);
    console.log(newTrain.freq);


    // Clears all of the text-boxes
    $("#add-name").val("");
    $("#add-dest").val("");
    $("#add-next").val("");
    $("#add-freq").val("");
});

//Add train to Firebase database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything to a variable.
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().dest;
    var trainNext = childSnapshot.val().next;
    var trainFreq = childSnapshot.val().freq;

    // Colsole log train info
    console.log(trainName);
    console.log(trainDest);
    console.log(trainNext);
    console.log(trainFreq);

    
    // Prettify the employee start DO I NEED THIS???
    //var empStartPretty = moment.unix(empStart).format("MM/DD/YYYY");

    
    // Assumptions
    //var trainFreq = 3;

    // Time is 3:30 AM
    //var trainNext = "03:30";

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(trainNext, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % trainFreq;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = trainFreq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm a");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainFreq),
        $("<td>").text(nextTrain),
        $("<td>").text(tMinutesTillTrain),
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
});