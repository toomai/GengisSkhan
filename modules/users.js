var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var logger = require("./logger.js");



var get_user= function (db,login, callback){
    findUser(db,login,function(docs){
      callback(docs[0]);
    });
}

var get_users= function (db,callback){
     findUsers(db,function(docs){
      callback(docs);
    });
}

// Renvoi les utilisateurs avec une commande active
var get_users_with_commands = function(db, callback){
  findUsers(db,function(docs){
      var users = [];
      var indice = 0;
      docs.forEach(function(element) {
        if(!element.commands[element.commands.length-1].payed){
          users[indice] = element;
          indice++;
        }
      });
      callback(users);
    });
}

var update_user_command=function(db,user,callback){
     update_command(db,user,function(docs){
        callback(docs[0]);
  });
}

exports.get_user = get_user;
exports.update_user_command = update_user_command;
exports.get_users = get_users;
exports.get_users_with_commands = get_users_with_commands;

var update_command = function(db,user,callback){
  var collection = db.collection('users');
  collection.update({'user_id':user.user_id},{$set:{'commands':user.commands}},function(err,docs){
    callback(docs);
  });
}

var findUsers = function(db, callback) {
  var collection = db.collection('users');
  collection.find({}).toArray(function(err, docs) {
    callback(docs);
  });
}

var findUser = function(db,user,callback){
  var collection = db.collection("users");
  collection.find({'user_id':user}).toArray(function(err,docs){
    callback(docs);
  });
}
