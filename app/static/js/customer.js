function Customer(order) {
  this.order = order;
  this.happy = 1;
  this.table = null;
};

function customer_tip(customer) {
  return Math.round(customer.happy * (0.8 + Math.random()/2.5) * 10);
}

function Server() {
  this.orders = null;
  this.holding = null;
  this.task = false;
  this.tableNum = -1;
};

function Server_serve(server, table, item) {
  server.holding = item;
  server.task = true;
  server.tableNum = table;
}

function Server_takeOrder(server, table) {
  orders = cust_getOrder(chair_Cust(table_Chairs(table)));
  return orders;
}

function make_Food(server) {
  console.log(server.orders);
  console.log(savedata);
}
