/*
Dallas Andersen
Robert Imbler
Arthur Mayer
CSCI446 Final Project
JS File
*/

//Change this to get different numbers of colors.
//Min 1, max 5
var numColors = 5;

//Number rows/cols
var numRows = 16;

var DIMENSION = numRows;
var numCells = numRows * numRows;

var black = "images/black.png";
var cells = [];
var matches = [];
var colors = ["red", "yellow", "blue", "green", "brown"];
var playerScore = 0;
var cellsRemoved = 0;

//function call for saving score
function saveScore(score){
    // Check browser support
    if (typeof(Storage) != "undefined") {
        console.log(typeof(Storage));
        //if null set to 0
        if(localStorage.getItem("HighscoreFinal") == null){
            localStorage.setItem("HighscoreFinal", 0);
        }
        // Store if score is greater than highscore
        if(score > localStorage.getItem("HighscoreFinal")){
            localStorage.setItem("HighscoreFinal", score);
        }
    } else {
        //alert no highscore kept
        console.log("No Highscore to save");
        alert("Sorry, your browser does not support Web Storage, Highscore will not be saved");
        return;
    }
    //update highscore if any update
    if(localStorage.getItem("HighscoreFinal") == "undefined"){
        return;
    }
    document.getElementById("highscore").innerHTML="High Score: " + localStorage.getItem("HighscoreFinal").toString();
}
//reset highscore
function resetHighScore(){
    localStorage.setItem("HighscoreFinal", 0);
    document.getElementById("highscore").innerHTML="High Score: " + localStorage.getItem("HighscoreFinal").toString();
}

function createTable() {
    var rowNum = 0;
    var index = 0;
	var table = document.getElementById("board_table");
	for (var j=0; j<DIMENSION; j++){
		var row = table.insertRow(rowNum);
		rowNum++;
		for(var i=0; i<DIMENSION; i++) {
			//var ID = j*DIMENSION + i + 1;
			var newcell = row.insertCell(i);
			newcell.innerHTML = "<img src='./images/black.png' alt='empty_cell' id="+(++index).toString()+" onclick='check_remove(this)'/>";
		}
	}
}


//Define cell class
function cell(){
	this.id=0;
	this.src="";
}


//Randomize cells and reset score
function randomize(){
	cells = [];
	playerScore = 0;
	cellsRemoved = 0;
	updateScore(0);

	var j, i, source;
	for (i = 0; i < DIMENSION*DIMENSION; i++) {
		j = Math.floor(Math.random() * numColors);
		source = "images/"+colors[j]+".png";
		document.getElementById((i+1).toString()).src = source;
		var c = new cell();
		c.src = source;
		c.id = i+1;
		cells.push(c);
	}
}

createTable()
//Initial randomization. Done when the page is loaded.
randomize();


/*
  Checks adjacent cells for matches
  Passing in the id of the cell, which is indexed starting at 1,
  so adjustments need to be made to the function.
*/
function check_neighbours(id){
	console.log(id);
	var hasMatch = false;

	//We don't wan't consecutive blacks to match, 
	//else we get an infinite loop in the check_remove function.
	if (cells[id - 1].src == black){
		return;
	}

	//If not at the left edge
	if ((id-1)%numRows != 0){
		//Check cell to left
		if (cells[id-2].src == cells[id-1].src){
			console.log("Match to the left for cell " + id.toString());
			matches.push(cells[id-2]);
			hasMatch = true;
		}
	}

	//If not at the right edge
	if (id%numRows != 0){
		//Check cell to the right
		if (cells[id].src == cells[id-1].src){
			console.log("Match to the right for cell " + id.toString());
			matches.push(cells[id]);
			hasMatch = true;
		}
	}

	//If not at the top edge
	if (id > numRows){
		//Check cell above
		if (cells[id-numRows - 1].src == cells[id-1].src){
			console.log("Match above for cell " + id.toString());
			matches.push(cells[id-numRows-1]);
			hasMatch = true;
		}
	}

	//If not at bottom edge
	if (id < numCells - numRows + 1){ //21
		//Check cell below
		if (cells[id+numRows-1].src == cells[id-1].src){
			console.log("Match below for cell " + id.toString());
			matches.push(cells[id+numRows-1]);
			hasMatch = true;
		}
	}

	if (!hasMatch){
		console.log("No matches for cell " + id.toString());
	}
}

function check_neighbours_botched(id){
	var hasMatch = false;

	//We don't wan't consecutive blacks to match, 
	//else we get an infinite loop in the check_remove function.
	if (cells[id - 1].src == black){
		return;
	}

	//If not at the left edge
	if ((id-1)%DIMENSION != 0){
		//Check cell to left
		if (cells[id-2].src == cells[id-1].src){
			console.log("Match to the left for cell " + id.toString());
			matches.push(cells[id-2]);
			hasMatch = true;
		}
	}

	//If not at the right edge
	if (id%DIMENSION != 0){
		//Check cell to the right
		if (cells[id].src == cells[id-1].src){
			console.log("Match to the right for cell " + id.toString());
			matches.push(cells[id]);
			hasMatch = true;
		}
	}

	//If not at the top edge
	if (id > DIMENSION){
		//Check cell above
		if (cells[id-(DIMENSION+1)].src == cells[id-1].src){
			console.log("Match above for cell " + id.toString());
			matches.push(cells[id-(DIMENSION+1)]);
			hasMatch = true;
		}
	}

	//If not at bottom edge
	if (id <= DIMENSION*(DIMENSION-1)){
		//Check cell below
		if (cells[id+4].src == cells[id-1].src){
			console.log("Match below for cell " + id.toString());
			matches.push(cells[id+(DIMENSION-1)]);
			hasMatch = true;
		}
	}

	if (!hasMatch){
		console.log("No matches for cell " + id.toString());
	}
}


//Swaps the colors of 2 cells
//Used to move black cells to the top
function swap(cell1, cell2){
	var source = cell1.src;
	cell1.src = cell2.src;
	cell2.src = source;
}


//Bubble the empty (black) cells to the top
function lift_empty(){
	var i;

	//Iterating over cell list, don't need to adjust for the off by one error
	for (i = 0; i < cells.length; i++){
		var index = i;
		if (cells[i].src == black){
			while(index > DIMENSION-1){
				swap(cells[index], cells[index - DIMENSION]);

				//Using id, so need to adjust for the off by one error
				swap(document.getElementById(index + 1), document.getElementById(index - (DIMENSION-1)));

				index = index - DIMENSION;
			}
		}
	}
}

//Shift empty columns to the right
function shift_cols(){
	var i, j, colIsEmpty, index;

	//I do this 16 times since there was an issue where
	//It would shift columns which created more empty columns,
	//then not update those cloumns
	for (var q=0; q<DIMENSION; q++){
		//For every column
		for (i = 0; i<DIMENSION; i++){
			//Check all rows are empty
			for (j = 0; j<DIMENSION; j++){
				colIsEmpty=false;
				if (cells[DIMENSION*j + i].src != black){
					break;
				}
				colIsEmpty = true;
			}

			//If the column is empty, move it to the right
			if (colIsEmpty){
				for (j=0; j<DIMENSION; j++){
					index = j*DIMENSION + i;
					while((index+1)%DIMENSION != 0){
						swap(cells[index], cells[index+1]);
						//Get by ID, adjust again
						swap(document.getElementById(index+1), document.getElementById(index+2));
						index++;
					}
				}
			}
		}
	}
}
		

function checkWin(){
	var canPlay = false;

	if (cellsRemoved == DIMENSION*DIMENSION){
		alert("Congratulations! You won! Your score is "+playerScore.toString());
		document.getElementById("next").submit();
	}
	else{
		for(var i=0; i<cells.length; i++){
			check_neighbours(cells[i].id);
			if (matches.length != 0){
				canPlay = true;
				matches = [];
				break;
			}
		}

		if (!canPlay){
			if (playerScore < 1000){
				alert("Uh-Oh! No more moves. Your score is "+playerScore.toString());
				randomize();
			}
			else{
				alert("Uh-Oh! No more moves, but your score is high enough to continue!");
				document.getElementById("next").submit();
			}
		}
	}
}


function updateScore(cellsRemoved){
	playerScore = playerScore + (cellsRemoved*(cellsRemoved-1));
    saveScore(playerScore);
	document.getElementById("score").innerHTML = "Your Score: " + playerScore.toString();
}


//On click function. Remove cells and game logic
function check_remove(cell){
	var numRemoved = 0;

	matches.push(cells[cell.id - 1]);
	check_neighbours(matches[0].id);

	//Do nothing if no matches exist.
	//Make sure the matches array is empty upon return of function.
	if (matches.length == 1){
		matches.shift();
		return;
	}

	/*
	  Colors concecutive blocks of the same color black.
	  Treats the matches array as a queue.
	  Push the matching neighbours of the first element
	  and color it black, then pop it off the queue.
	  Repeat until the queue is empty.
	*/
	while (matches.length > 0){
		//Prevent double counting of cells
		if (cells[matches[0].id -1].src == black){
			numRemoved--;
		}

		cells[matches[0].id - 1].src = black;
		document.getElementById(matches[0].id).src = black;
		matches.shift();

		//Count a cell each time we pop from the queue
		numRemoved++;

		//Due to the way this was set up, the length of
		//The queue could be 0 when we reach the check_neighbors
		//function.
		if (matches.length > 0){
			check_neighbours(matches[0].id);
		}
	}

	cellsRemoved = cellsRemoved + numRemoved;

	lift_empty();
	shift_cols();

	updateScore(numRemoved);

	setTimeout(function(){
		checkWin();
		console.log("TIME");
		}, 100);
}