
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var users = require('./users.js');
var pro = require('./product.js');

var new_command = function(url,login,callback){
  users.get_user(url,login,function(data){
    var commande =  {
        "command_id":data.commands.length,
        "date":new Date(),
        "lines":[],
        "price":0,
        "payed":false
    }
    data.commands[data.commands.length] = commande;
    users.update_user_command(url,data,function(user){
      callback(data);
    });
  });
}

var get_command = function(url,login,id_command,callback){
  users.get_user(url,login,function(data){
    callback(data.commands[id_command]);
  });
}

var add_line = function(url,login,id_command,product_id,quantity,callback){
  users.get_user(url,login,function(user){
    get_command(url,user.user_id,id_command,function(command){
      pro.find_product_code(url,product_id,function(product){
        var ligne = {
           "line_id": command.lines.length,
           "product_id":product.product_id,
           "name":product.name,
           "price":product.price,
           "description":product.description,
           "image":product.image,
           "quantity":quantity
         }
         command.lines[command.lines.length] = ligne;
         command.price = command.price + product.price*quantity;
         user.commands[id_command] = command;
         users.update_user_command(url,user,function(com){
               callback(com);
         });
       });
    });
  });
}

var end_command = function(url,user,id_command,callback){
  //recuperer la commande et solder le prix
}

//recuperer la commande et mettre true a payed
var pay_command = function(url,user,id_command,callback){
  get_command(url,user.user_id,id_command,function(command){
    command.payed = true;
    users.update_user_command(url, user, function(com){//TO CHECK
      callback(com);
    });
  });
}

var cancel_command = function(url,user,id_command,callback){
  //ajouter un flag annuler a true sur la commande
}

var print_command = function(url,user,id_command,callback){
  //normalement a supprimer mcar pareil que get_commmand
}



var remove_line = function(url,user,id_command,id_line,callback){
  //enlever la ligne et retirer le prix du solde
}

//changer qty d'une ligne + ajuster solde
var change_quantity = function(url,user,id_command,id_line,quantity,callback){
  get_command(url,user.user_id,id_command,function(command){
    var prix = command.price;
    prix -= command.lines[id_line].price * command.lines[id_line].quantity;
    prix += command.lines[id_line].price * quantity;
    command.price = prix;
    command.lines[id_line].quantity = quantity;
    users.update_user_command(url, user, function(com){//TO CHECK
      callback(com);
    });
  });
}

var change_price = function(url,user,id_command,id_line,price,callback){
  //changer prix de la ligne + ajuster prix
}


exports.new_command = new_command;
exports.get_command = get_command;
exports.end_command = end_command;
exports.pay_command = pay_command;
exports.cancel_command = cancel_command;
exports.print_command = print_command;
exports.add_line = add_line;
exports.remove_line = remove_line;
exports.change_quantity = change_quantity;
exports.change_price = change_price;
