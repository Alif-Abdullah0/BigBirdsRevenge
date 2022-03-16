function Customer(order) {
    this.personType = 'customer';
    this.order = order;
    this.happy = 1;
    this.table = null;

    this.x = 0.5;
    this.y = savedata.grid.length / 2;

    //Technical
    this.framesPerAction = 60;
    this.framesTillNextAction = this.framesPerAction;
    this.actionFunction = Customer_takeAction;
};

function customer_tip(customer) {
    return Math.round(customer.happy * (0.8 + Math.random()/2.5) * 10);
}

function drawPerson(customer, alpha = 1.0) {
    if (customer.personType == 'customer') {
        ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
    } else /* server */ {
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    }
    ctx.fillRect(customer.x * 25 - 3, customer.y * 25 - 1, 6, 10);
    ctx.beginPath();
    ctx.arc(customer.x * 25, customer.y * 25 - 6, 7, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(232, 211, 185, ${alpha})`;
    ctx.fill();
}

function Customer_takeAction(customer) {
    if (--customer.framesTillNextAction != 0) {return;}
    customer.framesTillNextAction = customer.framesPerAction;

    if (customer.table == null) {
        if (customer.tableHeading == null) {
            let chairlist = [];
            for (let i = 0; i < savedata.layout.length; i++) {
                if (savedata.layout[i].id == 1 && savedata.layout[i].customerSitting == null) {
                    chairlist.push(savedata.layout[i]);
                }
            }
            //console.log(chairlist);
      
            if (chairlist.length == 0) {return;}
            let mindistance_object = chairlist[0];
            for (let i = 1; i < chairlist.length; i++) {
                if (Math.abs(chairlist[i].x - customer.x) + Math.abs(chairlist[i].y - customer.y) < 
                Math.abs(mindistance_object.x - customer.x) + Math.abs(mindistance_object - customer.y)) {
                    mindistance_object = chairlist[i];
                }
            }
            customer.tableHeading = mindistance_object;
        } else {
            let angle = Math.atan2(customer.tableHeading.y + 0.5 - customer.y, customer.tableHeading.x + 0.5 - customer.x);
            for (let i = 1; i < 60; i++) {
                setTimeout((customer, moveangle) => {
                if (customer.table == null) {
                    customer.x += Math.cos(moveangle);
                    customer.y += Math.sin(moveangle);
                    if (Math.pow(customer.tableHeading.x + 0.5 - customer.x, 2) + Math.pow(customer.tableHeading.y + 0.5 - customer.y, 2) <= 0.25) {
                        customer.table = customer.tableHeading;
                        customer.x = 0.5 + customer.table.x;
                        customer.y = 0.5 + customer.table.y;
                        customer.table.customerSitting = customer;
                        customer.tableHeading = null;
                    }
                }
                }, Math.trunc(1000 * i / 60.0), customer, angle);
            }
        }
    }
}

function Server() {
  this.personType = 'server';
  this.orders = null;
  this.holding = null;
  this.task = false;
  this.tableNum = -1;
  this.x = savedata.grid[0].length - 2;
  this.y = savedata.grid.length - 1.5;

  // Technical
  this.framesPerAction = 10;
  this.framesTillNextAction = this.framesPerAction;
  this.actionFunction = Server_takeAction;
};

function Server_takeAction(server) {
  if (--server.framesTillNextAction != 0) {return;}
  server.framesTillNextAction = server.framesPerAction;
}

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
