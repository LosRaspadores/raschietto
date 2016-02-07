$(document).ready(function() {

    localStorage.clear();

    listaGruppiCompleta = [];

    //documenti
    $.when(getDocFromScraping(), getDocFromSparql()).done(function(r1, r2){
        docS = JSON.parse(r1[0]);
        docA = r2[0].results.bindings;

        getDocumenti(docA, docS);
    });


    //gruppi
    getGruppi();


    //inizializzazione elementi layout
    $('[data-tooltip="tooltip"]').tooltip();
    $('[data-toggle="tooltip"]').tooltip();
    $('body').tooltip({
        selector: '[data-toggle="tooltip"]'
    });
    $("#uriNuovoDoc").val("");

    $("#bottoniModificaSelezione").css('display', 'none');

    $('#bottoniAnnotator').hide();
    $('#insertAutore').css('display', 'none');
    $('#insertAnnoPub').css('display', 'none');
    $('#insertTitolo').css('display', 'none');
    $('#insertURL').css('display', 'none');
    $('#insertDOI').css('display', 'none');
    $('#insertComm').css('display', 'none');
    $('#insertfunzRet').css('display', 'none');
    $('#salvaInsert').prop('disabled', 'disabled');

    $("#home").load("/static/homeText.txt");

    $("#toHomeTab").click(function(){
        $('#homeTab').trigger("click");
    });

    $('#homeTab').click(function(){
        $('#homeTab').addClass("active");
        $(".in.active").removeClass("in active");
        $("#home").load("/static/homeText.txt");
        $("#home").addClass("in active");
    });

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
    //stickyNav();
    $(window).scroll(function() {
        stickyNav();
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

    $('#modalAnnotDoc').draggable({
        handle: ".modal-content"
    });

     $('#modalAnnotCit').draggable({
        handle: ".modal-content"
    });

    var year = new Date().getFullYear();
    for(i = year; i >=  1800; i--){
        $('select#anno').append('<option value="'+i+'">'+i+'</option>');
    }

    //TODO prendere le citazioni dall'oggetto che le contiene
    /*  getListaCitazioni(listaCitazioni) */
    var listaCitazioni = []
    var cit1 = {}
    cit1["testo"] = "[2] Gabriel, Christoph. 2011. 'Corpus of Argentinean Spanish'. In: Hedeland, Hanna et al. (Eds.), Multilingual Resources and Multilingual Applications Proceedings of the Conference of the German Society for Computational Linguistics and Language Technology (GSCL) 2011. Hamburg: Universit�t. (Arbeiten zur Mehrsprachigkeit: Working Papers in Multilingualism; Folge B: Serie B; 96).";
    cit1["numero"] = 2;
    cit1["path"] = "form1_h2";
    cit1["start"] = "0"
    cit1["end"] = "130";
    listaCitazioni.push(cit1)

    var cit2 = {}
    cit2["testo"] = "[3] Hedeland, Hanna et al. 2011. 'Multilingual Corpora at the Hamburg Centre for Language Corpora.' In: Hedeland, Hanna et al. (Eds.), Multilingual Resources and Multilingual Applications Proceedings of the Conference of the German Society for Computational Linguistics and Language Technology (GSCL) 2011. Hamburg: Universit�t. (Arbeiten zur Mehrsprachigkeit: Working Papers in Multilingualism; Folge B: Serie B; 96).";
    cit2["numero"] = 3;
    cit2["path"] = "form1_p2";
    cit2["start"] = "0"
    cit2["end"] = "90";
    listaCitazioni.push(cit2)


    $('ul#bottoniAnnotator button').click(function(e){
        /* I bottoni della nav bar non sono funzionali se non c'� un documento aperto, o se si sta modificando il frammento di un'annotazione */
        if($("ul.nav.nav-tabs li.active a").attr("id") == 'homeTab' || $("#bottoniModificaSelezione").css("display") == "block"){
            var mess = '';
            if($("ul.nav.nav-tabs li.active a").attr("id") == 'homeTab'){
                mess = "Nessun documento selezionato.";
            }else if($("#bottoniModificaSelezione").css("display") == "block"){
                mess = "Termina la modifica dell'annotazione per proseguire";
            }
            $('#alertMessage').text(mess);
            $('#alertDoc').modal('show');
            e.stopPropagation();
        }else if($(this).attr("id") == "buttonAnnotDoc"){ //Il modal per l'inserimento delle annotazioni ha bisogno di verificare che ci sia o meno un frammento di testo selezionato
            verificaTab()
        }
    });


    $('#selectTipoAnnot').change(function(){
        var annot = $(this).val();
        switch (annot) {
            case "autore":
                $('#salvaInsert').prop('disabled', 'disabled');
                $('#insertAutore').css('display', 'block');
                $('#insertAnnoPub').css('display', 'none');
                $('#insertTitolo').css('display', 'none');
                $('#insertURL').css('display', 'none');
                $('#insertDOI').css('display', 'none');
                $('#insertComm').css('display', 'none');
                $('#insertfunzRet').css('display', 'none');
                break;
            case "anno":
                $('#salvaInsert').prop('disabled', 'disabled');
                $('#insertAutore').css('display', 'none');
                $('#insertAnnoPub').css('display', 'block');
                $('#insertTitolo').css('display', 'none');
                $('#insertURL').css('display', 'none');
                $('#insertDOI').css('display', 'none');
                $('#insertComm').css('display', 'none');
                $('#insertfunzRet').css('display', 'none');
                break;
            case "titolo":
                $('#salvaInsert').prop('disabled', 'disabled');
                $('#insertAutore').css('display', 'none');
                $('#insertAnnoPub').css('display', 'none');
                $('#insertTitolo').css('display', 'block');
                $('#insertURL').css('display', 'none');
                $('#insertDOI').css('display', 'none');
                $('#insertComm').css('display', 'none');
                $('#insertfunzRet').css('display', 'none');
                break;
            case "url":
                $('#salvaInsert').prop('disabled', 'disabled');
                $('#insertAutore').css('display', 'none');
                $('#insertAnnoPub').css('display', 'none');
                $('#insertTitolo').css('display', 'none');
                $('#insertURL').css('display', 'block');
                $('#insertDOI').css('display', 'none');
                $('#insertComm').css('display', 'none');
                $('#insertfunzRet').css('display', 'none');
                break;
            case "doi":
                $('#salvaInsert').prop('disabled', 'disabled');
                $('#insertAutore').css('display', 'none');
                $('#insertAnnoPub').css('display', 'none');
                $('#insertTitolo').css('display', 'none');
                $('#insertURL').css('display', 'none');
                $('#insertDOI').css('display', 'block');
                $('#insertComm').css('display', 'none');
                $('#insertfunzRet').css('display', 'none');
                break;
            case "commento":
                $('#salvaInsert').prop('disabled', 'disabled');
                $('#insertAutore').css('display', 'none');
                $('#insertAnnoPub').css('display', 'none');
                $('#insertTitolo').css('display', 'none');
                $('#insertURL').css('display', 'none');
                $('#insertDOI').css('display', 'none');
                $('#insertComm').css('display', 'block');
                $('#insertfunzRet').css('display', 'none');
                break;
            case "funzione":
                $('#salvaInsert').prop('disabled', 'disabled');
                $('#insertComm').css('display', 'none');
                $('#insertAnnoPub').css('display', 'none');
                $('#insertTitolo').css('display', 'none');
                $('#insertURL').css('display', 'none');
                $('#insertDOI').css('display', 'none');
                $('#insertAutore').css('display', 'none');
                $('#insertfunzRet').css('display', 'block');
                break;
            case "":
                $('#salvaInsert').prop('disabled', 'disabled');
                $('#insertAutore').css('display', 'none');
                $('#insertAnnoPub').css('display', 'none');
                $('#insertTitolo').css('display', 'none');
                $('#insertURL').css('display', 'none');
                $('#insertDOI').css('display', 'none');
                $('#insertComm').css('display', 'none');
                $('#insertfunzRet').css('display', 'none');
                break;
        }
   });

    $('#buttonCit').click(function(){ //TODO lo fa solo la prima volta
        var id = $("ul.nav.nav-tabs li.active a").attr("id");
        if(id != 'homeTab'){
            getCitazioni(id);
            /*
            var cit = '';
            for(var i = 0; i < listaCitazioni.length; i++){
                if(listaCitazioni[i].testo.length > 70){
                    cit = listaCitazioni[i].testo.substring(0, 70)+'...';
                    } else {
                    cit = listaCitazioni[i].testo;
                    }
                $("#selectCit").append('<option value="'+(i+1)+'">'+cit+'</option>');
            }
            */
        }
    });


    /* Riempie modale di gestione delle annotazioni */
    $('#buttonGest').click(function(){
        var id = $("ul.nav.nav-tabs li.active a").attr("id");
        if(id != 'homeTab'){
            //mostra annotazioni sul nostro grafo
            annot_gest = annotDaGestire(id, 'http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537');
            $('#modalGestAnnotazioni div#annotazioniPresenti table.tableAnnot tbody').html("");
            for(i = 0; i < annot_gest.length; i++){
                if(typeof(annot_gest[i].type) != "undefined"){
                    classCSS = getClassNameType(typeToIta(annot_gest[i].type.value));
                }
                col = '<span class="glyphicon glyphicon-tint label' + classCSS.substring(9, classCSS.length)+ '"></span>'; //<td>'+ parseDatetime(annot_gest[i].date.value)+'</td>
                tr = '<tr><td>'+col+' '+ typeToIta(annot_gest[i].type.value)+'</td><td>'+ parseDatetime(annot_gest[i].date.value)+'</td><td>'+annot_gest[i].body_o.value+'</td><td><span class="glyphicon glyphicon-edit" onclick="modificaAnnot(this)"></span><span class="glyphicon glyphicon-trash" onclick="cancellaAnnotGrafo(this)"></span></td></tr>';
                $('#modalGestAnnotazioni div#annotazioniPresenti table.tableAnnot tbody').append(tr);
            }

            //mostra annotazioni non ancora salvate nella variabile 'annotazioniSessione' per quel documento !!
            $('#modalGestAnnotazioni div#annotazioniInserite table.tableAnnot tbody').html("");
            var annotazioniSessione = JSON.parse(sessionStorage.annotazioniSessione);
            for(i = 0; i<annotazioniSessione.length; i++){
                if(annotazioniSessione[i].doc == id){
                    for(j = 0; j<annotazioniSessione[i].annotazioni.length; j++){
                        tipo = annotazioniSessione[i].annotazioni[j].tipo;
                        data = annotazioniSessione[i].annotazioni[j].data.replace("T", " ");
                        selezione = annotazioniSessione[i].annotazioni[j].selezione;
                        oggetto = annotazioniSessione[i].annotazioni[j].oggetto;

                        idAnn = annotazioniSessione[i].annotazioni[j].id;
                        classCSS = getClassNameType(tipo);
                        var span = '';
                        var alert = 'annotazione';
                        if(tipo == 'Citazione'){
                            span = '<span class="glyphicon glyphicon-plus" data-toggle="tooltip" title="Annota citazione" onclick="annotaCitazione('+idAnn+')">'
                            alert = 'citazione';
                        }
                        col = '<span class="glyphicon glyphicon-tint label' + classCSS.substring(9, classCSS.length)+ '"></span>';
                        tr = '<tr data-id="'+idAnn+'"><td>'+col+' '+ tipo+'</td><td>'+data+'</td><td>'+oggetto+'</td><td><span class="glyphicon glyphicon-edit" onclick="modificaAnnotazioneLocale('+idAnn+')" data-toggle="tooltip" title="Modifica '+alert+'"></span><span onclick="eliminaAnnotazioneLocale('+idAnn+')" class="glyphicon glyphicon-trash" data-toggle="tooltip" title="Elimina '+alert+'"></span>'+span+'</td></tr>';

                        $('#modalGestAnnotazioni div#annotazioniInserite table.tableAnnot tbody').append(tr);
                    }
                }
            }
            sessionStorage.annotazioniSessione = JSON.stringify(annotazioniSessione);
        }
    });


    /* Chiamata ajax per ottenere il documento selezionato */
    $(document).on("click", "#lista_doc a.list-group-item", function(){
        var urlDoc = $(this).attr('value');
        if(isOpen(urlDoc)){
            $("ul.nav.nav-tabs a[id='" + urlDoc + "']").tab("show");
        }else{
            var numTabs = $("ul.nav.nav-tabs").children().length;
            var mq = window.matchMedia("(min-width: 700px)");
            if(mq.matches){


                if(numTabs <= 4){
                    var title = $(this).text()
                    $(this).addClass("active").siblings().removeClass("active");
                    $.ajax({
                        url: '/scrapingSingoloDocumento',
                        type: 'GET',
                        data: {url: urlDoc},
                        success: function(result) {
                            addTab(result, urlDoc, title);

                            query = query_all_annotazioni(urlDoc);
                            get_annotazioni(query, urlDoc);
                            filtriAttivi();
                        },
                        error: function(error) {
                            $('#alertMessage').text("Errore nel caricamento del documento.");
                            $('#alertDoc').modal('show');
                        }
                    });
                }else{
                    $('#alertMessage').text("Puoi aprire 4 documenti contemporaneamente.");
                    $('#alertDoc').modal('show');
                }
            }else{
                if(numTabs <= 1){
                    var title = $(this).text()
                    $(this).addClass("active").siblings().removeClass("active");
                    $.ajax({
                        url: '/scrapingSingoloDocumento',
                        type: 'GET',
                        data: {url: urlDoc},
                        success: function(result) {
                            addTab(result, urlDoc, title);
                            query = query_all_annotazioni(urlDoc);
                            get_annotazioni(query, urlDoc);

                            filtriAttivi();
                        },
                        error: function(error) {
                            $('#alertMessage').text("Errore nel caricamento del documento.");
                            $('#alertDoc').modal('show');
                        }
                    });
                }else{
                    $('#alertMessage').text("Ingrandisci la pagina per aprire piu' documenti.");
                    $('#alertDoc').modal('show');
                }
            }
        }
    });

    //collegamento bottone lancia scraper
    $('#buttonScraper').click(function(){
        var href = $("ul.nav.nav-tabs li.active a").attr("id");
        lancia_scraper(query, href);

    });

    //quando viene premuto il bottone per caricare un nuovo url
    $("#nuovoDoc").click(function(){
        urlNuovoDoc = $("#uriNuovoDoc").val();
        $("#uriNuovoDoc").val("");
        if(urlNuovoDoc !== ""){
            if(isOpen(urlNuovoDoc)){
                $("ul.nav.nav-tabs a[id='" + urlNuovoDoc + "']").tab("show");
            }else{
                var numTabs = $("ul.nav.nav-tabs").children().length;
                if(numTabs <= 4){
                    $.ajax({
                        url: '/scrapingSingoloDocumento',
                        type: 'GET',
                        data: {url: urlNuovoDoc},
                        success: function(result) {
                            addTab(result, urlNuovoDoc, urlNuovoDoc);
                            query = query_all_annotazioni(urlNuovoDoc);
                            get_annotazioni(query, urlNuovoDoc);
                            filtriAttivi();
                        },
                        error: function(error) {
                            $('#alertMessage').text("Impossibile aprire il documento cercato.");
                            $('#alertDoc').modal('show');
                        }
                    });
                    $.ajax({
                        url: '/checkDocumentoInCache',
                        type: 'GET',
                        data: {url: urlNuovoDoc},
                        success: function(result) {
                            obj = JSON.parse(result);
                            console.log(obj[0].url + " " + obj[0].titolo);
                            if(obj[0].url != "no"){
                                $('#numDoc').html(parseInt($('#numDoc').html()) + 1);
                                $('div#lista_doc').append('<a class="list-group-item" value="' + obj[0].url + '">' + obj[0].titolo + '</a><br>');
                            }
                        },
                        error: function(error) {
                            console.log("error");
                        }
                    });
                }else{
                    $('#alertMessage').text("Puoi aprire 4 documenti contemporaneamente.");
                    $('#alertDoc').modal('show');
                }
            }
        } else {
            $('#alertMessage').text("L'URI inserito non � valido.");
            $('#alertDoc').modal('show');
        }
    });

    $('#salvaGest').click(function(){
        for(k = 0; k < listaAnnotGrafo1537.length; k++){
            if(listaAnnotGrafo1537[k].url == $("ul.nav.nav-tabs li.active a").attr("id")){
                for(l = 0; l < listaAnnotGrafo1537[k].annotazioni.length; l++){
                    if(typeof(listaAnnotGrafo1537[k].annotazioni[l].update) != "undefined"){
                        console.log(creaQueryUpdate(listaAnnotGrafo1537[k].annotazioni[l]));
                        if(typeof(listaAnnotGrafo1537[k].annotazioni[l].update.oggetto) != "undefined"){
                            if(typeof(listaAnnotGrafo1537[k].annotazioni[l].update.tipo) != "undefined"){
                                tipo = listaAnnotGrafo1537[k].annotazioni[l].update.tipo;
                            } else {
                                tipo = listaAnnotGrafo1537[k].annotazioni[l].label.value;
                            }

                            if(tipo.toLowerCase() == "autore"){
                                console.log(creaTripleAutore(listaAnnotGrafo1537[k].annotazioni[l].update.oggetto, listaAnnotGrafo1537[k].annotazioni[l].body_s.value));
                            } else if(tipo.toLowerCase() == "citazione"){
                                //TODO completare con l'oggetto delle citazioni
                            }
                        }
                    }
                }
            }
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
    $("ul.nav.nav-tabs").append("<li class='active'><a data-toggle='tab' href='#"+url+"' id='"+urlP+"'><label>"+title+"</label><span class='glyphicon glyphicon-remove' title='Chiudi' onclick='closeTab(this)'></span></a></li>");
    $("div.tab-content").append("<div class='tab-pane fade active in' id='"+url+"'><div id='"+url+"t'></div></div>");
    $("#"+url+"t").html(text);
}
function closeTab(element){
    var tabContentId = $(element).parent().attr("href");
    var tabId = $(element).parent().attr("id");
    $(element).parent().parent().remove(); //remove li of tab
    $(tabContentId).remove(); //remove respective tab content
    $('ul.nav.nav-tabs a:last').tab('show'); // Select first tab

    for(j = 0; j < listaAllAnnotazioni.length; j++){
        if(listaAllAnnotazioni[j].url == tabId){
            listaAllAnnotazioni.splice(j, 1);
        }
    }

    console.log("lista");
    for(j = 0; j < listaAllAnnotazioni.length; j++){
        console.log(listaAllAnnotazioni[j].url);
    }
    if($(".in .active").length==0){
        $('#homeTab').trigger("click");
    };
}

function mostraAnnotGruppo(element){
    $(element).addClass("active").siblings().removeClass("active");
    urlGruppo = $(element).attr('value');
    urlD = $("ul.nav.nav-tabs li.active a").attr("id");
    filtriGruppo(urlGruppo, urlD);
}

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
   }

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
                    $('#alertMessage').text("Nessuna citazione presente nel documento selezionato.");
                    $('#alertDoc').modal('show');
                }
            },
            error: function(error) {
                $('#alertMessage').text(error);
                $('#alertDoc').modal('show');
            }
        });
    }
