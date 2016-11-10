var winston = require("winston");

var info = function info(message){
    var logger = module.exports = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
            colorize: true,
            timestamp: true
            })
        ]
    });
    logger.info(message);
}

exports.info = info;