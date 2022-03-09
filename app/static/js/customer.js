function Customer(order) {
  this.order = order;
  this.happy = 1;
  this.tip = function () {
    return "test" + this.happy;
  };
};

function Server() {
  this.holding;
  this.task = false;
  this.tableNum = -1;
  this.serve = function (tableNum, item) {
    this.holding = item;
    this.task = true;
    this.tableNum = tableNum;
  };
};
