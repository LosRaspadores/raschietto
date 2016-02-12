/* Variabile contenente le informazioni sull'annotazione corrente (da modificare) */
annotInfoTemp = {}; // info annotazione corrente quando si vuole moficare il frammento
oggettoSelezionato = {}; // nuova selezione di frammento
annotazioneModificata = {}; // annotazione che si vuole modificare
annotazioneCitazione = {}; // citazione su cui si vuole aggiungere un'annotazione
listaQueryDaInviare = []; // lista di query da inviare al server

/* Variabile contenente le informazioni di un'annotazione da inserire (path, start, end, id)*/
infoAnnotazioneDaInserire = [];

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
            $('textarea#selezione').css('display', 'none');
            $('select[id="selectTipoAnnot"]').find('option:contains("Commento")').prop('disabled',true);
            $('select[id="selectTipoAnnot"]').find('option:contains("Funzione retorica")').prop('disabled',true);

            infoAnnotazioneDaInserire["path"] = "document";
            infoAnnotazioneDaInserire["start"] = "document";
            infoAnnotazioneDaInserire["end"] = "document";
            infoAnnotazioneDaInserire["selezione"] = "document";

            $('#modalTipoAnnotazione').modal('show');
        }else{
            path = frammentoSelezionato.id;
            start = frammentoSelezionato.inizio;
            end = frammentoSelezionato.fine;
            selezione = frammentoSelezionato.selezione;
            //apri modale per inserire annotazione sul frammento
            $('#selezione').val(selezione)
            $('#selezione').css('display', 'block');
            $('select[id="selectTipoAnnot"]').find('option:contains("Commento")').prop('disabled',false);
            $('select[id="selectTipoAnnot"]').find('option:contains("Funzione retorica")').prop('disabled',false);

            infoAnnotazioneDaInserire["path"] = path;
            infoAnnotazioneDaInserire["start"] = start;
            infoAnnotazioneDaInserire["end"] = end;
            infoAnnotazioneDaInserire["selezione"] = selezione;

            $('#modalAnnotDoc').modal('show');
        }
    }
}

/* Ottiene il dominio del documento corrente */
function getHostname(url) {
    var m = url.match(/^http:\/\/[^/]+/);
    return m ? m[0] : null;
}

function verificaFrammento(){
    selection = rangy.getSelection();
    if(selection.toString() != ""){
        alert(selection.toString());
        var range = selection.getRangeAt(0);
        var bookmark = selection.getBookmark(range.commonAncestorContainer).rangeBookmarks[0]; //getBookmark->obj con start e end - commonAncestorContainer->nodo più in profondità
        var container = bookmark.containerNode; //nodo contenente la selezione
        startOffset = bookmark.start;
        endOffset = bookmark.end;
        if (container.nodeType == 3) { //container: [Object text]
            var temp = container.parentNode; //nodo selezione

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
/* Permette di costruire il path della selezione, fino al più piccolo elemento, escludendo gli span di evidenziazione delle annotazioni */
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
/* Preso in input un nodo */
function getTextNodes(node) { //=container.parentNode
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

/* Rimuove annotazioni inserite e non ancora salvate */ //TODO PER ANNOTAZIONI PRESENTI
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
                        $('select[id="selectTipoAnnot"]').find('option:contains("'+tipo+'")').prop("selected",true).change();
                        // in base al tipo mostro l'oggetto dell'annotazione nell'apposito contenitore
                        if(tipo == "Funzione retorica"){
                            $('select[id="funcRet"]').find('option:contains("'+oggettoAnnotazione+'")').prop("selected",true);
                        } else if (tipo == "Anno pubblicazione"){
                            $('select[id="anno"]').find('option:contains("'+oggettoAnnotazione+'")').prop("selected",true);
                        } else if(tipo == "Commento" || tipo == "Titolo"){
                            $('div.form-group textarea').val(oggettoAnnotazione);
                        } else {
                            $('div.form-group input').val(oggettoAnnotazione);
                        }
                        /* Modifica di un'annotazione con frammento */

                        if(annotazioniSessione[i].annotazioni[j].selezione != 'document'){

                            if(annotazioniSessione[i].annotazioni[j].source.indexOf("_cited[") > -1){ //ann su cit
                                $('textarea#selezione').css("display", "block");
                                $('button#bottonemodFramm').css("display", "none");
                                $('select[id="selectTipoAnnot"]').find('option:contains("Commento")').prop('disabled',false);
                                $('select[id="selectTipoAnnot"]').find('option:contains("Funzione retorica")').prop('disabled',false);

                                $('#modalAnnotDoc textarea#selezione').val(annotazioniSessione[i].annotazioni[j].selezione);
                            }else{ //annotazione semplice
                                $('textarea#selezione').css("display", "block");
                                $('button#bottonemodFramm').css("display", "block");
                                $('select[id="selectTipoAnnot"]').find('option:contains("Commento")').prop('disabled',false);
                                $('select[id="selectTipoAnnot"]').find('option:contains("Funzione retorica")').prop('disabled',false);

                                $('#modalAnnotDoc textarea#selezione').val(annotazioniSessione[i].annotazioni[j].selezione);
                            }

                        }else{ /* Modifica di un'annotazione sul documento */

                            $('textarea#selezione').css("display", "none");
                            $('button#bottonemodFramm').css("display", "none");
                            $('select[id="selectTipoAnnot"]').find('option:contains("Commento")').prop('disabled',true);
                            $('select[id="selectTipoAnnot"]').find('option:contains("Funzione retorica")').prop('disabled',true);
                        }

                        $('#modalAnnotDoc h3').html("Modifica annotazione");
                        $('#modalAnnotDoc').data("azione", "modifica");
                        $('#modalAnnotDoc').data('id', id).modal('show');

                    }else{ //sto modificando una citazione (si apre il modal per le citazioni)
                        //getCitazioni($("ul.nav.nav-tabs li.active a").attr("id"));
                        $("#modalAnnotCit h3").html("Modifica citazione");
                        $("#modalAnnotCit").data('idCit', id).modal("show");
                    }
                }

            }
        }
    }
    sessionStorage.annotazioniSessione = JSON.stringify(annotazioniSessione);
}


/* Funzione chiamata quando si preme il bottone per modificare il frammento dell'annotazione */
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
        annotInfoTemp["tipo"] = tipo;
        annotInfoTemp["oggetto"] = testo;

    if(typeof($('#modalAnnotDoc').data('id'))!= "undefined"){
        annotInfoTemp["id"] = $('#modalAnnotDoc').data('id');
    }else{
        annotInfoTemp["index"] =  $('#modalAnnotDoc').data('index');
        annotInfoTemp["indexDoc"] = $('#modalAnnotDoc').data('indexDoc');
    }
    $('#modalGestAnnotazioni').modal('hide');
    $('#modalAnnotDoc').modal('hide');

    var idTab = $("ul.nav.nav-tabs li.active a").attr("href").substr(1);
    $("#"+idTab).prepend($("#bottoniModificaSelezione"));
    $("#bottoniModificaSelezione").css("display", "block");
}

function aggiornaAnnotazione(azione){ // funzione che viene richiamata quando viene premuto il bottone conferma

    var tipo = annotInfoTemp["tipo"];
    var oggetto = annotInfoTemp["oggetto"];

    //prendere tipo e oggetto
    $('select[id="selectTipoAnnot"]').find('option:contains("'+tipo+'")').prop("selected",true).change();
    // in base al tipo mostro l'oggetto dell'annotazione nell'apposito contenitore
    if(tipo == "Funzione retorica"){
        $('select[id="funcRet"]').find('option:contains("'+oggetto+'")').prop("selected",true);
    } else if (tipo == "Anno pubblicazione"){
        $('select[id="anno"]').find('option:contains("'+oggetto+'")').prop("selected",true);
    } else if(tipo == "Commento" || tipo == "Titolo"){
        $('div.form-group textarea').val(oggetto);
    } else {
        $('div.form-group input').val(oggetto);
    }
    /* Se l'utente ha confermato una nuova selezione oppure no - tramite i due bottoni aggiunti */
    if(azione == 'confermaSelezione'){
        var obj = verificaFrammento();
        if(!obj){
            $('#alertMessage').text("Nessun frammento selezionato.");
            $('#alertDoc').modal('show');
        }else{
            oggettoSelezionato = obj;
            $("textarea#selezione").val(obj.selezione);
            $('#modalAnnotDoc').data("azione", "modifica");

            if(typeof(annotInfoTemp["id"]) != "undefined"){
                $('#modalAnnotDoc').data("id", annotInfoTemp["id"]);
            }
            $("#bottoniModificaSelezione").css("display", "none");
            $('#modalAnnotDoc').modal('show');
        }
    }else{
        $('#modalAnnotDoc').data("azione", "modifica");

        if(typeof(annotInfoTemp["id"]) != "undefined"){
            $('#modalAnnotDoc').data("id", annotInfoTemp["id"]);
        }
        $("#bottoniModificaSelezione").css("display", "none");
        $('#modalAnnotDoc').modal('show');
    }
}

/* Metodo per annotare una citazione */
function annotaCitazione(idCit){
    var annotazioniSessione = JSON.parse(sessionStorage.annotazioniSessione);
    var pathCit = '';
    var startCit = '';
    var endCit = '';
    var selezione = '';
    var indiceCitazione = '';
    for(var i = 0; i < annotazioniSessione.length; i++){
        if(annotazioniSessione[i].doc == $("ul.nav.nav-tabs li.active a").attr("id")){
            for(var j = 0; j < annotazioniSessione[i].annotazioni.length; j++){
                if(annotazioniSessione[i].annotazioni[j].id == idCit){
                    $('textarea#selezione').val(annotazioniSessione[i].annotazioni[j].oggetto);
                    pathCit = annotazioniSessione[i].annotazioni[j].idFrammento;
                    startCit = annotazioniSessione[i].annotazioni[j].start;
                    endCit = annotazioniSessione[i].annotazioni[j].end;
                    var ogg = annotazioniSessione[i].annotazioni[j].oggetto;
                    selezione = ogg.substring(0, (ogg.length)-1);
                    indiceCitazione = ogg.substring((ogg.length)-1, ogg.length);
                }
            }
        }
    }
    $('textarea#selezione').css("display", "block");
    $('button#bottonemodFramm').css("display", "none");
    sessionStorage.annotazioniSessione = JSON.stringify(annotazioniSessione);

    infoAnnotazioneDaInserire["path"] = pathCit;
    infoAnnotazioneDaInserire["start"] = startCit;
    infoAnnotazioneDaInserire["end"] = endCit;
    infoAnnotazioneDaInserire["selezione"] = selezione;
    infoAnnotazioneDaInserire["annotaCitazione"] = indiceCitazione; //passo questo parametro cosi capisco che sto annotando una citazione

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
        //l'oggetto è vuoto -> inserisco l'annotazione
        var annotazioniDoc = {};
        annotazioniDoc['doc'] = $("ul.nav.nav-tabs li.active a").attr("id");
        annotazioniDoc['annotazioni'] = [];
        annotazioniDoc['annotazioni'].push(singolaAnnotazione);
        annotazioniSessione.push(annotazioniDoc);
    }else{
        for(i = 0; i<annotazioniSessione.length; i++){
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
    var indexRiga = $(element).closest('tr').index();
    var index = $(element).closest('tr').attr("id");
    $('textarea#selezione').css("display", "none");
    $('button#bottonemodFramm').css("display", "none");

    var indexDoc = 0;
    var urlDoc = $("ul.nav.nav-tabs li.active a").attr("id");
    for(i = 0; i < listaAnnotGrafo1537.length; i++){
        if(listaAnnotGrafo1537[i].url == urlDoc){
            indexDoc = i;
        }
    }

    annotazioneModificata = listaAnnotGrafo1537[indexDoc].annotazioni[index];

    $('#modalAnnotDoc').data('azione', 'modifica');

    for(i = 0; i < annotazioniGrafoSessione.length; i++){
        if(annotazioniGrafoSessione[i].url == urlDoc){
            for(j = 0; j < annotazioniGrafoSessione[i].annot.length; j++){
                if(annotazioniGrafoSessione[i].annot[j].provenance.value == annotazioneModificata.provenance.value && annotazioniGrafoSessione[i].annot[j].date.value == annotazioneModificata.date.value && annotazioniGrafoSessione[i].annot[j].type.value == annotazioneModificata.type.value && annotazioniGrafoSessione[i].annot[j].body_s.value == annotazioneModificata.body_s.value){
                    annotazioneModificata = annotazioniGrafoSessione[i].annot[j];
                }
            }
        }
    }

    annotazioneModificata['index'] = index;
    annotazioneModificata['indexRiga'] = indexRiga;
    // controllo il tipo dell'annotazione, in base a quello seleziono l'opzione di quel tipo
    var tipo = typeToIta(annotazioneModificata.type.value);
    var oggetto = annotazioneModificata.body_o.value;
    var path = annotazioneModificata.fs_value.value;;
    var start = annotazioneModificata.start.value;
    var end = annotazioneModificata.end.value;
    var frammentoSelezionato = "";

    if(tipo == "Funzione retorica"){
        oggetto = gestioneRetoriche(annotazioneModificata.body_o.value);
    } else if(tipo == "Autore"){
        oggetto = annotazioneModificata.body_ol.value;
    }

    if(typeof(annotazioneModificata.update) != "undefined"){
        if(typeof(annotazioneModificata.update.tipo) != "undefined"){
            tipo = annotazioneModificata.update.tipo;
        }

        if(typeof(annotazioneModificata.update.oggetto) != "undefined"){
            oggetto = annotazioneModificata.update.oggetto;
        }

        if(typeof(annotazioneModificata.update.path) != "undefined"){

            frammentoSelezionato = annotazioneModificata.update.selezione;
        }
    }

    if(frammentoSelezionato == ""){
        frammentoSelezionato = getRangeContent(path, start, end, urlDoc);
    }

    $('select[id="selectTipoAnnot"]').find('option:contains("'+tipo+'")').prop("selected",true).change();

    // se l'annotazione è stata fatta su un frammento mostro la textarea e il bottone e anche le opzioni commento e retorica TODO MOSTRARE FRAMMENTO
    if(frammentoSelezionato != ""){        
        $('textarea#selezione').css("display", "block");
        $('textarea#selezione').val(frammentoSelezionato);
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
        $('select[id="funcRet"]').find('option:contains("'+ oggetto +'")').prop("selected",true);
    } else if (tipo == "Anno pubblicazione"){
        $('select[id="anno"]').find('option:contains("'+ oggetto +'")').prop("selected",true);
    } else if(tipo == "Commento" || tipo == "Titolo"){
        $('div.form-group textarea').val(oggetto);
    } else if (tipo == "Anno pubblicazione"){
        $('select[id="anno"]').find('option:contains("'+oggetto+'")').prop("selected",true);
    } else {
        $('div.form-group input').val(oggetto);
    }

    $('#modalAnnotDoc h3').html("Modifica annotazione");
    $('#modalAnnotDoc').modal('show');
}

// chiede conferma per la cancellazione di un'annotazione sul grafo
function confermaCancellazione(element){
    var indexRiga = $(element).closest('tr').index();
    var index = $(element).closest('tr').attr("id");
    var indexDoc = 0;
    for(i = 0; i < listaAnnotGrafo1537.length; i++){
        if(listaAnnotGrafo1537[i].url == $("ul.nav.nav-tabs li.active a").attr("id")){
            indexDoc = i;
        }
    }

    annotazioneModificata = listaAnnotGrafo1537[indexDoc].annotazioni[index];
    annotazioneModificata['index'] = index;
    annotazioneModificata['indexRiga'] = indexRiga;

    $('#modalConfermaEliminazione').modal('show');
}

function prendiInfoCitazioni(indice){ //indice è la posizione della cit nella lista, quello che poi sarà n
    var infoCitazione = {};
    infoCitazione["testo"] = listaCitazioni[indice-1].testo;
    infoCitazione["path"] = listaCitazioni[indice-1].path;
    infoCitazione["start"] = listaCitazioni[indice-1].start;
    infoCitazione["end"] = listaCitazioni[indice-1].end;
    return infoCitazione;
}

// elimina in local l'annotazione del grafo
function eliminaAnnotazioneGrafo(){
    var indexRiga = annotazioneModificata.indexRiga;
    $('#modalGestAnnotazioni #annotazioniPresenti table tbody tr:eq('+ indexRiga +')').remove();
    annotazioniGrafoSessione = JSON.parse(sessionStorage.annotModificSessione);
    var urlDoc = $("ul.nav.nav-tabs li.active a").attr("id");
    var present = false;

    if(annotazioniGrafoSessione.length == 0){
        annotazioneModificata['deleted'] = "delete";
        annotDoc = {};
        annotDoc['url'] = urlDoc;
        annotDoc['annot'] = [];
        annotDoc['annot'].push(annotazioneModificata);
        annotazioniGrafoSessione.push(annotDoc);
    } else {
        for(i = 0; i < annotazioniGrafoSessione.length; i++){
            if(annotazioniGrafoSessione[i].url == urlDoc){
                var find = false;
                for(j = 0; j < annotazioniGrafoSessione[i].annot.length; j++){
                    if(annotazioniGrafoSessione[i].annot[j].prov_email.value == annotazioneModificata.prov_email.value && annotazioniGrafoSessione[i].annot[j].date.value == annotazioneModificata.date.value && annotazioniGrafoSessione[i].annot[j].type.value == annotazioneModificata.type.value && annotazioniGrafoSessione[i].annot[j].body_s.value == annotazioneModificata.body_s.value){
                        annotazioniGrafoSessione[i].annot[j]['deleted'] = "delete";
                        find = true;
                    }
                }
                if(!find){
                    annotazioneModificata['deleted'] = "delete";
                    annotazioniGrafoSessione[i].annot.push(annotazioneModificata);
                }
                present = true;
            }
            break;
        }

        if(!present){
            annotazioneModificata['deleted'] = "delete";
            annotDoc = {};
            annotDoc['url'] = urlDoc;
            annotDoc['annot'] = [];
            annotDoc['annot'].push(annotazioneModificata);
            annotazioniGrafoSessione.push(annotDoc);
        }
    }

    sessionStorage.annotModificSessione = JSON.stringify(annotazioniGrafoSessione);
}

// fare un'annotazione su una citazione del grafo
function annotaCitazioneGrafo(element){
    var index = $(element).closest('tr').attr("id");
    var indexDoc = 0;
    for(i = 0; i < listaAnnotGrafo1537.length; i++){
        if(listaAnnotGrafo1537[i].url == $("ul.nav.nav-tabs li.active a").attr("id")){
            indexDoc = i;
        }
    }

    $('button#bottonemodFramm').css("display", "none");
    $('#modalAnnotDoc h3').html("Inserisci annotazione");
    $('textarea#selezione').css('display', 'block');
    $('textarea#selezione').val(listaAnnotGrafo1537[indexDoc].annotazioni[index].body_l.value); //TODO c'era body_ol.value

    annotazioneCitazione = listaAnnotGrafo1537[indexDoc].annotazioni[index];
    $("#modalAnnotDoc").modal("show");
}

// modifica una citazione presente nel grafo
function modificaCitazioneGrafo(element){
    var id = $(element).closest('tr').attr("id");
    getCitazioni($("ul.nav.nav-tabs li.active a").attr("id"));
    $("#modalAnnotCit h3").html("Modifica citazione");
    $("#modalAnnotCit").data('idCitGrafo', id).modal("show");
}

$(document).ready(function(){

    /* Bottoni associati alla modifica del frammento di un'annotazione */
    $("#bottonemodFramm").click(function(){
        modificaSelezione()
    });
    $("#confermaModificaSelezione").click(function(){
        aggiornaAnnotazione('confermaSelezione')
    });
    $("#annullaModificaSelezione").click(function(){
        aggiornaAnnotazione('annullaModifica')
    });

    /* Inserimento e modifica annotazione sul documento */
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
            if(typeof($('#modalAnnotDoc').data("id")) == "undefined"){ // modifica annotazioni del grafo

                var annot = annotazioneModificata;

                if(typeof(annot['update']) == "undefined"){
                    annot['update'] = {};
                }

                annot['update']['autore'] = "<mailto:" + sessionStorage.email + ">";
                annot['update']['data_mod'] = getDateTime();

                if(tipo != typeToIta(annot.type.value)){ // se il tipo selezionato nel modale e' diverso da quello dell'annotazione
                    annot['update']['tipo'] = tipo;
                    annot['update']['label_tipo'] = tipo;
                }

                if(tipo == "Funzione retorica" || typeToIta(annot.type.value) == "Funzione retorica"){
                    if(testo != gestioneRetoriche(annot.body_o.value)){
                        annot['update']['oggetto'] = testo;
                        annot['update']['label_oggetto'] = testo;
                    }
                } else {
                    if(testo != annot.body_o.value){
                        annot['update']['oggetto'] = testo;
                        annot['update']['label_oggetto'] = testo;
                    }
                }

                if(typeof(oggettoSelezionato.id) != "undefined"){
                    annot['update']['path'] = oggettoSelezionato.id;
                    annot['update']['start_fragm'] = oggettoSelezionato.inizio;
                    annot['update']['end_fragm'] = oggettoSelezionato.fine;
                    annot['update']['selezione'] = oggettoSelezionato.selezione;
                }
                annotazioniGrafoSessione = JSON.parse(sessionStorage.annotModificSessione);
                var urlDoc = $("ul.nav.nav-tabs li.active a").attr("id");
                var present = false;

                if(annotazioniGrafoSessione.length == 0){
                    annotDoc = {};
                    annotDoc['url'] = urlDoc;
                    annotDoc['annot'] = [];
                    annotDoc['annot'].push(annot);
                    annotazioniGrafoSessione.push(annotDoc);
                } else {
                    for(i = 0; i < annotazioniGrafoSessione.length; i++){
                        if(annotazioniGrafoSessione[i].url == urlDoc){
                            var find = false;
                            for(j = 0; j < annotazioniGrafoSessione[i].annot.length; j++){
                                if(annotazioniGrafoSessione[i].annot[j].provenance.value == annot.provenance.value && annotazioniGrafoSessione[i].annot[j].date.value == annot.date.value && annotazioniGrafoSessione[i].annot[j].type.value == annot.type.value && annotazioniGrafoSessione[i].annot[j].body_s.value == annot.body_s.value){
                                    annotazioniGrafoSessione[i].annot[j] = annot;
                                    find = true;
                                }
                            }
                            if(!find){
                                annotazioniGrafoSessione[i].annot.push(annot);
                            }
                            present = true;
                        }
                        break;
                    }

                    if(!present){
                        annotDoc = {};
                        annotDoc['url'] = urlDoc;
                        annotDoc['annot'] = [];
                        annotDoc['annot'].push(annot);
                        annotazioniGrafoSessione.push(annotDoc);
                    }
                }

                var ind = annot.indexRiga+1;
                var classCSS = getClassNameType(tipo);
                classCSS = classCSS.substring(9, classCSS.length);
                var colTipo = '<span class="glyphicon glyphicon-tint label' + classCSS + '"></span> '+ tipo;
                $('#modalGestAnnotazioni #annotazioniPresenti table tbody tr:nth-child('+ind+') td:nth-child(1)').html(colTipo);
                $('#modalGestAnnotazioni #annotazioniPresenti table tbody tr:nth-child('+ind+') td:nth-child(2)').html(annot.update.data_mod.replace("T", " "));
                $('#modalGestAnnotazioni #annotazioniPresenti table tbody tr:nth-child('+ind+') td:nth-child(3)').html(annot.update.oggetto);
                sessionStorage.annotModificSessione = JSON.stringify(annotazioniGrafoSessione);
            } else{
                /* Modifica annotazione locale */
                var idAnn = $('#modalAnnotDoc').data("id"); //id annotazione locale che sto modificando

                annotazioniSessione = JSON.parse(sessionStorage.annotazioniSessione);
                for(i = 0; i<annotazioniSessione.length; i++){
                    if(annotazioniSessione[i].doc == $("ul.nav.nav-tabs li.active a").attr("id")){
                        for(j = 0; j<annotazioniSessione[i].annotazioni.length; j++){
                            if(annotazioniSessione[i].annotazioni[j].id == idAnn){

                                /* Se il frammento è stato modificato, aggiorno i dati */
                                if(typeof(oggettoSelezionato.selezione) != 'undefined'){
                                    annotazioniSessione[i].annotazioni[j].selezione = oggettoSelezionato.selezione;
                                    annotazioniSessione[i].annotazioni[j].idFrammento = oggettoSelezionato.id;
                                    annotazioniSessione[i].annotazioni[j].start = oggettoSelezionato.inizio;
                                    annotazioniSessione[i].annotazioni[j].end = oggettoSelezionato.fine;
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
           annotazioneModificata = {};

        } else {

            /* Inserimento di un'annotazione o di un'annotazione su una citazione */
            var source = $('.active a').attr('id');
            var idFrammento = infoAnnotazioneDaInserire["path"];
            var startOffset = infoAnnotazioneDaInserire["start"];
            var endOffset = infoAnnotazioneDaInserire["end"];
            var selezione = infoAnnotazioneDaInserire["selezione"];

            if(typeof(infoAnnotazioneDaInserire["annotaCitazione"]) != "undefined"){ //invece di annotaCitazione posso passare il numero della cit (o il value di option)
                source += '_ver1_cited['+infoAnnotazioneDaInserire["annotaCitazione"]+']'
                if(typeof(idFrammento) == "undefined"){
                    idFrammento = annotazioneCitazione.fs_value.value;
                    startOffset = annotazioneCitazione.start.value;
                    endOffset = annotazioneCitazione.end.value;
                    selezione = annotazioneCitazione.body_ol.value;
                    source = annotazioneCitazione.body_o.value;
                }
            }
            var idAnn = costruisciAnnotazione(source, tipo, testo, idFrammento, startOffset, endOffset, selezione);

            /* Se l'annotazione è su una citazioni, la inserisco dinamicamente nel modal */
            if(typeof(infoAnnotazioneDaInserire["annotaCitazione"]) != "undefined"){
                classCSS = getClassNameType(tipo);
                col = '<span class="glyphicon glyphicon-tint label' + classCSS.substring(9, classCSS.length)+ '"></span>';
                tr = '<tr data-id="'+idAnn+'"><td>'+col+' '+classCSS.substring(9, classCSS.length)+'</td><td>'+getDateTime().replace("T", " ")+'</td><td>'+testo+'</td><td><span class="glyphicon glyphicon-edit" onclick="modificaAnnotazioneLocale('+idAnn+')" data-toggle="tooltip" title="Modifica annotazione"></span><span onclick="eliminaAnnotazioneLocale('+idAnn+')" class="glyphicon glyphicon-trash" data-toggle="tooltip" title="Elimina annotazione"></span></td></tr>';

                $('#modalGestAnnotazioni div#annotazioniInserite tbody').append(tr);
            }
            infoAnnotazioneDaInserire = []; //svuota oggetto
        }
        $('#modalAnnotDoc').modal('hide');
    });

    /* Salvare sul grafo annotazioni e citazioni inserite localmente */
    $("#salvaGest").click(function(){
        var numeroAnnot = '';
        /* Invia annotazioni DEL DOCUMENTO corrente da salvare */
        var urlDoc = $("ul.nav.nav-tabs li.active a").attr("id");
        var listaNuoveAnnotazioni = {"annotazioni":[]};
        annotazioniSessione = JSON.parse(sessionStorage.annotazioniSessione);
        for(i = 0; i<annotazioniSessione.length; i++){
            if(annotazioniSessione[i].doc == urlDoc){
                for(j = 0; j<annotazioniSessione[i].annotazioni.length; j++){
                    numeroAnnot = annotazioniSessione[i].annotazioni.length;
                    annotazioneSingola = {};
                    annotazioneSingola["tipo"] = annotazioniSessione[i].annotazioni[j].tipo;
                    annotazioneSingola["data"] = annotazioniSessione[i].annotazioni[j].data;
                    annotazioneSingola["valore"] = annotazioniSessione[i].annotazioni[j].oggetto;
                    annotazioneSingola["url"] = annotazioniSessione[i].annotazioni[j].source;
                    annotazioneSingola["id"] = annotazioniSessione[i].annotazioni[j].idFrammento;
                    annotazioneSingola["start"] = annotazioniSessione[i].annotazioni[j].start;
                    annotazioneSingola["end"] = annotazioniSessione[i].annotazioni[j].end;
                    annotazioneSingola["provenance"] = annotazioniSessione[i].annotazioni[j].autore;

                    if(annotazioniSessione[i].annotazioni[j].tipo == 'Citazione'){
                        annotazioneSingola["valore"] = annotazioneSingola["valore"].substring(0, (annotazioneSingola["valore"].length)-1)
                    }
                    listaNuoveAnnotazioni.annotazioni.push(annotazioneSingola);
                }
                annotazioniSessione.splice(i,1); //rimuove l'oggetto in locale contenente le annotazioni del documento
            }
        }
        console.log(listaNuoveAnnotazioni)
        sessionStorage.annotazioniSessione = JSON.stringify(annotazioniSessione);

        if(numeroAnnot != 0){
            var query = creaQueryInsertAnnotazioni(listaNuoveAnnotazioni)
            listaQueryDaInviare.push(query);
        }

        annotazioniGrafoSessione = JSON.parse(sessionStorage.annotModificSessione);
        var indexDoc = 0;
        for(j = 0; j < annotazioniGrafoSessione.length; j++){
            if(annotazioniGrafoSessione[j].url == urlDoc){
                indexDoc = j;
                for(i = 0; i < annotazioniGrafoSessione[j].annot.length; i++){
                    if(typeof(annotazioniGrafoSessione[j].annot[i].deleted) == "undefined"){
                        listaQueryDaInviare.push(creaQueryUpdate(annotazioniGrafoSessione[j].annot[i]));
                        if((typeof(annotazioniGrafoSessione[j].annot[i].update.tipo) != "undefined") && (annotazioniGrafoSessione[j].annot[i].update.tipo == "Autore")){
                            listaQueryDaInviare.push(creaTripleAutore(annotazioniGrafoSessione[j].annot[i].update.oggetto, annotazioniGrafoSessione[j].annot[i].body_s.value));
                        }
                    } else {
                        listaQueryDaInviare.push(creaQueryDelete(annotazioniGrafoSessione[j].annot[i]));
                    }
                }
            }
        }
        annotazioniGrafoSessione.splice(indexDoc, 1);
        sessionStorage.annotModificSessione = JSON.stringify(annotazioniGrafoSessione);
        $('#modalGestAnnotazioni').modal('hide');
        if(listaQueryDaInviare.length != 0){
            inviaQuery(JSON.stringify(listaQueryDaInviare));
            for(j = 0; j < listaAllAnnotazioni.length; j++){
                if(listaAllAnnotazioni[j].url == urlDoc){
                    listaAllAnnotazioni.splice(j, 1);
                }
            }
        }

    });

    /* Eliminare annotazioni o citazioni in locale */
    $('#eliminaAnnotazione').click(function () {
        if(typeof($('#modalConfermaEliminazione').data('id')) != "undefined"){
            var id = $('#modalConfermaEliminazione').data('id');
            eliminaAnnotazione(id);
        } else {
            eliminaAnnotazioneGrafo();
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

     /* Gestione citazioni -> abilita il bottone di salvataggio solo se è selezionata una citazione */
     $(document).on('change', '#selectCit', function(){
         if($("#selectCit").find(":selected").text().length != 0){
            $("#salvaInsertCit").removeAttr('disabled', 'disabled');
         }else{
            $("#salvaInsertCit").prop('disabled', 'disabled');
         }
     });


    /* Salva le citazioni inserite in locale */
    $("#salvaInsertCit").click(function(){
        /* Modifica citazione */
        if($("#modalAnnotCit").data('idCit') != undefined){
            var indice = $("#selectCit").find(":selected").attr("value")
            var infoCit = prendiInfoCitazioni(indice);
            var idCit = $("#modalAnnotCit").data('idCit');
            var annotazioniSessione = JSON.parse(sessionStorage.annotazioniSessione);
            for(i = 0; i<annotazioniSessione.length; i++){
                if(annotazioniSessione[i].doc == $("ul.nav.nav-tabs li.active a").attr("id")){
                    for(j = 0; j<annotazioniSessione[i].annotazioni.length; j++){
                        if(annotazioniSessione[i].annotazioni[j].id == idCit){
                            annotazioniSessione[i].annotazioni[j].oggetto = infoCit.testo+indice;
                            annotazioniSessione[i].annotazioni[j].idFrammento = infoCit.path;
                            annotazioniSessione[i].annotazioni[j].start = infoCit.start;
                            annotazioniSessione[i].annotazioni[j].end = infoCit.end;
                            annotazioniSessione[i].annotazioni[j].selezione = infoCit.testo;
                            annotazioniSessione[i].annotazioni[j].data = getDateTime();

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
        }else if($("#modalAnnotCit").data('idCitGrafo') != undefined){
            var idCit = $("#modalAnnotCit").data('idCitGrafo');
            var indexDoc = 0;
            for(i = 0; i < listaAnnotGrafo1537.length; i++){
                if(listaAnnotGrafo1537[i].url == $("ul.nav.nav-tabs li.active a").attr("id")){
                    indexDoc = i;
                }
            }
            var annot = listaAnnotGrafo1537[indexDoc].annotazioni[idCit];
            if(typeof(annot['update']) == "undefined"){
                annot['update'] = {};
            }

            annot['update']['autore'] = "<mailto:" + sessionStorage.email + ">";
            annot['update']['data_mod'] = getDateTime();

            annot['update']['path'] = "path nuova citazione";
            annot['update']['start_fragm'] = "start nuova citazione";
            annot['update']['end_fragm'] = "end nuova citazione";

            annot['update']['oggetto'] = "_ver1_cited[n]"
            annot['update']['label_oggetto'] = $("#selectCit").find(":selected").text();

            annotazioniGrafoSessione = JSON.parse(sessionStorage.annotModificSessione);
            var find = false;
            for(i = 0; i < annotazioniGrafoSessione.length; i++){
                if(annotazioniGrafoSessione[i].provenance.value == annot.provenance.value && annotazioniGrafoSessione[i].date.value == annot.date.value && annotazioniGrafoSessione[i].type.value == annot.type.value && annotazioniGrafoSessione[i].body_s.value == annot.body_s.value){
                    annotazioniGrafoSessione[i] = annot;
                    find = true;
                }
            }

            if(!find){
                annotazioniGrafoSessione.push(annot);
            }

            sessionStorage.annotModificSessione = JSON.stringify(annotazioniGrafoSessione);
        }else{
            var indiceCit = $("#selectCit").find(":selected").attr("value")
            //con questo indice mi cerco le info della citazione nell oggetto
            var testo = listaCitazioni[indiceCit-1].citazione;
            var path = listaCitazioni[indiceCit-1].path;
            var start = listaCitazioni[indiceCit-1].start;
            var end = listaCitazioni[indiceCit-1].end;

            /* Inserisci citazione */
            //costruisciAnnotazione(source, tipo, valore, idFrammento, start, end, testoSelezionato)
            costruisciAnnotazione($("ul.nav.nav-tabs li.active a").attr("id"), 'Citazione', testo.replaceAll('"', "'")+indiceCit, path, start, end, testo); //TODO prendere le citazioni vere con l'indice, dall'oggetto che le contiene tutte, + .replace(' " ', " ' ")

            $("#modalAnnotCit").modal("hide");
        } 

    });

    $("#modalAnnotDoc").on('hidden.bs.modal', function () {
        $(this).removeData('id');
        $(this).removeData('azione');
        $(this).removeData('path');
        $(this).removeData('inizio');
        $(this).removeData('fine');
        annotazioneCitazione = {};
            
        $("#autore").val('');
        $("#anno").val('');
        $("#titolo").val('');
        $("#url").val('');
        $("#doi").val('');
        $("#comm").val('');
        $("#funcRet").val('');
        $("textarea#selezione").val(''); //TODO
    });

    $("#modalConfermaEliminazione").on('hidden.bs.modal', function () {
            annotazioneModificata = {};
    });

});