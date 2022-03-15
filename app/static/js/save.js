async function saveRequest(s) {
    let request = {
	credentials : 'include',
	cache: 'no-cache',
        method: 'POST',
        headers: {
	    'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            save : s,
	}),
    };
    //console.log(request);
    let response = await fetch('/save', request);
    return response.json();
}

async function save() {
	localStorage['save'] = JSON.stringify(compactSaveData());
	console.log('Saved to localStorage!');
    saveRequest(localStorage['save'])
	.then(data => {
	    console.log("Server Response: ", data.valueOf());
	});
}

async function loadRequest() {
    let request = {
	credentials : 'include',
	cache: 'no-cache',
	method : 'GET',
    }
    let response = await fetch('/load', request);
    return response.json();
}

async function load() {
	if ('save' in localStorage) {
		savedata = JSON.parse(localStorage['save']);
		console.log('Loaded save from localStorage!');
	} else {
		loadRequest()
		.then(data => {
			console.log(data.valueOf());
			if (data.status == 'good') {
				savedata = JSON.parse(data.save);
			} else {
				console.log('No saved game!');
			}
		});
	}
	expandLoadedSave();
}

function expandLoadedSave() {
	savedata.grid = Array(600 / 25);
	for (i = 0; i < savedata.grid.length; i++) {
		savedata.grid[i] = Array(800 / 25);
	}
	savedata.counters = [];

	let savelayout = savedata.layout;
	savedata.layout = [];
	for (i in savelayout) {
		//console.log(savelayout[i]);
		switch (savelayout[i].id) {
			case 0:
			case 1:
			case 2:
				objectTypeList[savelayout[i].id][2](savelayout[i].x, savelayout[i].y);
				break;
			default:
				console.error("Something went wrong");
				break;
		}
	}
}

function compactSaveData() {
	let tosave = {money : savedata.money, layout : [], people : savedata.people, igt : savedata.igt};
	for (i = 0; i < savedata.layout.length; i++) {
		tosave.layout[i] = Object();
		Object.assign(tosave.layout[i], savedata.layout[i]);
		let elem = tosave.layout[i];
		switch (elem.id) {
			case 0:
				delete elem.chairsAttached;
				break;
			case 1:
				delete elem.tableOwner;
				break;
		}
	}
	console.log(tosave);
	return tosave;
}