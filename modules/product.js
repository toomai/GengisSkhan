var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var logger = require("./logger.js");

var find_product_code = function(db,id_product,callback){
      findProductId(db,id_product,function(docs){
        callback(docs[0]);
  });
}

var find_product_name = function(db,name,callback){
        findProductName(db,name,function(docs){
          callback(docs[0]);
  });
}


var list_all_product=function(db,callback){
     findProducts(db,function(docs){
      callback(docs);
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
