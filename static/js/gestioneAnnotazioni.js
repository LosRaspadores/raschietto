function verificaTab(){
    var path = '';
    var start = '';
    var end = '';
    var selezione = '';
    if($("ul.nav.nav-tabs li.active a").attr("id") != 'homeTab'){
        var oggettoSelezionato = verificaFrammento();
        if(!oggettoSelezionato){
            $('#selezione').css('display', 'none');
            $('#commento').css('display', 'none');
            $('#funzione').css('display', 'none');

            $('#modalAnnotDoc').data("path", path);
            $('#modalAnnotDoc').data("start", start);
            $('#modalAnnotDoc').data("end", end);
            $('#modalAnnotDoc').data("selezione", selezione);

            $('#modalTipoAnnotazione').modal('show');
        }else{
            path = oggettoSelezionato.id;
            start = oggettoSelezionato.inizio;
            end = oggettoSelezionato.fine;
            selezione = oggettoSelezionato.selezione;
            //apri modale per inserire annotazione sul frammento
            $('#selezione').css('display', 'block');
            $('#commento').css('display', 'block');
            $('#funzione').css('display', 'block');

            $('#modalAnnotDoc').data("path", path);
            $('#modalAnnotDoc').data("start", start);
            $('#modalAnnotDoc').data("end", end);
            $('#modalAnnotDoc').data("selezione", selezione);

            $('#modalAnnotDoc').modal('show');
        }
    }
}

function getHostname(url) {
    var m = url.match(/^http:\/\/[^/]+/);
    return m ? m[0] : null;
}

var urlDoc = '';
//var idFrammento = '';
//var startOffset = '';
//var endOffset = '';
//var selection = '';

function verificaFrammento(){
    selection = rangy.getSelection();
    if(selection.toString() != ""){
        $('#selezione').html(selection.toString())
        var range = selection.getRangeAt(0);
        var bookmark = selection.getBookmark(range.commonAncestorContainer).rangeBookmarks[0];
        var container = bookmark.containerNode; //contenuto del tag a cui appartiene la selezione
        startOffset = bookmark.start;
        endOffset = bookmark.end;

        if (container.nodeType == 3) { //text
            var temp = container.parentNode; //tag completo a cui appartiene la selezione

            var textNodes = getTextNodes(temp);
            var offset = 0;
            var foundNode = false;

            for (var i = 0; (i < textNodes.length) && (!foundNode); i++) {
                if (textNodes[i] == container) {
                    foundNode = true;
                } else {
                    offset += textNodes[i].length;
                }
            };
            startOffset += offset;
            endOffset += offset;
            container = temp;
        };
        var url = $('.active a').attr('id')
        var domain = getHostname(url)
        var originalPath = ''
        var d = ''
        if(domain == 'http://www.dlib.org'){
            d = 0
            originalPath = 'form1_table3_tbody_tr_td_table5';
        }else if(domain == 'http://rivista-statistica.unibo.it' || domain == 'http://antropologiaeteatro.unibo.it' || domain == 'http://almatourism.unibo.it'){
            d = 1
            originalPath = 'div1_div3_div2_div3'
        }
        pathFrammento = url+'#'+originalPath+'_'+getElementPath($(container), d)
        idFrammento = originalPath+'_'+getElementPath($(container), d)
        alert(idFrammento)
        obj = {"selezione": selection.toString(),
                "source": url,
                "id": idFrammento,
                "inizio": startOffset,
                "fine": endOffset};
        return obj;
    }else{
        return false;
    }
}

function getElementPath($element, d){
    var tag = $element[0].tagName.toLowerCase()
    var target = $($element[0]);
    //Se seleziona uno span con classe che inzia con 'highlight' -> è un frammento già annotato !
    //Esclude gli <span> dal path del frammento
    while(tag == 'span' && (target.is($("span[class^='highlight']")))){
        $element = $element.parent();
        tag = $element[0].tagName.toLowerCase();
    }
    var index = $element.parent().children(tag).index($element) + 1;
    var path = []
    $element.parents().not('html').not('body').each(function() {
        if(d == 0){
            var f = $(this).attr('width') == '100%' && $(this).attr('cellspacing') == '0' && $(this).attr('cellpadding') == '0' && $(this).attr('border') == '0' && $(this).attr('align') == 'center'
        }else{
            var f =  $(this).attr('id') == 'content'
        }
        if(f){
            return false
        }else{
            var tag = this.tagName.toLowerCase();
            var index = $(this).parent().children(tag).index(this) + 1;
            path.push(tag+""+ index)
        }

    });
    path.reverse()
    return path.join("_")+"_"+$element[0].tagName.toLowerCase()+index
}

function getTextNodes(node) {
    var textNodes = [];
    if (node.nodeType == 3) {
        textNodes.push(node);
    } else {
        var children = node.childNodes;
        for (var i = 0, len = children.length; i < len; ++i) {
            textNodes.push.apply(textNodes, getTextNodes(children[i]));
        }
    }
    return textNodes;
}

/* Inserimento annotazione sul documento */
$('#salvaInsert').on('click', function(){
    var source = $('.active a').attr('id');
    if($('#modalAnnotDoc').data("id") != undefined){ //sto inserendo un'annotazione su una citazione -> il soggetto di tale annotazione è la citazione stessa
        source += '_ver1_cited[n]' //TODO passargli queste cose +++++++++
    }
    var tipoAnnotazione = $('#selectTipoAnnot').find(":selected").text();
    var testo = '';
    var tipo = '';
    switch (tipoAnnotazione) {
            case "Autore":
                testo = $('#autore').val();
                tipo = "Autore";
                break;
            case "Anno pubblicazione":
                testo = $('#anno').find(":selected").text();
                tipo = "Anno pubblicazione";
                break;
            case "DOI":
                testo = $('#doi').val();
                tipo = "DOI";
                break;
            case "Titolo":
                testo = $('#titolo').val();
                tipo = "Titolo";
                break;
            case "URL":
                testo = $('#url').val();
                tipo = "URL";
                break;
            case "Commento":
                testo = $('#comm').val();
                tipo = "Commento";
                break;
            case "Funzione retorica":
                testo = $('#funcRet').find(":selected").text();
                tipo = "Funzione retorica";
                break;
    }

    var idFrammento = $('#modalAnnotDoc').data("path");
    var startOffset = $('#modalAnnotDoc').data("start");
    var endOffset = $('#modalAnnotDoc').data("end");
    var selezione = $('#modalAnnotDoc').data("selezione");

    var idAnn = costruisciAnnotazione(source, tipo, testo, idFrammento, startOffset, endOffset, selezione);

    if($('#modalAnnotDoc').data("id") != undefined){ //sto inserendo un'annotazione su una citazione -> il soggetto di tale annotazione è la citazione stessa
        var idCit = $('#modalAnnotDoc').data("id");
        classCSS = getClassNameLabel(tipo);
        col = '<span class="glyphicon glyphicon-tint label' + classCSS.substring(9, classCSS.length)+ '"></span>';
        tr = '<tr data-id="'+idAnn+'"><td>'+col+' '+ classCSS.substring(9, classCSS.length)+'</td><td>'+getDateTime().replace("T", " ")+'</td><td>'+testo+'</td><td><span class="glyphicon glyphicon-edit" onclick="modificaAnnotazioneLocale('+idAnn+')" data-toggle="tooltip" title="Modifica annotazione"></span><span onclick="eliminaAnnotazioneLocale('+idAnn+')" class="glyphicon glyphicon-trash" data-toggle="tooltip" title="Elimina annotazione"></span></td></tr>';

        $('#modalGestAnnotazioni div#annotazioniInserite table.tableAnnot tbody').append(tr);
    }
    $('#modalAnnotDoc').modal('hide');

});
/* Rimuove annotazioni inserite e non ancora salvate */
function eliminaAnnotazioneLocale(id){
    $('#modalConfermaEliminazione').data('id', id).modal('show');
}
function eliminaAnnotazione(id){
    var annotazioniSessione = JSON.parse(sessionStorage.annotazioniSessione);
    for(i = 0; i<annotazioniSessione.length; i++){
        if(annotazioniSessione[i].doc == $("ul.nav.nav-tabs li.active a").attr("id")){
            for(j = 0; j<annotazioniSessione[i].annotazioni.length; j++){
                if(annotazioniSessione[i].annotazioni[j].id == id){
                    annotazioniSessione[i].annotazioni.splice(j,1);
                    $('[data-id="' + id + '"]').remove();
                    $('#modalConfermaEliminazione').modal('hide');
                }
            }
        }
    }
    sessionStorage.annotazioniSessione = JSON.stringify(annotazioniSessione);
}


function modificaAnnotazioneLocale(id){ //TODO vedere come ha fatto silvia !!!
//    var tipoModifica = '';
    $('#modalAnnotDoc h3').html("Modifica annotazione"); //TODO NON funzia
    $('textarea#selezione').css("display", "none");
//    $('div#modificaSelezione').css("display", "none");
//    $('div#modificaSelezione button').remove();
    var annotazioniSessione = JSON.parse(sessionStorage.annotazioniSessione);
    for(i = 0; i<annotazioniSessione.length; i++){
        if(annotazioniSessione[i].doc == $("ul.nav.nav-tabs li.active a").attr("id")){
            for(j = 0; j<annotazioniSessione[i].annotazioni.length; j++){
                if(annotazioniSessione[i].annotazioni[j].id == id){
                    tipo = annotazioniSessione[i].annotazioni[j].tipo;
                    if(tipo != 'Citazione'){ //modifica citazione
                        if(annotazioniSessione[i].annotazioni[j].selezione.length != 0){
                            $('textarea#selezione').css("display", "block");
//                            $('div#modificaSelezione').append('<button type="button" class="btn btn-success" data-dismiss="modal" onclick="modificaSelezione('+id+')">Modifica Testo Selezionato</button>');
//                            $('div#modificaSelezione').css("display", "block");

                            $('#modalAnnotDoc textarea').html(annotazioniSessione[i].annotazioni[j].selezione);
                        }else{
                            $('textarea#selezione').css("display", "none");
//                            $('div#modificaSelezione').css("display", "none");
//                            $('div#modificaSelezione button').remove();
                        }
//                        $("#tipo").html(annotazioniSessione[i].annotazioni[j].tipo);
                        $("#oggettoAnnotazione").children('div.modificaAnn').remove();
//                        popolaModalModifica(annotazioniSessione[i].annotazioni[j].tipo)
                        $('#modalAnnotDoc').data('id', id).modal('show');
                        $('#modalAnnotDoc h3').html("Inserisci annotazione");
                    }else{
                        getCitazioni($("ul.nav.nav-tabs li.active a").attr("id"));
                        $("#modalAnnotCit h3").html("Modifica citazione");
                        $("#modalAnnotCit").data('idCit', id).modal("show");
                    }
                }
            }
        }
    }
    sessionStorage.annotazioniSessione = JSON.stringify(annotazioniSessione);
}

//TODO da togliere !!
function popolaModalModifica(tipo){
    switch (tipo) {
        case "Autore":
            $("#modAutore").css("display", "block");
            $("#modAnno").css("display", "none");
            $("#modDoi").css("display", "none");
            $("#modTitolo").css("display", "none");
            $("#modUrl").css("display", "none");
            $("#modCommento").css("display", "none");
            $("#modFunzioneRetorica").css("display", "none");
            break;
        case "Anno pubblicazione":
            $("#modAnno").css("display", "block");
            $("#modAutore").css("display", "none");
            $("#modDoi").css("display", "none");
            $("#modTitolo").css("display", "none");
            $("#modUrl").css("display", "none");
            $("#modCommento").css("display", "none");
            $("#modFunzioneRetorica").css("display", "none");
            break;
        case "DOI":
            $("#modDoi").css("display", "block");
            $("#modAutore").css("display", "none");
            $("#modAnno").css("display", "none");
            $("#modTitolo").css("display", "none");
            $("#modUrl").css("display", "none");
            $("#modCommento").css("display", "none");
            $("#modFunzioneRetorica").css("display", "none");
            break;
        case "Titolo":
            $("#modTitolo").css("display", "block");
            $("#modAutore").css("display", "none");
            $("#modAnno").css("display", "none");
            $("#modDoi").css("display", "none");
            $("#modUrl").css("display", "none");
            $("#modCommento").css("display", "none");
            $("#modFunzioneRetorica").css("display", "none");
            break;
        case "URL":
            $("#modUrl").css("display", "block");
            $("#modAutore").css("display", "none");
            $("#modAnno").css("display", "none");
            $("#modDoi").css("display", "none");
            $("#modTitolo").css("display", "none");
            $("#modCommento").css("display", "none");
            $("#modFunzioneRetorica").css("display", "none");
            break;
        case "Commento":
            $("#modCommento").css("display", "block");
            $("#modAutore").css("display", "none");
            $("#modAnno").css("display", "none");
            $("#modDoi").css("display", "none");
            $("#modTitolo").css("display", "none");
            $("#modUrl").css("display", "none");
            $("#modFunzioneRetorica").css("display", "none");
            break;
        case "Funzione retorica":
            $("#modFunzioneRetorica").css("display", "block");
            $("#modAutore").css("display", "none");
            $("#modAnno").css("display", "none");
            $("#modDoi").css("display", "none");
            $("#modTitolo").css("display", "none");
            $("#modUrl").css("display", "none");
            $("#modCommento").css("display", "none");
            break;
    }
}

function modificaSelezione(id){
    $('#modalGestAnnotazioni').modal('hide');
    var idTab = $("ul.nav.nav-tabs li.active a").attr("href").substr(1);
    $("#"+idTab).prepend("<button id='confermaModificaSelezione' class='btn btn-success' data-toggle='modal' onclick='aggiornaAnnotazione("+id+")'>Conferma nuova selezione</button>")
}

function aggiornaAnnotazione(id){
    obj = verificaFrammento();
    if(!obj){
        $('#alertMessage').text("Nessun frammento selezionato.");
        $('#alertDoc').modal('show');
    }else{
        annotazioniSessione = JSON.parse(sessionStorage.annotazioniSessione);
        for(i = 0; i<annotazioniSessione.length; i++){
            if(annotazioniSessione[i].doc == $("ul.nav.nav-tabs li.active a").attr("id")){
                for(j = 0; j<annotazioniSessione[i].annotazioni.length; j++){
                    if(annotazioniSessione[i].annotazioni[j].id == id){
                        annotazioniSessione[i].annotazioni[j].selezione = obj.selezione;
                        annotazioniSessione[i].annotazioni[j].source = obj.source;
                        annotazioniSessione[i].annotazioni[j].idFrammento = obj.id;
                        annotazioniSessione[i].annotazioni[j].start = obj.inizio;
                        annotazioniSessione[i].annotazioni[j].end = obj.fine;

                        $("modalModificaAnnot textarea").html(obj.selezione);
                    }
                }
            }
        }
        sessionStorage.annotazioniSessione = JSON.stringify(annotazioniSessione);
        modificaAnnotazioneLocale(id)
        $("#confermaModificaSelezione").remove();
        $('#modalModificaAnnot').modal('show');
    }
}

/* Metodo per annotare una citazione */
function annotaCitazione(idCit){
    var annotazioniSessione = JSON.parse(sessionStorage.annotazioniSessione);
    var pathCit = '';
    var startCit = '';
    var endCit = '';
    var oggettoCitazione = '';
    for(i = 0; i<annotazioniSessione.length; i++){
        if(annotazioniSessione[i].doc == $("ul.nav.nav-tabs li.active a").attr("id")){
            for(j = 0; j<annotazioniSessione[i].annotazioni.length; j++){
                if(annotazioniSessione[i].annotazioni[j].id == idCit){
                    $('textarea#selezione').html(annotazioniSessione[i].annotazioni[j].oggetto);
                    oggettoCitazione = annotazioniSessione[i].annotazioni[j].oggetto;
                }
            }
        }
    }
    $('#funzione').css('display', 'none'); //TODO renderla visibile ma non cliccabile
    sessionStorage.annotazioniSessione = JSON.stringify(annotazioniSessione);
    $("#modalAnnotDoc").data("path", pathCit);
    $("#modalAnnotDoc").data("start", startCit);
    $("#modalAnnotDoc").data("end", endCit);
    $("#modalAnnotDoc").data("selezione", '');
    $("#modalAnnotDoc").data("id", idCit).modal("show");
}

function costruisciAnnotazione(source, tipo, testo, idFrammento, start, end, selezione){
    //Costruisce annotazione locale
    var singolaAnnotazione = {};
    var idAnn = Math.random();
    singolaAnnotazione['id'] = idAnn;
    singolaAnnotazione['tipo'] = tipo;
    singolaAnnotazione['data'] = getDateTime();
//    singolaAnnotazione['target'] = 'target'; //documento o frammento //TODO togliere ovunque
    singolaAnnotazione['selezione'] = selezione;
    singolaAnnotazione['oggetto'] = testo;
    singolaAnnotazione['source'] = source;
    singolaAnnotazione['idFrammento'] = idFrammento;
    singolaAnnotazione['start'] = start;
    singolaAnnotazione['end'] = end;
    singolaAnnotazione['autore'] = sessionStorage.email;

    /* Verifica che non ci sia gia l'entry per il documento */
    var annotazioniSessione = JSON.parse(sessionStorage.annotazioniSessione);
    if(annotazioniSessione.length == 0){
        //l'oggetto è vuoto -> inserisco l'annotazione
        var annotazioniDoc = {};
        annotazioniDoc['doc'] = $("ul.nav.nav-tabs li.active a").attr("id");
        annotazioniDoc['annotazioni'] = [];
        annotazioniDoc['annotazioni'].push(singolaAnnotazione);
        annotazioniSessione.push(annotazioniDoc);
    }else{
        for(i = 0; i<annotazioniSessione.length; i++){
            //alert("doc: "+annotazioniSessione[i].doc)
            if(annotazioniSessione[i].doc == $("ul.nav.nav-tabs li.active a").attr("id")){
                //trovato e aggiungi qui
                annotazioniSessione[i].annotazioni.push(singolaAnnotazione)
                break;
            }else{
                //crea nuovo
                annotazioniDoc = {};
                annotazioniDoc['doc'] = $("ul.nav.nav-tabs li.active a").attr("id");
                annotazioniDoc['annotazioni'] = [];
                annotazioniDoc['annotazioni'].push(singolaAnnotazione);
                annotazioniSessione.push(annotazioniDoc);
                break;
            }
        }
    }
    sessionStorage.annotazioniSessione = JSON.stringify(annotazioniSessione);
    return idAnn;
}

$(document).ready(function(){

    //Elementi per la modifica delle annotazioni inserite dall'utente
    $("#modFunzioneRetorica").css("display", "none");
    $("#modAutore").css("display", "none");
    $("#modAnno").css("display", "none");
    $("#modDoi").css("display", "none");
    $("#modTitolo").css("display", "none");
    $("#modUrl").css("display", "none");
    $("#modCommento").css("display", "none");

    /* Salvare annotazioni e citazioni inserite */
    $("#salvaGest").click(function(){
        /* Invia annotazioni DEL DOCUMENTO corrente da salvare */
        var listaNuoveAnnotazioni = {"annotazioni":[]};
        annotazioniSessione = JSON.parse(sessionStorage.annotazioniSessione);
        for(i = 0; i<annotazioniSessione.length; i++){
            if(annotazioniSessione[i].doc == $("ul.nav.nav-tabs li.active a").attr("id")){
                for(j = 0; j<annotazioniSessione[i].annotazioni.length; j++){
                    annotazioneSingola = {};
                    annotazioneSingola["tipo"] = annotazioniSessione[i].annotazioni[j].tipo;
                    annotazioneSingola["data"] = annotazioniSessione[i].annotazioni[j].data;
//                    annotazioneSingola["target"] = annotazioniSessione[i].annotazioni[j].target;
                    annotazioneSingola["oggetto"] = annotazioniSessione[i].annotazioni[j].oggetto;
                    annotazioneSingola["source"] = annotazioniSessione[i].annotazioni[j].source;
                    annotazioneSingola["id"] = annotazioniSessione[i].annotazioni[j].idFrammento;
                    annotazioneSingola["start"] = annotazioniSessione[i].annotazioni[j].start;
                    annotazioneSingola["end"] = annotazioniSessione[i].annotazioni[j].end;
                    annotazioneSingola["provenance"] = annotazioniSessione[i].annotazioni[j].autore;

                    listaNuoveAnnotazioni.annotazioni.push(annotazioneSingola);
                }
            }
        }
        console.log(listaNuoveAnnotazioni)
        sessionStorage.annotazioniSessione = JSON.stringify(annotazioniSessione);
        $('#modalGestAnnotazioni').modal('hide');
        //invia listaNuoveAnnotazioni
    });

    /* Modifica annotazioni localmente */ //TODO questo andrà nell'inserimento
    $("#salvaModifica").click(function(){
        annotazioniSessione = JSON.parse(sessionStorage.annotazioniSessione);
        var id = $('#modalModificaAnnot').data('id');
        for(i = 0; i<annotazioniSessione.length; i++){
            if(annotazioniSessione[i].doc == $("ul.nav.nav-tabs li.active a").attr("id")){
                for(j = 0; j<annotazioniSessione[i].annotazioni.length; j++){
                    if(annotazioniSessione[i].annotazioni[j].id == id){
                        var valore = '';
                        switch(annotazioniSessione[i].annotazioni[j].tipo){
                            case 'Anno pubblicazione':
                                valore = $("#annoMod").find(":selected").text();
                                break;
                            case 'Autore':
                                valore = $("#autoreMod").val();
                                break;
                            case 'DOI':
                                valore = $("#doiMod").val();
                                break;
                            case 'Titolo':
                                valore = $("#titoloMod").val();
                                break;
                            case 'URL':
                                valore = $("#urlMod").val();
                                break;
                            case 'Commento':
                                valore = $("#commMod").val();
                                break;
                            case 'Funzione retorica':
                                valore = $("#funcRetMod").find(":selected").text();
                                break;
                        }
                        annotazioniSessione[i].annotazioni[j].oggetto = valore;
                        annotazioniSessione[i].annotazioni[j].data = getDateTime();

                        $('[data-id="' + id + '"]').children().filter(':nth-child(2)').html(annotazioniSessione[i].annotazioni[j].data.replace("T", " "));
                        $('[data-id="' + id + '"]').children().filter(':nth-child(3)').html(valore);
                        $('#modalModificaAnnot').modal('hide');
                    }
                }
            }
        }
        sessionStorage.annotazioniSessione = JSON.stringify(annotazioniSessione);
    });

    /* Eliminare annotazioni o citazioni in locale */
    $('#eliminaAnnotazione').click(function () {
        var id = $('#modalConfermaEliminazione').data('id');
        eliminaAnnotazione(id)

    });

     /* Gestione dei tipi nel modal di inserimento di annotazioni */
     $('#autore').keyup(function() {
        if($(this).val().length != 0) {
           $('#salvaInsert').removeAttr('disabled', 'disabled');
        }else{
            $('#salvaInsert').attr('disabled', 'disabled');
        }
     });
     $('#anno').change(function(){
        if($('#anno').find(":selected").text().length != 0) {
           $('#salvaInsert').removeAttr('disabled', 'disabled');
        }else{
           $('#salvaInsert').attr('disabled', 'disabled');
        }
     });
     $('#titolo').keyup(function() {
        if($(this).val().length != 0) {
           $('#salvaInsert').removeAttr('disabled', 'disabled');
        }else{
            $('#salvaInsert').attr('disabled', 'disabled');
        }
     });
     $('#url').keyup(function() {
        if($(this).val() != '') {
           $('#salvaInsert').removeAttr('disabled', 'disabled');
        }else{
            $('#salvaInsert').attr('disabled', 'disabled');
        }
     });
     $('#doi').keyup(function() {
        if($(this).val().length != 0) {
           $('#salvaInsert').removeAttr('disabled', 'disabled');
        }else{
            $('#salvaInsert').attr('disabled', 'disabled');
        }
     });
     $('#comm').keyup(function() {
        if($(this).val().length != 0) {
           $('#salvaInsert').removeAttr('disabled', 'disabled');
        }else{
            $('#salvaInsert').attr('disabled', 'disabled');
        }
     });
     $('#funcRet').change(function() {
        if($('#funcRet').find(":selected").text().length != 0) {
           $('#salvaInsert').removeAttr('disabled', 'disabled');
        }else{
           $('#salvaInsert').attr('disabled', 'disabled');
        }
     });

     /* Gestione citazioni -> abilita il bottone di salvataggio solo se è selezionata una citazione */
     $(document).on('change', '#selectCit', function(){
         if($("#selectCit").find(":selected").text().length != 0){
            $("#salvaInsertCit").removeAttr('disabled', 'disabled');
         }else{
            $("#salvaInsertCit").attr('disabled', 'disabled');
         }
     });


    /* Salva le citazioni inserite in locale */
    $("#salvaInsertCit").click(function(){
        if($("#modalAnnotCit").data('idCit') != undefined){ //modifica citazione
            var idCit = $("#modalAnnotCit").data('idCit');
            var annotazioniSessione = JSON.parse(sessionStorage.annotazioniSessione);
            for(i = 0; i<annotazioniSessione.length; i++){
                if(annotazioniSessione[i].doc == $("ul.nav.nav-tabs li.active a").attr("id")){
                    for(j = 0; j<annotazioniSessione[i].annotazioni.length; j++){
                        if(annotazioniSessione[i].annotazioni[j].id == idCit){
                            annotazioniSessione[i].annotazioni[j].oggetto = $("#selectCit").find(":selected").text();
                            annotazioniSessione[i].annotazioni[j].data = getDateTime();
                            annotazioniSessione[i].annotazioni[j].idFrammento = '';
                            annotazioniSessione[i].annotazioni[j].start = '';
                            annotazioniSessione[i].annotazioni[j].end = '';

                            $('[data-id="' + idCit + '"]').children().filter(':nth-child(2)').html(annotazioniSessione[i].annotazioni[j].data.replace("T", " "));
                            $('[data-id="' + idCit + '"]').children().filter(':nth-child(3)').html(annotazioniSessione[i].annotazioni[j].oggetto);
                            $('#modalAnnotCit').modal('hide');
                        }
                    }
                }
            }
            sessionStorage.annotazioniSessione = JSON.stringify(annotazioniSessione);
            $('#modalAnnotCit').removeData('idCit');
            $('#modalAnnotCit h3').html("Inserisci citazione");
        }else{ //inserisci citazione
            //costruisciAnnotazione(source, tipo, valore, idFrammento, start, end, testoSelezionato)
            costruisciAnnotazione($("ul.nav.nav-tabs li.active a").attr("id"), 'Citazione', $("#selectCit").find(":selected").text(), '', '', '', '');

            $("#modalAnnotCit").modal("hide");
        }

    });

});