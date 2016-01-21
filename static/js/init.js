$( document ).ready(function() {

    $('[data-tooltip="tooltip"]').tooltip();
    $('[data-toggle="tooltip"]').tooltip();

    $("#uriNuovoDoc").val("");
    $('#bottoniAnnotator').hide();
    filtriAttivi();

    $('#insertAutore').css('display', 'none');
    $('#insertAnnoPub').css('display', 'none');
    $('#insertTitolo').css('display', 'none');
    $('#insertURL').css('display', 'none');
    $('#insertDOI').css('display', 'none');
    $('#insertComm').css('display', 'none');
    $('#insertfunzRet').css('display', 'none');
    $('#salvaInsert').attr('disabled', 'disabled');

    var year = new Date().getFullYear();
    for(i = year; i >=  1800; i--){
        $('select#anno').append('<option value="'+i+'">'+i+'</option>');
    }
     
    // seconda nav fissa dopo lo scrolling della pagina
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
            //out += '<input type="checkbox"/><label>' + arr[i].id + ' - ' +arr[i].nome + '</label><br>';
            out += '<a class="list-group-item" value="' + arr[i].id + '" onclick="mostraAnnotGruppo(this)">' +arr[i].nome + '</a><br>';
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
            //out += '<a class="list-group-item" value="' + arr[i].url + '" onclick="mostraDocumento(this)">' +arr[i].title + '</a><br>';
            $('div#lista_doc').append('<a class="list-group-item" value="' + arr[i].url + '">' +arr[i].title + '</a><br>');
        }
       //$('div#lista_doc').html(out);
       $('#numDoc').html(arr.length);
    }



    $('#modalAnnotCit').draggable({
        handle: ".modal-content"
    });

    $('#modalAnnotDoc').on('hide.bs.modal', function(e){
        $('#selectTipoAnnot').val('');
        $('#insertAutore').css('display', 'none');
        $('#insertAnnoPub').css('display', 'none');
        $('#insertTitolo').css('display', 'none');
        $('#insertURL').css('display', 'none');
        $('#insertDOI').css('display', 'none');
        $('#insertComm').css('display', 'none');
        $('#insertfunzRet').css('display', 'none');
    });


    $('#selectTipoAnnot').change(function(){
        var annot = $(this).val();
        switch (annot) {
            case "autore":
                $('#insertAutore').css('display', 'block');
                $('#insertAnnoPub').css('display', 'none');
                $('#insertTitolo').css('display', 'none');
                $('#insertURL').css('display', 'none');
                $('#insertDOI').css('display', 'none');
                $('#insertComm').css('display', 'none');
                $('#insertfunzRet').css('display', 'none');
                $('#salvaInsert').removeAttr('disabled', 'disabled');
                break;
            case "anno":
                $('#insertAutore').css('display', 'none');
                $('#insertAnnoPub').css('display', 'block');
                $('#insertTitolo').css('display', 'none');
                $('#insertURL').css('display', 'none');
                $('#insertDOI').css('display', 'none');
                $('#insertComm').css('display', 'none');
                $('#insertfunzRet').css('display', 'none');
                $('#salvaInsert').removeAttr('disabled', 'disabled');
                break;
            case "titolo":
                $('#insertAutore').css('display', 'none');
                $('#insertAnnoPub').css('display', 'none');
                $('#insertTitolo').css('display', 'block');
                $('#insertURL').css('display', 'none');
                $('#insertDOI').css('display', 'none');
                $('#insertComm').css('display', 'none');
                $('#insertfunzRet').css('display', 'none');
                $('#salvaInsert').removeAttr('disabled', 'disabled');
                break;
            case "url":
                $('#insertAutore').css('display', 'none');
                $('#insertAnnoPub').css('display', 'none');
                $('#insertTitolo').css('display', 'none');
                $('#insertURL').css('display', 'block');
                $('#insertDOI').css('display', 'none');
                $('#insertComm').css('display', 'none');
                $('#insertfunzRet').css('display', 'none');
                $('#salvaInsert').removeAttr('disabled', 'disabled');
                break;
            case "doi":
                $('#insertAutore').css('display', 'none');
                $('#insertAnnoPub').css('display', 'none');
                $('#insertTitolo').css('display', 'none');
                $('#insertURL').css('display', 'none');
                $('#insertDOI').css('display', 'block');
                $('#insertComm').css('display', 'none');
                $('#insertfunzRet').css('display', 'none');
                $('#salvaInsert').removeAttr('disabled', 'disabled');
                break;
            case "commento":
                $('#insertAutore').css('display', 'none');
                $('#insertAnnoPub').css('display', 'none');
                $('#insertTitolo').css('display', 'none');
                $('#insertURL').css('display', 'none');
                $('#insertDOI').css('display', 'none');
                $('#insertComm').css('display', 'block');
                $('#insertfunzRet').css('display', 'none');
                $('#salvaInsert').removeAttr('disabled', 'disabled');
                break;
            case "funzione":
                $('#insertAutore').css('display', 'none');
                $('#insertAnnoPub').css('display', 'none');
                $('#insertTitolo').css('display', 'none');
                $('#insertURL').css('display', 'none');
                $('#insertDOI').css('display', 'none');
                $('#insertComm').css('display', 'none');
                $('#insertfunzRet').css('display', 'block');
                $('#salvaInsert').removeAttr('disabled', 'disabled');
                break;
            case "":
                $('#insertAutore').css('display', 'none');
                $('#insertAnnoPub').css('display', 'none');
                $('#insertTitolo').css('display', 'none');
                $('#insertURL').css('display', 'none');
                $('#insertDOI').css('display', 'none');
                $('#insertComm').css('display', 'none');
                $('#insertfunzRet').css('display', 'none');
                $('#salvaInsert').attr('disabled', 'disabled');
                break;
        }
   });

   function citazioniWidget(lista_cit){

        var cit = '';
        $('#modalAnnotCit div.modal-body').html('<form><div class="form-group" id="insertCit"><label for="selectCit">Scegli un riferimento bibliografico</label>'
                                   + '<select class="form-control" id="selectCit"><option value=""></option></select></div></form>');
         for(i = 0; i < lista_cit.length; i++){
         if(lista_cit[i].cit.length > 50){
            cit = lista_cit[i].cit.substring(0, 50)+'...';
         } else {
            cit = lista_cit[i].cit;
         }
            $('#selectCit').append('<option value="">'+cit+'</option>');
         }
   };

    function getCitazioni(urlDoc){
        //var urlDoc = 'http://www.dlib.org/dlib/november14/brook/11brook.html';
        $.ajax({
            url: '/scrapingCitazioni',
            type: 'GET',
            data: {url: urlDoc},
            success: function(result) {
                lista_cit = JSON.parse(result);
                if(lista_cit.length > 0){
                    citazioniWidget(lista_cit)
                } else {
                $('#modalAnnotCit div.modal-body').html('<div class="alert alert-warning alert-dismissible" role="alert">'
                              +'<strong>Attenzione!</strong> Nessuna citazione presente.'
                            +'</div>');
                }
            },
            error: function(error) {
                alert("Error: " + error);
            }
        });
    }

    $('#buttonCit').click(function(){
        var href = $("ul.nav.nav-tabs li.active a").attr("id");
        getCitazioni(href);
    });


    /* Chiamata ajax per ottenere il documento selezionato */
    $(document).on("click", "a.list-group-item", function(){
        var urlDoc = $(this).attr('value');
        if(isOpen(urlDoc)){
            $("ul.nav.nav-tabs a[id='" + urlDoc + "']").tab("show");
        }else{
            var numTabs = $("ul.nav.nav-tabs").children().length;
            if(numTabs <= 4){
                var title = $(this).text()
                $(this).addClass("active").siblings().removeClass("active");
                $.ajax({
                    url: '/scrapingSingoloDocumento',
                    type: 'GET',
                    data: {url: urlDoc},
                    success: function(result) {
                        addTab(result, urlDoc, title);
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
                                     "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1540", "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1549",
                                     "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1543", "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1544",
                                     "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1545", "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1547"];
                        var i;
                        for (i=0; i<grafi.length; i++){
                            //query = query_all_annotazioni(grafi[i], urlDoc);
                            //chiamata ajax
                            //get_annotazioni(query, urlDoc, grafi[i]);
                        }
                        query = query_all_annotazioni("", urlDoc);
                        get_annotazioni(query, urlDoc);
                        filtriAttivi();
                    },
                    error: function(error) {
                        alert("Error: " + error);
                    }
                });
            }else{
                alert("Puoi aprire 4 documenti contemporaneamente.")
            }
        }

    });

    function lanciaScraper(urlDoc) {
    alert("ciaooooo11111");

   // for (i = 0; i < anns["results"]["bindings"].length; i++) {
    //    ann = anns["results"]["bindings"][i];
        //ann_out = displaySingolaAnnotazione(ann);
        //if(ann_out !== ""){
        //    out += ann_out;
        //    numeroAnnotazioni += 1;
       // }
   // }
    //alert('sono io:::'+out);


     //   ann_out = displaySingolaAnnotazione(ann);
//        if(ann_out !== ""){
//            out += ann_out;
//            numeroAnnotazioni += 1;
//    alert("ann_out="+ann_out);

//        tipo_ann = gestioneTipoType(ann["type"]["value"]);
//        alert("tipo_ann"+tipo_ann);
//        ret = gestioneRetoriche(ann["body_o"]["value"]);
//        alert("ret"+ret);
        //var urlDoc = "http://almatourism.unibo.it/article/view/5290?acceptCookies=1";
        $.ajax({
            url: '/scrapingAutomatico',
            type: 'GET',
            data: {url: urlDoc},
            success: function(result) {
                alert(result,urlDoc);
            },
            error: function(error) {
                alert("Error: " + error);
            }
        });

        return "";
    }

  //  $('#buttonScraper').click(function(){
  //      var href = $("ul.nav.nav-tabs li.active a").attr("id");
  //      lanciaScraper(href);
  //  });



    //Quando il modal per vedere le annotazioni di un frammento viene chiuso allora viene svuotato
    $('#modalAnnotazioneSingola').on('hide.bs.modal', function(e){
        $('#infoAnnotazione').html("");
    });


    //quando viene premuto il bottone per caricare un nuovo url
    $("#nuovoDoc").click(function(){
        urlNuovoDoc = $("#uriNuovoDoc").val();
        console.log(urlNuovoDoc);
        if(urlNuovoDoc !== ""){
            if(isOpen(urlNuovoDoc)){
                $("ul.nav.nav-tabs a[id='" + urlNuovoDoc + "']").tab("show");
            }else{
                var numTabs = $("ul.nav.nav-tabs").children().length;
                if(numTabs <= 4){
                    var title = urlNuovoDoc;
                    $.ajax({
                        url: '/scrapingSingoloDocumento',
                        type: 'GET',
                        data: {url: urlNuovoDoc},
                        success: function(result) {
                            addTab(result, urlNuovoDoc, urlNuovoDoc);
                            query = query_all_annotazioni("", urlNuovoDoc);
                            get_annotazioni(query, urlNuovoDoc);
                        },
                        error: function(error) {
                            alert("Error: " + error);
                        }
                    });
                }else{
                    alert("Puoi aprire 4 documenti contemporaneamente.")
                }
            }
        } else {
            alert("L'url inserito non è corretto");
        }
    });



});

/* Funzioni per la gestione delle tab in cui visualizzare i documenti */
function isOpen(url){
    var res = false;
    $("ul.nav.nav-tabs").children().each(function() {
        if(url == $(this).children().attr("id")){
            res = true;
            return res;
        }
    });
    return res;
}
function addTab(text, urlP, title){
    $('.active').removeClass('active');
    var url = urlP.replace(/([/|_.|_:|_-])/g, '');
    $("ul.nav.nav-tabs").append("<li class='active'><a data-toggle='tab' href='#"+url+"' id="+urlP+"><label>"+title+"</label><span class='glyphicon glyphicon-remove' title='Chiudi' onclick='closeTab(this)'></span></a></li>");
    $("div.tab-content").append("<div class='tab-pane fade active in' id='"+url+"'><div id='"+url+"t'></div></div>");
    $("#"+url+"t").html(text);
}
function closeTab(element){
    var tabContentId = $(element).parent().attr("href");
    $(element).parent().parent().remove(); //remove li of tab
    $('ul.nav.nav-tabs a:last').tab('show'); // Select first tab
    $(tabContentId).remove(); //remove respective tab content
    $('ul.nav.nav-tabs a:last').tab('show'); // Select first tab
}


function mostraAnnotGruppo(element){
    $(element).addClass("active").siblings().removeClass("active");
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

function filtriAttivi(){
    $('#toggleTitolo').prop('checked', true);
    $('#toggleURL').prop('checked', true);
    $('#toggleAutore').prop('checked', true);
    $('#toggleAnnoP').prop('checked', true);
    $('#toggleDOI').prop('checked', true);
    $('#toggleFunzRet').prop('checked', true);
    $('#toggleCit').prop('checked', true);
    $('#toggleComm').prop('checked', true);
}


