const objectTypeList = [
	/* id name constructor draw cost  */
	[0, "table", createTable, drawTable, 200],
	[1, "chair", createChair, drawChair, 100],
	[2, "kitchen counter", createCounter, drawCounter, 500],
	[3, "cactus", createCactus, drawCactus, 50],
	[3, "plant", createBush, drawBush, 50],
];
objectTypeList.sort();
var selectedObjectIndex = -1;

function canBuild(object) {
	//console.log(object);
	if (object.x <= 4 && object.y >= 8 && object.y <= 14) {
		return false;
	}

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

function FurniturePrototype(x, y, id) {
	this.x = x;
	this.y = y;
	this.id = id;
	switch (id) {
		case 0:
			this.name = "table";
			break;
		case 1:
			this.name = "chair";
			break;
		case 2:
			this.name = "kitchen";
			break;
		default:
			this.name = "fuck";
			break;
	}
}

function createTable(x, y) {
	let newtable = new FurniturePrototype(x, y, 0);
	newtable.chairsAttached = [];
	if (!canBuild(newtable)) {
		return 1;
	}
	let possArray = [savedata.grid[y][x - 1], savedata.grid[y][x + 1]];
	if (y > 0) {
		possArray.push(savedata.grid[y - 1][x]);
	} else if (y < savedata.grid.length - 1) {
		possArray.push(savedata.grid[y + 1][x]);
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

function drawTable(table, alpha = 1.0) {
	//console.log(`rgb(150,75,0,${alpha})`);
	ctx.fillStyle = `rgb(150,75,0,${alpha})`;
	ctx.fillRect(table.x * 25, table.y * 25, 25, 25);
}

function createChair(x, y, forcebuild) {
	let newchair = new FurniturePrototype(x, y, 1);
	if (!canBuild(newchair)) {
		return 1;
	}
	let possArray = [savedata.grid[y][x - 1], savedata.grid[y][x + 1]];
	if (y > 0) {
		possArray.push(savedata.grid[y - 1][x]);
	}
	if (y < savedata.grid.length - 1) {
		possArray.push(savedata.grid[y + 1][x]);
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
		if (!forcebuild && !confirm("This chair is not next to any table. Are you sure you want to build this?")) { return 2; }
		newchair.tableOwner = null;
	}
	newchair.customerSitting = null;
	if (Build(newchair) == 1) { return 1; }
	return 0;
}

function drawChair(chair, alpha = 1.0) {
	ctx.fillStyle = `rgba(150,75,0,${alpha})`;
	ctx.beginPath();
	ctx.arc(chair.x * 25 + 12.5, chair.y * 25 + 12.5, 10, 0, 2 * Math.PI);
	ctx.fill();
	ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
	ctx.stroke();
}

function createCounter(x, y) {
	if (y != savedata.grid.length - 1) { return 1; }

	let newCounter = new FurniturePrototype(x, y, 2);
	if (!canBuild(newCounter)) { return 1; }
	newCounter.holding = undefined;

	if (Build(newCounter) == 1) { return 1; }
	savedata.counters.push(newCounter);
	if (savedata.counters.length >= 3) {
		savedata.people.push(new Server());
	}
	return 0;
}

function drawCounter(counter, alpha = 1.0) {
	ctx.fillStyle = `rgba(142, 142, 142, ${alpha})`;
	ctx.fillRect(counter.x * 25, counter.y * 25, 25, 25);
	if (counter.food != null) {
		// draw food
		drawFood(counter.food, counter.x + 0.5, counter.y + 0.5)
	}
}

function DecorationPrototype(x, y, id) {
	this.x = x;
	this.y = y;
	this.id = id;
	switch (id) {
		case 0:
			this.name = "cactus";
			break;
		case 4:
			this.name = "plant";
			break;
		default:
			this.name = "fuck";
			break;
	}
}

function createCactus(x, y) {
	let newPlant = new DecorationPrototype(x, y, 3);
	if (Build(newPlant) == 0) {
		return 0;
	} else {
		return 1;
	}
}

function drawCactus(plant, alpha = 1.0) {
	ctx.fillStyle = `rgba(204, 153, 102, ${alpha})`;
	ctx.fillRect(plant.x * 25 + 8, plant.y * 25 + 19, 8, 6);
	ctx.fillStyle = 'lawngreen';
	ctx.fillRect(plant.x * 25 + 9, plant.y * 25 + 3, 6, 16);
	ctx.fillRect(plant.x * 25 + 3, plant.y * 25 + 12, 8, 4);
	ctx.fillRect(plant.x * 25 + 3, plant.y * 25 + 6, 4, 6);
	ctx.fillRect(plant.x * 25 + 15, plant.y * 25 + 8, 6, 4);
	ctx.fillRect(plant.x * 25 + 17, plant.y * 25 + 5, 4, 3);
}

function createBush(x, y) {
	let newBush = new DecorationPrototype(x, y, 4);
	if (Build(newBush) == 0) {
		return 0;
	} else {
		return 1;
	}
}

function drawBush(bush, alpha = 1.0) {
	ctx.fillStyle = `rgba(0, 80, 0, ${alpha})`;
	ctx.beginPath();
	ctx.moveTo(bush.x * 25 + 10, bush.y * 25 + 24);
	ctx.lineTo(bush.x * 25 + 15, bush.y * 25 + 24);
	ctx.lineTo(bush.x * 25 + 16, bush.y * 25 + 17);
	ctx.lineTo(bush.x * 25 + 9, bush.y * 25 + 17);
	ctx.fill();
	ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
	ctx.beginPath();
	ctx.arc(bush.x * 25 + 12.5, bush.y * 25 + 12.5, 7, 0, 2 * Math.PI);
	ctx.fill();
}

function deleteObject(obj) {
	savedata.money += objectTypeList[obj.id][4];
	// counter
	if (obj.id == 2) {
		for (let i = 0; i < savedata.counters.length; i++) {
			if (savedata.counters[i] == obj) {
				savedata.counters.splice(i, 1);
				break;
			}
		}
		for (let i = 0; i < savedata.people.length; i++) {
			if (savedata.people[i].personType == 'server') {
				let serv = savedata.people[i];
				if (serv.customerServing != null) {
					serv.customerServing.orderTaken = false;
				}
				savedata.people.splice(i, 1);
				delete serv;
				break;
			}
		}
	} else if (obj.id == 1) {
		// Remove reference to chair from table
		if (obj.tableOwner != null) {
			for (let i = 0; i < obj.tableOwner.chairsAttached.length; i++) {
				if (obj.tableOwner.chairsAttached[i] == obj) {
					obj.tableOwner.chairsAttached.splice(i,1);
					break;
				}
			}
		}
		if (obj.customerSitting != null) {
			if (obj.customerSitting.gotFood == true) {
				obj.customerSitting.table = Object();
			} else {
				obj.customerSitting.table = null;
				obj.customerSitting.orderTaken = false;
				obj.customerSitting.happiness -= 0.2;
			}
		}
	} else if (obj.id == 0) {
		for (let i = 0; i < obj.chairsAttached.length; i++) {
			obj.chairsAttached[i].tableOwner = null;
		}
	}

	for (let i = 0; i < savedata.layout.length; i++) {
		if (savedata.layout[i] == obj) {
			savedata.layout.splice(i, 1);
			break;
		}
	}

	savedata.grid[obj.y][obj.x] = undefined;
	delete obj;
}
