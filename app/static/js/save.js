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
    loadRequest()
	.then(data => {
	    console.log(data.valueOf());
	    savedata = JSON.parse(data.save);
	});
}

var c = document.getElementById("drawing");
var ctx = c.getContext("2d");

var savedata = {money : 1000, layout : [[5,5,"table"]]};
var requestID;



var size = 200; 
var growing = true;

function draw() { 
    ctx.font = "72px Calibri"
    ctx.fillText("Hello World!", 200, 300);
    
    requestID = window.requestAnimationFrame(draw);
}

requestID = window.requestAnimationFrame(draw);
