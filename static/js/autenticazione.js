$( document ).ready(function() {

    $("#readerMode").hide();

    var ncutente = "";
    var emailutente = "";

    $("#autenticati").click(function(){
        var nomecognome = $("#nomecognome").val();
        var email = $("#email").val();
        if(nomecognome!=="" & email!==""){
            ncutente = nomecognome;
            emailutente = email;
            $("#annotatorMode").hide();
            $('#readerMode').show();
            $('#utenteAutenticato').text("Utente autenticato come "+nomecognome+" "+email);
            $('#modalAutenticazione').modal('hide');
        };
    });

    $("#readerMode").click(function(){
        $("#annotatorMode").show();
        $('#readerMode').hide();
        $('#utenteAutenticato').text("Nessun utente autenticato");
    });

});




