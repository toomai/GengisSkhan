var express = require('express');
var bodyParser = require('body-parser');
var logger = require("./logger.js");
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

  var user = users.connexion(login, function(err, data){
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

app.post('/connect/mobile', function (req, res) {
  var login = req.body.login;

});
//***************SOCKETS**********************


/*
***************SOCKETS**********************
*  app.post('/connect/web', function (req, res) {
*       var login = req.body.login;
*  }
*);
*/


//USER WANTS A NEW COMMAND

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
