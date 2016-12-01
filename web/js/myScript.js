$(document).ready(function() {
    $('#commande_user').hide();
    var nickname, timeOut, typing;
    var socket = io();
    var userLists = {};


    io.connect('http://localhost:3000');
    socket.on("connected",function(){
      console.log("caca");
    });

    socket.on('listeUser', function(data){
      var optionInputEntry = '<option value = \"';
      var optionInputOut = '</option>';
      for(key in data){
        $('#choice_user').append(optionInputEntry + data[key].user_id + '\">' + data[key].name + optionInputOut);
      }
    });

    $('#confirmUser').on('click', function(){
      socket.emit('userId', $('#choice_user').find(":selected").val());
    });
  //  io.connect('https://gengisskhan.herokuapp.com/');
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
