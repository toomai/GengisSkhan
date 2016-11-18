var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var logger = require("./modules/logger.js");

// Connection URL
var url = 'mongodb://Admin:password@ds157187.mlab.com:57187/gengis';


var findProducts = function(db, callback) {
  var collection = db.collection('products');
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

var findUsers = function(db, callback) {
  var collection = db.collection('users');
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}


var closeDb = function(db, callback) {
  db.close();
  logger.info("Disconnected successfully from server");
}

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  logger.info("Connected successfully to server");
  findUsers(db,function(docs){

  })
});
