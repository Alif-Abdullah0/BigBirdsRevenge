async function saveRequest(s) {
    let request = {
	credentials : 'include',
	cache: 'no-cache',
        method: 'POST',
        headers: {
	    'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            save : JSON.stringify(s),
	}),
    };
    //console.log(request);
    let response = await fetch('/save', request);
    return response.json();
}

async function save() {
	localStorage['save'] = savedata;
    saveRequest(savedata)
	.then(data => {
	    console.log(data.valueOf());
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
		savedata = localStorage['save'];
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
}

if (promptSave) {
	if (confirm("Would you like to load your previously saved game?")) {
		load();
	}
}