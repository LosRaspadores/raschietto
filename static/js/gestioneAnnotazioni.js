/* Variabile contenente le informazioni sull'annotazione corrente (da modificare) */
annotazioneCorrente = [];

/* Variabile contenente le informazioni della selezione di un frammento di testo (path, startOffset, endOffsett, selezione) */
oggettoSelezionato = {};

function verificaTab(){
    var path = '';
    var start = '';
    var end = '';
    var selezione = '';
    $('#modalAnnotDoc h3').html("Inserisci annotazione");
    if($("ul.nav.nav-tabs li.active a").attr("id") != 'homeTab'){
        $('button#bottonemodFramm').css("display", "none");
        var frammentoSelezionato = verificaFrammento();
        if(!frammentoSelezionato){
            $('#selezione').css('display', 'none');
            $('select[id="selectTipoAnnot"]').find('option:contains("Commento")').prop('disabled',true);
            $('select[id="selectTipoAnnot"]').find('option:contains("Funzione retorica")').prop('disabled',true);

            $('#modalAnnotDoc').data("path", "document");
            $('#modalAnnotDoc').data("start", "document");
            $('#modalAnnotDoc').data("end", "document");
            $('#modalAnnotDoc').data("selezione", "document");

            $('#modalTipoAnnotazione').modal('show');
        }else{
            path = frammentoSelezionato.id;
            start = frammentoSelezionato.inizio;
            end = frammentoSelezionato.fine;
            selezione = frammentoSelezionato.selezione;
            //apri modale per inserire annotazione sul frammento
            $('#selezione').css('display', 'block');
            $('select[id="selectTipoAnnot"]').find('option:contains("Commento")').prop('disabled',false);
            $('select[id="selectTipoAnnot"]').find('option:contains("Funzione retorica")').prop('disabled',false);

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
    //Se seleziona uno span con classe che inzia con 'highlight' -> � un frammento gi� annotato !
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
        for (var i = 0; i < children.length; i++) {
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
        if(typeof($('#modalAnnotDoc').data("indexDoc")) != "undefined"){ // modifica annotazioni del grafo
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

            if(typeof(oggettoSelezionato.id) != "undefined"){
                annot['update']['path'] = oggettoSelezionato.id;
                annot['update']['start_fragm'] = oggettoSelezionato.inizio;
                annot['upgrade']['end_fragm'] = oggettoSelezionato.fine;
            }
            annotazioniGrafoSessione = JSON.parse(sessionStorage.annotModificSessione);
//            for(i = 0; i < annotazioniGrafoSessione; i++){
//                if(annotazioniGrafoSessione[i].)
//            }
        } else{
            /* Modifica annotazione locale */
            var idAnn = $('#modalAnnotDoc').data("id"); //id annotazione locale che sto modificando

            annotazioniSessione = JSON.parse(sessionStorage.annotazioniSessione);
            for(i = 0; i<annotazioniSessione.length; i++){
                if(annotazioniSessione[i].doc == $("ul.nav.nav-tabs li.active a").attr("id")){
                    for(j = 0; j<annotazioniSessione[i].annotazioni.length; j++){
                        if(annotazioniSessione[i].annotazioni[j].id == idAnn){

                            if(oggettoSelezionato["frammento"] != 'document'){ //Modifica ann su frammento
                                if(typeof(oggettoSelezionato.selezione) != 'undefined'){ //Il frammento � stato modificato
                                    annotazioniSessione[i].annotazioni[j].selezione = oggettoSelezionato.selezione;
                                    annotazioniSessione[i].annotazioni[j].idFrammento = oggettoSelezionato.id;
                                    annotazioniSessione[i].annotazioni[j].start = oggettoSelezionato.inizio;
                                    annotazioniSessione[i].annotazioni[j].end = oggettoSelezionato.fine;
                                }
                            }
                            annotazioniSessione[i].annotazioni[j].oggetto = testo;
                            annotazioniSessione[i].annotazioni[j].tipo = tipo;
                            annotazioniSessione[i].annotazioni[j].data = getDateTime();

                            $('[data-id="' + idAnn + '"]').children().filter(':nth-child(2)').html(annotazioniSessione[i].annotazioni[j].data.replace("T", " "));
                            $('[data-id="' + idAnn + '"]').children().filter(':nth-child(3)').html(testo);
                            var classCSS = getClassNameType(tipo);
                            var col = '<span class="glyphicon glyphicon-tint label' + classCSS.substring(9, classCSS.length)+ '"></span>';
                            var tagTipo = '<td>'+col+' '+ tipo+'</td>'
                            $('[data-id="' + idAnn + '"]').children().filter(':nth-child(1)').html(tagTipo);
                            $('#modalAnnotDoc').modal('hide');
                        }
                    }
                }
            }
            sessionStorage.annotazioniSessione = JSON.stringify(annotazioniSessione);
       }
       oggettoSelezionato = {}; //svuota l'oggetto dopo la modifica

    } else {

        /* Inserimento di un'annotazione o di un'annotazione su una citazione */
        var source = $('.active a').attr('id');
        var idFrammento = $('#modalAnnotDoc').data("path");
        var startOffset = $('#modalAnnotDoc').data("start");
        var endOffset = $('#modalAnnotDoc').data("end");
        var selezione = $('#modalAnnotDoc').data("selezione");

        if(typeof($('#modalAnnotDoc').data("annotaCitazione")) != "undefined"){
            alert("INSERT ANNOT SU CIT - idCit dev essere un numero: "+$('#modalAnnotDoc').data("id"))
            source += '_ver1_cited[n]' //TODO passargli queste cose <---------------------------------
        }
        var idAnn = costruisciAnnotazione(source, tipo, testo, idFrammento, startOffset, endOffset, selezione);

        /* Se l'annotazione � su una citazioni, la inserisco dinamicamente nel modal */
        if(typeof($('#modalAnnotDoc').data("annotaCitazione")) != "undefined"){
            alert("INSERT ANNOT SU CIT - idCit dev essere un numero: "+$('#modalAnnotDoc').data("id"))
            //var idCit = $('#modalAnnotDoc').data("id");
            classCSS = getClassNameType(tipo);
            col = '<span class="glyphicon glyphicon-tint label' + classCSS.substring(9, classCSS.length)+ '"></span>';
            tr = '<tr data-id="'+idAnn+'"><td>'+col+' '+classCSS.substring(9, classCSS.length)+'</td><td>'+getDateTime().replace("T", " ")+'</td><td>'+testo+'</td><td><span class="glyphicon glyphicon-edit" onclick="modificaAnnotazioneLocale('+idAnn+')" data-toggle="tooltip" title="Modifica annotazione"></span><span onclick="eliminaAnnotazioneLocale('+idAnn+')" class="glyphicon glyphicon-trash" data-toggle="tooltip" title="Elimina annotazione"></span></td></tr>';

            $('#modalGestAnnotazioni div#annotazioniInserite tbody').append(tr);
        }

        $('#modalAnnotDoc').removeData("path");
        $('#modalAnnotDoc').removeData("start");
        $('#modalAnnotDoc').removeData("end");
        $('#modalAnnotDoc').removeData("selezione");
        $('#modalAnnotDoc').removeData("annotaCitazione");

    }
    $('#modalAnnotDoc').modal('hide');

});

/* Rimuove annotazioni inserite e non ancora salvate */ //TODO PER ANNOTAZIONI PRESENTI
function eliminaAnnotazioneLocale(id){
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
    var tipo = '';
    var annotazioniSessione = JSON.parse(sessionStorage.annotazioniSessione);
    for(i = 0; i < annotazioniSessione.length; i++){
        if(annotazioniSessione[i].doc == $("ul.nav.nav-tabs li.active a").attr("id")){
            for(j = 0; j<annotazioniSessione[i].annotazioni.length; j++){
                if(annotazioniSessione[i].annotazioni[j].id == id){
                    tipo = annotazioniSessione[i].annotazioni[j].tipo;
                    if(tipo != 'Citazione'){ //sto modificando un'annotazione
                        var oggettoAnnotazione = annotazioniSessione[i].annotazioni[j].oggetto;
                        $('select[id="selectTipoAnnot"]').find('option:contains("'+tipo+'")').attr("selected",true).change();
                        // in base al tipo mostro l'oggetto dell'annotazione nell'apposito contenitore
                        if(tipo == "Funzione retorica"){
                            $('select[id="funcRet"]').find('option:contains("'+oggettoAnnotazione+'")').attr("selected",true);
                        } else if (tipo == "Anno pubblicazione"){
                            $('select[id="anno"]').find('option:contains("'+oggettoAnnotazione+'")').attr("selected",true);
                        } else if(tipo == "Commento" || tipo == "Titolo"){
                            $('div.form-group textarea').val(oggettoAnnotazione); //TODO sbarella
                        } else {
                            $('div.form-group input').val(oggettoAnnotazione);
                        }
                        /* Modifica di un'annotazione con frammento */

                        if(annotazioniSessione[i].annotazioni[j].selezione != 'document'){

                            if(annotazioniSessione[i].annotazioni[j].source.indexOf("_cited[") > -1){ //ann su cit
                                $('textarea#selezione').css("display", "block");
                                $('select[id="selectTipoAnnot"]').find('option:contains("Commento")').prop('disabled',false);
                                $('select[id="selectTipoAnnot"]').find('option:contains("Funzione retorica")').prop('disabled',false);

                                $('#modalAnnotDoc textarea').html(annotazioniSessione[i].annotazioni[j].selezione);
                            }else{ //annotazione semplice
                                $('textarea#selezione').css("display", "block");
                                $('button#bottonemodFramm').css("display", "block");
                                $('select[id="selectTipoAnnot"]').find('option:contains("Commento")').prop('disabled',false);
                                $('select[id="selectTipoAnnot"]').find('option:contains("Funzione retorica")').prop('disabled',false);

                                $('#modalAnnotDoc textarea').html(annotazioniSessione[i].annotazioni[j].selezione);
                            }

                        }else{ /* Modifica di un'annotazione sul documento */
                            oggettoSelezionato["frammento"] = 'document';

                            $('textarea#selezione').css("display", "none");
                            $('button#bottonemodFramm').css("display", "none");
                            $('select[id="selectTipoAnnot"]').find('option:contains("Commento")').prop('disabled',true);
                            $('select[id="selectTipoAnnot"]').find('option:contains("Funzione retorica")').prop('disabled',true);
                        }

                        $('#modalAnnotDoc h3').html("Modifica annotazione");
                        $('#modalAnnotDoc').data("azione", "modifica");
                        $('#modalAnnotDoc').data('id', id).modal('show');

                    }else{ //sto modificando una citazione (si apre il modal per le citazioni)
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



function modificaSelezione(){
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
        annotazioneCorrente["tipo"] = tipo;
        annotazioneCorrente["oggetto"] = testo;

    if(typeof($('#modalAnnotDoc').data('id'))!= "undefined"){
        annotazioneCorrente["id"] = $('#modalAnnotDoc').data('id');
    }else{
        annotazioneCorrente["index"] =  $('#modalAnnotDoc').data('index');
        annotazioneCorrente["indexDoc"] = $('#modalAnnotDoc').data('indexDoc');
    }
    $('#modalGestAnnotazioni').modal('hide');
    $('#modalAnnotDoc').modal('hide');

    var idTab = $("ul.nav.nav-tabs li.active a").attr("href").substr(1);
    $("#"+idTab).prepend($("#bottoniModificaSelezione"));
    $("#bottoniModificaSelezione").css("display", "block");
}

function aggiornaAnnotazione(){ // bottone che sta fermo

    var tipo = annotazioneCorrente["tipo"];
    var oggetto = annotazioneCorrente["oggetto"]; //TODO � sbagliato ! prende la selezione anzich� l'oggetto

    //prendere tipo e oggetto
    $('select[id="selectTipoAnnot"]').find('option:contains("'+tipo+'")').attr("selected",true).change();
    // in base al tipo mostro l'oggetto dell'annotazione nell'apposito contenitore
    if(tipo == "Funzione retorica"){
        $('select[id="funcRet"]').find('option:contains("'+oggetto+'")').attr("selected",true);
    } else if (tipo == "Anno pubblicazione"){
        $('select[id="anno"]').find('option:contains("'+oggetto+'")').attr("selected",true);
    } else if(tipo == "Commento" || tipo == "Titolo"){
        $('div.form-group textarea').val(oggetto);
    } else {
        $('div.form-group input').val(oggetto);
    }

    obj = verificaFrammento();
    if(!obj){
        $('#alertMessage').text("Nessun frammento selezionato.");
        $('#alertDoc').modal('show');
    }else{
        oggettoSelezionato = obj;
        $("modalAnnotDoc textarea#selezione").html(obj.selezione);
        $('#modalAnnotDoc').data("azione", "modifica");

        if(typeof(annotazioneCorrente["id"]) != "undefined"){
            $('#modalAnnotDoc').data("id", annotazioneCorrente["id"]);
        } else {
            $('#modalAnnotDoc').data("index", annotazioneCorrente["index"]);
            $('#modalAnnotDoc').data("indexDoc", annotazioneCorrente["indexDoc"]);
        }
        $("#bottoniModificaSelezione").css("display", "none");
        $('#modalAnnotDoc').modal('show');
    }
}

/* Metodo per annotare una citazione */
function annotaCitazione(idCit){
    var annotazioniSessione = JSON.parse(sessionStorage.annotazioniSessione);
    //TODO prendere queste cose
    var pathCit = 'pathCit';
    var startCit = 'startCit';
    var endCit = 'endCit';
    var oggettoCitazione = '';
    for(var i = 0; i < annotazioniSessione.length; i++){
        if(annotazioniSessione[i].doc == $("ul.nav.nav-tabs li.active a").attr("id")){
            for(var j = 0; j < annotazioniSessione[i].annotazioni.length; j++){
                if(annotazioniSessione[i].annotazioni[j].id == idCit){
                    $('textarea#selezione').html(annotazioniSessione[i].annotazioni[j].oggetto);
                    oggettoCitazione = annotazioniSessione[i].annotazioni[j].oggetto;
                }
            }
        }
    }
    $('button#bottonemodFramm').css("display", "none");
    sessionStorage.annotazioniSessione = JSON.stringify(annotazioniSessione);
    $("#modalAnnotDoc").data("path", pathCit);
    $("#modalAnnotDoc").data("start", startCit);
    $("#modalAnnotDoc").data("end", endCit);
    $("#modalAnnotDoc").data("selezione", 'qui andr� il testo della citazione');
    $("#modalAnnotDoc").data("annotaCitazione", idCit); //passo questo parametro cosi capisco che sto annotando una citazione

    $('#modalAnnotDoc h3').html("Inserisci annotazione");
    $("#modalAnnotDoc").modal("show");
}

function costruisciAnnotazione(source, tipo, testo, idFrammento, start, end, selezione){
    //Costruisce annotazione locale
    var singolaAnnotazione = {};
    var idAnn = Math.random();
    singolaAnnotazione['id'] = idAnn;
    singolaAnnotazione['tipo'] = tipo;
    singolaAnnotazione['data'] = getDateTime();
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
        //l'oggetto � vuoto -> inserisco l'annotazione
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

    // se l'annotazione � stata fatta su un frammento mostro la textarea e il bottone e anche le opzioni commento e retorica TODO MOSTRARE FRAMMENTO
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
        $('div.form-group textarea').val(listaAnnotGrafo1537[indexDoc].annotazioni[index].body_o.value);
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

    /* Bottoni associati alla modifica del frammento di un'annotazione */
    $("#bottonemodFramm").click(function(){
        modificaSelezione()
    });
    $("#confermaModificaSelezione").click(function(){
        aggiornaAnnotazione()
    });
    $("#annullaModificaSelezione").click(function(){
        $("#bottoniModificaSelezione").css("display", "none");
    });


    /* Salvare sul grafo annotazioni e citazioni inserite localmente */
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
                    annotazioneSingola["oggetto"] = annotazioniSessione[i].annotazioni[j].oggetto;
                    annotazioneSingola["source"] = annotazioniSessione[i].annotazioni[j].source;
                    annotazioneSingola["id"] = annotazioniSessione[i].annotazioni[j].idFrammento;
                    annotazioneSingola["start"] = annotazioniSessione[i].annotazioni[j].start;
                    annotazioneSingola["end"] = annotazioniSessione[i].annotazioni[j].end;
                    annotazioneSingola["provenance"] = annotazioniSessione[i].annotazioni[j].autore;

                    listaNuoveAnnotazioni.annotazioni.push(annotazioneSingola);
                }
                annotazioniSessione.splice(i,1); //rimuove l'oggetto in locale contenente le annotazioni del documento
            }
        }
        console.log(listaNuoveAnnotazioni)
        sessionStorage.annotazioniSessione = JSON.stringify(annotazioniSessione);
        $('#modalGestAnnotazioni').modal('hide');
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


     /* Abilita il bottone di salvataggio quando si apre un modal e i campi sono gia riempiti */
     $("#modalAnnotDoc").on('shown.bs.modal', function(){
        var checkAutore = $('#autore').val().length != 0;
        var checkAnno = $('#anno').find(":selected").text().length != 0;
        var checkTitolo = $('#titolo').val().length != 0;
        var checkUrl = $('#url').val() != '';
        var checkDoi = $('#doi').val().length != 0;
        var checkComm = $('#comm').val().length != 0;
        var checkFun = $('#funcRet').find(":selected").text().length != 0;
        if(checkAutore || checkAnno || checkTitolo || checkUrl || checkDoi || checkComm || checkFun){
            $('#salvaInsert').removeAttr('disabled', 'disabled');
        }
    });

     /* Gestione citazioni -> abilita il bottone di salvataggio solo se � selezionata una citazione */
     $(document).on('change', '#selectCit', function(){
         if($("#selectCit").find(":selected").text().length != 0){
            $("#salvaInsertCit").removeAttr('disabled', 'disabled');
         }else{
            $("#salvaInsertCit").attr('disabled', 'disabled');
         }
     });


    /* Salva le citazioni inserite in locale */
    $("#salvaInsertCit").click(function(){

        /* Modifica citazione */
        if($("#modalAnnotCit").data('idCit') != undefined){
            var idCit = $("#modalAnnotCit").data('idCit');
            var annotazioniSessione = JSON.parse(sessionStorage.annotazioniSessione);
            for(i = 0; i<annotazioniSessione.length; i++){
                if(annotazioniSessione[i].doc == $("ul.nav.nav-tabs li.active a").attr("id")){
                    for(j = 0; j<annotazioniSessione[i].annotazioni.length; j++){
                        if(annotazioniSessione[i].annotazioni[j].id == idCit){
                            annotazioniSessione[i].annotazioni[j].oggetto = $("#selectCit").find(":selected").text();
                            annotazioniSessione[i].annotazioni[j].data = getDateTime();
                            //TODO andare a cercare queste nuove informazioni
                            annotazioniSessione[i].annotazioni[j].idFrammento = 'nuovoPathCit';
                            annotazioniSessione[i].annotazioni[j].start = 'nuovoStartCit';
                            annotazioniSessione[i].annotazioni[j].end = 'nuovoEndCit';

                            $('[data-id="' + idCit + '"]').children().filter(':nth-child(2)').html(annotazioniSessione[i].annotazioni[j].data.replace("T", " "));
                            $('[data-id="' + idCit + '"]').children().filter(':nth-child(3)').html(annotazioniSessione[i].annotazioni[j].oggetto);

                            sessionStorage.annotazioniSessione = JSON.stringify(annotazioniSessione);
                            $('#modalAnnotCit').removeData('idCit');
                            $('#modalAnnotCit').modal('hide');
                            $('#modalAnnotCit h3').html("Inserisci citazione");
                            break;
                        }
                    }
                }
            }
        }else{
            /* Inserisci citazione */
            //costruisciAnnotazione(source, tipo, valore, idFrammento, start, end, testoSelezionato)
            costruisciAnnotazione($("ul.nav.nav-tabs li.active a").attr("id"), 'Citazione', $("#selectCit").find(":selected").text(), 'pathCitazione', 'startCitazione', 'endCitazione', 'testo citazione');

            $("#modalAnnotCit").modal("hide");
        }

    });


    $("#modalAnnotDoc").on('hidden.bs.modal', function () {
        $(this).removeData('id');
        $(this).removeData('index');
        $(this).removeData('indexDoc');
        $(this).removeData('azione');
        $(this).removeData('path');
        $(this).removeData('inizio');
        $(this).removeData('fine');

        //TODO svuotare i campi del modal quando si chiudono
        $("#autore").val('').end();
        $("#anno").val('').end();
        $("#titolo").val('').end();
        $("#url").val('').end();
        $("#doi").val('').end();
        $("#comm").val('').end();
        $("#funcRet").val('').end();
    });


});