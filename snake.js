var canvas = document.getElementById("board");
var context = canvas.getContext("2d");
var gridSize = 10;
var snakeLength = 3;
var gameLost = false;
var paused = false;
var gameStart = false;
var snakeColor = 'red';
var appleColor = 'green';
var gameSpeed = 20.0 //fps
var startX = canvas.width/(gridSize*2);
var startY = canvas.width/(gridSize*2);
var startDirection = 'up';
var playerScore = 0;
var prevScore = playerScore;
var needNewApple = false;
var hasReset = false;
var invincibility = false;
var timer;
var snake;
var apple;
var muted = false;
var newHighscore = false;
var scoreName = "";
window.onkeydown = function(e){
	if (!gameStart){
		gameStart = true;
		return;
	}
	let key = e.key || e.keyCode;
	switch(key) {
		case "ArrowLeft":
		case 37:
			snake.direction = 'left';
			break;
		case "ArrowUp":
		case 38:
			snake.direction = 'up';
			break;
		case "ArrowRight":
		case 39:
			snake.direction = 'right';
			break;
		case "ArrowDown":
		case 40:
			snake.direction = 'down';
			break;
		case 80:
		case "p":
			paused = !paused;
			break;
		case 73:
		case "i":
			invincibility = !invincibility;
			break;
		case 75:
		case "r":
			reset();
			break;
	}
}
//mute button
function mute(){
    if(muted == false){
        document.getElementById("get").muted = true;
        document.getElementById("die").muted = true;
        document.getElementById("mute").innerHTML="un-mute";
        console.log("muted");
        muted = true;
    }
    else{
        muted = false;
        document.getElementById("get").muted = false;
        document.getElementById("die").muted = false;
        document.getElementById("mute").innerHTML="mute";
        console.log("unmuted");
    }
    
}
function setName(){
    scoreName = window.prompt("Enter a name for the highscore", "Snake").toString();
    if (typeof(Storage) != "undefined") {
        localStorage.setItem("SnakeName", scoreName);
    } else {
        //alert no highscore kept
        alert("Sorry, your browser does not support Web Storage, Highscore will not be saved");
    }
    //update highscore if any update
    document.getElementById("scorename").innerHTML="Scored by: " + localStorage.getItem("SnakeName").toString();
    
}
//reset name
function resetName(){
    // Check browser support
    if (typeof(Storage) != "undefined") {
        // Store if score is greater than highscore
        localStorage.setItem("SnakeName", "Snake");
    } else {
        //alert no highscore kept
        alert("Sorry, your browser does not support Web Storage, Highscore will not be saved");
    }
    //update highscore if any update
    document.getElementById("scorename").innerHTML="Scored by: " + localStorage.getItem("SnakeName").toString();
}
//function call for saving score
function saveScore(score){
    // Check browser support
    if (typeof(Storage) != "undefined") {
        // Store if score is greater than highscore
        if(localStorage.getItem("HighscoreSnake") == null){
            localStorage.setItem("HighscoreSnake", 0);
        }
        if(score > localStorage.getItem("HighscoreSnake")){
            newHighscore = true;
            localStorage.setItem("HighscoreSnake", score);
        }
	if(localStrage.getitem("SnakeName") == null{
	   localStorage.setItem("SnakeName", "Snake");
    	}
    } else {
        //alert no highscore kept
        alert("Sorry, your browser does not support Web Storage, Highscore will not be saved");
    }
    //update highscore if any update
    document.getElementById("highscore").innerHTML="High Score: " + localStorage.getItem("HighscoreSnake").toString();
    document.getElementById("scorename").innerHTML="Scored by: " + localStorage.getItem("SnakeName").toString();
}
//reset highscore
function resetHighScore(){
    localStorage.setItem("HighscoreSnake", 0);
    document.getElementById("highscore").innerHTML="High Score: " + localStorage.getItem("HighscoreSnake").toString();
}
//Draw square at these coordinates.
//Treat each cell as a point.
//The lower left cell is (0,0).
//Cell size is accounted for when drawing the squares.
//Example: drawSquare(0, 0, 'red');
//Example: drawSquare(23, 54, '#005537');
function drawSquare(x, y, color){
	context.beginPath();
	context.fillStyle = color;
	//Manipulate x and y so that square ends up where you expect it to.
	context.fillRect(x*gridSize, canvas.width-((y+1)*gridSize), gridSize, gridSize);
}

function removeSquare(x, y){
	context.clearRect(x*gridSize, canvas.width-((y+1)*gridSize), gridSize, gridSize);
	
}
	
//Draw game grid
function drawGrid(){
	context.beginPath();
	context.strokeStyle = 'dimgrey';
	context.lineWidth = 0.75;
	context.beginPath();
	for (var x =0; x<canvas.width; x+= gridSize){
		context.moveTo(x,0);
		context.lineTo(x, canvas.height);
	}
	for (var y=0; y<canvas.height; y+=gridSize){
		context.moveTo(0, y);
		context.lineTo(canvas.width, y);
	}
	context.stroke();
}

class Square{
	//Square of size gridSize with lower left corner at (x, y)
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	equals(sqr){
		return this.x == sqr.x && this.y == sqr.y;
	}
}

class Snake{
	constructor(headX, headY, direction){
		this.color = snakeColor;
		this.length = snakeLength;
		this.headX = headX;
		this.headY = headY;
		this.direction = direction;
		this.locations = [new Square(this.headX, this.headY, this.color)];
		for (var i = 1; i<this.length; i++){
			if (this.direction == 'right'){
				this.locations.push(new Square(this.headX-i, this.headY, this.color));
			}
			else if (this.direction == 'left'){
				this.locations.push(new Square(this.headX+i, this.headY, this.color));
			}
			else if (this.direction == 'down'){
				this.locations.push(new Square(this.headX, this.headY+i, this.color));
			}
			else if (this.direction == 'up'){
				this.locations.push(new Square(this.headX, this.headY-i, this.color));
			}
			else {
				console.log("Invalid direction");
			}
		}
	}
	draw(){
		for (var i =0; i<this.locations.length; i++){
			drawSquare(this.locations[i].x, this.locations[i].y, this.color);
		}
	}
	check(){
		if(this.locations[0].x > canvas.width/gridSize-1
			|| this.locations[0].x < 0
			|| this.locations[0].y < 0
			|| this.locations[0].y > canvas.height/gridSize-1){
				gameLost = true;
				return;
		}
		for (var j = 1; j<this.locations.length; j++){
			if (this.locations[0].equals(this.locations[j])){
				gameLost = true;
				return;
			}
		}
		if (this.locations[0].equals(apple)){
			needNewApple = true;
			document.getElementById("get").play();
			playerScore++;
		}
	}
}

function generateApple(){
	apple = new Square(Math.floor(Math.random()*canvas.width/gridSize)%(canvas.width/gridSize), Math.floor(Math.random()*(canvas.width/gridSize))%(canvas.width/gridSize), appleColor);
	drawApple();
}

function drawApple(){
	drawSquare(apple.x, apple.y, appleColor);
}

function updateGame(){
	//Add head
	if (snake.direction == 'left'){
		snake.locations.unshift(new Square(snake.locations[0].x-1, snake.locations[0].y, snake.color));
	}
	else if (snake.direction == 'right'){
		snake.locations.unshift(new Square(snake.locations[0].x+1, snake.locations[0].y, snake.color));
	}
	else if (snake.direction == 'up'){
		snake.locations.unshift(new Square(snake.locations[0].x, snake.locations[0].y+1, snake.color));
	}
	else if (snake.direction == 'down'){
		snake.locations.unshift(new Square(snake.locations[0].x, snake.locations[0].y-1, snake.color));
	}

	//Remove tail if player didn't eat apple
	if (prevScore == playerScore){
		snake.locations.pop();
	}
	else{
		prevScore = playerScore;

		//Update score
		document.getElementById("score").innerHTML = "Your Score: " + playerScore.toString();
        //check if player score constitutes a high score and update
        
	}
    saveScore(playerScore);
}

function reset(){
	if (hasReset){
		return;
	}
    saveScore(playerScore);
	hasReset = true;
	invincibility=false;
	playerScore = 0;
	prevScore = 0;
	document.getElementById("score").innerHTML = "Your Score: "+playerScore.toString();
	context.clearRect(0,0,canvas.width, canvas.height);
	console.log("RESETTING");
	gameLost = false;
	gameStart = false;
	paused = false;
	snake = new Snake(startX, startY, startDirection);
	snake.draw();
	generateApple();
	drawGrid();
	//drawGame();
	timer=setInterval(drawGame, 1000.0/gameSpeed);
}

function drawGame(){
	if (!paused && gameStart){
		if (gameLost){
			console.log("Game Over");
			clearInterval(timer);
			hasReset = false;
			document.getElementById("die").play();
			setTimeout(function(){
				if (playerScore<20){
					alert("You died. Try again.");
					reset();
				}
				else{
					alert("You died, but your score was high enough. Good job!");
					document.getElementById("next").submit();
				}
			}, 100);
		}
		else{
			updateGame();
		}
		context.clearRect(0,0,canvas.width, canvas.height);
		snake.draw();
		drawApple();
		drawGrid();
		if (!invincibility){
			snake.check();
		}
		if (needNewApple){
			generateApple();
			needNewApple = false;
		}
		/*if (gameLost){
			console.log("Game Over");
			clearInterval(timer);
			hasReset = false;
		}
		else{
			updateGame();
		}*/
        if(gameLost && newHighscore){
            newHighscore = false;
            setName();
        }
	}
}

reset();

//TODO: User clicks something on canvas to restart game rather than hitting reset button?
