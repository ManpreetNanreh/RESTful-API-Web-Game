stage=null;
interval=null;
userScore=null;

function setupGame(){
	let dimensions = Math.floor(document.getElementById("setupDimensions").value);
	let numMonsters = Math.floor(document.getElementById("setupMonsters").value);
	let numMegaMonsters = Math.floor(document.getElementById("setupMegaMonsters").value);
	let numMimicMonsters = Math.floor(document.getElementById("setupMimicMonsters").value);
	let numBoxes =  Math.floor(document.getElementById("setupBoxes").value);
	//Automatically adjust bad setup inputs! If any of the parameters is out of bound then set everything to default.
	if (dimensions < 5 || dimensions > 50 || numMegaMonsters > numMonsters || numMimicMonsters > numBoxes ||numMonsters < 0 || numMonsters > ((dimensions * dimensions)/2) || numBoxes < 0 || numBoxes > (dimensions * dimensions) - numMonsters + 5){
		dimensions = 10;
		numMegaMonsters = 1;
		numMimicMonsters = 1;
		numMonsters = 5;
		numBoxes = 50;
	}
	stage=new Stage(dimensions, dimensions, numMonsters, numMegaMonsters, numMimicMonsters, numBoxes);
	stage.initialize();
}

function startGame(){
	// We're setting our interval to 1 second - it could be lower, but this is the smoothest.
	interval = setInterval(function(){ stage.step(); }, 1000);
	// Reset the pause and resume buttons that may have been removed by stopping the game.
	document.getElementById("pauseButton").style="";
	document.getElementById("resumeButton").style="";
}

function stopGame(){
	stage.gameStatus = "PAUSED";

	// Update the user's score when the game ends.
	userScore = stage.score;
	registerScore();

	currentStatus.value = stage.gameStatus;
	stage.controls(stage.player);
	stage = null;
	clearInterval(interval);
	interval = null;
}

function resumeGame(){
	stage.gameStatus = "PLAYING";
	currentStatus.value = stage.gameStatus;
	stage.controls(stage.player);
}

function pauseGame(){
	stage.gameStatus = "PAUSED";
	currentStatus.value = stage.gameStatus;
	stage.controls(stage.player);
}
