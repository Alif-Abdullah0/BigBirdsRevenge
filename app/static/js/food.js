const food = {
    "steak" : 80,
    "burger" : 35,
    "fries" : 25,
    "coffee" : 20,
    "soda" : 20,
    "water" : 15
};

function drawFood(food, x, y) {
    ctx.fillStyle = "gray";
    ctx.fillRect(x * 25 - 5, y * 25 - 2.5, 10, 5);
    switch (food) {
        case "steak":
            ctx.fillStyle = '#a53f29';
            ctx.fillRect(x * 25 - 3.5, y * 25 - 2, 7, 4);
            break;
        case "water":
            ctx.fillStyle = 'blue';
            ctx.fillRect(x * 25 - 1.5, y * 25 - 1.5, 3, 3);
            break;
        case "fries":
            ctx.fillStyle = 'yellow';
            ctx.fillRect(x * 25 + 0.5, y * 25 - 2.5, 3, 1);
            ctx.fillRect(x * 25 + 0.5, y * 25 - 1.5, 4, 1);
            ctx.fillRect(x * 25 + 0.5, y * 25 - 0.5, 2, 1);
            ctx.fillStyle = 'red';
            ctx.fillRect(x * 25 - 3.5, y * 25 - 2.5, 4, 3);
            break;
        case "soda":
            ctx.fillStyle = 'red';
            ctx.fillRect(x * 25 - 2, y * 25 - 5, 4, 6);
            break;
        case "fries":
            ctx.fillStyle = 'red';
            ctx.fillRect(x * 25 - 3, y * 25 - 1.5, 4, 3);
            ctx.fillStyle = 'yellow';
            ctx.rect(x * 25 + 1, y * 25 - 1.5, 3, 1);
            ctx.rect(x * 25 + 1, y * 25 - 0.5, 4, 1);
            ctx.rect(x * 25 + 1, y * 25 + 0.5, 2, 1);
            break;
        case "coffee":
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(x * 25, y * 25 - 3, 3, 0, Math.PI);
            ctx.moveTo(x * 25 - 3, y * 25 - 4);
            ctx.lineTo(x * 25 + 3, y * 25 - 4);
            ctx.fill();
            ctx.stroke();
            break;
        case "burger":
            ctx.fillStyle = '#d58b44';
            ctx.beginPath();
            ctx.ellipse(x * 25, y * 25 - 3, 3, 2, 0, 0, 2 * Math.PI);
            ctx.fill();
            // ctx.arc(x * 25, y * 25 - 4, 3, Math.PI, 2 * Math.PI);
            // ctx.fill();
            ctx.fillStyle = '#a53f29';
            ctx.fillRect(x * 25 - 3, y * 25 - 4, 6, 1);
            break;
    }
}
