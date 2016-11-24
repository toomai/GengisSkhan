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

    app.use(express.static(path.join(__dirname, 'web')));

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

    app.get('/login/:login', function(req, res) {
        var login = req.params.login;
        logger.info('login : '+login);
        var user = users.get_user(config.url_db,login, function(data) {
            if (data) {
                res.status(200).send(data);
                //res.sendFile('/index.html');
                //res.status(200).sendFile(path.join(__dirname, '/..', '/web', '/index.html'));
            } else {
                res.status(404).send('Error happend');
            }
        });
    });

    io.on('connection', function(socket) {
        logger.info("A user just connected");
    });

    //CONNEXION


    app.post('/connect/mobile', function(req, res) {
        var login = req.body.login;
        logger.info(login);
        users.get_user(config.url_db,login, function(user) {
            if (user) {
                logger.info(user);
                res.status(200).send(user);
            } else {
                res.status(404).send('Error happend');
            }
        });
    });

    //USER WILL A NEW COMMAND


    app.get('/command/new/:login', function(req, res) {
        var login = req.body.login;
        users.get_user(config.url_db,login, function(user) {
            if (user) {
                commands.new_command(user, function(command) {
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
                        commands.add_line(config.url_db,user, command_id, product, quantity, function(command) {
                            if (command) {
                                commands.get_command(config.url_db,user, command_id, function(data) {
                                    if (data) {
                                        res.status(200).send(command);
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
        var login = req.body.login;
        var command_id = req.body.command;

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

    //USER WILL END HIS COMMAND


    app.get('/command/end/:login/:command', function(req, res) {
        var login = req.body.login;
        var command_id = req.body.command;
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
