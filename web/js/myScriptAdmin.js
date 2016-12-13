$(function() {

    ////////////////////////////////////////////////////////// INITIALISATION

    var tableProducts = $("#tableProducts").DataTable({
        responsive: true,
        "language": {
            "lengthMenu": "Afficher _MENU_ ",
            "zeroRecords": "Pas de produits !",
            "info": "Afficher les pages _PAGE_ à _PAGES_",
            "infoEmpty": "Vide",
            "search": "Recherche ",
            "infoFiltered": "(filtered from _MAX_ total records)",
        },
        dom: 'Bfrtip',
        fixedColumns: true,
        buttons: [
            'copyHtml5',
            'excelHtml5',
            'csvHtml5',
            'pdfHtml5'
        ],
        "columns": [
            null,
            null,
            null,
            null,
            null,
        {
            "data": null,
            "defaultContent": "<a class=\"remove btn btn-danger\">Supprimer</a> "
        },, {
            "data": null,
            "defaultContent": "<a class=\"update btn btn-primary \">Modifier</a>"
        }        ]
    });


    ////////////////////////////////////////////////////////// EVENT

    $('#tableProducts').on('click', 'a.remove', function(e) {
        var data = $(this).closest('tr');
        var da = Array();
        var i = 0;
        data.children('td').each(function() {
            da[i] = $(this).text();
            i++;
        });
        var product = {
            'product_id' : da[0]
        };
        suprimerProduits(product);
    });


    $('#tableProducts').on('click', 'a.update', function(e) {
        var data = $(this).closest('tr');
        var da = Array();
        var i = 0;
        data.children('td').each(function() {
            da[i] = $(this).text();
            i++;
        });
        var product = {
            'product_id' : da[0],
            'name' : da[1],
            'description' : da[3],
            'price' : da[2]
        };
        modifierProduits(product);
    });

    /////////////////////////////////////////////////////////////////////////////////// CALL

    afficherNotif('Bienvenue dans le mode de gestion !','success');
    chargerProduits();
    


    /////////////////////////////////////////////////////////////////////////////////// FUNCTION

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

    function chargerProduits(){
        $.ajax({
                type: 'GET',
                url: 'https://gengiskhan.herokuapp.com/admin/products',
                success: function(reponse) {
                    var ob = reponse;
                    tableProducts.clear().draw();
                    for (var k in ob) {
                        var line = ob[k];
                        tableProducts.row.add([line.product_id, line.name, line.price, line.description, '<img src="https://gengiskhan.herokuapp.com/images/' + line.image + '" alt="img" height="42" width="42" >',null,null]).draw(false);
                    }
                    afficherNotif('Voici les produits !','success');
                }
            });
    }


    function ajouterProduits(product){
         $.ajax({
                type: 'GET',
                url: 'https://gengiskhan.herokuapp.com/admin/add',
                data : {'product': product},
                success: function(reponse) {
                    afficherNotif('Votre produit est ajouté !','success');
                    chargerProduits();
                }
        });
    }

    function suprimerProduits(product){
        $.ajax({
                type: 'GET',
                url: 'https://gengiskhan.herokuapp.com/admin/add',
                data : {'product': product},
                success: function(reponse) {
                    afficherNotif('Votre produit a été supprimé !','success');
                    chargerProduits();
                }
        });
    }

    function modifierProduits(product){
        $.ajax({
                type: 'GET',
                url: 'https://gengiskhan.herokuapp.com/admin/add',
                data : {'product': product},
                success: function(reponse) {
                    afficherNotif('Votre produit est modifié !','success');
                    chargerProduits();
                }
        });
    }

});