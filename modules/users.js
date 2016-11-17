var userJson = require('../json/users.json');

var get_user_by_login = function (login, callback){
    callback(null,userJson[login]);
}


exports.get_user_by_login = get_user_by_login;
