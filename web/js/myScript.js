$(function() {

    var nickname, timeOut, typing;
    var socket = io();
    var userLists = {};


    $('#connect').click(function() {
        log();
    });

     $('#log').submit(function() {
        log();
    });

    $('form').submit(function() {
        socket.emit('chat message', $('#message').val());
        $('#message').val('');
        return false;
    });

    socket.on('chat message', function(msg) {
        if(msg){
            var o = JSON.parse(msg);
            if(o.message != ""){
                var element = '<div class="form-group"> '+
                '<span class="label label-default">'+o.user+'</span> '+
                '<li><div class="msg"><p class="ms">'+o.message+'</p></div></li></div>';    
                $('#messages').append(element);
            }
        }
    });

    socket.on('broad', function(msg) {
        afficherNotif(msg, 'success');
    });

    socket.on('typing', function(msg) {
        $('#message').attr('placeholder', msg);
    });

    socket.on('list', function(msg) {
        userLists = JSON.parse(msg);
        $('#users').empty();
        for (var key in userLists) {
            if (userLists[key] != "null") {
                var element = '<li><span class="label label-success">'+key+'</span></li>';
                $('#users').append(element);
            } else {
                var element = '<li><span class="label label-danger">'+key+'</span></li>';
              $('#users').append(element);
            }
        }
    });

    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    function log(){
        nickname = $('#nickname').val();
        if(nickname){
            socket.emit('nickname', nickname);
            $('#loginPage').css('display', 'none');
            $('#chatPage').css('display', 'block');
        }else{
            afficherNotif('Please enter your Nickname !', 'error');
        }
       
    }

    function timeoutFunction() {
        typing = false;
        socket.emit("typing", false);
    }

    $('#message').keyup(function() {
        typing = true;
        socket.emit('typing', ' is typing ...');
        clearTimeout(timeOut);
        timeOut = setTimeout(timeoutFunction, 2000);
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