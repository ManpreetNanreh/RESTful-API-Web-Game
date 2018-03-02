// Stage 
function Stage(stageWidth, stageHeight, monsterNum, megaMonsterNum, mimicMonsterNum, boxNum){
	this.actors=[]; // all actors on this stage (monsters, player, boxes, mega monsters, mimic monsters and walls).
	this.player=null; // a special actor, the player
	this.monsterNum=monsterNum; // the number of monsters
	this.megaMonsterNum=megaMonsterNum; // the number of mega monsters
	this.mimicMonsterNum=mimicMonsterNum; // the number of mimic monsters
	this.boxNum=boxNum; //the number of boxes
	// the logical width and height of the stage
	this.width=stageWidth;
	this.height=stageHeight;
	// the player's score and time.
	this.score=0;
	this.time=0;
	// the game status
	this.gameStatus="PLAYING";
	// New Icons Sourced and free for non-commercial use.
	this.blankImageSrc=document.getElementById('blankImage').src;
	// A blank image
	this.monsterImageSrc=document.getElementById('monsterImage').src;
	// Source: http://www.gatheringro.ch/data/items/icons/7609.png
	this.megaMonsterImageSrc=document.getElementById('megaMonsterImage').src;
	// Source: http://www.gatheringro.ch/data/items/icons/7225.png
	this.mimicMonsterImageSrc=document.getElementById('mimicMonsterImage').src;
	// Source: https://pokefarm.com/img/items/plate_earth.png/t=1400533333 + editing
	this.playerImageSrc=document.getElementById('playerImage').src;
	// Source: http://lazythunk.com/kappa/
	this.boxImageSrc=document.getElementById('boxImage').src;
	// Source: https://pokefarm.com/img/items/plate_earth.png/t=1400533333
	this.wallImageSrc=document.getElementById('wallImage').src;
	// Source: http://www.bathroom39.com/media/catalog/category/cat_resized/xmosaici.png.pagespeed.ic.RTKeB2ERT4.png
}

// initialize an instance of the game
Stage.prototype.initialize=function(){
	// Create a table of blank images, give each image an ID so we can reference it later
	let s='<center><table>';
		for(let y=0; y<(this.width+2); y++){
			s+= '<tr>';
			for(let x=0; x<(this.height+2); x++){
				s+= '<td>';
				if (y==0 || x==0 || y==(this.width+1) || x==(this.height+1)){
					// Add walls around the outside of the stage, so actors can't leave the stage
					s+= '<img src="' + this.wallImageSrc + '" height="25" width="25"';
				}else{
					// Add a blank image
					s+= '<img src="' + this.blankImageSrc + '" height="25" width="25"';
				}
				// Set each id to its (x,y) value 
				s+= ' id="(' + x + ',' + y + ')"/></td>';
			}
			s+= '</tr>'
		}
	s+="</table></center>";
	
	document.getElementById('stage').innerHTML = s;

	// Add the player to the center of the stage
	let centerX = Math.ceil(this.width / 2);
	let centerY = Math.ceil(this.height / 2);
	playerSprite = new Player(this, centerX, centerY);
	this.addActor(playerSprite);
	this.player=playerSprite;
	
	// Let's give the player some controls to use
	this.controls(this.player);
	
	// Add some Boxes to the stage
	let boxX = Math.floor(Math.random() * (this.width + 1));
	let boxY = Math.floor(Math.random() * (this.height + 1));
	for(let numBoxes = this.boxNum; numBoxes > 0; numBoxes--){
		// This keeps looping until we can place the box in a valid, unused position.
		// The front end should ensure this doesn't loop infinitely.
		while (document.getElementById(this.getStageId(boxX, boxY)).src != this.blankImageSrc){
			boxX = Math.floor(Math.random() * (this.width + 1));
			boxY = Math.floor(Math.random() * (this.height + 1));
		}
		newBox = new Box(this, boxX, boxY);
		this.addActor(newBox);		
	}
	// Let's make the Wall textures we generated actual walls
	for(let y=0; y<(this.width+2); y++){
		for(let x=0; x<(this.height+2); x++){
			if (y==0){
				newWall = new Wall(this, y, x);
				this.addActor(newWall);
			}else if (x==0){
				newWall = new Wall(this, y, x);
				this.addActor(newWall);
			}else if (y==(this.width+1)){
				newWall = new Wall(this, y, x);
				this.addActor(newWall);
			}else if (x==(this.height+1)){
				newWall = new Wall(this, y, x);
				this.addActor(newWall);
			}
		}
	} 

	// Add in some Monsters
	monsterX = Math.floor(Math.random() * (this.width + 1));
  monsterY = Math.floor(Math.random() * (this.height + 1));
	for(let numMonsters = this.monsterNum; numMonsters > 0; numMonsters--){
		// This keeps looping until we can place the monster in a valid, unused position.
		// The front end should ensure this doesn't loop infinitely.
		while (document.getElementById(this.getStageId(monsterX, monsterY)).src != this.blankImageSrc){
			monsterX = Math.floor(Math.random() * (this.width + 1));
			monsterY = Math.floor(Math.random() * (this.height + 1));
		}
		newMonster = new Monster(this, monsterX, monsterY);
		this.addActor(newMonster);
	}

	// Add in some Mega Monsters
	for(let numMegaMonsters = this.megaMonsterNum; numMegaMonsters > 0; numMegaMonsters--){
		// This keeps looping until we can place the monster in a valid, unused position.
		// The front end should ensure this doesn't loop infinitely.
		while (document.getElementById(this.getStageId(monsterX, monsterY)).src != this.blankImageSrc){
			monsterX = Math.floor(Math.random() * (this.width + 1));
			monsterY = Math.floor(Math.random() * (this.height + 1));
		}
		newMegaMonster = new MegaMonster(this, monsterX, monsterY);
		this.addActor(newMegaMonster);
	}

	// Add in some Mimic Monsters
	for(let numMimicMonsters = this.mimicMonsterNum; numMimicMonsters > 0; numMimicMonsters--){
		// This keeps looping until we can place the monster in a valid, unused position.
		// The front end should ensure this doesn't loop infinitely.
		while (document.getElementById(this.getStageId(monsterX, monsterY)).src != this.blankImageSrc){
			monsterX = Math.floor(Math.random() * (this.width + 1));
			monsterY = Math.floor(Math.random() * (this.height + 1));
		}
		newMimicMonster = new MimicMonster(this, monsterX, monsterY);
		this.addActor(newMimicMonster);
	}

}
// Return the ID of a particular image, useful so we don't have to continually reconstruct IDs.
Stage.prototype.getStageId=function(x,y){ 
	return "(" + x + "," + y + ")"; 
}

// Add an actor.
Stage.prototype.addActor=function(actor){
	this.actors.push(actor);
}

// Remove an actor.
Stage.prototype.removeActor=function(actor){
	this.setImage(actor.x, actor.y, this.blankImageSrc);
	this.actors.splice(this.actors.indexOf(actor), 1);
}

// Set the src of the image at stage location (x,y) to src.
Stage.prototype.setImage=function(x, y, src){
	document.getElementById(this.getStageId(x,y)).src = src;
}

// If there's no monsters left, the game is over!
Stage.prototype.noMonstersLeft=function(){
	let noneLeft = true;
	for (n = 0; n < this.actors.length; n++){
		if (this.actors[n] instanceof Monster || this.actors[n] instanceof MegaMonster || this.actors[n] instanceof MimicMonster){
			noneLeft = false;
		}
	}
	return noneLeft;
}

// Take one step in the animation of the game.
Stage.prototype.step=function(){
	if (this.noMonstersLeft()){
		// Run Victory script
		this.victory();
	}else if (this.gameStatus == "PLAYING"){
		for(let i=0;i<this.actors.length;i++){
			// each actor takes a single step in the game
			this.actors[i].step();
		}
		this.time++;
		currentTime.value = this.time;
		currentScore.value = this.score;
		currentStatus.value = this.gameStatus;
	}
}

// Return the first actor at coordinates (x,y) return null if there is no such actor.
// There should be only one actor at (x,y)!
Stage.prototype.getActor=function(x, y){
	let firstActor = null;
	for(i = 0; i < this.actors.length; i++ ){
		// Since there's only one actor at (x,y), this has to be that actor
		if(this.actors[i].x == x && this.actors[i].y == y){
			firstActor = this.actors[i];
		}
	}
	return firstActor;
}

// Let's set up the controls
Stage.prototype.controls=function(player){
	
	if (this.gameStatus == "PLAYING"){
		// Controls for clicking on the Controls arrows
		document.getElementById("northwest").onclick = function(){
			player.move(-1, -1);
		};
		document.getElementById("west").onclick = function(){
			player.move(-1, 0);
		};	
		document.getElementById("southwest").onclick = function(){
			player.move(-1, 1);
		};	
		document.getElementById("north").onclick = function(){
			player.move(0, -1);
		};
		document.getElementById("south").onclick = function(){
			player.move(0, 1);
		};	
		document.getElementById("northeast").onclick = function(){
			player.move(1, -1);
		};	
		document.getElementById("east").onclick = function(){
			player.move(1, 0);
		};	
		document.getElementById("southeast").onclick = function(){
			player.move(1, 1);
		};
		// Let's implement Arrow Key controls.
		document.onkeydown = function(e) {
			switch (e.keyCode) {
				// Left
				case 37:
					player.move(-1, 0);
					break;
				// Up
				case 38:
					player.move(0, -1);
					break;
				// Right
				case 39:
					player.move(1, 0);
					break;
				// Down
				case 40:
					player.move(0, 1);
					break;
				// AND numpad controls! (Something like QAZWSXEDC movement is bad because it's on an angle)
				case 97:
					player.move(-1, 1);
					break;
				case 98:
					player.move(0, 1);
					break;
				case 99:
					player.move(1, 1);
					break;
				case 100:
					player.move(-1, 0);
					break;		
				case 102:
					player.move(1, 0);
					break;
				case 103:
					player.move(-1, -1);
					break;
				case 104:
					player.move(0, -1);
					break;
				case 105:
					player.move(1, -1);
					break;		
			}
		};
	}else{
		// Disable everything above
		document.getElementById("northwest").onclick = null;
		document.getElementById("west").onclick = null;
		document.getElementById("southwest").onclick = null;
		document.getElementById("north").onclick = null;
		document.getElementById("south").onclick = null;
		document.getElementById("northeast").onclick = null;
		document.getElementById("east").onclick = null;
		document.getElementById("southeast").onclick = null;
		document.onkeydown = null;
	}
}

Stage.prototype.victory=function(){
	stage.gameStatus = "VICTORY!";
	currentStatus.value = this.gameStatus;
	stage.controls(this.player);
	currentScore.value = this.score;
	currentStatus.value = this.gameStatus;
	document.getElementById("pauseButton").style="display: none;"
	document.getElementById("resumeButton").style="display: none;"
}


Stage.prototype.gameOver=function(){
	stage.gameStatus = "GAME OVER";
	currentStatus.value = this.gameStatus;
	stage.controls(this.player);
	currentScore.value = this.score;
	currentStatus.value = this.gameStatus;
	document.getElementById("pauseButton").style="display: none;";
	document.getElementById("resumeButton").style="display: none;";
}

// End Class Stage

// Player
// Set the player's location and assign it a stage.
function Player(stage, x, y){
	this.x = x;
	this.y = y;
	this.stage = stage;
	this.stage.setImage(x, y, this.stage.playerImageSrc);
}

//Players don't automatically do anything per interval, so this just returns nothing.
Player.prototype.step=function(){ 
	return; 
}

// A move function is required, since we can't move the player in step!
Player.prototype.move=function(x, y){
	let possX = this.x + x;
	let possY = this.y + y;
	// Let's make cases for everything the player can bump into!
	// First, you can't hit a wall
	if (this.stage.getActor(possX, possY) instanceof Wall){
		// If you hit a wall, you don't get to move!
		return false;
	}else if (this.stage.getActor(possX, possY) instanceof Monster || this.stage.getActor(possX, possY) instanceof 
		MegaMonster || this.stage.getActor(possX, possY) instanceof MimicMonster){
		// If you hit a monster, you lose!
		this.stage.removeActor(this);
		this.player=null;
		this.x = possX;
		this.y = possY;
		stage.gameOver();
	}else if (this.stage.getActor(possX, possY) instanceof Box && this.stage.getActor(possX, possY).bump(x, y)){
		// If you hit a box, you recursively push boxes down the line.
		this.stage.removeActor(this);
		this.x = possX;
		this.y = possY;
		this.stage.addActor(this);
		this.stage.setImage(this.x, this.y, this.stage.playerImageSrc);
		return true;
	}else if (this.stage.getActor(possX, possY) == null){
		// Otherwise, we're hitting empty spaces!
		this.stage.removeActor(this);
		this.x = possX;
		this.y = possY;
		this.stage.addActor(this);
		this.stage.setImage(this.x, this.y, this.stage.playerImageSrc);
		return true;
	}else{
		return false;
	}
	
}
// End Class Player

// Box
// Set a box's location and assign it a stage.
function Box(stage, x, y){
	this.x = x;
	this.y = y;
	this.stage = stage;
	this.stage.setImage(x, y, this.stage.boxImageSrc);
}

// Boxes don't automatically do anything per interval, so this just returns.
Box.prototype.step=function(){ 
	return; 
}

// Boxes cannot move and don't react to steps, but they can be bumped somewhere else by the player!
Box.prototype.bump=function(x, y){ 
	let possX = this.x + x;
	let possY = this.y + y;
	// A box can either bump into a blank tile, another box, or a position it won't move to.
	// We'll do this recursively.
	// If you hit a Wall or Monster, you don't get to move!
	if (this.stage.getActor(possX, possY) instanceof Wall || this.stage.getActor(possX, possY) instanceof Monster || 
		this.stage.getActor(possX, possY) instanceof MegaMonster || this.stage.getActor(possX, possY) instanceof MimicMonster){
		// Note: You can't move a mimic monster! This means you might be able to find one this way!
		return false;
	// If you bump into another box or an empty space, you replace it...
	// But only if you can push it further down the line!
	}else if ((this.stage.getActor(possX, possY) == null || this.stage.getActor(possX, possY).bump(x, y))){
		this.stage.removeActor(this);
		this.x = possX;
		this.y = possY;
		this.stage.addActor(this);
		this.stage.setImage(this.x, this.y, this.stage.boxImageSrc);
		return true;
	}else{
		return false;
	}
	
}
// End Class Box

// Monster
// Set a monster's location and assign it a stage.
function Monster(stage, x, y){
	this.x = x;
	this.y = y;
	this.stage = stage;
	this.stage.setImage(x, y, this.stage.monsterImageSrc);
}

// Unlike boxes and players, Monsters move BY TIMER, automatically every interval!
Monster.prototype.step=function(){ 
	// Let's generate a random location for the monster to move out of the possibilities.
	// First, we need to store the directions possible (every permutation of -1, 1, & 0 except (0,0)).
	let possibleXList = [-1, -1, -1, 0, 0, 1, 1, 1];
	let possibleYList = [-1, 0, 1, -1, 1, -1, 0, 1];
	// This also links X and Y: for any i, possibleX[i] and possibleY[i] should give a valid combination.
	
	let randNum = Math.floor(Math.random()*(8));
	let possX = this.x + possibleXList[randNum];
	let possY = this.y + possibleYList[randNum];
	
	//If a monster chooses a path it cannot go to, then it should not move there.
	let stillChoosing = true;
	while (stillChoosing == true){
		if(this.surrounded()){
			// If there's no possible options, it's dead!
			stage.score+=10;
			stillChoosing = false;
			this.stage.removeActor(this);
			this.stage.setImage(this.x, this.y, this.stage.blankImageSrc);
		}
		// A case for if the monster's eating the player (game over!)
		else if (this.stage.getActor(possX, possY) instanceof Player){
			stillChoosing = false;
			this.stage.removeActor(this);
			this.x = possX;
			this.y = possY;
			this.stage.addActor(this);
			this.stage.setImage(possX, possY, this.stage.monsterImageSrc);
			// Run Game Over scripts
			stage.gameOver();
		// Otherwise, they're going to an empty square
		}else if (!(this.stage.getActor(possX, possY))){
			stillChoosing = false;
			this.stage.removeActor(this);
			this.x = possX;
			this.y = possY;
			this.stage.addActor(this);
			this.stage.setImage(possX, possY, this.stage.monsterImageSrc);
		}
		// Recalculating until we get a valid position
		randNum = Math.floor(Math.random()*(8));
		possX = this.x + possibleXList[randNum];
		possY = this.y + possibleYList[randNum];
		break;
	}
	return; 

}

Monster.prototype.surrounded=function(){
	let possibleXList = [-1, -1, -1, 0, 0, 1, 1, 1];
	let possibleYList = [-1, 0, 1, -1, 1, -1, 0, 1];
	let cantMove = true;
	for (p=0; p<8; p++){
		let possibleMove = this.stage.getActor(this.x + possibleXList[p], this.y + possibleYList[p]);
		// If even a single potential move is possible, the monster can move
		if (!(possibleMove instanceof Box || possibleMove instanceof Monster || possibleMove instanceof MegaMonster || possibleMove instanceof Wall)){
			cantMove = false;
			break;
		}
	}
	return cantMove;
}
// End Class Monster

// Mega Monster
// Set a mega monster's location and assign it a stage.
function MegaMonster(stage, x, y){
	this.x = x;
	this.y = y;
	this.stage = stage;
	this.stage.setImage(x, y, this.stage.megaMonsterImageSrc);
}

// Unlike boxes and players, Mega Monsters move BY TIMER, automatically every interval!
MegaMonster.prototype.step=function(){ 
	// Let's generate a random location for the mega monster to move out of the possibilities.
	// First, we need to store the directions possible (every permutation of -1, 1, & 0 except (0,0)).
	let possibleXList = [-1, -1, -1, 0, 0, 1, 1, 1];
	let possibleYList = [-1, 0, 1, -1, 1, -1, 0, 1];
	// This also links X and Y: for any i, possibleX[i] and possibleY[i] should give a valid combination.
	
	let randNum = Math.floor(Math.random()*(8));
	let possX = this.x + possibleXList[randNum];
	let possY = this.y + possibleYList[randNum];
	
	// We want our mega monsters EVEN SMARTER. So if it chooses a path it can't go to, it should recalculate a better one.
	let stillChoosing = true;
	while (stillChoosing == true){
		if(this.surrounded()){
			// If there's no possible options, it's dead!
			stage.score+=10;
			stillChoosing = false;
			this.stage.removeActor(this);
			this.stage.setImage(this.x, this.y, this.stage.blankImageSrc);
		}
		// A case for if the mega monster's eating the player (game over!)
		else if (this.stage.getActor(possX, possY) instanceof Player){
			stillChoosing = false;
			this.stage.removeActor(this);
			this.x = possX;
			this.y = possY;
			this.stage.addActor(this);
			this.stage.setImage(possX, possY, this.stage.megaMonsterImageSrc);
			// Run Game Over scripts
			stage.gameOver();

		// Otherwise, they're going to an empty square
		}else if (!(this.stage.getActor(possX, possY))){
			stillChoosing = false;
			this.stage.removeActor(this);
			this.x = possX;
			this.y = possY;
			this.stage.addActor(this);
			this.stage.setImage(possX, possY, this.stage.megaMonsterImageSrc);
		}else{
			// Recalculating until we get a valid position on EACH step!
			randNum = Math.floor(Math.random()*(8));
			possX = this.x + possibleXList[randNum];
			possY = this.y + possibleYList[randNum];
		}
	}
	return; 

}

MegaMonster.prototype.surrounded=function(){
	let possibleXList = [-1, -1, -1, 0, 0, 1, 1, 1];
	let possibleYList = [-1, 0, 1, -1, 1, -1, 0, 1];
	let cantMove = true;
	for (p=0; p<8; p++){
		let possibleMove = this.stage.getActor(this.x + possibleXList[p], this.y + possibleYList[p]);
		// If even a single potential move is possible, the mega monster can move.
		if (!(possibleMove instanceof Box || possibleMove instanceof Monster || possibleMove instanceof MegaMonster || 
			possibleMove instanceof MimicMonster || possibleMove instanceof Wall)){
			cantMove = false;
			break;
		}
	}
	return cantMove;
}
// End Class Mega Monster

// Mimic Monster
// Set a mimic monster's location and assign it a stage.
function MimicMonster(stage, x, y){
	this.x = x;
	this.y = y;
	this.stage = stage;
	this.stage.setImage(x, y, this.stage.boxImageSrc);
}

// Mimics move freely, but disguise themselves as boxes!
MimicMonster.prototype.step=function(){ 
	// Let's generate a random location for the mega monster to move out of the possibilities.
	// First, we need to store the directions possible (every permutation of -1, 1, & 0 except (0,0)).
	let possibleXList = [-1, -1, -1, 0, 0, 1, 1, 1];
	let possibleYList = [-1, 0, 1, -1, 1, -1, 0, 1];
	// This also links X and Y: for any i, possibleX[i] and possibleY[i] should give a valid combination.
	
	let randNum = Math.floor(Math.random()*(8));
	let possX = this.x + possibleXList[randNum];
	let possY = this.y + possibleYList[randNum];
	
	// Our mimic monsters look similar to the boxes, but act like regular monsters!
	let stillChoosing = true;
	while (stillChoosing == true){
		if(this.surrounded()){
			// If there's no possible options, it's dead!
			stage.score+=10;
			stillChoosing = false;
			this.stage.removeActor(this);
			this.stage.setImage(this.x, this.y, this.stage.blankImageSrc);
		}
		// A case for if the monster's eating the player (game over!)
		else if (this.stage.getActor(possX, possY) instanceof Player){
			stillChoosing = false;
			this.stage.removeActor(this);
			this.x = possX;
			this.y = possY;
			this.stage.addActor(this);
			this.stage.setImage(possX, possY, this.stage.mimicMonsterImageSrc);
			// Run Game Over scripts.
			stage.gameOver();
		// Otherwise, they're going to an empty square.
		}else if (!(this.stage.getActor(possX, possY))){
			stillChoosing = false;
			this.stage.removeActor(this);
			this.x = possX;
			this.y = possY;
			this.stage.addActor(this);
			this.stage.setImage(possX, possY, this.stage.mimicMonsterImageSrc);
		}else{
			// Hide the mimic as a box if it doesn't have a place to move!
			this.stage.setImage(this.x, this.y, this.stage.boxImageSrc);
			break;
			
		}
		// Recalculating until we get a valid position
		randNum = Math.floor(Math.random()*(8));
		possX = this.x + possibleXList[randNum];
		possY = this.y + possibleYList[randNum];
	}
	return; 

}

MimicMonster.prototype.surrounded=function(){
	let possibleXList = [-1, -1, -1, 0, 0, 1, 1, 1];
	let possibleYList = [-1, 0, 1, -1, 1, -1, 0, 1];
	let cantMove = true;
	for (p=0; p<8; p++){
		let possibleMove = this.stage.getActor(this.x + possibleXList[p], this.y + possibleYList[p]);
		// If even a single potential move is possible, the mega monster can move.
		if (!(possibleMove instanceof Box || possibleMove instanceof Monster || possibleMove instanceof MegaMonster || 
			possibleMove instanceof MimicMonster ||	possibleMove instanceof Wall)){
			cantMove = false;
			break;
		}
	}
	return cantMove;
}

MimicMonster.prototype.surrounded=function(){
	let possibleXList = [-1, -1, -1, 0, 0, 1, 1, 1];
	let possibleYList = [-1, 0, 1, -1, 1, -1, 0, 1];
	let cantMove = true;
	for (p=0; p<8; p++){
		let possibleMove = this.stage.getActor(this.x + possibleXList[p], this.y + possibleYList[p]);
		// If even a single potential move is possible, the mega monster can move
		if (!(possibleMove instanceof Box || possibleMove instanceof Monster || possibleMove instanceof MegaMonster || 
			possibleMove instanceof MimicMonster ||	possibleMove instanceof Wall)){
			cantMove = false;
			break;
		}
	}
	return cantMove;
}
// End Class Mimic Monster

// Wall
// Set a wall's location and assign it a stage.
function Wall(stage, x, y){
	this.x = x;
	this.y = y;
	this.stage = stage;
	this.stage.setImage(x, y, this.stage.wallImageSrc);
}

// Walls don't automatically do anything per interval, so this just returns.
Wall.prototype.step=function(){ 
	return; 
}
// End Class Wall
