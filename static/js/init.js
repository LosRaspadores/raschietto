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
            out += '<a class="classeDoc" value="' + arr[i].url + '" onclick="mostraDocumento(this)">' +arr[i].title + '</a><br>';
        }
       $('div#lista_doc.panel-body').html(out);
    }




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


    $(function() { //replace(/(/)/g, '');
      addTab = function(text, url){
            $("ul.nav.nav-tabs").append("<li><a data-toggle='tab' href='#"+url+"'>Doc<button class='close closeTab' type='button' onclick='closeTab(this)'>x</button></a></li>");
            $("div.tab-content").append("<div class='tab-pane fade' id='"+url+"'><div id='"+url+"t'></div></div>");
            $("#"+url+"t").html(text);
       }
    });



});

function mostraDocumento(element){
    var urlDoc = $(element).attr('value')
    $.ajax({
        url: '/scrapingSingoloDocumento',
        type: 'GET',
        data: {url: urlDoc},
        success: function(result) {
            singoloDocumento(result, urlDoc);
        },
        error: function(error) {
            alert("Error: " + error);
        }
    });
}

function singoloDocumento(str, url){
    //$("#singoloDocumento").html(str);
    addTab(str, url);
}

function closeTab(element){
    var tabContentId = $(element).parent().attr("href");
    $(element).parent().parent().remove(); //remove li of tab
    $('ul.nav.nav-tabs a:last').tab('show'); // Select first tab
    $(tabContentId).remove(); //remove respective tab content
}