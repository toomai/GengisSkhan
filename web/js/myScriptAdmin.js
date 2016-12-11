$(function() {

    var tableProducts = $("#tableProducts").DataTable({
        dom: 'Bfrtip',
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
            null
        ]
    });


    $.ajax({
        type: 'GET',
        url: 'https://gengiskhan.herokuapp.com/admin/products',
        success: function(reponse) {
            var ob = reponse;
            for (var k in ob) {
                var line = ob[k];
                tableProducts.row.add([line.product_id, line.name, line.price, line.description, '<img src="https://gengiskhan.herokuapp.com/images/' + line.image + '" alt="img" height="42" width="42" >']).draw(false);
            }
        }
    });

    $('#tableProducts').on('click', 'a.modify', function(e) {
        var data = $(this).closest('tr');
        var da = Array();
        var i = 0;
        data.children('td').each(function() {
            da[i] = $(this).text();
            i++;
        });
        var product = {};
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


});