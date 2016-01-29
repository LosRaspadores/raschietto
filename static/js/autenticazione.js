$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();

    /*
        Verifica della presenza di un utente gi� autenticato come annotator.
        I dati dell'utente vengono salvati nella sessionStorage.
        I dati in sessionStorage vengono ripuliti ogniqualvolta la sessione della pagine termina.
        La sessione della pagina dura fino a quando il browser � aperto e sopravvive alla ricarica della pagina e al
        ripristino. L'apertuta di una nuova un un nuovo tab o nuova finestra implica l'apertura di una nuova sessione,
        il che differisce da come funzionano i cookie di sessione.
    */
    if(sessionStorage.length == 0){
        $('#modalitaToggle').prop('checked', false);
        readerMode();
    } else {
        $('#modalitaToggle').prop('checked', true);
        annotatorMode();
        $('#utenteAutenticato').text(sessionStorage.nomecognome + " - " + sessionStorage.email);
    }

    /* Passaggio da modalità reader a modalità annotator e viceversa */
    /* quando cambia il valore della checkbox #modalitaToggle */
    $('#modalitaToggle').change(function() {
        if ($("#modalitaToggle").prop('checked')) {
            $('#modalAutenticazione').modal({backdrop: 'static', keyboard: false});  // before modal show line!
            $('#modalAutenticazione').modal('show');
            annotatorMode();
        }else{
            $('#modalitaToggle').prop('checked', false);
            readerMode();
            sessionStorage.removeItem("nomecognome");
            sessionStorage.removeItem("email");
        }
    });

    function readerMode(){
        $('[data-toggle="tooltip"]').tooltip('destroy');
        $("#modalitaToggleLabel").attr('title','Passa a modalità annotator');
        $('[data-toggle="tooltip"]').tooltip();
        $('#utenteAutenticato').text("");
        $('#bottoniAnnotator').hide();
    }

    function annotatorMode(){
        $('[data-toggle="tooltip"]').tooltip('destroy');
        $("#modalitaToggleLabel").attr('title','Passa a modalità reader');
        $('[data-toggle="tooltip"]').tooltip();
        $('#bottoniAnnotator').show();
    }

    /* Validazione autenticazione utente */
    $("#autenticati").click(function(){
        var regexNomecognome = /^([a-zA-Z]+\s)*[a-zA-Z]+$/i;
        var regexEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|it|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
        var nomecognome = $("#nomecognome").val();
        var email = $("#email").val();
        if(nomecognome==""){
            $('#messaggioErrore').text("Il campo nome e cognome è obbligatorio.");
            $("#nomecognome").val("");
            $("#nomecognome").focus();
        } else if(email==""){
            $('#messaggioErrore').text("Il campo email è obbligatorio.");
            $("#email").val("");
            $("#email").focus();
        } else if(!regexNomecognome.test(nomecognome)){
            $('#messaggioErrore').text("Il campo nome e cognome può contenere solo caratteri alfabetici.");
            $("#nomecognome").val("");
            $("#nomecognome").focus();
        } else if(!regexEmail.test(email)){
            $('#messaggioErrore').text("Il campo email deve essere del tipo user@dominio.it.");
            $("#email").val("");
            $("#email").focus();
        } else {
            $('#messaggioErrore').text("");
            $('#modalAutenticazione').modal('hide');
            $("#nomecognome").val("");
            $("#email").val("");
            //I dati dell'utente vengono salvati nella sessionStorage
            sessionStorage.nomecognome = nomecognome;
            sessionStorage.email = email;
            $('#utenteAutenticato').text(sessionStorage.nomecognome + " - " + sessionStorage.email);
            annotatorMode();
        };
    });

    /* Gestione della chiusura del modal autenticazione: si ritorna alla modalità reader */
    $('#modalAutenticazione button.close').click(function (){
        $("#nomecognome").val("");
        $("#email").val("");
        $('#messaggioErrore').text("");
        $('#modalitaToggle').prop('checked', false);
        readerMode();
    });

    /*
        prop() // attr()
        con le checkboxes uso prop(), attr() potrebbe dare risultati indesiderati
    */
});