/* 
JavaScript : Find the Penguins Project 
Group Members: Damanpreet Singh Grewal , Zhoha Damani, Yashkumar Patel, Vipulkumar Gupta and Neelkumar Patel
Project Group No: 9
Description : This index.js contains the logic of the find the penguins game , when each mound is clicked a penguin or a yeti can pop up, if yeti pops up then the game ends,
if a penguin pops up then the score is increemented, the game ends when a yeti pops up. Also the position of yeti is randomized when the application is restarted 
or when the restart game button is clicked. Once a yeti pops up the other penguins should reside. 
*/

"use strict";

//Function that returns a Random number between 0 and the Maximum Number that is passed as an Argument to this Function
var getRandomNumber = function (max) {
  var random;
  if (!isNaN(max)) {
    random = Math.random(); //value >= 0.0 and < 1.0
    random = Math.floor(random * max); //value is an integer between 0 and max - 1
    random = random + 1; //value is an integer between 1 and max
  }
  return random;
};

//This method will run once the page DOM is ready to execute JavaScript code
$(document).ready(function () {
  var gameEnd = false; //Variable to flag if the game has ended once yeti is found

  var currentScore = 0;
  var penguinClickAudio = new Audio("../code_files/audio/PenguinClick.wav"); //Initialize audio file that will play when each mound is clicked
  var foundYetiAudio = new Audio("../code_files/audio/FoundYeti.wav"); //Initialize audio file that will play when yeti pops up
  var gameRestartAudio = new Audio("../code_files/audio/GameRestart.mp3"); //Initialize audio file that will play when the reset button is clicked/game restarts

  //Declare an Array that stores all the Characters of this Game
  var characterArray = [
    "penguin1",
    "penguin2",
    "penguin3",
    "penguin4",
    "penguin5",
    "penguin6",
    "penguin7",
    "penguin8",
    "penguin9",
    "penguin10",
    "penguin11",
    "yeti",
  ];

  //Get the Highest Score from Session Storage if its present , or else reset the High Score to 0 when a new Game is started and store in the Session Storage
  if (sessionStorage.highestScore) {
    $("#highest").text(sessionStorage.highestScore);
  } else {
    sessionStorage.setItem("highestScore", 0);
    $("#highest").text(sessionStorage.highestScore);
  }

  var divIds = $("div"); //Get all the divs in divIds Array
  var charDivs = []; //Declare a blank array that will later store all the divs that contain Penguins and Yeti

  //Iterate over all the divs in the Index File to filter out the non Penguins or Yeti and add them in a array called charDivs
  for (let i = 0; i < divIds.length; i++) {
    if (
      $(divIds[i]).attr("id") != "gameholder" && //filter our the gameholder div
      $(divIds[i]).attr("id") != "title" && //filter our the title div
      $(divIds[i]).attr("id") != "score_board" && //filter our the score_board div
      $(divIds[i]).attr("id") != "reset" //filter our the reset div
    ) {
      charDivs[charDivs.length] = divIds[i]; //add all the Penguins and Yeti divs into charDivs Array
    }
  }

  //Function that will randomize the position of Penguins and the Yeti when the game is started or restarted
  //the Idea here is to swap the value of id attributes in a random order using the random function declared above
  var randomize = function () {
    for (let i = 0; i < charDivs.length; i++) {
      var random = getRandomNumber(characterArray.length);

      var swapId1 = "";
      var swapId2 = "";
      var temp = "";

      swapId1 = $(charDivs[i]).attr("id");
      swapId2 = $(charDivs[random]).attr("id");

      temp = swapId2;
      swapId2 = swapId1;
      swapId1 = temp;

      $(charDivs[i]).attr("id", swapId1);
      $(charDivs[random]).attr("id", swapId2);
    }
  };

  randomize(); //Run the Randomize function

  //Event Handler Function that is linked to the 'on click' event of the Penguins and Yeti (characters) divs
  $(charDivs).click(function (evt) {
    //check if the game has not ended
    if (gameEnd == false) {
      const target = evt.currentTarget; //get the div that was clicked in the current Target

      var currentId = $(target).attr("id"); //get the id of the div that was clicked

      $(target).attr("class", currentId); //add a class to the div that was clicked , and the value of the class will same as the id attribute

      if (currentId != "yeti") {
        //check if the clicked div is not a yeti
        penguinClickAudio.play(); //play a sound when a penguin pops up
        currentScore++; //increment the score
        $("#current").text(currentScore); //display the score in the scoreboard
      } else {
        //yeti has been encountered
        gameEnd = true; //set the gameEnd flag to true to denote that the game has ended
        foundYetiAudio.play(); //play this sound when yeti pops up

        //Make all the other penguins dissappear when yeti pops up
        for (let i = 0; i < charDivs.length; i++) {
          if ($(charDivs[i]).attr("id") != "yeti") {
            $(charDivs[i]).removeAttr("class");
          }
        }

        //check if current score is the new High score - if Yes update the High score in Session Storage
        if (sessionStorage.highestScore < currentScore) {
          sessionStorage.highestScore = currentScore;

          $("#highest").text(currentScore); //display the High score in the scoreboard

          alert(
            "Yeti ate you but you have achieved new High Score: " + currentScore
          ); //Display an alert that Yeti ate you and display current Score which is the new High score
        } else {
          alert("Yeti ate you! Your score is " + currentScore); //Display an alert that Yeti ate you and display current Score
        }
        $("#reset").removeAttr("class"); //show the reset Button once the game has ended
      }
    } else {
      alert("Game has ended! Please restart the Game!"); //Display an alert if any mound is clicked again , when the game has ended
    }
  });

  //Event Handler Function that is linked to the 'on click' event of the Reset Button
  $("#reset").click(function () {
    gameRestartAudio.play(); //play this sound when the game is restarted

    //Reload the application with a delay of 1 sec
    setTimeout(function () {
      location.reload();
    }, 1000);
  });
}); //End of Ready Function
