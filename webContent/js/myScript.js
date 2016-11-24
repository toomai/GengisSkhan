$(document).ready(function() {

    var socket = io();

    io.connect('http://localhost:3000');

    /*String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }*/
var dataTest= [
  ['1', "Courgette", "123456","1000", "1000.5", "Fruit de forme allongée", "Coucou", "1000005" ],
  ['2', "Carotte", "7891011","10560", "1646500.5", "Fruit de forme allongée", "Coucou", "106400005" ]
];
    $('#tableCourses').DataTable({
      data:dataTest,
      columns: [
            { title: "Numéro" },
            { title: "Produit" },
            { title: "Id" },
            {title:"Quantité"},
            { title: "Prix unitaire" },
            { title: "Description" },
            { title: "Image" },
            { title: "Total ligne" }
        ]
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
