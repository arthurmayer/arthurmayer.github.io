/*
Towers of Hanoi
CSCI446 - Web Developement
Dallas Anderson, Robert Imbler, Arthur Mayer
*/


var gameLost = false;
var gameStart = false;
var brickColors = [];
var poleColor = 'grey';
var moveCount = 0;
var highScore = 0;
var bricks = [];
var poles = [];
var difficulty = 5; // 5, 6, 7
var difficultyDict = {'easy' : 5, 'medium':6, 'hard':7};
var movesDict = {1:50, 5:50, 6:100, 7:200};
var poleTops = [0,0,0];
var isMuted = false;
var scoreName = "";
// BUTTON FUNCTIONS
function setName(){
    scoreName = window.prompt("Enter a name for the highscore", "Hanoi").toString();
    if (typeof(Storage) != "undefined") {
        localStorage.setItem("HanoiName", scoreName);
    } else {
        //alert no highscore kept
        alert("Sorry, your browser does not support Web Storage, Highscore will not be saved");
    }
    //update highscore if any update
    document.getElementById("scorename").innerHTML="Scored by: " + localStorage.getItem("HanoiName").toString();
}
//reset name
function resetName(){
    // Check browser support
    if (typeof(Storage) != "undefined") {
        localStorage.setItem("HanoiName", "Hanoi");
    } else {
        //alert no highscore kept
        alert("Sorry, your browser does not support Web Storage, Highscore will not be saved");
    }
    //update highscore if any update
    document.getElementById("scorename").innerHTML="Scored by: " + localStorage.getItem("HanoiName").toString();
}
// manage the mute functionality of the game
function mute() {
    // invert mute setting on click and modify button text
    if (isMuted) {
        isMuted = false;
        document.getElementById("get").muted = false;
        document.getElementById("mute-btn").innerHTML = "Mute";
    }
    else {
        isMuted = true;
        document.getElementById("get").muted = true;
        document.getElementById('mute-btn').innerHTML = "Un-Mute";
    }
}
function difficultyChange(ev) {
    elem = document.getElementById("difficultyRadio");
    for (var i = 0; i< elem.length; i++) {
        if(elem[i].checked) {
            output = (elem[i].value);
            difficulty = difficultyDict[elem[i].value];
        }
    }
    //console.log(elem, ev);
    console.log("changed to " + output + " difficulty!");
    createTable();
}

// GAME FUNCTIONS

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    //Check if block can be moved
    var tar = ev.target;
    var canDrop = true;
    if (moveCount < 1) {
        alert("You are out of moves! Please try again!");
        return;
    }
    moveCount--;
    document.getElementById("move_count").innerHTML = ("Move Count: " + moveCount);
    if (tar.id <= 3 * (difficulty - 1)) {
        while (tar.id <= 3 * (difficulty - 1) && document.getElementById((parseInt(tar.id, 10) + 3).toString()).innerHTML == "") {
            document.getElementById((parseInt(tar.id, 10) + 3).toString()).innerHTML = tar.innerHTML;
            tar.innerHTML = "";
            tar = document.getElementById((parseInt(tar.id, 10) + 3).toString());
        }
    }
    
    if (tar.id <= 3 * (difficulty - 1)){
        canDrop = document.getElementById((parseInt(tar.id, 10) + 3)).innerHTML > image;
    }
    if (srcId > 3){
        if (document.getElementById((parseInt(srcId, 10) - 3)).innerHTML != "") {
            canDrop = false;
        }
    }
    if(canDrop ){
        document.getElementById("get").play();
    }
    if (!canDrop && !isMuted) {
        document.getElementById("err").play();
    }
    if (ev.target.tagName != "IMG" && canDrop) {
        tar = ev.target;
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
        if (tar.id <= 3 * (difficulty - 1)) {
            while (tar.id <= 3 * (difficulty - 1) && document.getElementById((parseInt(tar.id, 10) + 3).toString()).innerHTML == "") {
                document.getElementById((parseInt(tar.id, 10) + 3).toString()).innerHTML = tar.innerHTML;
                tar.innerHTML = "";
                tar = document.getElementById((parseInt(tar.id, 10) + 3).toString());
            }
        }
    }
    if (moveCount == 0) {
        setTimeout(alert("You are out of moves!"), 3000);
    }
    if (document.getElementById('3').innerHTML!=''){
        alert("you win!");
        console.log('Player wins with '+moveCount + ' movevs left!');
        saveScore(moveCount);
    }
}

function reset(){
	createTable();
}

//function call for saving score
function saveScore(score){
    // Check browser support
    if (typeof(Storage) != "undefined") {
        //called first so set name 
        if(localStorage.getItem("HanoiName") == null){
            localStorage.setItem("HanoiName", "Hanoi");
        }
        // Store if score is greater than highscore
        if(score > localStorage.getItem("HighscoreHanoi")){
            localStorage.setItem("HighscoreHanoi", score);
            localStorage.setItem("HanoiName", prompt("Please Enter your Name, Winner!", 'Hanoi'));
        }
    } else {
        //alert no highscore kept
        alert("Sorry, your browser does not support Web Storage, Highscore will not be saved");
    }
    //update highscore if any update
    document.getElementById("highscore").innerHTML="Best Move Count: " + localStorage.getItem("HighscoreHanoi").toString();
    document.getElementById("scorename").innerHTML="Scored by: " + localStorage.getItem("HanoiName").toString();
}
//reset highscore
function resetHighScore(){
    localStorage.setItem("Highscore", 150);
    document.getElementById("highscore").innerHTML="Best Move Count: 0";
    document.getElementById("scorename").innerHTML="Scored by: " 
    localStorage.setItem("HanoiName", 'Hanoi');
    localStorage.setItem("HighscoreHanoi",0);
}


// SUPERFICIAL GAME LOGIC

//init();



var image;
var srcId;


function changeId(img) {
    image = img.innerHTML;
    srcId = img.id;
}



function createTable() {
    var rowNum = 0;
    var index = 0;
    var table = document.getElementById("board_table");
    moveCount = movesDict[difficulty];
    document.getElementById("move_count").innerHTML = ("Move Count: " + moveCount);
    table.innerHTML = "";
	for (var j=0; j<difficulty; j++){
		var row = table.insertRow(rowNum);
		rowNum++;
		for(var i=0; i<3; i++) {
			//var ID = j*DIMENSION + i + 1;
			var newcell = row.insertCell(i);
			if (i==0){
			    newcell.innerHTML = "<div id=" + (++index).toString() + " ondragstart='changeId(this)' ondrop='drop(event)' ondragover='allowDrop(event)'><img src='./images/hanoi" + (j + 1).toString() + ".png' onclick='changeId(this)' draggable='true' ondragstart='drag(event)' width='100%' id='img" + index.toString() + "'></div>";
			}
			else{
			    newcell.innerHTML = "<div id=" + (++index).toString() + " ondragstart='changeId(this)' ondrop='drop(event)' ondragover='allowDrop(event)' width='100%'></div>";
			}
		}
	}
}

createTable();


















/*
Challenge 3 - Towers of Hanoi
This assignment is worth 20 points. Requirements:
(2) Page layout with game board, remaining move count, mute button, and reset button
(2) Difficulty setting with 5, 6, 7 pieces
(2) Changing difficulty resets game and resets score appropriately
(4) Dragging Hanoi blocks follows mouse correctly
(2) Blocks snap into position if dropped close to post
(2) Bigger blocks placed on smaller blocks return to previous position
Sounds play when blocks move:
	(2) Correctly and incorrectly with different sounds
	(2) Mute button works as expected
(2) High Score and Name is saved between sessions
*/
