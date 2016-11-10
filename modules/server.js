var express = require('express');
var logger = require("./logger.js");
var jwt = require('jsonwebtoken');

var object,token;

var start = function(callback){
    var app = express();
    _configureServer(app);
    _configureRoutes(app);
    app.listen(config.port,callback);
}

var stop = function(callback){
    callback(null);
}

exports.start = start;
exports.stop = stop;

function _configureServer(app){

   object = { admin: 'admin' };
   token = jwt.sign(object, 'token private crypte');
   logger.info(token);

   app.use(function(req, res, next) {
       logger.info('Request URL:'+ req.originalUrl);
       next();
    });
   app.use(function (req, res, next) {
    next();
   });
}

function _configureRoutes(app){

    app.get('/', function (req, res) {
        res.send('Hello World ');
    });

    app.post('/admin', function (req, res) {
        logger.info(token);
        var decoded = jwt.verify(req.query.token, 'token private crypte');
        if(decoded.admin == 'admin'){
            res.send('Admin only');
        }else{
            res.redirect('/');
        }
    });

    app.use('*', function (req, res, next) {
        res.send(404,'No route');
    });
}
