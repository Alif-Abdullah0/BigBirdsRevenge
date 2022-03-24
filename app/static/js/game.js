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
var savedata = {money : 1000, layout : [], grid : Array(600/25), people : [], igt : [9,0], counters : []};
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
	ctx.fillStyle = '#ff0038';
	ctx.fillRect(0, 8 * 25, 5 * 25, 7 * 25);
	for (index in savedata.layout) {
		object = savedata.layout[index];
		objectTypeList[object.id][3](object);
	}
	if (drawGridBoolean) {
		drawGrid();
		drawObjectPreview();
		drawCursor();
	}
	if (searchingBoolean) {
		searchQueryDiv.innerHTML = '<pre>🔎: <span style="text-decoration:underline;">' + searching + (framesTillNextMinute < 30 ? ' ' : '') + '</span></pre>';
	} else {
		searchQueryDiv.textContent = drawGridBoolean ? 'Press 0 to search objects' : '';
		searchResultsDiv.innerHTML = '';
	}
	if ((savedata.igt[0] >= 8 && savedata.igt[0] < 21) && framesTillNextMinute == 30 && Math.random() <= 0.06 * Math.pow(savedata.layout.length, 0.5) / 3) {
		for (let i = Math.trunc(Math.random() * 3) + 1; i > 0; i--) {
			setTimeout(() => {savedata.people.push(new Customer());}, i * 1000);
		}
	}

	savedata.people.forEach((person, index) => {
		peopleActionFunctions[person.personType](person, index);
	});
	drawPeople();

	dummy = "$" + savedata.money;
	while (dummy.length < 6) {
		dummy = "&nbsp;" + dummy;
	}
	moneyCounter.innerHTML = "Money:&nbsp;" + dummy;
	timeCounter.innerHTML = "Time: " + (savedata.igt[0] < 10 ? '0' : '') + savedata.igt[0] + ':' + (savedata.igt[1] < 10 ? '0' : '') + savedata.igt[1] + " " + getTimeEmoji(savedata.igt[0]);
	if ((savedata.igt[0] < 8 || savedata.igt[0] >= 22) && savedata.people.length == savedata.counters.length - 2) {
		framesTillNextMinute = Math.min(0, framesTillNextMinute - 8);
	}
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
	for (let i = 0; i < savedata.people.length; i++) {
		let person = savedata.people[i];
		drawPerson(person, i);
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

function drawObjectPreview() {
	if (selectedObjectIndex != -1) {
		let previewobject = new FurniturePrototype(cursorX, cursorY, selectedObjectIndex);
		objectTypeList[previewobject.id][3](previewobject, 0.5);
	}
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

function getTimeEmoji(hour) {
	if (hour <= 5) {
		return '🌙';
	} else if (hour <= 7) {
		return '🌅';
	} else if (hour < 20) {
		return '🌞';
	} else if (hour < 22) {
		return '🌇';
	} else {
		return '🌙';
	}
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

function capitalizeString(s) {
	let r = "";
	for (let i = 0; i < s.length; i++) {
		if (i == 0 || s.charAt(i - 1) == ' ') {
			r += s.charAt(i).toUpperCase();
		} else {
			r += s.charAt(i);
		}
	}
	return r;
}

function genObjectSearchResults() {
	searchResultsDiv.innerHTML = '<hr>';
	let terms = searching.toLowerCase().split(' ');
	objectTypeList.forEach((objectDef, index) => {
		let searchedFor = (searching.trim() == '') ? true : includesInArray(objectDef[1], terms);
		if (searchedFor) {
			//console.log(objectDef);
			let newp = document.createElement('p');
			newp.id = 'objectTypeDef_' + index;
			//newp.innerHTML = JSON.stringify(objectDef) + "&nbsp;<button>Select</button>";
			newp.innerHTML = `${capitalizeString(objectDef[1])}&nbsp;-&nbsp;Price: $${objectDef[4]}&nbsp;&nbsp;<button>Select</button>`;
			newp.children[0].onclick = (e) => {
				console.log(e.target.parentElement.id);
				selectedObjectIndex = parseInt(e.target.parentElement.id.substring('objectTypeDef_'.length));
				searchingBoolean = false;
				searching = '';
			};
			searchResultsDiv.appendChild(newp);
			searchResultsDiv.appendChild(document.createElement('hr'));

			//console.log(newp.children[0]);
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
	selectedObjectIndex = -1;
	searching = '';
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
		genObjectSearchResults();
	} else if (drawGridBoolean) {
		if (searchingBoolean) {
			let queryChanged = true;
			if (e.keyCode == 0x20 || (e.keyCode >= ord('A') && e.keyCode <= ord('Z'))) {
				if (searching.length <= 29) {searching += e.key;}
			} else if (e.keyCode == 8 /* Backspace */) {
				if (searching.length != 0) {
					searching = searching.substring(0, searching.length - 1);
				} else {
					queryChanged = false;
				}
			} else if (e.keyCode == 0xD) {
				queryChanged = false;
				let ch = searchResultsDiv.children[1];
				if (ch != undefined &&  ch.id.includes('objectTypeDef_')) {
					selectedObjectIndex = parseInt(ch.id.substring('objectTypeDef_'.length));
				} else {
					selectedObjectIndex = -1;
				}
				searching = '';
				searchingBoolean = false;

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
					cursorX = Math.min(cursorX + 1, savedata.grid[0].length - 1);
					break;
				case ord('E'):
					if (selectedObjectIndex != -1) {
						selectedObjectIndex = (selectedObjectIndex + 1) % objectTypeList.length;
					}
					break;
				case ord('Q'):
					if (selectedObjectIndex != -1) {
						selectedObjectIndex--;
						if (selectedObjectIndex < 0) {selectedObjectIndex = objectTypeList.length - 1;}
					}
					break;
				case ord('T'):
					drawGridBoolean = false;
					break;
				case ord(';'):
					if (e.key == ':' && savedata.grid[cursorY][cursorX] != null) {
						let obj = savedata.grid[cursorY][cursorX];
						if (confirm(`Are you sure you want to delete the ${obj.name} at X: ${cursorX}, Y : ${cursorY} ?`)) {
							deleteObject(obj);
						}
					}
					break;
				case ord('U'):
					selectedObjectIndex = -1;
					break;
				case ord('I'):
					if (selectedObjectIndex != -1) {
						if (savedata.money >= objectTypeList[selectedObjectIndex][4]) {
							let rval = objectTypeList[selectedObjectIndex][2](cursorX, cursorY);
							if (rval == 1) {
								alert(`Can't build a(n) ${ objectTypeList[selectedObjectIndex][1] } here!`);
							} else if (rval == 0) {
								savedata.money -= objectTypeList[selectedObjectIndex][4];
							}
						}
					}
					break;
				default:
					break;
					console.log(e);
			}
		}
	} else {
		if (e.keyCode == ord('T')) {
			drawGridBoolean = true;
			searchingBoolean = false;
			selectedObjectIndex = -1;
			searching = '';
		}
	}
});

function startgame() {
	createTable(6,5);
	createChair(7,5);
	createChair(5,5);
	createChair(6,4);
	createChair(6,6);

	createCounter(28,23);
	createCounter(29,23);
	createCounter(30,23);
	createCounter(31,23);

	window.requestAnimationFrame(nextframe);
}

window.addEventListener('load', () => {
	if (promptSave) {
		if (confirm("Would you like to load your previously saved game?")) {
			load();
		}
	}
	startgame();
});
