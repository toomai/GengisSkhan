var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var logger = require("./logger.js");
var config = require("./config.js");
var commands = require("./command.js");
var products = require("./product.js");
var users = require("./users.js");
var command = require("./command.js");

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var tableConnexions={};

var start = function(callback) {

    _configureServer(app);
    _configureRoutes(app, io);

    server.listen(process.env.PORT || config.port, callback);
}


var stop = function(callback) {
    callback(null);
}

exports.start = start;
exports.stop = stop;

function _configureServer(app) {

    app.use('/webapp',express.static(path.join(__dirname, '/..','/web')));

    app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(function(req, res, next) {
        logger.info('Request URL:' + req.originalUrl);
        next();
    });

}

function _configureRoutes(app, io) {

    /*
    */
    app.get('/login/:login', function(req, res) {
        var login = req.params.login;
        var user = users.get_user(config.url_db,login, function(data) {
          //data = 1;
            if (data) {
                _socketConnection(io, data);
            } else {
                res.status(404).send('Error happend');
            }
        });
    });

    //CONNEXION


    app.post('/connect/mobile', function(req, res) {
        var login = req.body.login;
        users.get_user(config.url_db,login, function(user) {
            if (user) {
                res.status(200).send(user);
            } else {
                res.status(404).send('Error happend');
            }
        });
    });

    //USER WILL A NEW COMMAND


    app.get('/command/new/:login', function(req, res) {
        var login = req.params.login;
        users.get_user(config.url_db,login, function(user) {
            if (user) {
                commands.new_command(config.url_db,user.user_id, function(command) {
                    if (command){
                        res.status(200).send(command);

                    } else {
                        res.status(404).send('Error happend');
                    }
                });
            }
        });

    });

    //USER WILL ADD A NEW PRODUCT


    app.post('/command/add', function(req, res) {
        var login = req.body.login;
        var command_id = req.body.command;
        var product = req.body.product;
        var quantity = req.body.quantity;

        users.get_user(config.url_db,login, function(user) {
            if (user) {
                products.find_product_code(config.url_db,product, function(product) {
                    if (product) {
                        commands.add_line(config.url_db,user.user_id, command_id, product.product_id, quantity, function(command) {
                            if (command) {
                                commands.get_command(config.url_db,user.user_id, command_id, function(data) {
                                    if (data) {
                                        res.status(200).send(command);
                                     //   tableConnexions[user.user_id].emit(command);
                                    } else {
                                        res.status(404).send('Error happend');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });


    //USER WILL PAY HIS COMMAND


    app.get('/command/pay/:login/:command', function(req, res) {
        var login = req.params.login;
        var command_id = req.params.command;

        users.get_user(config.url_db,login, function(user) {
            commands.pay_command(config.url_db,user, command_id, function(command) {
                if (command) {
                    res.status(200).send(command);
                } else {
                    res.status(404).send('Error happend');
                }
            })
        });
    });



 app.post('/command/remove', function(req, res) {
        var login = req.body.login;
        var command_id = req.body.command;
         var line_id = req.body.line;

        users.get_user(config.url_db,login, function(user) {
            commands.remove_line(config.url_db,user, command_id,line_id, function(command) {
                if (command) {
                    res.status(200).send(command);
                } else {
                    res.status(404).send('Error happend');
                }
            })
        });
    });


app.post('/command/modify/quantity', function(req, res) {
        var login = req.body.login;
        var command_id = req.body.command;
         var line_id = req.body.line;
         var quantity = req.body.quantity;

        users.get_user(config.url_db,login, function(user) {
            commands.change_quantity(config.url_db,user, command_id,line_id, quantity,function(command) {
                if (command) {
                    res.status(200).send(command);
                } else {
                    res.status(404).send('Error happend');
                }
            })
        });
    });


app.post('/command/modify/price', function(req, res) {
        var login = req.body.login;
        var command_id = req.body.command;
         var line_id = req.body.line;
         var price = req.body.price;

        users.get_user(config.url_db,login, function(user) {
            commands.change_price(config.url_db,user, command_id,line_id,price, function(command) {
                if (command) {
                    res.status(200).send(command);
                } else {
                    res.status(404).send('Error happend');
                }
            })
        });
    });


    //USER WILL END HIS COMMAND


    app.get('/command/end/:login/:command', function(req, res) {
        var login = req.params.login;
        var command_id = req.params.command;
        users.get_user(config.url_db,login, function(user) {
            commands.end_command(config.url_db,user, command_id, function(command) {
                 if (command) {
                    res.status(200).send(command);
                } else {
                    res.status(404).send('Error happend');
                }
            })
        });
    });

    //NO ROUTE FOUND

    app.use('*', function(req, res, next) {
        res.status(404).send('No route');
    });
}

io.on('connection', function(socket){
  socket.emit('connected');
  logger.info("A user just connected");
  var listUser = users.get_users(config.url_db,function(data){
    if(data){
      socket.emit('listeUser',data);
    }else{
      socket.emit('error', 'ZUT');
    }
  });
  socket.on('userId', function(data){
    tableConnexions[data] = socket;
  });
});
