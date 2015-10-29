$( document ).ready(function() {

    $('[data-toggle="tooltip"]').tooltip();

    $.ajax({
        url: '/scrapingGruppi',
        type: 'GET',
        success: function(result) {
            //convert json string to json object
            var jsonobject = JSON.parse(result);
            listaGruppi(jsonobject);
        },
        error: function(error) {
            alert("Error: " + error);
        }
    });

    function listaGruppi(arr) {
        var out = "";
        var i;
        for(i = 0; i < arr.length; i++) {
            out += '<input type="checkbox" checked/><label>' + arr[i].id + ' - ' +arr[i].nome + '</label><br>';
        }
        document.getElementById("listaGruppi").innerHTML = out;
    }

    $.ajax({
        url: '/scrapingDocumenti',
        type: 'GET',
        success: function(result) {
            //convert json string to json object
            var jsonobject = JSON.parse(result);
            listaDocumenti(jsonobject);
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
        document.getElementById("listaDocumenti").innerHTML = out;
    }
});




