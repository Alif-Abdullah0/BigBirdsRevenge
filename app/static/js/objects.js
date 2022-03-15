const objectTypeList = [
	/* id name constructor constructorArgs  */
	[0, "table", createTable, ['x', 'y']],
	[1, "chair", createChair, ['x', 'y']],
	[2, "kitchen counter", createCounter, ['x', 'y']],
];
objectTypeList.sort(); 
var selectedObjectInde = -1;

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
	let newchair = new FurniturePrototype(x, y, 1);
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
	if (Build(newchair) == 1)  {return 1;}
	return 0;
}

function createCounter(x, y) {
	if (y != savedata.grid.length - 1) {return 1;}

	let newCounter = new FurniturePrototype(x, y, 2);
	if (!canBuild(newCounter)) {return 1;}
	newCounter.holding = undefined;

	if (Build(newCounter) == 1) {return 1;}
    savedata.counters.push(newCounter);
	return 0;
}