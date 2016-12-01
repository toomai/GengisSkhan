$(document).ready(function() {
    $('#commande_user').hide();
    var nickname, timeOut, typing;
    var socket = io();
    var userLists = {};
    var currentUserid;

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

    $('#tableCourses tbody').on('click', 'tr', function(){
      if($(this).hasClass('selected')){
        $(this).removeClass('selected');
      }else{
        $('#tableCourses').$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
      }
      return false;
    });

    io.connect('http://localhost:3000');
    socket.on("connected",function(){
      console.log('socket connected');
    });

    socket.on('listeUser', function(data){
      var optionInputEntry = '<option value = \"';
      var optionInputOut = '</option>';
      for(key in data){
        $('#choice_user').append(optionInputEntry + data[key].user_id + '\">' + data[key].name + optionInputOut);
      }
    });
    socket.on('commandAlreadyPayed', function(data){
      console.log('La commande a déjà été payée');
    });
    socket.on('currentCommand',function(data){
      $('#connexion').hide();
      $('#commande_user').show();
      var i = 0;
      var lines = data.lines;
      console.log(lines);
      for(var prod in lines){
        var line = lines[prod];
        $('#tableCourses').row.add(line.line_id, line.name, line.image,
           line.product_id, line.description, line.price, line.quantity, (line.quantity * line.price), null);
      }
    /*    $('#tableCourses').row.add(++i,data.lines[key].name,data.lines[key].image,
          [data[key].product_id,data[key].description,
          data[key].price,null ]).draw(false);*/
    });
    socket.on('error', function(data){
      console.log('An error occured');
    });
    $('#confirmUser').on('click', function(){
      currentUserid = $('#choice_user').find(":selected").val();
      socket.emit('userId', currentUserid);
    });

    $('#payement').on('click', function(){

    });
  //  io.connect('https://gengisskhan.herokuapp.com/');


    return;
});
