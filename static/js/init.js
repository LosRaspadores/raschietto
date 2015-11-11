$( document ).ready(function() {

    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("active");
    });

    $('[data-toggle="tooltip"]').tooltip();
    var stickyNavTop = $('#secondnav').offset().top;

    var stickyNav = function(){
        var scrollTop = $(window).scrollTop();
        if (scrollTop > stickyNavTop) {
            $('#secondnav').addClass('sticky');
        } else {
            $('#secondnav').removeClass('sticky');
        }
    };

    stickyNav();

    $(window).scroll(function() {
        stickyNav();
    });

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
        document.getElementById("listaDocumenti").innerHTML = out;
    };


    /* ottenere data e ora nel formato specificato YYYY-MM-DDTHH:mm */
    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    };

    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-"
                    + (currentdate.getMonth())  + "-"
                    + currentdate.getDay() + "T"
                    + currentdate.getHours() + ":"
                    + addZero(currentdate.getMinutes());

});





