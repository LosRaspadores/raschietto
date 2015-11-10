$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();


    /*
    function setCookie(key, value) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
        document.cookie = key + '=' + value +';path=/'+ ';expires=' + expires.toUTCString();
    };

    function getCookie(key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    };

    //inizializzazione modalità
    if(getCookie('nomecognome') == null & getCookie('email') == null){
        $('#modalitaToggle').prop('checked', false);
        $("#modalitaToggleLabel").prop('title','Passa a modalità annotator');
        $('#utenteAutenticato').text("Nessun utente autenticato");
    } else {
        $('#modalitaToggle').prop('checked', true);
        $("#modalitaToggleLabel").prop('title','Passa a modalità reader');
        $('#utenteAutenticato').text("Utente autenticato come: "+getCookie('nomecognome')+", email: "+getCookie('email'));
    };

    //quando si ritorna a modalità reader
    //document.cookie = "nomecognome=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    //document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC";

    //al momento dell'autenticazione
    //setCookie('nomecognome', nomecognome);
    //setCookie("email", email);

    */

    function readerMode(){
        $('[data-toggle="tooltip"]').tooltip('destroy');
        $("#modalitaToggleLabel").prop('title','Passa a modalità annotator');
        $('[data-toggle="tooltip"]').tooltip();
        $('#utenteAutenticato').text("Nessun utente autenticato.");
    };

    function annotatorMode(){
        $('[data-toggle="tooltip"]').tooltip('destroy');
        $("#modalitaToggleLabel").prop('title','Passa a modalità reader');
        $('[data-toggle="tooltip"]').tooltip();
    };

    /* Passaggio da modalità reader a modalità annotator e viceversa */
    $('#modalitaToggle').change(function() {
        if ($("#modalitaToggle").prop('checked')) {
            $('#modalAutenticazione').modal({backdrop: 'static', keyboard: false});  // before modal show line!
            $('#modalAutenticazione').modal('show');
            annotatorMode();
        }else{
            readerMode();
            sessionStorage.removeItem("nomecognome");
            sessionStorage.removeItem("email");
        };
    });

    /*
        Verifica della presenza di un utente già autenticato come annotator.
        I dati dell'utente vengono salvati nella sessionStorage.
        I dati in sessionStorage vengono ripuliti ogniqualvolta la sessione della pagine termina.
        La sessione della pagina dura fino a quando il browser è aperto e sopravvive alla ricarica della pagina e al
        ripristino. L'apertuta di una nuova un un nuovo tab o nuova finestra implica l'apertura di una nuova sessione,
        il che differisce da come funzionano i cookie di sessione.
    */
    if(sessionStorage.length == 0){
        $('#modalitaToggle').prop('checked', false);
        readerMode();
    } else {
        $('#modalitaToggle').prop('checked', true);
        annotatorMode();
        $('#utenteAutenticato').text("Utente autenticato: "+sessionStorage.nomecognome+", email: "+sessionStorage.email);
    };

    /* Validazione autenticazione utente */
    $("#autenticati").click(function(){
        var regexNomecognome = /^([a-zA-Z]+\s)*[a-zA-Z]+$/i;
        var regexEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|it|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
        var nomecognome = $("#nomecognome").val();
        var email = $("#email").val();
        if(nomecognome==""){
            alert("Il campo nome e cognome è obbligatorio.");
            $("#nomecognome").val("");
            $("#nomecognome").focus();
        } else if(email==""){
            alert("Il campo email è obbligatorio.");
            $("#email").val("");
            $("#email").focus();
        } else if(!regexNomecognome.test(nomecognome)){
            alert("Il campo nome e cognome può contenere solo caratteri alfabetici.");
            $("#nomecognome").val("");
            $("#nomecognome").focus();
        } else if(!regexEmail.test(email)){
            alert("Il campo email deve essere del tipo user@domin.io");
            $("#email").val("");
            $("#email").focus();
        } else {
            $('#modalAutenticazione').modal('hide');
            $("#nomecognome").val("");
            $("#email").val("");
            //I dati dell'utente vengono salvati nella sessionStorage
            sessionStorage.nomecognome=nomecognome;
            sessionStorage.email=email;
            $('#utenteAutenticato').text("Utente autenticato: "+sessionStorage.nomecognome+", email: "+sessionStorage.email);
            annotatorMode();
        };
    });

    /* Gestione della chiusura del modal autenticazione: si ritorna alla modalità reader */
    $('.close').click(function (){
        $('#modalitaToggle').prop('checked', false);
        readerMode();
    });
});