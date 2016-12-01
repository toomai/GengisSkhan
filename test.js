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


com.new_command(config.url_db,'8201516662627',function(data){
    logger.info('user : '+JSON.stringify(data));
  });

com.add_line(config.url_db,'8201516662627',0,'7256201375642',2,function(data){
  logger.info('command1 : '+JSON.stringify(data));
});

users.get_user(config.url_db,'8201516662627', function(data){
  com.pay_command(config.url_db,data,0,function(test){
    logger.info('command2 : '+JSON.stringify(test));
  });
});

users.get_user(config.url_db,'8201516662627', function(data){
  com.change_quantity(config.url_db,data,0,0,10,function(test){
    logger.info('command2 : '+JSON.stringify(test));
  });
});

users.get_user(config.url_db,'8201516662627', function(data){
  com.change_price(config.url_db,data,0,0,50.25,function(test){
    logger.info('command2 : '+JSON.stringify(test));
  });
});*/

users.get_user(config.url_db,'8201516662627', function(data){
  com.remove_line(config.url_db,data,0,0,function(test){
    logger.info('command2 : '+JSON.stringify(test));
  });
});

});
