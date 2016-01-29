/* funzioni annotazioni */

//globale
prefissi = 'PREFIX foaf: <http://xmlns.com/foaf/0.1/> '+
        'PREFIX frbr: <http://purl.org/vocab/frbr/core#> '+
        'PREFIX cito: <http://purl.org/spar/cito/> '+
        'PREFIX fabio: <http://purl.org/spar/fabio/> '+
        'PREFIX sro: <http://salt.semanticauthoring.org/ontologies/sro#> '+
        'PREFIX dcterms: <http://purl.org/dc/terms/> '+
        'PREFIX schema: <http://schema.org/> '+
        'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> '+
        'PREFIX oa: <http://www.w3.org/ns/oa#> '+
        'PREFIX rsch: <http://vitali.web.cs.unibo.it/raschietto/> '+
        'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> '+
        'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+
        'PREFIX sem: <http://www.ontologydesignpatterns.org/cp/owl/semiotics.owl#> '+
        'PREFIX skos: <http://www.w3.org/2009/08/skos-reference/skos.html> '+
        'PREFIX prism: <http://prismstandard.org/namespaces/basic/2.0/> '+
        'PREFIX deo: <http://purl.org/spar/deo/> '+
        'PREFIX foaf: <http://xmlns.com/foaf/0.1/> ';


// query che restituisce tutte le annotazioni di un determinato documento
function query_all_annotazioni(url_documento){
    var query = prefissi +
        'SELECT ?graph ?label ?type ?date ?provenance ?prov_nome ?prov_email ?prov_label ?body_s ?body_p ?body_o ?body_l ?body_ol ?fs_value '+
        '?start ?end ';
    var i;
    for (i=0; i<listaGruppiCompleta.length; i++){
        query += 'FROM NAMED <' + listaGruppiCompleta[i].url + '> ';
    }
    //query += 'FROM NAMED <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537> '
    query += 'WHERE {'+
            'GRAPH ?graph {?a a oa:Annotation. '+
            'OPTIONAL {?a rdfs:label ?label} '+
            'OPTIONAL {?a rsch:type ?type} '+
            '?a oa:annotatedAt ?date; '+
            'oa:annotatedBy ?provenance. '+
            'OPTIONAL {?provenance foaf:name ?prov_nome} '+
            'OPTIONAL {?provenance schema:email ?prov_email} '+
            'OPTIONAL {?provenance rdfs:label ?prov_label} '+
            '?a oa:hasBody ?body. '+
            '?body rdf:subject ?body_s; '+
                  'rdf:object ?body_o; '+
                  'rdf:predicate ?body_p. '+
            'OPTIONAL {?body rdfs:label ?body_l} '+
            'OPTIONAL {?body_o rdfs:label ?body_ol} '+
            '?a oa:hasTarget ?target. '+
            '?target oa:hasSelector ?fragment_selector. '+
            '?fragment_selector rdf:value ?fs_value; '+
                               'oa:start ?start; '+
                               'oa:end ?end. '+
            '?target oa:hasSource <' + url_documento + '> '+
            '} } ORDER BY DESC(?date) ';
    return query;
}


//chiamata ajax
function get_annotazioni(query, urlDoc){
    uriQuery = encodeURIComponent(query), // rende la query parte dell'uri
    $.ajax({
        url: "http://tweb2015.cs.unibo.it:8080/data/query?query=" + uriQuery + "&format=json",
        //url: "http://localhost:3030/data/query?query=" + uriQuery + "&format=json",

        dataType: "jsonp",
        success: function(result) {
            lista_annotazioni = result["results"]["bindings"];

            if(lista_annotazioni.length != 0){
                salvaAnnotazioniJSON(urlDoc, lista_annotazioni);
                for (i = 0; i < lista_annotazioni.length; i++) {
                    ann = lista_annotazioni[i];
                    fragmentPath = ann["fs_value"]["value"];
                    if(fragmentPath == "" || fragmentPath == "document" || fragmentPath == "Document" || fragmentPath == "html/body/" || fragmentPath == "html/body"){
                        console.log("ANNOTAZIONE SUL DOCUMENTO SENZA FRAGMENT PATH");
                    } else {
                        //Vengono evidenziate sul testo solo le annotazioni su frammento (ovviamente)
                        highligthFragment(fragmentPath, ann, urlDoc);
                    }
                }
                //TODO aggionare numero ann totali per il documento
                displayAnnotazioni(lista_annotazioni); //modale
                //annotDaGestire(urlDoc);
            } else {
                $('#alertMessage').text("Non ci sono annotazioni per il documento selezionato.");
                $('#alertDoc').modal('show');
            }
        },
        error: function(error) {
            $('#alertMessage').text("Errore nel caricamento delle annotazioni.");
            $('#alertDoc').modal('show');
        }
    });
};


// modal
function displayAnnotazioni(anns) {
    var numeroAnnotazioni = 0;

    var out = "";
    var i;
    for (i = 0; i < anns.length; i++) {
        var ann = anns[i];
        var subject = ann["body_s"]["value"];
        if(subject.indexOf("cited") != -1) {
            var ann_out = displaySingolaAnnotazione("Annotazione su citazione di tipo", ann);
        } else {
            var ann_out = displaySingolaAnnotazione("Annotazione di tipo", ann);
        }
        if(ann_out != ""){
            out += ann_out;
            numeroAnnotazioni += 1;
        }
    }
    console.log("Numero totale annotazioni: " + anns.length + ", effettive non scartate: " + numeroAnnotazioni);
    if(numeroAnnotazioni != 0){
        $('#modalAnnotazioni').modal({backdrop: 'static', keyboard: false});  // before modal show line!
        $('#modalAnnotazioni').modal('show');
        $('#numeroAnnotazioni').text("Numero totale annotazioni: " + numeroAnnotazioni);
        $('#listaAnnotazioni').html(out);
    } else {
        $('#alertMessage').text("Non ci sono annotazioni per il documento selezionato.");
        $('#alertDoc').modal('show');
    }
};

// formattazione singola annotazione da visualizzare
function displaySingolaAnnotazione(str, ann){
    //tipo e contenuto
    var out = "";
    if(typeof(ann["type"]) != "undefined"){
        var tipo_ann = gestioneTipoType(ann["type"]["value"]);
        if(tipo_ann != ""){
            out = '<div><span class ="filtri">' + str + " " + tipo_ann;
            if(ann["type"]["value"] == "denotesRhetoric"){
                var ret = gestioneRetoriche(ann["body_o"]["value"]);
                if(ret != ""){
                    out += ret + '</p>';
                } else {
                    out += ann["body_o"]["value"];
                }
            } else {
                if (typeof(ann["body_ol"]) != "undefined") {
                    out += ann["body_ol"]["value"];
                } else if (typeof(ann["body_o"]) != "undefined") {
                    out += ann["body_o"]["value"];
                } else if (typeof(ann["body_l"]) != "undefined") {
                    out += ann["body_l"]["value"];
                }
                out += ".</p>";
            }
            // provenance e dataora
            out += '<p>Inserita da: '
            if(typeof(ann["prov_label"]) != "undefined"){
                out += ann["prov_label"]["value"] + " "
            } else if(typeof(ann["prov_nome"]) != "undefined"){
                out += ann["prov_nome"]["value"] + " "
            } else if(typeof(ann["provenance"]) != "undefined"){
                out += ann["provenance"]["value"];
            }
            if(typeof(ann["prov_email"]) != "undefined"){
                out += ann["prov_email"]["value"];
            }
            out += parseDatetime(ann["date"]["value"]) + "</p>";
            out += "</div><br>";
        }
    }

    else if (typeof(ann["label"]) != "undefined"){
        var tipo_ann = gestioneTipoLabel(ann["label"]["value"]);
        if(tipo_ann != ""){
            var out = '<div><span class="filtri">Annotazione di tipo ' + tipo_ann;
            if(ann["label"]["value"] == "Retorica" || ann["label"]["value"] == "Rhetoric"){
                var ret = gestioneRetoriche(ann["body_o"]["value"]);
                if(ret != ""){
                    out += ret + '</p>';
                } else {
                    out += ann["body_o"]["value"];
                }
            } else {
                if (typeof(ann["body_ol"]) != "undefined") {
                    out += ann["body_ol"]["value"];
                } else if (typeof(ann["body_o"]) != "undefined") {
                    out += ann["body_o"]["value"];
                } else if (typeof(ann["body_l"]) != "undefined") {
                    out += ann["body_l"]["value"];
                }
                out += ".</p>";
            }
            // provenance e dataora
            out += '<p>Inserita da: '
            if(typeof(ann["prov_label"]) != "undefined"){
                out += ann["prov_label"]["value"] + " "
            } else if(typeof(ann["prov_nome"]) != "undefined"){
                out += ann["prov_nome"]["value"] + " "
            } else if(typeof(ann["provenance"]) != "undefined"){
                out += ann["provenance"]["value"] + " "
            }
            if(typeof(ann["prov_email"]) != "undefined"){
                out += ann["prov_email"]["value"] + " "
            }
            out += parseDatetime(ann["date"]["value"]) + "</p>";
            out += "</div><br>";
        }
    }
    return out;
}

function highligthFragment(fragmentPath, ann, urlDoc) {

    var start = ann["start"]["value"];
    var end = ann["end"]["value"];

    if(typeof(ann["type"]) != "undefined"){
        var classCSS = getClassNameType(ann["type"]["value"]);
    }
    else if (typeof(ann["label"]) != "undefined"){
        var classCSS = getClassNameLabel(ann["label"]["value"]);
    }

    else {
        //se il tipo di annotazione non c'è nè nel campo type nè in label l'annotazione viene scartata
        var classCSS = "";
    }
    if(classCSS != ""){
        //fragmentPath trasformato in XPath (del documento originale)
        var path = getXPath(fragmentPath);

        //XPath (del documento originale) trasformato in xPath locale
        var id = urlDoc.replace(/([/|_.|_:|_-])/g, '');

        //if dilib
        if (path.indexOf('tbody') == -1 ) { // se non c'è tbody
            path = path.replace(/\/tr/g, '/tbody[1]/tr');
        }
        //TODO perchè //table/ e non /table/
        path = path.replace("form[1]/table[3]/tbody[1]/tr[1]/td[1]/table[5]/", ".//*[@id='" + id +"']//table/");

        //if rivista statistica
        path = path.replace("div[1]/div[2]/div[2]/div[3]/", ".//*[@id='" + id +"']/div/div/");

        //if antropologia e teatro
        path = path.replace("div[1]/div[1]/div[1]/div[1]/", ".//*[@id='" + id +"']/div/div/");
        path = path.replace("div[1]/div[3]/div[2]/div[3]/", ".//*[@id='" + id +"']/div/div/");

        //if rivista statistica or if antropologia e teatro
        path = path.replace("div[1]/div[2]/div[2]/div[2]/", ".//*[@id='" + id +"']/div/div/");

        //evaluate: metodo API DOM JAVASCRIPT, restituisce il nodo (di qualsiasi tipo?//TODO controlla)
        //rappresentato dal XPath passato come parametro
        try {
            //The expression is a legal expression.
            var nodo = document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            findCorrectNodo(nodo, start, end, classCSS, ann);
        } catch (ex) {
            //The expression is NOT a legal expression.
            //se per esempio il fragmentPath è incompleto o relativo
        }
    }
}

function findCorrectNodo(nodo, start, end, classCSS, ann){
    var out;
    if (nodo != null){
        if (nodo.nodeType == 3){
            //se è un text node
            out = check(nodo, start, end, classCSS, ann);
        } else {
            //scorro tutti i nodi figli del nodo iniziale (di qualsiasi tipo?//TODO controlla)
            var elementChildren = nodo.childNodes;
            var i = 0;
            while(i < elementChildren.length){
                var result = findCorrectNodo(elementChildren[i], start, end, classCSS, ann);
                if (result.exit) {
                    return result;
                } else{
                    if (result.altroNodo){
                        i++;
                    }

                    start = result.inizio;
                    end = result.fine;
                    i++;
                }
            }
            out = {inizio: start, fine:end}
        }
    }
    return out;
}

function check(nodo, start, end, classCSS, ann){
    var output;
    var lunghezza = nodo.length;

    if (start < 0) {
        start = 0;
    }

    //allora il nodo non è quello corretto
    if(start>=lunghezza){
        output = {inizio: start-lunghezza, fine:end-lunghezza}
    }
    if(start < lunghezza && end <= lunghezza){
        //OK
        var fragment = document.createRange();
        fragment.setStart(nodo, parseInt(start));
        fragment.setEnd(nodo, parseInt(end));
        var nuovoNodo = document.createElement('span');

        var subject = ann["body_s"]["value"];
        if(subject.indexOf("cited") != -1) {
            nuovoNodo.className = "highlightMultiple";
        } else {
            nuovoNodo.className = classCSS;
        }
        nuovoNodo.ondblclick = function () {
            $("#modalAnnotazioneSingola").modal({backdrop: 'static', keyboard: false});  // before modal show line!
            $("#modalAnnotazioneSingola").modal('show');
            if(subject.indexOf("cited") != -1) {
                var out_ann = displaySingolaAnnotazione("Annotazione su citazione di tipo", ann);
            } else {
                var out_ann  = displaySingolaAnnotazione("Annotazione di tipo", ann);
            }
            $('#infoAnnotazione').append(out_ann);
        };
        fragment.surroundContents(nuovoNodo);
        output = {exit: true}
    }
    if(start < lunghezza && end > lunghezza){
        //OK l'ann si estende anche a un altro nodo
        var fragment = document.createRange();
        fragment.setStart(nodo, parseInt(start));
        fragment.setEnd(nodo, parseInt(lunghezza));
        var nuovoNodo = document.createElement('span');
        var subject = ann["body_s"]["value"];
        if(subject.indexOf("cited") != -1) {
            nuovoNodo.className = "highlightMultiple";
        } else {
            nuovoNodo.className = classCSS;
        }
        nuovoNodo.ondblclick = function () {
            $("#modalAnnotazioneSingola").modal({backdrop: 'static', keyboard: false});  // before modal show line!
            $("#modalAnnotazioneSingola").modal('show');
            if(subject.indexOf("cited") != -1) {
                var out_ann = displaySingolaAnnotazione("Annotazione su citazione di tipo", ann);
            } else {
                var out_ann  = displaySingolaAnnotazione("Annotazione di tipo", ann);
            }
            $('#infoAnnotazione').append(out_ann);
        };
        fragment.surroundContents(nuovoNodo);
        output={inizio: 0, fine: end-lunghezza, altroNodo: true}
    }
    return output;
}


//trasformazione del fragment path (scritto nel corpo dell'annotazione) in un XPath expression
function getXPath(x){
    x = x.toLowerCase();
    if(x.substring(0, 1) == "/"){
       x = x.substr(1);
    }
    x = x.replace(/\_/g, '/');
    x = x.replace(/\[/g, '');
    x = x.replace(/\]/g, '');
    if(x.substring(0, 10) == "html/body/"){
       x = x.substr(10);
    }
    var array = x.split("/");
    for (var i = 0; i < array.length; i++) {
        //se contiene numeri
        if (array[i].match(/\d+/)) {
            if (array[i].indexOf('h3') != -1){
                var suffix = array[i].toString().substring(2, array[i].length);
                if (suffix != 1 && suffix != "")
                {
                    array[i] = 'h3[' + suffix + ']';
                }
                else array[i] = 'h3';
            } else if (array[i].indexOf('h4') != -1){
                var suffix = array[i].toString().substring(2, array[i].length);
                if (suffix != 1 && suffix != "")
                {
                    array[i] = 'h4[' + suffix + ']';
                }
                else array[i] = 'h4';
            } else if (array[i].indexOf('h2') != -1){
                var suffix = array[i].toString().substring(2, array[i].length);
                if (suffix != 1 && suffix != "")
                {
                    array[i] = 'h2[' + suffix + ']';
                }
                else array[i] = 'h2';
            } else {
                var suffix = array[i].match(/\d+/)
                array[i] = array[i].toString().replace(/\d+/g, '') + '[';
                for (var j = 0; j < suffix.length; j++) {
                  array[i] += suffix[j];
                }
                array[i] += ']';
            }
        } else {
            array[i] += '[1]';
        }
    }
    return array.join('/');
}


function gestioneRetoriche(retorica){
    var out = ""
    switch(retorica){
        case "sro:Abstract":
        case "http://salt.semanticauthoring.org/ontologies/sro#Abstract":
            out = "Abstract.";
            break;
        case "deo:Introduction":
        case "http://purl.org/spar/deo/Introduction":
            out = "Introduction.";
            break;
        case "deo:Materials":
        case "http://purl.org/spar/deo/Materials":
            out = "Materials.";
            break;
        case "deo:Methods":
        case "http://purl.org/spar/deo/Methods":
            out = "Methods.";
            break;
        case "deo:Results":
        case "http://purl.org/spar/deo/Results":
            out = "Results.";
            break;
        case "sro:Discussion":
        case "http://salt.semanticauthoring.org/ontologies/sro#Discussion":
            out = "Discussion.";
            break;
        case "sro:Conclusion":
        case "http://salt.semanticauthoring.org/ontologies/sro#Conclusion":
            out = "Conclusion.";
            break;
    }
    return out;
};

function getClassNameType(type){
    var classCSS = "";
    switch(type){
        case "hasUrl":
        case "hasURL":
            classCSS = "highlightURL";
            break;
        case "hasTitle":
            classCSS = "highlightTitle";
            break;
        case "hasPublicationYear":
            classCSS = "highlightPublicationYear";
            break;
        case "hasDOI":
        case "hasDoi":
            classCSS = "highlightDOI";
            break;
        case "hasAuthor":
            classCSS = "highlightAuthor";
            break;
        case "hasComment":
            classCSS = "highlightComment";
            break;
        case "denotesRhetoric":
            classCSS = "highlightDenotesRhetoric";
            break;
        case "Cites":
        case "cites":
        //case "refecences":
        //case "Reference":
            classCSS = "highlightCites";
            break;
    }
    return classCSS;
};

function getClassNameLabel(label){
    var classCSS = "";
    switch(label){
        case "URL":
        case "Url":
            classCSS = "highlightURL";
            break;
        case "Titolo":
        case "Title":
            classCSS = "highlightTitle";
            break;
        case "Publication Year":
        case "PublicationYear":
        case "Anno di pubblicazione":
        case "Anno pubblicazione":
            classCSS = "highlightPublicationYear";
            break;
        case "DOI":
        case "Doi":
            classCSS = "highlightDOI";
            break;
        case "Autore":
        case "Author":
            classCSS = "highlightAuthor";
            break;
        case "Commento":
            classCSS = "highlightComment";
            break;
        case "Retorica":
        case "Rhetoric":
        case "Funzione retorica":
            classCSS = "highlightDenotesRhetoric";
            break;
        case "Citation":
        case "Citazione":
        //case "refecences":
        //case "Reference":
            classCSS = "highlightCites";
            break;
    }
    return classCSS;
};


function gestioneTipoType(type){
    out = "";
    switch(type){
        case "hasURL":
        case "hasUrl":
            out = '<span class="filtri labelURL"> URL </span> </span> <p>L\'URL di questo documento è ';
            break;
        case "hasTitle":
            out = '<span class="filtri labelTitle"> TITOLO </span> </span> <p>Il titolo di questo documento è ';
            break;
        case "hasPublicationYear":
            out = '<span class="filtri labelPublicationYear"> ANNO DI PUBBLICAZIONE </span> </span> <p> L\'anno di pubblicazione di questo documento è il ';
            break;
        case "hasDoi":
        case "hasDOI":
            out = '<span class="filtri labelDOI"> DOI </span> </span> <p> Il DOI di questo documento è ';
            break;
        case "hasAuthor":
            out = '<span class="filtri labelAuthor"> AUTORE </span> </span> <p> Un autore di questo documento è ';
            break;
        case "hasComment":
            out = '<span class="filtri labelComment"> COMMENTO </span> </span> <p> Un commento a questo documento è ';
            break;
        case "denotesRhetoric":
            out = '<span class="filtri labelDenotesRhetoric"> RETORICA </span> </span> <p> Una retorica di questo documento è ';
            break;
        case "Cites":
        case "cites":
        //case "references":
        //case "Reference":
            out = '<span class="filtri labelCites"> CITAZIONE </span> </span> <p> Questo documento cita ';
            break;
    }
    return out;
};

function gestioneTipoLabel(label){
    out = "";
    switch(label){
        case "URL":
        case "Url":
            out = '<span class="filtri labelURL"> URL </span> </span> <p> L\'URL di questo documento è ';
            break;
        case "Titolo":
        case "Title":
            out = '<span class="filtri labelTitle"> TITOLO </span> </span> <p> Il titolo di questo documento è ';
            break;
        case "PublicationYear":
        case "Publication Year":
        case "Anno di pubblicazione":
            out = '<span class="filtri labelPublicationYear"> ANNO DI PUBBLICAZIONE </span> </span> <p> L\'anno di pubblicazione di questo documento è il ';
            break;
        case "DOI":
        case "Doi":
            out = '<span class="filtri labelDOI"> DOI </span> </span> <p> Il DOI di questo documento è ';
            break;
        case "Autore":
        case "Author":
            out = '<span class="filtri labelAuthor"> AUTORE </span> </span> <p> Un autore di questo documento è ';
            break;
        case "Commento":
            out = '<span class="filtri labelComment"> COMMENTO </span> </span> <p> Un commento a questo documento è ';
            break;
        case "Retorica":
        case "Rhetoric":
            out = '<span class="filtri labelDenotesRhetoric"> RETORICA </span> </span> <p> Una retorica di questo documento è ';
            break;
        case "Citation":
        case "Citazione":
        //case "refecences":
        //case "Reference":
            out = '<span class="filtri labelCites"> CITAZIONE </span> </span> <p> Questo documento cita ';
            break;
    }
    return out;
}

/* parse formato data e ora YYYY-MM-DDTHH:mm */
function parseDatetime(dataAnn){
    return dataAnn = " in data " + dataAnn.replace("T", " alle ") + ".";
}


$( document ).ready(function() {
    //Quando il modal per vedere le annotazioni di un frammento viene chiuso allora viene svuotato
    $('#modalAnnotazioneSingola').on('hide.bs.modal', function(e){
        $('#infoAnnotazione').html("");
    });
});
