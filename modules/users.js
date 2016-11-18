var userJson = require('../json/users.json');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  
var get_user= function (login, callback){
    callback(null,userJson[login]);
}


exports.get_user = get_user;
