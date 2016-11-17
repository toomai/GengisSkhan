var userJson = require('../json/users.json');

var connexion = function (login, callback){
    for(var key in userJson){
      if(userJson[key].user_id === login){
        callback(null, userJson[key]);
      }
    }
}

var get_user = function (login,callback){

}

exports.connexion = connexion;
exports.get_user = get_user;
