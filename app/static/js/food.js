const food = {
  "steak" : 200,
  "burger" : 100,
  "fries" : 50,
  "coffee" : 30,
  "soda" : 20,
  "water" : 10
};

function drawFood(food, x, y) {
    ctx.fillStyle = "gray";
    ctx.fillRect((x * 25) - 5, y * 25 - 2.5, 10, 5);
    if (food == "steak") {
        ctx.fillStyle = `#a53f29`;
        ctx.fillRect((x * 25) - 3.5, y * 25 - 3, 7, 4);
    }
}
