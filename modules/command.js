var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
var users = require('./users.js');
var pro = require('./product.js');

var new_command = function(db, login, callback) {
    users.get_user(db, login, function(data) {
        var commande = {
            "command_id": data.commands.length,
            "date": new Date(),
            "lines": [],
            "price": 0,
            "payed": false
        }
        data.commands[data.commands.length] = commande;
        users.update_user_command(db, data, function(user) {
            callback(data);
        });
    });
}

var get_command = function(db, login, id_command, callback) {
    users.get_user(db, login, function(data) {
        callback(data.commands[id_command]);
    });
}

// Recupere la derniere commande de l'utilisateur'; verifie si la derniere commande est payee
var get_last_command = function(db, login, callback) {
    users.get_user(db, login, function(data) {
        callback(data.commands[data.commands.length - 1]);
    });
}

var add_line = function(db, login, id_command, product_id, quantity, callback) {
    users.get_user(db, login, function(user) {
        get_command(db, login, id_command, function(command) {
            pro.find_product_code(db, product_id, function(product) {
                var ligne = {
                    "line_id": command.lines.length,
                    "product_id": product.product_id,
                    "name": product.name,
                    "price": product.price,
                    "description": product.description,
                    "image": product.image,
                    "quantity": quantity
                }
                command.lines[command.lines.length] = ligne;
                command.price = command.price + product.price * quantity;
                user.commands[id_command] = command;
                users.update_user_command(db, user, function(com) {
                    callback(user.commands[id_command]);
                });
            });
        });
    });
}

/************* NO NEED A PRIORI ***********************
var end_command = function(db,user,id_command,callback){
  //recuperer la commande et solder le prix
  //renvoyer commande
}
*******************************************************/

//recuperer la commande et mettre true a payed
var pay_command = function(db, user, id_command, callback) {
    get_command(db, user.user_id, id_command, function(command) {
        user.commands[id_command] = command;
        user.commands[id_command].payed = true;
        users.update_user_command(db, user, function(com) { //TO CHECK
            callback(command);
        });
    });
}

/************* NO NEED A PRIORI ***********************
//ajouter un flag annuler a true sur la commande
var cancel_command = function(db,user,id_command,callback){
  get_command(db,user.user_id,id_command,function(command){
    user.commands[id_command] = command;
    user.command.canceled = true;
    users.update_user_command(db, user, function(com){//TO CHECK
      callback(com);
    });
  });
}
******************************************************/

/************* NO NEED A PRIORI ***********************
var print_command = function(db,user,id_command,callback){
  //normalement a supprimer mcar pareil que get_commmand
}
******************************************************/

//enlever la ligne et retirer le prix du solde
var remove_line = function(db, user, id_command, id_line, callback) {
    get_command(db, user.user_id, id_command, function(command) {
        var prix = command.price;
        var i = 0;
        for(;i < command.lines.length; i++){
          if(command.lines[i].line_id === id_line)
            break;
        }
        prix -= command.lines[i].price * command.lines[i].quantity;
        user.commands[i].price = prix;

        if (command.lines.length === 1) {
            var lines = [];
            user.commands[id_command].lines = lines;
        } else {
            command.lines[i] = command.lines[command.lines.length - 1];
            var indice, lines = [];
            for (indice = 0; indice < command.lines.length - 1; indice++) {
                lines[indice] = command.lines[indice];
              //  console.log(lines[indice]);
            }
            user.commands[id_command].lines = lines;
        }

        users.update_user_command(db, user, function(com) { //TO CHECK
            callback(user);
        });
    });
}

//changer qty d'une ligne + ajuster solde
var change_quantity = function(db, user, id_command, id_line, quantity, price,callback) {
    get_command(db, user.user_id, id_command, function(command) {
        var prix = command.price;
        var i = 0;
        for(; i < command.lines.length ; i++){
          if(command.lines[i].line_id === id_line){
            prix -= command.lines[i].price * command.lines[i].quantity;
            prix += price * quantity;
            break;
          }
        }

        command.price = prix;
        command.lines[i].quantity = quantity;
        command.lines[i].price = price;
        user.commands[id_command] = command;
        users.update_user_command(db, user, function(com) { //TO CHECK
          get_last_command(db, user.user_id,function(lastCom){
            callback(lastCom);
          });
        });
    });
}

//changer prix de la ligne + ajuster prix
var change_price = function(db, user, id_command, id_line, price, callback) {
    get_command(db, user.user_id, id_command, function(command) {
        var prix = command.price;
        prix -= command.lines[id_line].price * command.lines[id_line].quantity;
        prix += price * command.lines[id_line].quantity;
        command.price = prix;
        command.lines[id_line].price = price;
        user.commands[id_command] = command;
        users.update_user_command(db, user, function(com) { //TO CHECK
            callback(command);
        });
    });
}


exports.new_command = new_command;
exports.get_command = get_command;
exports.pay_command = pay_command;
exports.add_line = add_line;
exports.remove_line = remove_line;
exports.change_quantity = change_quantity;
exports.change_price = change_price;
exports.get_last_command = get_last_command;
