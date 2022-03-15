// gets the canvas
const c = document.getElementById('drawing');
const ctx = c.getContext("2d");

const moneyCounter = document.getElementById('money-counter');
const timeCounter = document.getElementById('time-counter');
const loadButton = document.getElementById('loadButton');
const saveButton = document.getElementById('saveButton');
const toggleGridButton = document.getElementById('buildToggleButton');
const searchQueryDiv = document.getElementById('searchQueryText');
const searchResultsDiv = document.getElementById('searchResults');

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
var searchingBoolean = false;
var searching = '';

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
				ctx.fillStyle = '#8E8E8E';
				ctx.fillRect(object.x * 25, object.y * 25, 25, 25);
				break;
		}
	}
	if (drawGridBoolean) {
		drawGrid();
		drawCursor();
	}
	if (searchingBoolean) {
		searchQueryDiv.innerHTML = '<pre>🔎: <span style="text-decoration:underline;">' + searching + (framesTillNextMinute < 30 ? ' ' : '') + '</span></pre>';
	} else {
		searchQueryDiv.textContent = drawGridBoolean ? 'Press 0 to search objects' : '';
		searchResultsDiv.innerHTML = '';
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

function ord(ch) {
	return ch.charCodeAt(0);
}

function includesInArray(string, arr) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].length != 0 && !string.includes(arr[i])) {
			return false;
		}
	}
	return true;
}

function genObjectSearchResults() {
	searchResultsDiv.innerHTML = '<hr>';
	let terms = searching.split(' ');
	objectTypeList.forEach((objectDef, index) => {
		let searchedFor = (searching.trim() == '') ? true : includesInArray(objectDef[1], terms);
		if (searchedFor) {
			//console.log(objectDef);
			searchResultsDiv.innerHTML += "<p id=objectTypeDef_" + index + ">" + JSON.stringify(objectDef) + "</p><hr>";
		}
	});
	if (searchResultsDiv.childElementCount == 1) {
		searchResultsDiv.innerHTML += "<p>No results for '" + searching.trimEnd() + "'.</p><hr>";
	}
}

loadButton.addEventListener('click', load);
saveButton.addEventListener('click', save);
toggleGridButton.addEventListener('click', () => {
	drawGridBoolean = drawGridBoolean ? false : true;
	searchingBoolean = false;
});
c.addEventListener('click', (e) => {
	if (drawGridBoolean) {
		cursorX = Math.trunc((e.clientX - c.offsetLeft) / 25);
		cursorY = Math.trunc((e.clientY - c.offsetTop) / 25);
	}
});
document.addEventListener('keydown', (e) => {
	if (drawGridBoolean && e.keyCode == 0x30 /*ord('0')*/) {
		searchingBoolean = searchingBoolean ? false : true;
		searching = '';
		genObjectSearchResults();
	} else {
		if (searchingBoolean) {
			let queryChanged = true;
			if (e.keyCode == 0x20 || (e.keyCode >= ord('A') && e.keyCode <= ord('Z'))) {
				searching += e.key;
			} else if (e.keyCode == 8 /* Backspace */) {
				if (searching.length != 0) {
					searching = searching.substring(0, searching.length - 1);
				} else {
					queryChanged = false;
				}
			} else {
				queryChanged = false;
			}
			if (queryChanged) {
				//console.log('query changed !');
				genObjectSearchResults();
			}
		} else {
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
				default:
					break;
					console.log(e);
			}
		}
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
window.addEventListener('load', startgame);
