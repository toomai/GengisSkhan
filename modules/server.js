var express = require('express');
var bodyParser = require('body-parser');

var logger = require("./logger.js");
var config = require("./config.js");

var users = require("./users.js");
var commands = require("./command.js");
var products = require("./product.js");


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
        users.connexion(login,function(err,user){
            if(err)
                logger.info(err);
            if(user){
                res.status(200).send(user);
            }else{
                res.status(404).send('Error happend');
            }
        });
        
    });

    //USER WILL A NEW COMMAND

    app.get('/command/new/:login', function (req, res) {
        var login = req.body.login;
        var user = users.get_user(login);
        if(user){
            var command = commands.new_command(user);
            res.status(200).send(command);
        }else{
            res.status(404).send('Error happend');
        }
    });

    //USER WILL ADD A NEW PRODUCT
    app.post('/command/add', function (req, res) {
        var login = req.body.login;
        var command_id = req.body.command;
        var product = req.body.product;
        var quantity = req.body.quantity;
        var user = users.get_user(login);
        product = products.find_product_code(product);
        commands.add_line(user,command_id,product,quantity);
        if(command){
            var command = commands.get_command(user,command_id);
            res.status(200).send(command);
        }else{
            res.status(404).send('Error happend');
        }
    });


    //USER WILL PAY HIS COMMAND

    app.get('/command/pay/:login/:command', function (req, res) {
        var login = req.body.login;
        var command_id = req.body.command;
        var user = users.get_user(login);
        var command = commands.pay_command(user,command_id)
        if(command){
            res.status(200).send(command);
        }else{
            res.status(404).send('Error happend');
        }
    });

    //USER WILL END HIS COMMAND

    app.get('/command/end/:login/:command', function (req, res) {
        var login = req.body.login;
        var command_id = req.body.command;
        var user = users.get_user(login);
        var command = commands.end_command(user,command_id)
        if(command){
            res.status(200).send(command);
        }else{
            res.status(404).send('Error happend');
        }
    });

    //NO ROUTE FOUND 

    app.use('*', function (req, res, next) {
        res.status(404).send('No route');
    });
}
