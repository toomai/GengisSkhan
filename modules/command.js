var fs = require('fs');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  
var new_command = function(user,callback){
    fs.readFile('../json/users.json', 'utf8', function (err, data) {
        if(err) callback(new Error("Error while creating new command "+err.message));
        var users = JSON.parse(data);
        
        for(var user in users){
          if(user === user.user_id){
            var id = user.commands.length;
            var date = new Date();
            var now = date.getDate();
            var commande =  {
                "command_id":id,
                "date":now,
                "lines":[],
                "price":"",
                "payed":""
            }
            user.commands[id] = commande;
            //Mettre à jour la DB

            callback(null, user); // Send back user with new command          
          }
        }
    });
}

var get_command = function(user,id_command,callback){
    fs.readFile('../json/users.json', 'utf8', function (err, data) {
        if(err) callback(new Error("Error while getting command "+err.message));
        var users = JSON.parse(data);
        for(var user in users){
          if(user===user.user_id){
            for(var command in user.commands){
                if(command.command_id===id_command){
                    callback(null,command);
                }
            }
            callback(new Error("Command not found "));
          }
        }
    });
}

var end_command = function(user,id_command,callback){
    
}

var pay_command = function(user,id_command,callback){
    
}

var cancel_command = function(user,id_command,callback){
    
}

var print_command = function(user,id_command,callback){
    
}

var add_line = function(user,id_command,product,quantity,callback){
    var command;
    get_command(user, id_command, function(err, commande){
        if(err) callback(new Error("Commant not found "+err.message))
        command = commande;
    });
     var idLine = command.lines.length+1;
     var ligne = {
        "line_id":idLine,
        "product_id":product.product_id,
        "name":product.name,
        "price":product.price,
        "description":product.description,
        "image":product.image,
        "quantity":quantity
      }
      command.lines[idLine] = ligne;
      //Met à jour le prix total de la commande
      command.price = command.price+ product.price*quantity;
      
      //Mettre à jour la DB


      callback(null,command);
}

var remove_line = function(user,id_command,id_line,callback){
    
}

var change_quantity = function(user,id_command,id_line,quantity,callback){
    
}

var change_price = function(user,id_command,id_line,price,callback){
    
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