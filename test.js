var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var logger = require("./modules/logger.js");
var config = require("./modules/config.js");


config.load(function(data){
});
