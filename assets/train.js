//Initialize Firebase
var config = {
    apiKey: "AIzaSyBGT3t0S9kffCXcd8RBW9aH2eSKXvsu_FE",
    authDomain: "train-times-d13cf.firebaseapp.com",
    databaseURL: "https://train-times-d13cf.firebaseio.com",
    projectId: "train-times-d13cf",
    storageBucket: "",
    messagingSenderId: "164401567501"
};
firebase.initializeApp(config);

console.log(config);

//Used to access database 
var database = firebase.database();

//Variables for index
var trainName = "";
var destination = "";
var trainDepart = "";
var frequency = "";
var nextArrival = "";
var minutesAway = "";

//Executes after page loads
$(document).ready(function () {

    //Takes form input and pushes the data to firebase
    $('#submitBtn').click(function (event) {

        event.preventDefault();


        trainName = $('#trainName').val().trim();
        destination = $('#trainDestination').val().trim();
        trainDepart = $('#trainFirstTime').val().trim();
        frequency = $('#trainFrequency').val().trim();

        database.ref().push({
            name: trainName,
            destination: destination,
            depart: trainDepart,
            frequency: frequency,
        })


    })

    //When a new child is added to database, create table row with appropriate values
    database.ref().on('child_added', function (snap) {
        

        //current time
        var currTime = moment();
        // converts departTime to unix
        var departTime = moment(snap.val().depart, 'HH:mm Z').format();
        // stores the frequency in a variable
        var freq = snap.val().frequency;
        // calculates the difference between the departTime and the current time
        var difference = moment().diff(moment(departTime), "minutes");
        // calculates the times the train has arrived from first to now
        var timeLeft = moment().diff(moment(departTime), 'minutes') % freq;
        // calculates the amount of minutes left
        var mins = moment(freq - timeLeft, "mm").format('mm');
        // addes minutes to last arrival for next arrival
        var nextTrain = moment().add(mins, "m").format("hh:mm");


        var train = $('<tr>');

        var name = $('<td>');
        var destination = $('<td>');
        var frequency = $('<td>');
        var arrival = $('<td>');
        var untilArrival = $('<td>');

        name.text(snap.val().name);
        destination.text(snap.val().destination);
        frequency.text(snap.val().frequency);
        arrival.text(nextTrain);
        untilArrival.text(mins);

        train.append(name).append(destination).append(frequency).append(arrival).append(untilArrival);

        $('tbody').append(train);

        console.log(currTime);
        console.log(departTime);
        console.log(difference);
        console.log(timeLeft);


    })

})