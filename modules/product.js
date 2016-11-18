var fs = require('fs');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  
var find_product_code = function(id_product,callback){
  fs.readFile('../json/products.json', 'utf8', function (err, data) {
      if (err) callback(new Error("erreur dans find product code "+ err.message));
      var allProducts = JSON.parse(data);
      callback(null,allProducts[id_product]);
});
}

var find_product_name = function(name,callback){
  fs.readFile('../json/products.json', 'utf8', function (err, data) {
      if (err) callback(new Error("erreur dans find product name"+ err.message));
      var allProducts = JSON.parse(data);

      for(var key in allProducts){
          if(allProducts[key].name===name){
            var produit = allProducts[key];
          }
  }
      callback(null,produit);
});
}


var list_all_product=function(callback){

fs.readFile('../json/products.json', 'utf8', function (err, data) {
  if (err) callback(new Error("erreur dans list all product"+ err.message));
    var allProducts = JSON.parse(data);

      callback(null,allProducts);
});
}

exports.list_all_product= list_all_product;
exports.find_product_code = find_product_code;
exports.find_product_name = find_product_name;
