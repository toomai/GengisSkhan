var express = require('express');
var bodyParser = require('body-parser');

var logger = require("./logger.js");
var users = require("./users.js");
var command = require("./command.js");

var start = function(callback){
    var app = express();
    _configureServer(app);
    _configureRoutes(app);
    app.listen(3000,callback);
    
}

var stop = function(callback){
    callback(null);
}

exports.start = start;
exports.stop = stop;

function _configureServer(app){

   app.use(bodyParser.json()); 
   app.use(bodyParser.urlencoded({ extended: true }));

   app.use(function(req, res, next) {
       logger.info('Request URL:'+ req.originalUrl);
       next();
    });

   app.use(function (req, res, next) {
        next();
   });

}

function _configureRoutes(app){

    
    //CONNEXION

    app.post('/connect/mobile', function (req, res) {
        var login = req.body.login;

    });

    app.post('/connect/web', function (req, res) {
         var login = req.body.login;
    }
    );


    //USER WILL A NEW COMMAND

    app.get('/command/new/:login', function (req, res) {
        var login = req.body.login;

    });

    //USER WILL ADD A NEW PRODUCT
    app.post('/command/add', function (req, res) {
        var login = req.body.login;
        var command_id = req.body.command;
        var product = req.body.product;
        var quantity = req.body.quantity;
    });


    //USER WILL PAY HIS COMMAND

    app.get('/command/pay/:login/:command', function (req, res) {
        var login = req.body.login;
        var command_id = req.body.command;
    });

    //USER WILL END HIS COMMAND

    app.get('/command/end/:login/:command', function (req, res) {
        var login = req.body.login;
        var command_id = req.body.command;

    });

    //NO ROUTE FOUND 

    app.use('*', function (req, res, next) {
        res.status(404).send('No route');
    });
}
