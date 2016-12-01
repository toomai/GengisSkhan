$(document).ready(function() {
    $('#commande_user').hide();
    var nickname, timeOut, typing;
    var socket = io();
    var userLists = {};
    var currentUserid;
    var currentCommand;

    var tableCourses = $("#tableCourses").DataTable({
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

    $('#tableCourses').on('click', 'tr', function(){
      if($(this).hasClass('selected')){
        $(this).removeClass('selected');
      }else{
        tableCourses.$('tr.selected').removeClass('selected');
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
      $('#titreCommandeDate').append(data.date);
      $('#titreCommandeUser').append(currentUserid);
      var lines = data.lines;
      currentCommand = data;
      tableCourses.clear();
      for(var prod in lines){
        var line = lines[prod];
        tableCourses.row.add([line.line_id+1, line.name, line.image,
           line.product_id, line.description, line.price, line.quantity,
            (line.quantity * line.price), null]).draw(false);
      }
    });
    socket.on('error', function(data){
      console.log('An error occured');
    });
    $('#confirmUser').on('click', function(){
      currentUserid = $('#choice_user').find(":selected").val();
      socket.emit('userId', currentUserid);
    });

    $('#payement').on('click', function(){
      var pay = {
          usr : currentUserid,
          commande : currentCommand
      };
      socket.emit('payement', pay);
    });

    socket.on('paymentAccepted',function(data){

    });
    socket.on('payementRefused',function(data){
      afficherNotif('Payement refusé', 'error')
    });

    function afficherNotif(message, code) {
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        toastr[code](message);
    }
    return;
});
