//global vars

//IMPORTANT IMPORTANT IMPORTANT IMPORTANT IMPORTANT IMPORTANT IMPORTANT IMPORTANT 
// Logic is based that the user is X and will always go first. Can change later
//IMPORTANT IMPORTANT IMPORTANT IMPORTANT IMPORTANT IMPORTANT IMPORTANT 

var board = Array.from(Array(9).keys());
const winCondition = [ [0,1,2], [0,4,8], [0,3,6], [1,4,7], [2,4,6], [2,5,8], [3,4,5], [6,7,8] ];
// const huPlayer = "X";
// const aiPlayer = "O";
var gameOver = false;
var gameStart = false;
var huPlayer;
var aiPlayer;

//show X/O when hover
function showHover(cell) {
    if(!checkFilled(cell) && gameOver == false && gameStart == true){ document.getElementById(cell).innerText = huPlayer; }
}

function removeHover(cell) { if(!checkFilled(cell)){ document.getElementById(cell).innerText = ""; } }

function setPlayer(symbol){
    if(gameStart == true){return;}
    gameStart = true;
    if(symbol == "X"){
        huPlayer = symbol;
        aiPlayer = "O";
        document.getElementById('message').innerText = "You are " + huPlayer;
    }
    else {
        huPlayer = symbol;
        aiPlayer = "X";
        document.getElementById('message').innerText = "You are " + huPlayer;

        displayTurn(bestSpot(aiPlayer), aiPlayer);
        gameWon = checkWin(board, aiPlayer);
        if(gameWon == null){ //board full and no winner
            if(getEmpty().length == 0){
                document.getElementById('message').innerText = "It's a tie!";
                gameOver = true;
                for (let i = 0; i < board.length; i++) {
                    document.getElementById(i).style.border = "4px solid red";   
                }
            }
        }
        else{
            endGame(gameWon);
            return;
        }
    }
    gameStart = true;
}


function reset() {
    huPlyaer = "";
    aiPlayer = "";
    board = Array.from(Array(9).keys());
    gameStart = false;
    gameOver = false;
    document.getElementById('message').innerText = "Choose X or O";
    //turn all cells opaque
    for (let i = 0; i < board.length; i++) {
        document.getElementById(i).innerText = "";
        document.getElementById(i).style.border = "1px solid black";
        document.getElementById(i).style.borderRadius = ".25rem";
    }
}

function makeTurn(cell) {

    if(gameOver == true || gameStart == false){ return; }
    if(checkFilled(cell)){ return; }
    displayTurn(cell, huPlayer);

    var gameWon = checkWin(board, huPlayer);
    if(gameWon == null){ //board full and no winner
        if(getEmpty().length == 0){
            document.getElementById('message').innerText = "It's a tie!";
            gameOver = true;
            for (let i = 0; i < board.length; i++) {
                document.getElementById(i).style.border = "4px solid red";   
            }
            return;
        }
    }
    else{ //WINNER!
        endGame(gameWon);
        return;
    }

    //ai turn
    displayTurn(bestSpot(aiPlayer), aiPlayer);


    gameWon = checkWin(board, aiPlayer);
    if(gameWon == null){ //board full and no winner
        if(getEmpty().length == 0){
            document.getElementById('message').innerText = "It's a tie - Reset to start new game";
            gameOver = true;
            for (let i = 0; i < board.length; i++) {
                document.getElementById(i).style.border = "4px solid red";   
            }
        }
    }
    else{
        endGame(gameWon);
        return;
    }
}

function displayTurn(cell, player){ //fill cell with player symbol
    board[cell] = player;
    document.getElementById(cell).innerText = player;
    document.getElementById(cell).style.opacity = 1;
}

//True for filled, false for not filled
function checkFilled(cell) {
    if(board[cell] == cell){ return false; }
    else { return true; }
}

function checkWin(board, player){   
    
    let cellsPlayed = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;

    for(let [index, win] of winCondition.entries()) {
        //check if matches win condition
		if (win.every(elem => cellsPlayed.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
			break;
		}
    }
    return gameWon;
}

function endGame(gameWon){
    for(let index of winCondition[gameWon.index]){ document.getElementById(index).style.border = "4px solid green"; }
    //make the cells unclickable
    gameOver = true;
    gameStart = false;
    document.getElementById('message').innerText = "The computer won - Reset to start new game";
}

function getEmpty() { return board.filter(s => typeof s == 'number'); }

function minimax(newBoard, player) {
	var availSpots = getEmpty();

	if (checkWin(newBoard, huPlayer)) { return {score: -10}; } 
    else if (checkWin(newBoard, aiPlayer)) { return {score: 10}; } 
    else if (availSpots.length === 0) { return {score: 0}; }

	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
        } 
        else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;
		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
    } 
    else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}

function bestSpot(player) { return minimax(board, player).index; }
