function Customer(order) {
  this.order = order;
  this.happy = 1;
  this.shirtColor = ['#ff0000', '#ffff00', '#00ff00'][Math.floor(Math.random() * 3)];
};


function Server() {
  this.holding;
  this.task = false;
  this.tableNum = -1;
};

function Server_serve(server, tableNum, item) {
    server.holding = item;
    server.task = true;
    server.tableNum = tableNum;
  };
