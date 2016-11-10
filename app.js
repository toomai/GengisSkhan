var config = require("./modules/config.js");
var logger = require("./modules/logger.js");
var server = require("./modules/server.js");


config.load(function(err){
    if(err)
       logger.info(err);

    logger.info('Succes');

    server.start(function(err){
        if(err){logger.info(err);}
    });

});
