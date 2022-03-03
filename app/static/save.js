async function saveRequest(s) {
    var data = {
            save : s
    };
    console.log(JSON.stringify(data));
    let response = await fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response;
}
