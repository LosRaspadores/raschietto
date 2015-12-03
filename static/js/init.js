$( document ).ready(function() {

    var gruppi
    $("#panelAnnot").hide();

    // seconda nav fissa dopo lo scrolling della pagina
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
            out += '<a class="list-group-item" value="' + arr[i].id + '" onclick="mostraAnnotGruppo(this)">' +arr[i].nome + ' <span class="badge">0</span></a><br>';
        }
        $('div#lista_gruppi').html(out);
        $('#numGru').html(arr.length);
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
            out += '<a class="list-group-item" value="' + arr[i].url + '" onclick="mostraDocumento(this)">' +arr[i].title + '</a><br>';
        }
       $('div#lista_doc').html(out);
       $('#numDoc').html(arr.length);
    }

    $(function() { //replace(/(/)/g, '');
        addTab = function(text, url){
            var url = url.replace(/([/|_.|_:|_-])/g, '');
            $("ul.nav.nav-tabs").append("<li><a data-toggle='tab' href='#"+url+"'>Doc<button class='close closeTab' type='button' onclick='closeTab(this)'>x</button></a></li>");
            $("div.tab-content").append("<div class='tab-pane fade' id='"+url+"'><div id='"+url+"t'></div></div>");
            $("#"+url+"t").html(text);
        }
    });

    $('#nuovoDoc').click(function(){
        if($('#uriNuovoDoc').val()===""){
            alert("L'uri inserito non è valido.");
        } else {
            mostraDocumento('#uriNuovoDoc');
        };
        $('#uriNuovoDoc').text("");
    });

});

function mostraDocumento(element){ // NOTA: element è un selettore
    $("#panelAnnot").show();
    if($(element).val() === ""){
        urlDoc = $(element).attr('value'); //doc dalla lista
    } else {
        urlDoc = $(element).val(); //doc dal 'inserisci uri'
    }

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

    var grafi = ["http://vitali.web.cs.unibo.it/raschietto/graph/ltw1508", "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1510",
                 "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1511", "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1512",
                 "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1513", "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1514",
                 "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1516", "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1517",
                 "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1519", "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1520",
                 "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1521", "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1525",
                 "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1529", "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1531",
                 "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1532", "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1535",
                 "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1536", "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537",
                 "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1538", "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1539",
                 "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1540", "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1542",
                 "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1543", "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1544",
                 "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1545", "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1547",
                 "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1549"];
    var i;
    for (i=0; i<grafi.length; i++){
        //query = query_all_annotazioni(grafi[i], urlDoc);
        //chiamata ajax
        //get_annotazioni(query, urlDoc);
    }

    query = query_all_annotazioni("", urlDoc);
    get_annotazioni(query, urlDoc);
}

function singoloDocumento(str, url){
    addTab(str, url);
}

function mostraAnnotGruppo(element){
    $(element).addClass("active").siblings().removeClass("active");
}

function closeTab(element){
    var tabContentId = $(element).parent().attr("href");
    $(element).parent().parent().remove(); //remove li of tab
    $('ul.nav.nav-tabs a:last').tab('show'); // Select first tab
    $(tabContentId).remove(); //remove respective tab content
}

