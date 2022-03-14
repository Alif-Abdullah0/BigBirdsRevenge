const c = document.getElementById('drawing');
const ctx = c.getContext("2d");
const moneyCounter = document.getElementById('money-counter');
const timeCounter = document.getElementById('time-counter');
const loadButton = document.getElementById('saveButton');
const saveButton = document.getElementById('saveButton');
const toggleGridButton = document.getElementById('saveButton');

var requestID;

var savedata = {money : 1000, layout : [], grid : Array(600/25), people : Object(), igt : [7, 0]};
for (let i = 0; i < savedata.grid.length; i++) {
	savedata.grid[i] = Array(800/25);
}

var object;
var drawGridBoolean = false;
var dummy;
var framesTillNextMinute = 60;

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
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				break;
		}
	}
	if (drawGridBoolean) {
		drawGrid();
	}
	dummy = "$" + savedata.money;
	while (dummy.length < 6) {
		dummy = "&nbsp;" + dummy;
	}
	moneyCounter.innerHTML = "Money:&nbsp;" + dummy;
	timeCounter.innerHTML = "Time: " + (savedata.igt[0] < 10 ? '0' : '') + savedata.igt[0] + ':' + (savedata.igt[1] < 10 ? '0' : '') + savedata.igt[1] + " " + (savedata.igt[0] >= 7 && savedata.igt[0] < 19 ? '🌞' : '🌙');
	if (framesTillNextMinute-- == 0) {
		framesTillNextMinute = 60;
		if (savedata.igt[1]++ >= 60) {
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
	ctx.strokeStyle = '#aaaaaa';
	ctx.stroke();
}

function Build(object) {
	if (savedata.grid[object.y][object.x] == null) {
		savedata.grid[object.y][object.x] = object;
		savedata.layout.push(object);
		return 0;
	} else {
		return 1;
	}
}

function Furniture(x, y, type, rotation = 3 /* facing west */) {
	this.x = x;
	this.y = y;
	this.name = type;
	this.direction = rotation;
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
		default:
			this.id = -1;	
			break;
	}
}

loadButton.addEventListener('onclick', load);
loadButton.addEventListener('onclick', save);
toggleGridButton.addEventListener('onclick', () => {toggleGridButton = toggleGridButton ? false : true;});

function startgame() {
	Build(new Furniture(5,5,'table'));
	Build(new Furniture(4,5,'chair'));
	Build(new Furniture(6,5,'chair'));
	Build(new Furniture(5,4,'chair'));
	Build(new Furniture(5,6,'chair'));
	window.requestAnimationFrame(nextframe);
}

startgame();

