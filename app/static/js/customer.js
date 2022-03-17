function Customer() {
    this.personType = 'customer';
    this.happiness = 1.0;
    this.order = Object.keys(food)[Math.floor(Math.random() * Object.keys(food).length)];
    this.table = null;

    this.x = 0.5;
    this.y = savedata.grid.length / 2;

    //Technical
    this.framesPerAction = 60;
    this.framesTillNextAction = this.framesPerAction / 2;
    this.actionFunction = Customer_takeAction;
    this.shirtColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
};

function customer_tip(customer) {
    return Math.round(customer.happy * (0.8 + Math.random()/2.5) * 10);
}

function drawPerson(person) {
    if (person.personType == 'customer') {
        ctx.fillStyle = person.shirtColor;
    } else /* server */ {
        ctx.fillStyle = 'rgb(0, 0, 0)';
    }
    ctx.fillRect(person.x * 25 - 3, person.y * 25 - 1, 6, 10);
    ctx.beginPath();
    ctx.arc(person.x * 25, person.y * 25 - 6, 7, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgb(232, 211, 185)';
    ctx.fill();
}

function Customer_findTable(customer) {
    let chairlist = [];
    for (let i = 0; i < savedata.layout.length; i++) {
        if (savedata.layout[i].id == 1 && savedata.layout[i].tableOwner != null && savedata.layout[i].customerSitting == null) {
            chairlist.push(savedata.layout[i]);
        }
    }
    //console.log(chairlist);

    if (chairlist.length == 0) {return;}
    let dist_array = [];
    for (let i = 0; i < chairlist.length; i++) {
        dist_array.push([Math.pow(chairlist[i].x + 0.5 - customer.x, 2) + Math.pow(chairlist[i].y + 0.5 - customer.y, 2), chairlist[i]]);
    }
    dist_array.sort();
    customer.tableHeading = dist_array[0][1];
}


function Customer_takeAction(customer, peopleArrayIndex) {
    if (--customer.framesTillNextAction != 0) {return;}
    customer.framesTillNextAction = customer.framesPerAction;

    if (customer.table == null) {
        if (customer.tableHeading == null && ((customer) => {Customer_findTable(customer);return customer.tableHeading != null})(customer)) {
            //Customer_findTable(customer);
        } else {
            let angle = customer.tableHeading == null ? 0 : Math.atan2(customer.tableHeading.y + 0.5 - customer.y, customer.tableHeading.x + 0.5 - customer.x);
            for (let i = 1; i < 60; i++) {
                setTimeout((customer, moveangle) => {
                if (customer.table == null) {
                    if (customer.tableHeading == null) {
                        Customer_findTable(customer);
                        if (customer.tableHeading == null) {
                            if (Math.pow(customer.y - 12, 2) + Math.pow(customer.x - 0.5, 2) < 1) {
                                customer.happiness -= 0.001;
                                if (customer.happiness <= 0) {
                                    savedata.people.splice(peopleArrayIndex, 1);
                                    delete customer;
                                }
                                return;
                            }
                            let angle = Math.atan2((11.5 + Math.random()) - customer.y, (0 + Math.random()) - customer.x, 2);
                            if (angle < 0) {angle += 2 * Math.PI;}
                            customer.x += 5 / 60.0 * Math.cos(angle);
                            customer.y += 5 / 60.0 * Math.sin(angle)
                        }
                        return;
                    }
                    if (customer.tableHeading.customerSitting != null) {
                        customer.tableHeading = null;
                        return;
                    }
                    customer.x += 5 / 60.0 * Math.cos(moveangle);
                    customer.y += 5 / 60.0 * Math.sin(moveangle);
                    if (Math.pow(customer.tableHeading.x + 0.5 - customer.x, 2) + Math.pow(customer.tableHeading.y + 0.5 - customer.y, 2) <= 0.0625) {
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
    } else {
        // Order food? 
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
