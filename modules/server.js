var express = require('express');
var bodyParser = require('body-parser');
var logger = require("./logger.js");
var config = require("./config.js");
var commands = require("./command.js");
var products = require("./product.js");

var users = require("./users.js");
var command = require("./command.js");
var path = require('path');
var port = process.env.PORT || 3000;

var start = function(callback){
  var app = express();
  var server = require('http').Server(app);
  var io = require('socket.io')(server);
  _configureServer(app);
  _configureRoutes(app, io);
  server.listen(port,callback);
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
  app.use(function(req, res, next){
  /*  var indexPath = path.join(__dirname, '/..', '/web/');
    express.static(indexPath);*/
    next();
  });
}

function _configureRoutes(app, io){
  //var login global ?
app.get('/:login', function (req, res) {
  var login = req.params.login;

  var user = users.get_user_by_login(login, function(err, data){
    if(err || (data === undefined)){
      res.status(403);
    }else{
      res.status(200);
      res.sendFile(path.join(__dirname, '/..', '/web','/index.html'));
    }
  });
});

io.on('connection',function(socket){
  console.log("A user just connected");
});
//CONNEXION


//***************SOCKETS**********************


/*
***************SOCKETS**********************
*  app.post('/connect/web', function (req, res) {
*       var login = req.body.login;
*  }
*);
*/



    app.post('/connect/mobile', function (req, res) {
        var login = req.body.login;
        users.get_user_by_login(login,function(err,user){
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
