$( document ).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();

    $("#readerMode").hide();

    $("#autenticati").click(function(){
        var nomecognome = $("#nomecognome").val();
        var email = $("#email").val();
        if(nomecognome!=="" & email!==""){
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

var xmlhttp = new XMLHttpRequest();
var url = "file:///C:/Users/Alice/PycharmProjects/TechWeb/static/listaDocumenti.txt";
xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
        if(xmlhttp.status === 200 || xmlhttp.status == 0){
            var myArr = JSON.parse(xmlhttp.responseText);
            myFunction(myArr);
        }
    }
}
xmlhttp.open("GET", url, true);
xmlhttp.send();

function myFunction(arr) {
    var out = "";
    var i;
    for(i = 0; i < arr.length; i++) {
        out += '<a href="' + arr[i].url + '">' +
        arr[i].title + '</a><br>';
    }
    document.getElementById("documenti").innerHTML = out;
}

