var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var config = require("./modules/config.js");
var logger = require("./modules/logger.js");
var pro = require("./modules/product.js");
var users = require("./modules/users.js");
var com = require("./modules/command.js");

config.load(function(err){

  logger.info('URL database : '+config.url_db);

/*
  pro.find_product_name(config.url_db,'pomme',function(data){
    logger.info('name : '+JSON.stringify(data));
  });

  pro.find_product_code(config.url_db,'9250201379624',function(data){
    logger.info('id : '+JSON.stringify(data));
  });

  com.new_command(config.url_db,'8201516662627',function(data){
    logger.info('user : '+JSON.stringify(data));
  });

  com.add_line(config.url_db,'8201516662627',0,function(data){
    logger.info('command : '+JSON.stringify(data));
  });

  com.get_command(config.url_db,'8201516662627',0,function(data){
    logger.info('command : '+JSON.stringify(data));
  });
*/
com.add_line(config.url_db,'8201516662627',0,'725620137564',2,function(data){
  logger.info('command : '+JSON.stringify(data));
});

});
