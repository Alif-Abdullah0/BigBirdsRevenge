function Customer(order) {
  this.order = order;
  this.happy = 1;
};

function customer_tip(customer) {
  return Math.round(customer.happy * (0.8 + Math.random()/2.5) * 10);
}

function Server() {
  this.holding = NULL;
  this.task = false;
  this.tableNum = -1;
};

function Server_serve(server, tableNum, item) {
  server.holding = item;
  server.task = true;
  server.tableNum = tableNum;
}
