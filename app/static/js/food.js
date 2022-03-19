const food = {
    "steak" : 60,
    "burger" : 25,
    "fries" : 15,
    "coffee" : 12,
    "soda" : 12,
    "water" : 6
};

function drawFood(food, x, y) {
    ctx.fillStyle = "gray";
    ctx.fillRect((x * 25) - 5, y * 25 - 2.5, 10, 5);
    switch (food) {
        case "steak":
            ctx.fillStyle = '#a53f29';
            ctx.fillRect(x * 25 - 3.5, y * 25 - 2, 7, 4);
            break;
        case "water":
            ctx.fillStyle = 'blue';
            ctx.fillRect(x * 25 - 1.5, y * 25 - 1.5, 3, 3);
            break;
    }
}
