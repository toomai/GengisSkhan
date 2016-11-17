var fs = require("fs");
var logger = require("./logger.js");
var config = require('../json/config.json');

var load = function(callback){
    logger.info('Start loading config file ...');
    for(var key in config)
        exports[key] = config[key];
    logger.info('Config file is loading.',function(err){if(err){console.log(err);}});
    callback(null);
}

exports.load = load;
