oggettoSelezionato = {};
function verificaTab(){
    if($("ul.nav.nav-tabs li.active a").attr("id") != 'homeTab'){
        $('button#bottonemodFramm').css("display", "none");
        oggettoSelezionato = verificaFrammento();
        if(!oggettoSelezionato){
            $('#selezione').css('display', 'none');
            $('select[id="selectTipoAnnot"]').find('option:contains("Commento")').prop('disabled',true);
            $('select[id="selectTipoAnnot"]').find('option:contains("Funzione retorica")').prop('disabled',true);
//            $('#commento').css('display', 'none');
//            $('#funzione').css('display', 'none');
            $('#modalTipoAnnotazione').modal('show');
        }else{
            //apri modale per inserire annotazione sul frammento
            $('#selezione').css('display', 'block');
            $('select[id="selectTipoAnnot"]').find('option:contains("Commento")').prop('disabled',false);
            $('select[id="selectTipoAnnot"]').find('option:contains("Funzione retorica")').prop('disabled',false);
//            $('#commento').css('display', 'block');
//            $('#funzione').css('display', 'block');


//            $('#modalAnnotDoc #selectTipoAnnot').append('<option value="commento" id="commento">Commento</option>');
//            $('#modalAnnotDoc #selectTipoAnnot').append('<option value="funzione" id="funzione">Funzione retorica</option>');
            $('#modalAnnotDoc').modal('show');
        }
    }
}

function getHostname(url) {
    var m = url.match(/^http:\/\/[^/]+/);
    return m ? m[0] : null;
}

var urlDoc = '';
var idFrammento = '';
var startOffset = '';
var endOffset = '';
var selection = '';

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

    if($('#modalAnnotDoc').data("azione") == "modifica"){ // mettere come parametro "azione" - "modifica" per la modifica delle annotazioni sia locali che del grafo
        if($('#modalAnnotDoc').data("indexDoc") != "undefined"){ // modifica annotazioni del grafo
            var index = $('#modalAnnotDoc').data("index");
            var indexDoc = $('#modalAnnotDoc').data("indexDoc");
            var annot = listaAnnotGrafo1537[indexDoc].annotazioni[index];

            if(typeof(annot['update']) == "undefined"){
                annot['update'] = {};
            }

            annot['update']['autore'] = "<mailto:" + sessionStorage.email + ">";
            annot['update']['data_mod'] = getDateTime();

            if(tipo != typeToIta(annot.type.value)){
                annot['update']['tipo'] = tipo;
                annot['update']['label_tipo'] = tipo;
            }

            if(tipo == "Funzione retorica" || typeToIta(annot.type.value) == "Funzione retorica"){
                var arr = annot[index].body_o.value.split("#");
                var arrTemp = annot.body_o.value.split('#');
                if(arr[arr.length-1] != arrTemp[arrTemp.length-1]){
                    annot['update']['oggetto'] = testo;
                }
            } else {
                if(testo != annot.body_o.value){
                    annot['update']['oggetto'] = testo;
                }
            }




//            listaAnnotGrafo1537[i].annotazioni[index]['update']['path'] = "html_div_p";
//            listaAnnotGrafo1537[i].annotazioni[index]['update']['start_fragm'] = "55";
//            listaAnnotGrafo1537[i].annotazioni[index]['update']['end_fragm'] = "66";
            //console.log(listaAnnotGrafo1537[i].annotazioni[index]);

        } else {
            //eawsfdgh
        }
    } else { // inserimento
        var soggetto = '';
        if($('#modalAnnotDoc').data("id") != undefined){ //sto inserendo un'annotazione su una citazione -> il soggetto di tale annotazione è la citazione stessa
            soggetto = 'jettka.html_ver1_cited[n]' //TODO passargli il soggetto
        }

        //Costruisce annotazione locale
        var singolaAnnotazione = {};
        singolaAnnotazione['id'] = Math.random();
        singolaAnnotazione['tipo'] = tipo;
        singolaAnnotazione['data'] = getDateTime();
    //    singolaAnnotazione['target'] = 'target'; //documento o frammento
        singolaAnnotazione['selezione'] = selection.toString();
        singolaAnnotazione['oggetto'] = testo;
        singolaAnnotazione['soggetto'] = soggetto; //TODO metto sempre il soggetto senza il source !? (sono la stessa cosa)
        singolaAnnotazione['source'] = $('.active a').attr('id');
        singolaAnnotazione['idFrammento'] = idFrammento;
        singolaAnnotazione['start'] = startOffset;
        singolaAnnotazione['end'] = endOffset;
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
                    //alert("trovato")
                    annotazioniSessione[i].annotazioni.push(singolaAnnotazione)
                    break;
                }else{
                    //crea nuovo
                    //alert("non trovato")
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
    }
    $('#modalAnnotDoc').modal('hide');
    $('#modalGestAnnotazioni').modal('hide');

});

/* Rimuove annotazioni inserite e non ancora salvate */ //TODO PER ANNOTAZIONI PRESENTI
function eliminaAnnotazioneLocale(id){
    $('#modalConfermaEliminazione h4').html("Sei sicuro di voler eliminare l'annotazione ?");
    $('#modalConfermaEliminazione').data('tipo', 0); //annot
    $('#modalConfermaEliminazione').data('id', id).modal('show');

}
function eliminaAnnotazione(id){ // TODO PER ANNOTAZIONI PRESENTI
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

function modificaAnnotazioneLocale(id){
    $('textarea#frammento').css("display", "none");
    $('div#modificaSelezione').css("display", "none");
    $('div#modificaSelezione button').remove();
    var annotazioniSessione = JSON.parse(sessionStorage.annotazioniSessione);
    for(i = 0; i<annotazioniSessione.length; i++){
        if(annotazioniSessione[i].doc == $("ul.nav.nav-tabs li.active a").attr("id")){
            for(j = 0; j<annotazioniSessione[i].annotazioni.length; j++){
                if(annotazioniSessione[i].annotazioni[j].id == id){
                    if(annotazioniSessione[i].annotazioni[j].selezione.length != 0){
                        $('textarea#frammento').css("display", "block");
                        $('div#modificaSelezione').append('<button type="button" class="btn btn-success" data-dismiss="modal" onclick="modificaSelezione('+id+')">Modifica Testo Selezionato</button>');
                        $('div#modificaSelezione').css("display", "block");

                        $('#modalModificaAnnot textarea').html(annotazioniSessione[i].annotazioni[j].selezione);
                    }else{
                        $('textarea#frammento').css("display", "none");
                        $('div#modificaSelezione').css("display", "none");
                        $('div#modificaSelezione button').remove();
                    }
                    $("#tipo").html(annotazioniSessione[i].annotazioni[j].tipo);
                    $("#oggettoAnnotazione").children('div.modificaAnn').remove();
                    popolaModalModifica(annotazioniSessione[i].annotazioni[j].tipo)
                }
            }
        }
    }
    $('#modalModificaAnnot').data('id', id).modal('show');
    sessionStorage.annotazioniSessione = JSON.stringify(annotazioniSessione);
}

// modifica selezione frammento
function modificaSelezione(id){
    $('#modalGestAnnotazioni').modal('hide');
    $('#modalAnnotDoc').modal('hide');

    var idTab = $("ul.nav.nav-tabs li.active a").attr("href").substr(1);
    $("#"+idTab).prepend("<button id='confermaModificaSelezione' class='btn btn-success' onclick='aggiornaAnnotazione("+id+")'>Conferma nuova selezione</button>")
}

function aggiornaAnnotazione(id){ // bottone che sta fermo
    obj = verificaFrammento();
    if(!obj){
        $('#alertMessage').text("Nessun frammento selezionato.");
        $('#alertDoc').modal('show');
    }else{
        oggettoSelezionato = obj;

        $("#modalAnnotDoc textarea").html(obj.selezione);
        $("#confermaModificaSelezione").remove();
        $('#modalAnnotDoc').modal('show');

    }
}

/* Metodi per la gestione delle citazioni locali */
function modificaCitazioneLocale(idCit){
    getCitazioni($("ul.nav.nav-tabs li.active a").attr("id"));
    $("#modalAnnotCit h3").html("Modifica citazione");
    $("#modalAnnotCit").data('idCit', idCit).modal("show");
}

function eliminaCitazioneLocale(idCit){
    $("#modalConfermaEliminazione h4").html("Sei sicuro di voler eliminare la citazione ?");
    $('#modalConfermaEliminazione').data('tipo', 1); //cit
    $("#modalConfermaEliminazione").data('id', idCit).modal('show');
}
function eliminaCitazione(idCit){
    var citazioniSessione = JSON.parse(sessionStorage.citazioniSessione);
    for(i = 0; i<citazioniSessione.length; i++){
        if(citazioniSessione[i].doc == $("ul.nav.nav-tabs li.active a").attr("id")){
            for(j = 0; j<citazioniSessione[i].citazioni.length; j++){
                if(citazioniSessione[i].citazioni[j].id == idCit){
                    citazioniSessione[i].citazioni.splice(j,1);
                    $('[data-id="' + idCit + '"]').remove();
                    $('#modalConfermaEliminazione').modal('hide');
                }
            }
        }
    }
    sessionStorage.citazioniSessione = JSON.stringify(citazioniSessione);
}

function annotaCitazione(idCit){
    var citazioniSessione = JSON.parse(sessionStorage.citazioniSessione);
    for(i = 0; i<citazioniSessione.length; i++){
        if(citazioniSessione[i].doc == $("ul.nav.nav-tabs li.active a").attr("id")){
            for(j = 0; j<citazioniSessione[i].citazioni.length; j++){
                if(citazioniSessione[i].citazioni[j].id == idCit){
                    $('textarea#selezione').html(citazioniSessione[i].citazioni[j].citazione);
                }
            }
        }
    }
    $("#modalAnnotDoc #commento").remove();
    $("#modalAnnotDoc #funzione").remove();
    sessionStorage.citazioniSessione = JSON.stringify(citazioniSessione);
    $("#modalAnnotDoc").data("id", idCit).modal("show");
    $('button#bottonemodFramm').css("display", "none");
}

// modifica annotazione presente nel grafo
function modificaAnnot(element){
    var index = $(element).closest('td').parent()[0].rowIndex-1;

    $('textarea#selezione').css("display", "none");
    $('button#bottonemodFramm').css("display", "none");

    var indexDoc = 0;
    for(i = 0; i < listaAnnotGrafo1537.length; i++){
        if(listaAnnotGrafo1537[i].url == $("ul.nav.nav-tabs li.active a").attr("id")){
            indexDoc = i;
        }
    }

    $('#modalAnnotDoc').data('azione', 'modifica');
    $('#modalAnnotDoc').data('index', index);
    $('#modalAnnotDoc').data('indexDoc', indexDoc);


    // controllo il tipo dell'annotazione, in base a quello seleziono l'opzione di quel tipo
    var tipo = typeToIta(listaAnnotGrafo1537[indexDoc].annotazioni[index].type.value);
    $('select[id="selectTipoAnnot"]').find('option:contains("'+tipo+'")').attr("selected",true).change();

    // se l'annotazione è stata fatta su un frammento mostro la textarea e il bottone e anche le opzioni commento e retorica TODO MOSTRARE FRAMMENTO
    if(listaAnnotGrafo1537[indexDoc].annotazioni[index].fs_value.value != "document"){
        $('textarea#selezione').css("display", "block");
        $('button#bottonemodFramm').css("display", "block");
        $('select[id="selectTipoAnnot"]').find('option:contains("Commento")').prop('disabled',false);
        $('select[id="selectTipoAnnot"]').find('option:contains("Funzione retorica")').prop('disabled',false);
    }
    else {
        $('textarea#selezione').css("display", "none");
        $('button#bottonemodFramm').css("display", "none");
        $('select[id="selectTipoAnnot"]').find('option:contains("Commento")').prop('disabled',true);
        $('select[id="selectTipoAnnot"]').find('option:contains("Funzione retorica")').prop('disabled',true);
    }

    // in base al tipo mostro l'oggetto dell'annotazione nell'apposito contenitore
    if(tipo == "Funzione retorica"){
        var arr = listaAnnotGrafo1537[indexDoc].annotazioni[index].body_o.value.split("#");
        $('select[id="funcRet"]').find('option:contains("'+arr[arr.length-1]+'")').attr("selected",true);
    } else if (tipo == "Anno pubblicazione"){
        $('select[id="anno"]').find('option:contains("'+listaAnnotGrafo1537[indexDoc].annotazioni[index].body_o.value+'")').attr("selected",true);
    } else if(tipo == "Commento" || tipo == "Titolo"){
        $('div.form-group textarea').text(listaAnnotGrafo1537[indexDoc].annotazioni[index].body_o.value);
    } else {
        $('div.form-group input').val(listaAnnotGrafo1537[indexDoc].annotazioni[index].body_o.value);
    }

    $('#modalAnnotDoc').modal('show');
}

function cancellaAnnotGrafo(element){
    var index = $(element).closest('td').parent()[0].rowIndex-1;
    var indexDoc = 0;
    for(i = 0; i < listaAnnotGrafo1537.length; i++){
        if(listaAnnotGrafo1537[i].url == $("ul.nav.nav-tabs li.active a").attr("id")){
            indexDoc = i;
        }
    }


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
        /* Invia annotazioni del documento corrente da salvare */
        var listaNuoveAnnotazioni = {"annotazioni":[]};
        annotazioniSessione = JSON.parse(sessionStorage.annotazioniSessione);
        for(i = 0; i<annotazioniSessione.length; i++){
            if(annotazioniSessione[i].doc == $("ul.nav.nav-tabs li.active a").attr("id")){
                for(j = 0; j<annotazioniSessione[i].annotazioni.length; j++){
                    annotazioneSingola = {};
                    annotazioneSingola["tipo"] = annotazioniSessione[i].annotazioni[j].tipo;
                    annotazioneSingola["data"] = annotazioniSessione[i].annotazioni[j].data;
                    annotazioneSingola["target"] = annotazioniSessione[i].annotazioni[j].target;
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


        /* Invia citazioni del documento corrente da salvare */ //TODO inviare annotazioni
//        var listaNuoveCitazioni = {"citazioni":[]};
//        citazioniSessione = JSON.parse(sessionStorage.citazioniSessione);
//        for(i = 0; i<citazioniSessione.length; i++){
//            if(citazioniSessione[i].doc == $("ul.nav.nav-tabs li.active a").attr("id")){
//                for(j = 0; j<citazioniSessione[i].citazioni.length; j++){
//                    citazioneSingola = {};
//                    citazioneSingola["data"] = citazioniSessione[i].citazioni[j].data;
//                    citazioneSingola["citazione"] = citazioniSessione[i].citazioni[j].citazione;
//                    citazioneSingola["source"] = citazioniSessione[i].citazioni[j].source;
//                    citazioneSingola["id"] = citazioniSessione[i].citazioni[j].idFrammento;
//                    citazioneSingola["start"] = citazioniSessione[i].citazioni[j].start;
//                    citazioneSingola["end"] = citazioniSessione[i].citazioni[j].end;
//                    citazioneSingola["provenance"] = citazioniSessione[i].citazioni[j].autore;
//                    citazioneSingola["oggetto"] = citazioniSessione[i].citazioni[j].source+'_cited[n]'; //TODO aggiungere oggetto
//
//                    listaNuoveCitazioni.citazioni.push(citazioneSingola);
//                }
//            }
//        }
//        console.log(listaNuoveCitazioni)
//        sessionStorage.citazioniSessione = JSON.stringify(citazioniSessione);
        $('#modalGestAnnotazioni').modal('hide');
        //invia listaNuoveAnnotazioni + listaNuoveCitazioni

    });

    /* Modifica annotazioni localmente */
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
        var tipo = $('#modalConfermaEliminazione').data('tipo');
        if(tipo == 0){
            var id = $('#modalConfermaEliminazione').data('id');
            eliminaAnnotazione(id)
        }else{
            var id = $('#modalConfermaEliminazione').data('id');
            eliminaCitazione(id)
        }
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
            var citazioniSessione = JSON.parse(sessionStorage.citazioniSessione);
            for(i = 0; i<citazioniSessione.length; i++){
                if(citazioniSessione[i].doc == $("ul.nav.nav-tabs li.active a").attr("id")){
                    for(j = 0; j<citazioniSessione[i].citazioni.length; j++){
                        if(citazioniSessione[i].citazioni[j].id == idCit){
                            citazioniSessione[i].citazioni[j].citazione = $("#selectCit").find(":selected").text();
                            citazioniSessione[i].citazioni[j].data = getDateTime();
                            citazioniSessione[i].citazioni[j].idFrammento = '';
                            citazioniSessione[i].citazioni[j].start = '';
                            citazioniSessione[i].citazioni[j].end = '';

                            $('[data-id="' + idCit + '"]').children().filter(':nth-child(2)').html(citazioniSessione[i].citazioni[j].data.replace("T", " "));
                            $('[data-id="' + idCit + '"]').children().filter(':nth-child(3)').html(citazioniSessione[i].citazioni[j].citazione);
                            $('#modalAnnotCit').modal('hide');
                        }
                    }
                }
            }
            sessionStorage.citazioniSessione = JSON.stringify(citazioniSessione);
            $('#modalAnnotCit').removeData('idCit');
            $('#modalAnnotCit h3').html("Inserisci citazione");
        }else{ //inserisci citazione
            var citazioniSessione = JSON.parse(sessionStorage.citazioniSessione);
            //Costruisce annotazione locale
            var citazione = {};
            citazione['id'] = Math.random();
            citazione['tipo'] = "Citazione";
            citazione['data'] = getDateTime();
            citazione['idFrammento'] = '';
            citazione['start'] = '';
            citazione['end'] = '';
            citazione['citazione'] = $("#selectCit").find(":selected").text();
            citazione['source'] = $('.active a').attr('id');
            citazione['autore'] = sessionStorage.email;


            /* Verifica che non ci sia gia l'entry per il documento */
            var citazioniSessione = JSON.parse(sessionStorage.citazioniSessione);
            if(citazioniSessione.length == 0){
                //l'oggetto è vuoto -> inserisco la citazione
                var citazioniDoc = {};
                citazioniDoc['doc'] = $("ul.nav.nav-tabs li.active a").attr("id");
                citazioniDoc['citazioni'] = [];
                citazioniDoc['citazioni'].push(citazione);
                citazioniSessione.push(citazioniDoc);
            }else{
                for(i = 0; i<citazioniSessione.length; i++){
                    if(citazioniSessione[i].doc == $("ul.nav.nav-tabs li.active a").attr("id")){
                        citazioniSessione[i].citazioni.push(citazione)
                        break;
                    }else{
                        citazioniDoc = {};
                        citazioniDoc['doc'] = $("ul.nav.nav-tabs li.active a").attr("id");
                        citazioniDoc['annotazioni'] = [];
                        citazioniDoc['annotazioni'].push(citazione);
                        citazioniSessione.push(citazioniDoc);
                        break;
                    }
                }
            }
            sessionStorage.citazioniSessione = JSON.stringify(citazioniSessione);
            console.log(citazioniSessione)
            $("#modalAnnotCit").modal("hide");
        }

    });




});