$(document).ready(function() {

    var nickname, timeOut, typing;
    var socket = io();
    var userLists = {};

    io.connect('http://localhost:3000');
    /*
    * Affichage initial commande  
    */
    //io.connect('https://gengisskhan.herokuapp.com/');
    $("#tableCourses").DataTable({
    });
    return;
});
