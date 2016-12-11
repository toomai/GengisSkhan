var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var logger = require("./logger.js");
var config = require("./config.js");
var commands = require("./command.js");
var products = require("./product.js");
var users = require("./users.js");
var command = require("./command.js");

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var tableConnexions = {};

var fs = require('fs');

var start = function(callback) {

    _configureServer(app);
    _configureRoutes(app);

    server.listen(process.env.PORT || config.port, callback);
}


var stop = function(callback) {
    callback(null);
}

exports.start = start;
exports.stop = stop;

function _connect(url, callback) {
    MongoClient.connect(url, function(err, db) {
        if (err)
            logger.info(err);
        logger.info("Connected successfully to Database");
        callback(db);
    });
}

function _closeDb(db) {
    db.close();
    logger.info("Disconnected successfully from server");
}

function _configureServer(app) {

    app.use('/webapp', express.static(path.join(__dirname, '/..', '/web')));

    app.use('/images', express.static('json/Images'));

    app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(function(req, res, next) {
        logger.info('Request URL:' + req.originalUrl);
        next();
    });

    app.get('/', function(req, res) {
        var fichier = fs.readFileSync("./web/index.html","UTF8");
        res.status(200).send(fichier);
    });

    app.get('/admin', function(req, res) {
        var fichier = fs.readFileSync("./web/admin.html","UTF8");
        res.status(200).send(fichier);
    });

}

function _configureRoutes(app) {

    _connect(config.url_db, function(db) {


        app.get('/admin/products', function(req, res) {
            products.list_all_product(db,function(prods) {
                if (prods) {
                    res.status(200).send(prods);
                } else {
                    res.status(404).send('Error happend');
                }
            });
        });

        //CONNEXION


        app.post('/connect/mobile', function(req, res) {
            var login = req.body.login;
            users.get_user(db, login, function(user) {
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
            commands.new_command(db, login, function(command) {
                if (command) {
                    res.status(200).send(command);
                } else {
                    res.status(404).send('Error happend');
                }
            });

        });

        //USER WILL ADD A NEW PRODUCT


        app.post('/command/add', function(req, res) {
            var login = req.body.login;
            var command_id = req.body.command;
            var product = req.body.product;
            var quantity = req.body.quantity;
            commands.add_line(db, login, command_id, product, quantity, function(command) {
                if (command) {
                    commands.get_command(db, login, command_id, function(data) {
                        if (data) {
                            res.status(200).send(command);
                            actualiseSocket(login, command);
                        } else {
                            res.status(404).send('Error happend');
                        }
                    });
                }
            });
        });



        //USER WILL PAY HIS COMMAND


        app.get('/command/pay/:login/:command', function(req, res) {
            var login = req.params.login;
            var command_id = req.params.command;

            commands.pay_command(db, login, command_id, function(command) {
                if (command) {
                    res.status(200).send(command);
                } else {
                    res.status(404).send('Error happend');
                }
            });
        });


        app.get('/command/last/:login', function(req, res) {
            var login = req.params.login;

            commands.get_last_command(db, login, function(command) {
                if (command) {
                    res.status(200).send(command);
                } else {
                    res.status(404).send('Error happend');
                }
            });
        });

        app.post('/command/remove', function(req, res) {
            var login = req.body.login;
            var command_id = req.body.command;
            var line_id = req.body.line;

            users.get_user(db, login, function(user) {
                commands.remove_line(db, user, command_id, line_id, function(command) {
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

            users.get_user(db, login, function(user) {
                commands.change_quantity(db, user, command_id, line_id, quantity, function(command) {
                    if (command) {
                        res.status(200).send(command);
                        actualiseSocket(login, command);
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

            users.get_user(db, login, function(user) {
                commands.change_price(db, user, command_id, line_id, price, function(command) {
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

    });



}



var actualiseSocket = function(idUser, commande){
  console.log(tableConnexions[idUser]);
  if(tableConnexions[idUser]){
    tableConnexions[idUser].emit('currentCommand', commande);
  }else{
  }
}

io.on('connection', function(socket) {

    socket.emit('connected');
    logger.info("A user just connected");
    
    _connect(config.url_db, function(db) {
    users.get_users_with_commands(db, function(data) {
        if (data) {
            socket.emit('listeUser', data);
        } else {
            socket.emit('error', 'ZUT');
        }
    });
    
    socket.on('suppressLine', function(data){
      users.get_user(db, data.usr, function(userA){
        commands.remove_line(db, userA, data.commande.command_id, data.lineToSuppress,function(commandMod){
          actualiseSocket(data.usr, commandMod)
        });
      });
    });
        socket.on('payement', function (data) {
            users.get_user(db, data.usr, function(userToPay) {
                commands.pay_command(db, userToPay, data.commande.command_id, function(comm) {
                    if (comm) {
                        tableConnexions[data.usr].emit('paymentAccepted', null);
                    } else {
                        tableConnexions[data.usr].emit('payementRefused', null);
                    }
                });
            });
        });

        socket.on('userId', function(data) {
            tableConnexions[data] = socket;
            commands.get_last_command(db, data, function(currentCommand) {
                if (currentCommand) {
                    if (currentCommand.payed === false) {
                        tableConnexions[data].emit('currentCommand', currentCommand);
                    } else {
                        tableConnexions[data].emit('commandAlreadyPayed', null);
                    }
                } else {
                    tableConnexions[data].emit('error', 'ZUT');
                }
            });
        });

        socket.on('disconnect',function(data){
          logger.info('A user disconnected');
          tableConnexions[data] = undefined;
        });
    });
});
