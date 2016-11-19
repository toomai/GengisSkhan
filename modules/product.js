var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var logger = require("./logger.js");
var config = require("./config.js");
var url = config.url_db;

var find_product_code = function(id_product,callback){
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    logger.info("Connected successfully to server");
    findProductId(db,id_product,function(docs){
      callback(docs[0]);
      closeDb(db);
    })
  });
}

var find_product_name = function(name,callback){
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    logger.info("Connected successfully to server");
    findProductName(db,name,function(docs){
      callback(docs[0]);
      closeDb(db);
    })
  });
}


var list_all_product=function(callback){
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    logger.info("Connected successfully to server");
    findProducts(db,function(docs){
      callback(docs);
      closeDb(db);
    })
  });
}


exports.list_all_product= list_all_product;
exports.find_product_code = find_product_code;
exports.find_product_name = find_product_name;

var findProducts = function(db,callback){
  var collection = db.collection('products');
  collection.find().toArray(function(err,docs){
    callback(docs);
  });
}
var findProductName = function(db,name,callback){
  var collection = db.collection('products');
  collection.find({'name':name}).toArray(function(err,docs){
    callback(docs);
  });
}
var findProductId = function(db,id,callback){
  var collection = db.collection('products');
  collection.find({'product_id':id}).toArray(function(err,docs){
    callback(docs);
  });
}

var closeDb = function(db) {
  db.close();
  logger.info("Disconnected successfully from server");
}
