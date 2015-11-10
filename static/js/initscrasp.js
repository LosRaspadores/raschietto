$( document ).ready(function() {

    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("active");
    });

    $('[data-toggle="tooltip"]').tooltip();

    $.ajax({
        url: '/scrapingGruppi',
        type: 'GET',
        success: function(result) {
            //convert json string to json object
            lista_gruppi = JSON.parse(result);
            listaGruppi(lista_gruppi);
        },
        error: function(error) {
            alert("Error: " + error);
        }
    });

    function listaGruppi(arr) {
        var out = "";
        var i;
        for(i = 0; i < arr.length; i++) {
            out += '<input type="checkbox"/><label>' + arr[i].id + ' - ' +arr[i].nome + '</label><br>';
        }
        $('div#lista_gruppi.panel-body').html(out);
    }

    $.ajax({
        url: '/scrapingDocumenti',
        type: 'GET',
        success: function(result) {
            //convert json string to json object
            lista_doc = JSON.parse(result);
            listaDocumenti(lista_doc);
        },
        error: function(error) {
            alert("Error: " + error);
        }
    });

    function listaDocumenti(arr) {
        var out = "";
        var i;
        for(i = 0; i < arr.length; i++) {
            out += '<a href="' + arr[i].url + '">' +arr[i].title + '</a><br>';
        }
       $('div#lista_doc.panel-body').html(out);
    }
});





