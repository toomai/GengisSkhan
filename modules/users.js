var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var logger = require("./logger.js");


var get_user= function (url,login, callback){
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    logger.info("Connected successfully to server");
    findUser(db,login,function(docs){
      callback(docs[0]);
      closeDb(db);
    })
  });
}

var get_users= function (url,callback){
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    logger.info("Connected successfully to server");
    findUsers(db,function(docs){
      callback(docs);
      closeDb(db);
    })
});


}


exports.get_user = get_user;
exports.get_users = get_users;

var closeDb = function(db) {
  db.close();
  logger.info("Disconnected successfully from server");
}

var findUsers = function(db, callback) {
  var collection = db.collection('users');
  collection.find({}).toArray(function(err, docs) {
    callback(docs);
  });
}

var findUser = function(db,user,callback){
  var collection = db.collection('users');
  collection.find({'user_id':user}).toArray(function(err,docs){
    callback(docs);
  });
}
