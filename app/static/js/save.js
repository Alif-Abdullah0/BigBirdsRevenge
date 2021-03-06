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
	localStorage['saveuser'] = user;
	localStorage['savetime'] = new Date().getTime();
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
	if ('save' in localStorage && localStorage.getItem('saveuser') === user && (user == '' || new Date().getTime() - localStorage['savetime'] < 1000 * 3600)) {
		savedata = JSON.parse(localStorage['save']);
		expandLoadedSave();
		console.log('Loaded save from localStorage!');
	} else {
		loadRequest()
		.then(data => {
			console.log(data.valueOf());
			if (data.status == 'good') {
				savedata = JSON.parse(data.save);
				expandLoadedSave();
			} else {
				console.log('No saved game!');
			}
		});
	}
}

function expandLoadedSave() {
	savedata.grid = [];
	for (let i = 0; i < 24; i++) {
		savedata.grid.push(Array(32));
	}
	savedata.counters = [];
	savedata.people = [];

	let savelayout = [];
	Object.assign(savelayout, savedata.layout);
	savedata.layout = [];
	for (let i = 0; i < savelayout.length; i++) {
		//console.log(savelayout[i]);
		switch (savelayout[i].id) {
			case 1:
			case 5:
				objectTypeList[savelayout[i].id][2](savelayout[i].x, savelayout[i].y, true);
				if (savelayout[i].customerSitting != null) {
					//console.log("customerSitting");
					let cust = savelayout[i].customerSitting;
					cust.table = savedata.layout[savedata.layout.length - 1];
					cust.table.customerSitting = cust;
					savedata.people.push(cust);
					//console.log(cust);
				}
				break;	
			default:
				objectTypeList[savelayout[i].id][2](savelayout[i].x, savelayout[i].y);			
				break;
		}
	}
}

function compactSaveData() {
	let tosave = {money : savedata.money, layout : [], people : [], igt : savedata.igt};
	for (let i = 0; i < savedata.layout.length; i++) {
		tosave.layout[i] = Object();
		Object.assign(tosave.layout[i], savedata.layout[i]);
		let elem = tosave.layout[i];
		switch (elem.id) {
			case 0:
				delete elem.chairsAttached;
				break;
			case 1:
				if (elem.customerSitting != null) {
					let saveCust = {};
					Object.assign(saveCust, elem.customerSitting);
					if (saveCust.gotFood == false) {
						saveCust.orderTaken = false;
					}
					elem.customerSitting = saveCust;
					elem.customerSitting.table = null;
				} 	
				delete elem.tableOwner;
				break;
			case 5: 
				if (elem.customerSitting != null) {
					let saveCust = {};
					Object.assign(saveCust, elem.customerSitting);
					if (saveCust.gotFood == false) {
						saveCust.orderTaken = false;
					}
					saveCust.table = null;
					elem.customerSitting = saveCust;
				} 
				break;
		}
	}
	console.log(tosave);
	return tosave;
}