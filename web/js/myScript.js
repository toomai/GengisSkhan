$(document).ready(function() {

    var nickname, timeOut, typing;
    var socket = io();
    var userLists = {};

    //io.connect('http://localhost:3000');
    io.connect('https://gengisskhan.herokuapp.com/');
    $("#tableCourses").DataTable({
    
      "aoColumns": [
              null,
              null,
              {"bSortable": false},
              {"bSortable": false},
              {"bSortable": false},
              null,
              null,
              null,
              {"bSortable": false}
          ]
    });
    return;
});
