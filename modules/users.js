var userJson = require('../json/users.json');

var get_user= function (login, callback){
    callback(null,userJson[login]);
}


exports.get_user = get_user;
