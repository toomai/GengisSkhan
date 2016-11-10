var fs = require("fs");
var logger = require("./logger.js");

var load = function(callback){
    logger.info('Start loading config file ...',function(err){if(err){console.log(err);}});
    var fichier = fs.readFile('./json/config.json',function(err,data){
        if(err){
            err = new Error("Erreur lecture de fichier ./json/config.json");
            throw err;
        }else{
            var config = data;
            for(var key in config)
                exports[key] = config[key];
            logger.info('Config file is loading.',function(err){if(err){console.log(err);}});
            callback(null);
        }
    });
}

exports.load = load;
