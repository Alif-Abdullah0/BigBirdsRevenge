const peopleActionFunctions = {
    'server' : Server_takeAction,
    'customer' : Customer_takeAction,
}

function Customer() {
    this.personType = 'customer';
    this.happiness = 1.0;
    this.order = Object.keys(food)[Math.floor(Math.random() * Object.keys(food).length)];
    this.orderTaken = false;
    this.gotFood = false;
    this.table = null;

    this.x = 0.5;
    this.y = savedata.grid.length / 2;


    //Technical
    this.framesPerAction = 60;
    this.framesTillNextAction = this.framesPerAction / 2;
    this.shirtColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
};

function customer_tip(customer) {
    return Math.round(customer.happy * (0.8 + Math.random()/2.5) * 10);
}

function drawPerson(person) {
    if (person.personType == 'server') {
        ctx.fillStyle = 'rgb(0, 0, 0)';
    } else {
        ctx.fillStyle = person.shirtColor;
    }
    ctx.fillRect(person.x * 25 - 3, person.y * 25 - 1, 6, 10);
    ctx.beginPath();
    ctx.arc(person.x * 25, person.y * 25 - 6, 7, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgb(232, 211, 185)';
    ctx.fill();
    if (person.personType == 'server' && person.holding != null){
        drawFood(person.holding, person.x - 0.1, person.y);
    } else if (person.personType == 'customer' && person.gotFood && person.eatingTime > 0) {
        drawFood(person.order, person.x - 0.1, person.y + 0.1);
        if (person.eatingTime > 600 - 60) {
            ctx.fillStyle = 'green';
            ctx.fillRect(person.x *  25 - 1, person.y * 25 - 22.5, 10, 6);
            ctx.fillRect(person.x * 25 - 8, person.y * 25 - 22.5, 2, 8);
            ctx.fillRect(person.x * 25 - 11, person.y * 25 - 19.5, 8, 2);
            ctx.fillStyle = 'lawngreen';
            ctx.font = '5px Arial';
            ctx.fillText('$',person.x * 25 + 2, person.y * 25 - 17.5);
        }
    }
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
    if (savedata.igt[0] >= 21) {
        if (savedata.igt[0] >= 22 && customer.table != null) {
            customer.table.customerSitting = null;
            customer.table = null;
        } // If after 22:00 customers leave whether they have tables
        if (customer.table == null) {
            for (let i = 0; i < savedata.people.length; i++) {
                if (savedata.people[i].personType == 'server' && savedata.people[i].customerServing == customer) {
                    savedata.people[i].customerServing = null;
                    savedata.people[i].orders = null;
                    savedata.people[i].holding = null;
                }
            }
            let angle = Math.atan2(12 - customer.y, 0.5 - customer.x);
            customer.x += 5 / 60.0 * Math.cos(angle);
            customer.y += 5 / 60.0 * Math.sin(angle);
            if (Math.pow(12 - customer.y, 2) + Math.pow(0.5 - customer.x, 2) <= 0.25) {
                savedata.people.splice(peopleArrayIndex, 1);
                delete customer;
            }
            return;
        }
    }
    if (customer.table == null) {
        if (customer.tableHeading == null) {
            Customer_findTable(customer);
            //Customer_findTable(customer);
        }
        if (customer.tableHeading != null) {
            let angle = customer.tableHeading == null ? 0 : Math.atan2(customer.tableHeading.y + 0.5 - customer.y, customer.tableHeading.x + 0.5 - customer.x);
            if (customer.table == null) {
                if (customer.tableHeading.customerSitting != null) {
                    customer.tableHeading = null;
                    return;
                }
                customer.x += 5 / 60.0 * Math.cos(angle);
                customer.y += 5 / 60.0 * Math.sin(angle);
                if (Math.pow(customer.tableHeading.x + 0.5 - customer.x, 2) + Math.pow(customer.tableHeading.y + 0.5 - customer.y, 2) <= 0.0625) {
                    customer.table = customer.tableHeading;
                    customer.x = 0.5 + customer.table.x;
                    customer.y = 0.5 + customer.table.y;
                    customer.table.customerSitting = customer;
                    customer.tableHeading = null;
                }
            }
        } else {
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
            customer.y += 5 / 60.0 * Math.sin(angle);
        }
    } else {
        if (customer.gotFood == true) {
            if (customer.eatingTime == null) {
                customer.eatingTime = 600;
            } else {
                if (customer.eatingTime > 0) {
                    customer.eatingTime--;
                    return;
                } else {
                    if (customer.table.customerSitting == customer) {
                        customer.table.customerSitting = null;
                    }
                    let angle = Math.atan2(12 - customer.y, 0.5 - customer.x);
                    customer.x += 5 / 60.0 * Math.cos(angle);
                    customer.y += 5 / 60.0 * Math.sin(angle);
                    if (Math.pow(0.5 - customer.x, 2) + Math.pow(12 - customer.y, 2) <= 0.25) {
                        savedata.people.splice(peopleArrayIndex, 1);
                        delete customer;
                    }
                }
            }
        }
    }
}

function Server() {
    this.personType = 'server';
    this.orders = null;
    this.holding = null;
    //this.task = false;
    //this.tableNum = -1;
    this.x = savedata.grid[0].length - 2;
    this.y = savedata.grid.length - 1.5;

    this.customerServing = null;

};

function Server_findCustomer(server) {
    for (let i = 0; i < savedata.people.length; i++) {
        if (savedata.people[i].personType !== 'customer') { continue; }
        if (savedata.people[i].table != null && savedata.people[i].orderTaken == false) {
            server.customerServing = savedata.people[i];
            break;
        }
    }
}

function Server_findFood(server) {
    for (let i = 0; i < savedata.counters.length; i++) {
        if (savedata.counters[i].food == null) {
            savedata.counters[i].food = server.orders;
            server.foodCounter = savedata.counters[i];
            break;
        }
    }
}

function Server_takeAction(server) {
    if (server.customerServing == null) {
        Server_findCustomer(server);
    }
    if (server.customerServing != null) {
        if (server.customerServing.gotFood == true || (server.customerServing.orderTaken == true && server.orders == null)) {
            server.customerServing = null;
            server.orders = null;
            return;
        }
        if (server.customerServing.orderTaken == false) {
            if (Math.pow(server.x - server.customerServing.x, 2) + Math.pow(server.y - server.customerServing.y, 2) <= 0.25) {
                server.orders = server.customerServing.order;
                //console.log(server.customerServing.order);
                server.customerServing.orderTaken = true;
            } else {
                let angle = Math.atan2(server.customerServing.y - server.y, server.customerServing.x - server.x);
                server.x += 5 / 60.0 * Math.cos(angle);
                server.y += 5 / 60.0 * Math.sin(angle);
            }
        } else {
            if (server.holding == null) {
                if (server.foodCounter == null) {
                    Server_findFood(server);
                }
                if (server.foodCounter != null) {
                    let angle = Math.atan2(server.foodCounter.y - server.y, server.foodCounter.x + 0.5 - server.x);
                    server.x += 5 / 60.0 * Math.cos(angle);
                    server.y += 5 / 60.0 * Math.sin(angle);
                    if (Math.pow(server.foodCounter.y - server.y, 2) + Math.pow(server.foodCounter.x + 0.5 - server.x, 2) <= 0.0625) {
                        server.holding = server.orders;
                        server.foodCounter.food = null;
                        server.foodCounter = null;
                    }
                }
            } else {
                // Bring food back to customer
                if (Math.pow(server.x - server.customerServing.x, 2) + Math.pow(server.y - server.customerServing.y, 2) <= 0.25) {
                    server.customerServing.gotFood = true;
                    savedata.money += food[server.orders];
                    server.orders = null;
                    server.customerServing = null;
                    server.holding = null;
                } else {
                    let angle = Math.atan2(server.customerServing.y - server.y, server.customerServing.x - server.x);
                    server.x += 5 / 60.0 * Math.cos(angle);
                    server.y += 5 / 60.0 * Math.sin(angle);
                }
            }
        }
    } else {
        if (Math.pow(savedata.grid[0].length - 2 - server.x, 2) + Math.pow(savedata.grid.length - 1.5 - server.y, 2) >= 1) {
            let angle = Math.atan2(savedata.grid.length - 1.5 - server.y, savedata.grid[0].length - 2 - server.x);
            server.x += 5 / 60.0 * Math.cos(angle);
            server.y += 5 / 60.0 * Math.sin(angle);
        }
    }
}

function Server_serve(server, table, item) {
}

function Server_takeOrder(server, table) {
    orders = cust_getOrder(chair_Cust(table_Chairs(table)));
    return orders;
}

function make_Food(server) {
    console.log(server.orders);
}
