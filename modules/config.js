var logger = require("./logger.js");
var config = require('../json/config.json');

var load = function(callback){
    logger.info('Start loading config file ...');
    for(var key in config)
        exports[key] = config[key];
    exports.url_db = exports.db_url_start+exports.db_user+':'+exports.db_mdp+exports.db_url_serv+':'+exports.db_port+exports.db_name
    logger.info('URL database : '+exports.url_db);
    logger.info('Config file is loading.',function(err){if(err){console.log(err);}});
    callback(null);
}

exports.load = load;
