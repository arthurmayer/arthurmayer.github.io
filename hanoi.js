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
var lastDifficulty = 5; //compared for checked
var poleTops = [0,0,0];
var isMuted = false;
//get radio button
var difficulties = document.getElementById("difficulty");

// BUTTON FUNCTIONS

// manage the mute functionality of the game
function mute() {
    // invert mute setting on click and modify button text
    if (isMuted) {
        isMuted = false;
        //mute sounds
        document.getElementById("mute-btn").innerHTML = "Mute";
    }
    else {
        isMuted = true;
        //unmute sounds
        document.getElementById('mute-btn').innerHTML = "Un-Mute";
    }
}
//reset highscore
function resetHighScore(){
    setDifficulty();
}

//radio difficulty setting
function setDifficulty(){
    //check all buttons for checked
    for(var i=0, length = difficulties.length; i < length; i++){
        if(difficulties[i].checked){
            difficulty = difficulties[i].value;
        }
    }
    
    //difficulty has changed, reset
    if(difficulty != lastDifficulty){
        lastDifficulty = difficulty;
        //update best moves
        switch(lastDifficulty){
            case 5:
                setHighscore(31);
                break;
            case 6:
                setHighscore(63);
                break;
            case 7:
                setHighscore(127);
        }
    }
    console.log(difficulty);
}
// CLASS DECLARATIONS

class Pole {
    constuctor(index){
        this.color = poleColor;
        this.x = poleSpacing * index + offset;
        this.y = offset;
    }
}

class Brick {
    constructor(size){
        this.size = size;
        this.image = "./images/Hanoi" + size.toString + ".png";
    }
    // 'Shift less than'
    slt(brick) {
        return this.size < brick.size;
    }
}

// GAME FUNCTIONS

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    event.target.appendChild(document.getElementById(data));
}

// init global game pieces
function init() {
    //make bricks
    for (var i = 1; i<8; i++){
        bricks.push(new Brick(i))
        document.getElementById("row" + i.toString() + "1").innerHTML += 
        '<img id="drag' + i.toString + ' src=' + bricks[i-1].image.toString + ' draggable="true" ' 
        + 'ondragstart="drag(event)"/>';
    }
    /*
    document.getElementById("hanoi_display").innerHTML += '<table style="width:100%">';
    for (var i = 0; i < 7; i++) {
        document.getElementById("hanoi_display").innerHTML += '<tr name=' + i.toString + '>';
        for (var j = 0; j < 3; j++) {
            document.getElementById("hanoi_display").innerHTML += '<td>'
                + '<div id="div' + i.toString + j.toString + '" ondrop="drop(event) ondragover="allowDrop(event)">stuff</div></td>';
        }
        document.getElementById("hanoi_display").innerHTML += '</tr><br/>';
    }
    document.getElementById("hanoi_display").innerHTML += '</table>';
    
    for (var i = 0; i < difficulty; i++){
        if (i < 3) {
            poles.push(new Pole(i))
        }
        bricks.push(new Brick(i))
    }
    console.log("Variables initialized")
    */
}

// Draw Pole
function drawPole(pole) {
    context.beginPath();
    context.fillStyle = pole.color;
    context.fillRect(pole.x, pole.y, brickSize, poleHeight);
    //console.log("Pole drawn");
}

//Draw Brick
function drawBrick(brick) {
    context.beginPath();
    context.fillStyle = brick.color;
    context.fillRect(brick.x, brick.y, brick.width, brickSize);
    //console.log("Brick drawn");
}

// Draw line at the base of the canvas 
function drawBase(){
    context.beginPath();
    context.strokeStyle = 'dimgrey';
    context.lineWidth = 1.0;
    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(400, 0);
    context.stroke();
}

// Recurrent Draw all Elem fxn
function drawGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBase();
    for (item in poles) {
        drawPole(item);
    }
    for (item in bricks) {
        drawBrick(item);
    }
}

function reset(){
	init();
}

//function call for saving score
function saveScore(score){
    // Check browser support
    if (typeof(Storage) != "undefined") {
        // Store if score is greater than highscore
        if(score > localStorage.getItem("HighscoreHanoi")){
            localStorage.setItem("HighscoreHanoi", score);
        }
    } else {
        //alert no highscore kept
        alert("Sorry, your browser does not support Web Storage, Highscore will not be saved");
    }
    //update highscore if any update
    document.getElementById("highscore").innerHTML="Best Move Count: " + localStorage.getItem("HighscoreHanoi").toString();
}
//used for radio change
function setHighscore(score){
    // Check browser support
    if (typeof(Storage) != "undefined") {
        // Store if score is greater than highscore
        localStorage.setItem("HighscoreHanoi", score);
        
    } else {
        //alert no highscore kept
        alert("Sorry, your browser does not support Web Storage, Highscore will not be saved");
    }
    //update highscore if any update
    document.getElementById("highscore").innerHTML="Best Move Count: " + localStorage.getItem("HighscoreHanoi").toString();
}

// SUPERFICIAL GAME LOGIC

init();

/*
Challenge 3 - Towers of Hanoi
This assignment is worth 20 points. Requirements:
(2) Page layout with game board, remaining move count, mute button, and reset button
 
 Checkeroo
(2) Difficulty setting with 5, 6, 7 pieces
(2) Changing difficulty resets game and resets score appropriately
check
(4) Dragging Hanoi blocks follows mouse correctly


(2) Blocks snap into position if dropped close to post
(2) Bigger blocks placed on smaller blocks return to previous position
Sounds play when blocks move:
	(2) Correctly and incorrectly with different sounds
	(2) Mute button works as expected

    check
(2) High Score and Name is saved between sessions
*/
