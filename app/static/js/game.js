// gets the canvas
const c = document.getElementById('drawing');
const ctx = c.getContext("2d");

const moneyCounter = document.getElementById('money-counter');
const timeCounter = document.getElementById('time-counter');
const loadButton = document.getElementById('loadButton');
const saveButton = document.getElementById('saveButton');
const toggleGridButton = document.getElementById('buildToggleButton');

// for animations
var requestID;

/** Stores data from the game
	- Money counter: the money the player has
	- Layout: the layout of the restaurant, with its tables and chairs
	- grid: for the grid lines
	- people: to store the locations of the people in the restaurant
*/
var savedata = {money : 1000, layout : [], grid : Array(600/25), people : [], igt : [7,0]};
for (let i = 0; i < savedata.grid.length; i++) {
	savedata.grid[i] = Array(800/25);
}

var object;
var drawGridBoolean = false;
var framesTillNextMinute = 60;
var [cursorX, cursorY] = [Math.trunc(savedata.grid[0].length / 2), Math.trunc(savedata.grid.length / 2)];

/*
	keep track of: current position, new position, color and shape.
*/

function nextframe() {
	ctx.clearRect(0,0,c.clientWidth,c.clientHeight);
	for (index in savedata.layout) {
		object = savedata.layout[index];
		switch (object.id) {
			case 0:
				ctx.fillStyle = 'rgb(150,75,0)';
				ctx.fillRect(object.x * 25, object.y * 25, 25, 25);
				break;
			case 1:
				ctx.fillStyle = 'rgb(150,75,0)';
				ctx.beginPath();
				ctx.arc(object.x * 25 + 12.5, object.y * 25 + 12.5, 10, 0, 2 * Math.PI);
				ctx.fill();
				ctx.strokeStyle = '#000000';
				ctx.stroke();
				break;
			case 2:
				break;
			case 3:
				ctx.fillStyle = '#8E8E8E';
				ctx.fillRect(object.x * 25, object.y * 25, 25, 25);
				break;
		}
	}
	if (drawGridBoolean) {
		drawGrid();
		drawCursor();
	}

	dummy = "$" + savedata.money;
	while (dummy.length < 6) {
		dummy = "&nbsp;" + dummy;
	}
	moneyCounter.innerHTML = "Money:&nbsp;" + dummy;
	timeCounter.innerHTML = "Time: " + (savedata.igt[0] < 10 ? '0' : '') + savedata.igt[0] + ':' + (savedata.igt[1] < 10 ? '0' : '') + savedata.igt[1] + " " + (savedata.igt[0] >= 7 && savedata.igt[0] < 19 ? '🌞' : '🌙');
	if (framesTillNextMinute-- == 0) {
		framesTillNextMinute = 60;
		if (++savedata.igt[1] >= 60) {
			savedata.igt[0] = (savedata.igt[0] + 1) % 24;
			savedata.igt[1] = 0;
		}
	}
	requestID = window.requestAnimationFrame(nextframe);
}

function drawPeople() {
	for (index in savedata.people) {

	}
}

var drawGrid_index;
function drawGrid() {
	ctx.beginPath();
	for (drawGrid_index = 0; drawGrid_index < savedata.grid.length - 1; drawGrid_index++) {
		ctx.moveTo(0, drawGrid_index * 25 + 24.5);
		ctx.lineTo(c.clientWidth, drawGrid_index * 25 + 24.5);
	}
	for (drawGrid_index = 0; drawGrid_index < savedata.grid[0].length - 1; drawGrid_index++) {
		ctx.moveTo(drawGrid_index * 25 + 24.5, 0);
		ctx.lineTo(drawGrid_index * 25 + 24.5, c.clientHeight);
	}
	ctx.strokeStyle = '#bbbbbb';
	ctx.stroke();
}

function drawCursor() {
	ctx.beginPath();
	ctx.fillStyle = '#7f7f7f';
	ctx.rect(cursorX * 25 - 1, cursorY * 25 - 1, 8, 4);
	ctx.rect(cursorX * 25 - 1, cursorY * 25 - 1, 4, 8);

	ctx.rect(cursorX * 25 - 1,(cursorY + 1) * 25 - 3, 8, 4);
	ctx.rect(cursorX * 25 - 1, (cursorY + 1) * 25 - 7, 4, 8);

	ctx.rect((cursorX + 1) * 25 - 7,cursorY * 25 - 1, 8, 4);
	ctx.rect((cursorX + 1) * 25 - 3, cursorY * 25 - 1, 4, 8);

	ctx.rect((cursorX + 1) * 25 - 7,(cursorY + 1) * 25 - 3, 8, 4);
	ctx.rect((cursorX + 1) * 25 - 3, (cursorY + 1) * 25 - 7, 4, 8);
	ctx.fill();
}

function canBuild(object) {
	//console.log(object);
	if (savedata.grid[object.y][object.x] == null) {
		return true;
	} else {
		return false;
	}
}

function Build(object) {
	if (canBuild(object)) {
		savedata.grid[object.y][object.x] = object;
		savedata.layout.push(object);
		return 0;
	} else {
		return 1;
	}
}

function FurniturePrototype(x, y, type) {
	this.x = x;
	this.y = y;
	this.name = type;
	switch (type) {
		case 'table':
			this.id = 0;
			break;
		case 'chair':
			this.id = 1;
			break;
		case 'hostess_table':
			this.id = 2;
			break;
		case 'kitchen':
			this.id = 3;
			this.holding = NULL;
			break;
		default:
			this.id = -1;
			break;
	}
}

function createTable(x, y) {
	let newtable = new FurniturePrototype(x, y, 'table');
	newtable.chairsAttached = [];
	if (!canBuild(newtable)) {
		return 1;
	}
	let possArray = [savedata.grid[y][x-1], savedata.grid[y][x+1]];
	if (y > 0) {
		possArray.push(savedata.grid[y-1][x]);
	} else if (y < savedata.grid.length - 1) {
		possArray.push(savedata.grid[y+1][x]);
	}
	for (i in possArray) {
		if (possArray[i] != null && possArray[i].id == 1) {
			if (possArray[i].tableOwner != null) {
				return 1;
			} else {
				newtable.chairsAttached.push(possArray[i]);
				possArray[i].tableOwner = newtable;
			}
		}
	}
	return Build(newtable);

}

function createChair(x, y, forcebuild) {
	let newchair = new FurniturePrototype(x, y, 'chair');
	if (!canBuild(newchair)) {
		return 1;
	}
	let possArray = [savedata.grid[y][x-1], savedata.grid[y][x+1]];
	if (y > 0) {
		possArray.push(savedata.grid[y-1][x]);
	}
	if (y < savedata.grid.length - 1) {
		possArray.push(savedata.grid[y+1][x]);
	}
	let addArray = []
	for (i in possArray) {
		/* console.log(possArray[i]); */
		if (possArray[i] != null && possArray[i].id === 0) {
			addArray.push(possArray[i]);
		}
	}

	//console.log(newchair, addArray);
	if (addArray.length > 1) {
		return 1;
	} else if (addArray.length == 1) {
		newchair.tableOwner = addArray[0];
		addArray[0].chairsAttached.push(newchair);
	} else {
		if (!forcebuild && !confirm("This chair is not next to any table. Are you sure you want to build this?")) {return 2;}
		newchair.tableOwner = null;
	}
	if (Build(newchair) === 1)  {return 1;}
	return 0;
}

function ord(ch) {
	return ch.charCodeAt(0);
}

loadButton.addEventListener('click', load);
saveButton.addEventListener('click', save);
toggleGridButton.addEventListener('click', () => {
	drawGridBoolean = drawGridBoolean ? false : true;
});
c.addEventListener('click', (e) => {
	if (drawGridBoolean) {
		cursorX = Math.trunc((e.clientX - c.offsetLeft) / 25);
		cursorY = Math.trunc((e.clientY - c.offsetTop) / 25);
	}
});
document.addEventListener('keydown', (e) => {
	switch(e.keyCode) {
		case ord('W'):
		case 38: /* Up */
			cursorY = Math.max(cursorY - 1, 0);
			break;
		case ord('A'):
		case 37: /* Left */
			cursorX = Math.max(cursorX - 1, 0);
			break;
		case ord('S'):
		case 40: /* Down */
			cursorY = Math.min(cursorY + 1, savedata.grid.length - 1);
			break;
		case ord('D'):
		case 39: /* Right */
			cursorX = Math.min(cursorX + 1, savedata.grid[0].length);
			break;
		case 0x31:
			if (drawGridBoolean) {
				if (1 == createTable(cursorX, cursorY, false)) {alert("You can't build a chair here!");}
			}
			break;
		case 0x32:
			if (drawGridBoolean) {
				if (1 == createChair(cursorX, cursorY, false)) {alert("You can't build a chair here!");}
			}
			break;
		case 0x33:			
		case 0x34:	
		case 0x35:	
		case 0x36:		
		case 0x37:
		case 0x38:		
		case 0x39:
		case 0x30:
			break;
		default:
			break;
			console.log(e);
	}
});

function startgame() {
	createTable(5,5);
	createChair(6,5);
	createChair(4,5);
	createChair(5,4);
	createChair(5,6);

	window.requestAnimationFrame(nextframe);
}

if (promptSave) {
	if (confirm("Would you like to load your previously saved game?")) {
		load();
	}
}
startgame();
