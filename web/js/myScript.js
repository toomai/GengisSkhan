$(document).ready(function() {

    var nickname, timeOut, typing;
    var socket = io();
    var userLists = {};


    //io.connect('http://localhost:3000');
    io.connect('https://gengisskhan.herokuapp.com/');
    $("#tableCourses").dataTable({

      "columns": [
              null,
              null,
              {"bSortable": false},
              {"bSortable": false},
              {"bSortable": false},
              null,
              null,
              null,
              {"className": "dt-center","bSortable": false, "data": null,"defaultContent":"<img src=\"http://www.fancyicons.com/free-icons/103/office/png/256/delete_256.png\"height=\"32\" width=\"32\">" }
          ]
    });
    return;
});
