var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
var logger = require("./logger.js");

var find_product_code = function(db, id_product, callback) {
    findProductId(db, id_product, function(docs) {
        callback(docs[0]);
    });
}

var find_product_name = function(db, name, callback) {
    findProductName(db, name, function(docs) {
        callback(docs[0]);
    });
}


var list_all_product = function(db, callback) {
    findProducts(db, function(docs) {
        callback(docs);
    });
}

var modify_product = function(db, product, callback) {
    update_product(db, product, function(result) {
        callback(result[0]);
    });
}

var add_product = function(db, product, callback){
    insert_product(db, product, function(result){
        callback(result);
    });
}

var delete_product = function(db, product, callback){
    remove_product(db, product, function(result){
        callback(result);
    });
}

exports.list_all_product = list_all_product;
exports.find_product_code = find_product_code;
exports.find_product_name = find_product_name;
exports.modify_product = modify_product;
exports.add_product = add_product;
exports.delete_product = delete_product;

var update_product = function(db, product, callback) {
    var collection = db.collection('products');
    collection.update({
        'product_id': product.product_id
    }, {
        $set: {
            'name': product.name,
            'price': product.price,
            'description': product.description,
        }
    }, function(err, result) {
        callback(result);
    });
}

var insert_product = function(db, product, callback){
    db.collection('products').insertOne({
        'product_id': product.product_id,
        'name': product.name,
        'price': product.price,
        'description': product.description,
        'image': product.image
    }, function(err, result){
        assert.equal(err, null);
        callback(result);
    });
}

var remove_product = function(db, product, callback){
    db.collection('products').deleteOne({
        'product_id': product.product_id
        },
        function(err, result){
            assert.equal(err, null);
            callback(result);
        });
}

var findProducts = function(db, callback) {
    var collection = db.collection('products');
    collection.find().toArray(function(err, docs) {
        callback(docs);
    });
}
var findProductName = function(db, name, callback) {
    var collection = db.collection('products');
    collection.find({
        'name': name
    }).toArray(function(err, docs) {
        callback(docs);
    });
}
var findProductId = function(db, id, callback) {
    var collection = db.collection('products');
    collection.find({
        'product_id': id
    }).toArray(function(err, docs) {
        callback(docs);
    });
}

var closeDb = function(db) {
    db.close();
    logger.info("Disconnected successfully from server");
}