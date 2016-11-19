var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var config = require("./modules/config.js");
var logger = require("./modules/logger.js");
var pro = require("./modules/product.js");
var users = require("./modules/users.js");

config.load(function(err){

  logger.info('URL database : '+config.url_db);

  pro.find_product_name(config.url_db,'pomme',function(data){
    logger.info('name : '+JSON.stringify(data));
  });

  pro.find_product_code(config.url_db,'925020137962',function(data){
    logger.info('id : '+JSON.stringify(data));
  });

  users.get_user(config.url_db,'820151666262',function(data){
    logger.info('user : '+JSON.stringify(data));
  });

});
