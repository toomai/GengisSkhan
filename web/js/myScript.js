$(document).ready(function() {
    $('#commande_user').hide();
    var nickname, timeOut, typing;
    var socket = io();
    var userLists = {};
    var currentUserid;
    var currentCommand;
    var line;
    var tableCourses = $("#tableCourses").DataTable({
        dom: 'Bfrtip',
        buttons: [
            'copyHtml5',
            'excelHtml5',
            'csvHtml5',
            'pdfHtml5'
        ],
        "columns": [
            null,
            null, {
                "bSortable": false
            }, {
                "bSortable": false
            }, {
                "bSortable": false
            },
            null,
            null,
            null, {
                "className": "dt-center",
                "bSortable": false,
                "data": null,
                "defaultContent": '<a class="suppress"><img  src=\"http://www.fancyicons.com/free-icons/103/office/png/256/delete_256.png\"height=\"32\" width=\"32\"></a>'
            },
            {
              "bSortable": false,
                "data": null,
                "defaultContent": "<a class=\"update btn btn-primary \" data-toggle=\"modal\" data-target=\"#modal-modify\">Modifier</a>"
            }
        ]
    });

  /*  $('#tableCourses').on('click', 'tr', function() {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            tableCourses.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
        return false;
    });*/

    //io.connect('http://localhost:3000');
    io.connect('https://gengiskhan.herokuapp.com:3000');
    socket.on("connected", function() {
        console.log('socket connected');
    });

    socket.on('listeUser', function(data) {
        var optionInputEntry = '<option value = \"';
        var optionInputOut = '</option>';
        for (key in data) {
            $('#choice_user').append(optionInputEntry + data[key].user_id + '\">' + data[key].name + optionInputOut);
        }
    });
    socket.on('commandAlreadyPayed', function(data) {
        afficherNotif('La commande a déjà été payée', 'error');
    });
    socket.on('currentCommand', function(data) {
        $('#connexion').hide();
        $('#commande_user').show();
        $('#titreCommandeDate').html("Commande du " + data.date);
        $('#titreCommandeUser').html("Utilisateur : " + currentUserid);
        $('#totalCom').html('Total : ' + data.price + " $");
        var lines = data.lines;
        currentCommand = data;
        var inputQtyStart = '<input type="number" class="modifQty" value="';
        var inputQtyEnd = '"/>'

        tableCourses.clear();
        for (var prod in lines) {
            var line = lines[prod];
            tableCourses.row.add([line.line_id + 1, line.name, '<img src="https://gengiskhan.herokuapp.com/images/' + line.image + '" alt="img" height="42" width="42" >',
                line.product_id, line.description, line.price , line.quantity ,
                (line.quantity * line.price), null
            ]).draw(false);
        }
    });
    socket.on('error', function(data) {
        console.log('An error occured');
    });
    $('#confirmUser').on('click', function() {
        currentUserid = $('#choice_user').find(":selected").val();
        socket.emit('userId', currentUserid);
    });

    $('#tableCourses').on('click', 'div.priceLine',function(e){
      $('#basic_dial').modal('show');
    });
    $('#tableCourses').on('click', 'a.suppress', function(e) {
        //var data = tableCourses.row('.selected');
        var data = $(this).closest('tr');
        var da = Array();
        var i = 0;
        data.children('td').each(function() {
            da[i] = $(this).text();
            i++;
        });
        var commandToSuppr = {
            usr: currentUserid,
            commande: currentCommand,
            lineToSuppress: (da[0] - 1)
        };

        socket.emit('suppressLine', commandToSuppr);
    });

    $('#tableCourses').on('click', 'a.update', function(e) {
        var data = $(this).closest('tr');
        var da = Array();
        var i = 0;
        data.children('td').each(function() {
          if($(this).children('input').attr('class') === 'modifQty'){
            da[i]=$(this).children('input').val();
          }
            da[i] = $(this).text();
            i++;
        });
        product = {
            'product_id': da[3],
            'name': da[1],
            'description': da[4],
            'price': da[5],
            'quantity': da[6],
        };
        line = da[0]-1;
        jsonToForm($('#formupdate'), product);
    });
    function jsonToForm(src, o) {
        clear(src);
        src.find('input').each(function() {
            $(this).val(o[$(this).attr('name')]);
        });
    }
    $('#modify-button').click(function() {
        product = formToJson($('#formupdate'));
        product.usr = currentUserid;
        product.line = line;
        modifierProduits(product);
    });

    function modifierProduits(product) {
      socket.emit('modify', product);
    }

    $('#payement').on('click', function() {
        var pay = {
            usr: currentUserid,
            commande: currentCommand
        };
        socket.emit('payement', pay);
    });

    socket.on('paymentAccepted', function(data) {
        afficherNotif('Payement Accepté, à la prochaine !', 'success');
        closeCommande();
    });
    socket.on('payementRefused', function(data) {
        afficherNotif('Payement refusé', 'error');
    });

    function closeCommande() {
        $('#commande_user').hide();
        $('#connexion').show();
        socket.emit('disconnect', currentUserid);
        socket = undefined;
        currentUserid = undefined;
        currentCommand = undefined;
    }

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

    function clear(src) {
        src.find('input').each(function() {
            $(this).val("");
        });
    }

    function formToJson(src) {
        var o = {};
        src.find('input').each(function() {
            o[$(this).attr('name')] = $(this).val();
        });
        return o;
    }

    return;
});
