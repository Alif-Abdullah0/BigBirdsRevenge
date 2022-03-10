var c = document.getElementById('drawing');
var ctx = c.getContext("2d");
var requestID;

var savedata = {money : 1000, layout : [new Furniture(4,5,'chair'),new Furniture(5,5,'table'),new Furniture(6,5,'chair')]};

function nextframe() {
	ctx.clearRect(0,0,c.clientWidth,c.clientHeight);
	for (index in savedata.layout) {
		switch (savedata.layout[index][3]) {
			case 0:
				ctx.fillStyle = 'rgb(150,75,0)';
				ctx.fillRect(savedata.layout[index][0] * 25, savedata.layout[index][1] * 25, 25, 25);
				break;
			case 1:
				ctx.fillStyle = 'rgb(150,75,0)';
				ctx.beginPath();
				ctx.arc(savedata.layout[index][0] * 25 + 12.5, savedata.layout[index][1] * 25 + 12.5, 10, 0, 2 * Math.PI);
				ctx.fill();
		}
	}
	
	requestID = window.requestAnimationFrame(nextframe);
}

function Furniture(x, y, type) {
	this[0] = x;
	this[1] = y;
	this[2] = type;
	switch (type) {
		case 'table': 
			this[3] = 0;
			break;
		case 'chair':
			this[3] = 1;
			break;
		default:
			this[3] = -1;
			break;
	}
}

function startgame() {
	window.requestAnimationFrame(nextframe);
}

startgame();

