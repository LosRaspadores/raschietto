/* funzioni annotazioni */

//globale
prefissi =  'PREFIX foaf: <http://xmlns.com/foaf/0.1/> '+
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
            'PREFIX deo: <http://purl.org/spar/deo/> ';


// query che restituisce tutte le annotazioni di un determinato documento
function query_all_annotazioni(url_documento){
    var query = prefissi +
        'SELECT ?graph ?label ?type ?date ?provenance ?prov_nome ?prov_email ?prov_label ?body_s ?body_p ?body_o ?body_l ?body_ol ?fs_value '+
        '?start ?end ';
    var i;
    for (i=0; i<listaGruppiCompleta.length; i++){
        query += 'FROM NAMED <' + listaGruppiCompleta[i].url + '> ';
    };
    // query += 'FROM NAMED <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537> '
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


//chiamata ajax (tutte le annotazioni di un documento)
function get_annotazioni(query, urlDoc){
    var uriQuery = encodeURIComponent(query); // rende la query parte dell'uri
    $.ajax({
        url: "http://tweb2015.cs.unibo.it:8080/data/query?query=" + uriQuery + "&format=json",
        //url: "http://localhost:3030/data/query?query=" + uriQuery + "&format=json",
        dataType: "jsonp",  // Cross-Origin Resource Sharing (for accessing data from from other domains)
        success: function(result) {
            var lista_annotazioni = result["results"]["bindings"];
            if(lista_annotazioni.length != 0){
                salvaAnnotazioniJSON(urlDoc, lista_annotazioni);
                gestioneAnnotazioni(lista_annotazioni, urlDoc);
                stileAnnotazioniMultiple();
                annotazioniSuDoc(urlDoc);
            } else {
                $('#alertMessage').text("Non ci sono annotazioni per il documento selezionato.");
                $('#alertDoc').modal('show');
                scraper(urlDoc);  //lancia lo scraper automaticamente se non ci sono annotazioni sul documento
            }

        },
        //there is no error handling for JSONP request
        //workaround: jQuery ajax Timeout
        timeout: 20000,
        error: function(request, status, error) {
            $('#alertMessage').text("Errore nel caricamento delle annotazioni.\nIl server non è attualmente disponibile per elaborare la richiesta.");
            $('#alertDoc').modal('show');
            $('body').removeClass("loading");
        },
        beforeSend: function() { $('body').addClass("loading"); },
        complete: function() { $('body').removeClass("loading"); }
    });
};


function scraper(urlDoc){
    console.log("PARTE LO SCRAPER *********************************************************************");
    $.ajax({
        url: '/scrapingAutomatico',
        type: 'GET',
        data: {url: urlDoc},
        success: function(result){
            res = JSON.parse(result);
            query = query_all_annotazioni(urlDoc);
            get_annotazioni(query, urlDoc);
        },
        error: function(){

        }
    });
  }
  

function lancia_scraper(query, urlDoc){
    uriQuery = encodeURIComponent(query), // rende la query parte dell'uri
    $.ajax({
        url: "http://tweb2015.cs.unibo.it:8080/data/query?query=" + uriQuery + "&format=json",
        //url: "http://localhost:3030/data/query?query=" + uriQuery + "&format=json",

        dataType: "jsonp",
        success: function(result) {
            lista_annotazioni = result["results"]["bindings"];
            scraper(lista_annotazioni,urlDoc);
        },
        error: function(error) {
            $('#alertMessage').text("Errore nell'esecuzione dello scraper");
            $('#alertDoc').modal('show');
        }
    });
};

function gestioneAnnotazioni(lista_annotazioni, urlDoc) {
    for (i = 0; i < lista_annotazioni.length; i++) {
        var ann = lista_annotazioni[i];
        var fragmentPath = ann["fs_value"]["value"];
        if(fragmentPath == "" || fragmentPath == "document" || fragmentPath == "Document" || fragmentPath == "html/body/" || fragmentPath == "html/body"){
            // l'anntazione viene scartata
        } else {
            //l'annotazione viene evidenziata
            highligthFragment(fragmentPath, ann, urlDoc);
        };
    };
};


// formattazione singola annotazione da visualizzare
function displaySingolaAnnotazione(str, ann){

    var out = "";
    if(typeof(ann["type"]) != "undefined"){
        var tipo_ann = typeToIta(ann["type"]["value"]);
        var classCSS = getClassNameType(ann["type"]["value"]);
        col = '<span class="glyphicon glyphicon-tint label' + classCSS.substring(9, classCSS.length)+ '"></span>';
        if(tipo_ann != ""){
            out += "<tr><td>" + col;
            if(str == "citazione"){
                out += tipo_ann + " su citazione</td>";
            }else{
                out += tipo_ann + "</td>";
            }
            out += "<td>" + parseDatetime(ann["date"]["value"]) + "</td>";
            if(ann["type"]["value"] == "denotesRhetoric"){
                var ret = gestioneRetoriche(ann["body_o"]["value"]);
                if(ret != ""){
                    out += "<td>" + ret + "</td>";
                } else {
                    out += "<td>" + ann["body_o"]["value"] + "</td>";
                }
            } else {
                if (typeof(ann["body_ol"]) != "undefined") {
                    out += "<td>" + ann["body_ol"]["value"];
                } else if (typeof(ann["body_l"]) != "undefined") {
                    out += "<td>" + ann["body_l"]["value"];
                } else if (typeof(ann["body_o"]) != "undefined") {
                    out += "<td>" + ann["body_o"]["value"];
                }
                out += "</td>";
            }
            out += '<td>'
            if(typeof(ann["prov_label"]) != "undefined"){
                out += ann["prov_label"]["value"] + " ";
            } else if(typeof(ann["prov_nome"]) != "undefined"){
                out += ann["prov_nome"]["value"] + " ";
            } else if(typeof(ann["provenance"]) != "undefined"){
                out += ann["provenance"]["value"];
            }
            if(typeof(ann["prov_email"]) != "undefined"){
                out += ann["prov_email"]["value"] + " ";
            }
            out += "</td>"
            out += "</tr>";
        }
    }
    return out;
}

function highligthFragment(fragmentPath, ann, urlDoc) {

    var start = ann["start"]["value"];
    var end = ann["end"]["value"];

    if(typeof(ann["type"]) != "undefined"){
        var classCSS = getClassNameType(ann["type"]["value"]);
    }else {
        console.log("annotazione scartata" + ann + " *******************");
        //l'annotazione viene scartata
        var classCSS = "";
    }
    if(classCSS != ""){
        //fragmentPath trasformato in XPath (del documento originale)
        var path = getXPath(fragmentPath);
        console.log("path originale " + path);

        //XPath (del documento originale) trasformato in xPath locale
        var id = urlDoc.replace(/([/|_.|_:|_-])/g, '');

        //if dilib
        if (path.indexOf('tbody') == -1 ) { // se non c'è tbody
            path = path.replace(/\/tr/g, '/tbody[1]/tr');
        }
        path = path.replace("form[1]/table[3]/tbody[1]/tr[1]/td[1]/table[5]/", ".//*[@id='" + id +"']//table/");

        //if rivista statistica
        path = path.replace("div[1]/div[2]/div[2]/div[3]/", ".//*[@id='" + id +"']/div/div/");
        path = path.replace("div[1]/div[1]/div[2]/div[3]/", ".//*[@id='" + id +"']/div/div/");

        //if antropologia e teatro or if alma tourism
        path = path.replace("div[1]/div[1]/div[1]/div[1]/", ".//*[@id='" + id +"']/div/div/");
        path = path.replace("div[1]/div[3]/div[2]/div[3]/", ".//*[@id='" + id +"']/div/div/");

        //if rivista statistica or if antropologia e teatro
        path = path.replace("div[1]/div[2]/div[2]/div[2]/", ".//*[@id='" + id +"']/div/div/");

        //evaluate: metodo API DOM JAVASCRIPT, restituisce il nodo rappresentato dal XPath passato come parametro
        try {
            //The expression is a legal expression.
            var nodo = document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (nodo != null){
                setRange(nodo, start, end, classCSS, ann);
            };
        } catch (ex) {
            //The expression is NOT a legal expression.
            //se per esempio il fragmentPath è incompleto o relativo
            //l'annotazione viene scartata
        }
    }
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
        case "http://salt.semanticauthoring.org/ontologies/sro#Abstract":
            out = "Abstract";
            break;
        case "http://purl.org/spar/deo/Introduction":
            out = "Introduction";
            break;
        case "http://purl.org/spar/deo/Materials":
            out = "Materials";
            break;
        case "http://purl.org/spar/deo/Methods":
            out = "Methods";
            break;
        case "http://purl.org/spar/deo/Results":
            out = "Results";
            break;
        case "http://salt.semanticauthoring.org/ontologies/sro#Discussion":
            out = "Discussion";
            break;
        case "http://salt.semanticauthoring.org/ontologies/sro#Conclusion":
            out = "Conclusion";
            break;
    }
    return out;
};

function getClassNameType(type){
    var classCSS = "";
    switch(type){
        case "hasURL":
        case "URL":
            classCSS = "highlightURL";
            break;
        case "hasTitle":
        case "Titolo":
            classCSS = "highlightTitle";
            break;
        case "hasPublicationYear":
        case "Anno di pubblicazione":
        case "Anno pubblicazione":
            classCSS = "highlightPublicationYear";
            break;
        case "hasDOI":
        case "DOI":
            classCSS = "highlightDOI";
            break;
        case "hasAuthor":
        case "Autore":
            classCSS = "highlightAuthor";
            break;
        case "hasComment":
        case "Commento":
            classCSS = "highlightComment";
            break;
        case "denotesRhetoric":
        case "Funzione retorica":
            classCSS = "highlightDenotesRhetoric";
            break;
        case "cites":
        case "Citazione":
            classCSS = "highlightCites";
            break;
    }
    return classCSS;
};

/* parse formato data e ora YYYY-MM-DDTHH:mm */
function parseDatetime(dataAnn){
    return dataAnn = dataAnn.replace("T", " ");
};


// funzione ricorsiva per nodi text discendenti di un certo nodo (testato con debugger)
// diverso da textContent = text content of a node and its descendants (a me servono i nodi!)
function getTextNodesIn(node) {
    var textNodes = [];  // array di nodi testo figli del nodo iniziale
    if (node.nodeType == 3) {  // se il nodo iniziale è di tipo testo
        textNodes.push(node);
    } else {
        var children = node.childNodes;  // nodi figli del nodo iniziale (di tutti i tipi anche di tipo text)
        var len = children.length;
        for (var i = 0; i < len; i++) {  //  per ogni nodo figlio
            // Merge di array: apply()
            textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
        }
    }
    return textNodes;
}


function setRange(nodo, start, end, classCSS, ann) {
    var rangeObject = document.createRange();  // creating a Range object.. we wull need to define its start and end points
    var textNodes = getTextNodesIn(nodo);
    if (start < 0) { start = 0; };
    var caratteriTot = end - start;
    var trovatoNodoStart = false;
    var charParsed = 0;

    //scorro i nodi discendenti di tipo testo del nodo evaluated
    for (var i = 0; i<textNodes.length; i++) {
        var nodoCorrente = textNodes[i];
        var lunghezzaNodoCorrente = nodoCorrente.length;

        // allora lo start e l'end sono compresi nel nodo corrente => start end offset del range trovati!
        if((start<lunghezzaNodoCorrente && end <= lunghezzaNodoCorrente) || (trovatoNodoStart && end <= lunghezzaNodoCorrente)){
            if(!trovatoNodoStart){
                rangeObject.setStart(nodoCorrente, start);
            }
            charParsed = charParsed + (lunghezzaNodoCorrente - start);
            rangeObject.setEnd(nodoCorrente, end);

            rangeObject.setStart(nodoCorrente, start);
            // dopo aver trovato start e end
            var spanHighligth = document.createElement('span');
            var subject = ann["body_s"]["value"];
            spanHighligth.className = classCSS;  // classe dell' evidenziazione
            spanHighligth.ondblclick = function () {
                $("#modalAnnotazioneSingola").modal({backdrop: 'static', keyboard: false});  // before modal show line!
                $("#modalAnnotazioneSingola").modal('show');
                if(subject.indexOf("cited") != -1) {
                    var out_ann = displaySingolaAnnotazione("citazione", ann);
                } else {
                    var out_ann  = displaySingolaAnnotazione("semplice", ann);
                }
                $('#infoAnnotazione').append(out_ann);
            };
            rangeObject.surroundContents(spanHighligth);
            break;
        } else {
            if(start >= lunghezzaNodoCorrente){
                if(!trovatoNodoStart){
                    start = start - lunghezzaNodoCorrente;
                    end = end -lunghezzaNodoCorrente;
                    // si passa al  al nodo successivo
                }
            } else {  // cioè if(start < lunghezzaNodoCorrente)
                // lo start offset è nel nodo corrente
                if(!trovatoNodoStart){
                    rangeObject.setStart(nodoCorrente, start);
                };
                trovatoNodoStart = true;
                charParsed = charParsed + (lunghezzaNodoCorrente - start);
                end = caratteriTot - charParsed; // caratteri mancanti

                rangeObject.setStart(nodoCorrente, 0);
                rangeObject.setEnd(nodoCorrente, lunghezzaNodoCorrente);
                var spanHighligth = document.createElement('span');
                var subject = ann["body_s"]["value"];
                spanHighligth.className = classCSS;  // classe dell' evidenziazione
                spanHighligth.ondblclick = function () {
                    $("#modalAnnotazioneSingola").modal({backdrop: 'static', keyboard: false});  // before modal show line!
                    $("#modalAnnotazioneSingola").modal('show');
                    if(subject.indexOf("cited") != -1) {
                        var out_ann = displaySingolaAnnotazione("citazione", ann);
                    } else {
                        var out_ann  = displaySingolaAnnotazione("semplice", ann);
                    }
                    $('#infoAnnotazione').append(out_ann);
                };
                rangeObject.surroundContents(spanHighligth);
            }
        }
    }
    var rangeContent = rangeObject.toString();
}


function stileAnnotazioniMultiple(){
    //nodo figlio di span high ma preceduto da fratello nodo text
    $('span[class^="highlight"]>span[class^="highlight"]').each(function(){
        var className = $(this).attr('class').split(" ")[0]; //prima classe del nodo
        if($(this).prev().prop('nodeType')===undefined){ //preceding sibling di tipo testo
              //children: figli nodi elementi
              //se ha un figlio nodo elemento span high, altrimenti non si deve fare nulla
              if ($(this).children('span[class^="highlight"]:first-child') != 0){
                  //navigo sul figlio span high (sul primo figlio span high)
                  var figlio = $(this).children('span[class^="highlight"]:first-child');
                  controllofiglio(figlio, className);
              };
         };
    });

    //tutti i nodi span high che non hanno come parent un altro span high
    $('*:not([class^="highlight"])>span[class^="highlight"]').each(function(){
        var className = $(this).attr('class').split(' ')[0]; //prima classe del nodo
        //children: figli nodi elementi
        //se ha un figlio nodo elemento span high, altrimenti non si deve fare nulla
        if ($(this).children('span[class^="highlight"]:first-child') != 0){
            var figlio = $(this).children('span[class^="highlight"]:first-child');
            controllofiglio(figlio, className);
            //classe annot multiple associata all'ultimo figlio
        }
    });
};


function controllofiglio(nodo, classe){
    //se non ha primo figlio highlight, cioè se il nodo è l ultimo figlio
    //il metodo finisce
    //if(($(this).contents()[0].nodeType == 3)) || (nodo.children('span[class^="highlight"]:first-child').length == 0)){
    if((nodo.contents().first().prop('nodeType') == undefined) || (nodo.children('span[class^="highlight"]:first-child').length == 0)){
    //if(nodo.children('span[class^="highlight"]:first-child').length == 0){
        if(!nodo.hasClass(classe)){
            nodo.addClass("highlightMultipleTipoDiverso");
        } else {
            nodo.addClass("highlightMultipleTipoUguale");
        };
    }
    //se padre ha primo figlio figlio highlight
    else{
        var primofiglio = $(nodo).children('span[class^="highlight"]:first-child');
        controllofiglio(primofiglio, classe);
    };

};


// formattazione del div delle annotazioni senza fragment path
function displayAnnSuDoc(ann){
    var out = "";
    if(typeof(ann["type"]) != "undefined"){
        var tipo_ann = typeToIta(ann["type"]["value"]);
        var classCSS = getClassNameType(ann["type"]["value"]);
        if(tipo_ann != ""){
            out += '<div class="divAnnSulDoc">';
            out += "<p>Tipo: " + tipo_ann + "</p>";
            out += "<p>Data: " + parseDatetime(ann["date"]["value"] + "</p>");
            if(ann["type"]["value"] == "denotesRhetoric"){
                var ret = gestioneRetoriche(ann["body_o"]["value"]);
                if(ret != ""){
                    out += "<p>Oggetto: " + ret + "</p>";
                } else {
                    out += "<p>Oggetto: " + ann["body_o"]["value"] + "</p>";
                }
            } else {
                if (typeof(ann["body_ol"]) != "undefined") {
                    out += "<p>Oggetto: " + ann["body_ol"]["value"] + "</p>";
                } else if (typeof(ann["body_l"]) != "undefined") {
                    out += "<p>Oggetto: " + ann["body_l"]["value"] + "</p>";
                } else if (typeof(ann["body_o"]) != "undefined") {
                    out += "<p>Oggetto: " + ann["body_o"]["value"] + "</p>";
                }
            }
            if(typeof(ann["prov_label"]) != "undefined"){
                out += "<p>Autore: " + ann["prov_label"]["value"] + " ";
            } else if(typeof(ann["prov_nome"]) != "undefined"){
                out += "<p>Autore: " + ann["prov_nome"]["value"] + " ";
            } else if(typeof(ann["provenance"]) != "undefined"){
                out += "<p>Autore: " + ann["provenance"]["value"] + " ";
            }
            if(typeof(ann["prov_email"]) != "undefined"){
                out += ann["prov_email"]["value"];
            }
            out += "</p></div>";
        }
    }
    return out;
}


// visualizzazione annotazioni senza fragment path del documento corrente sul pannello laterale
function annotazioniSuDoc(url_doc){
    var numAnn = 0;
    for(var i=0; i<listaAllAnnotazioni.length; i++){
        if(listaAllAnnotazioni[i].url == url_doc){
            $("#ann_sul_doc").html("<p>Annotazioni sul documento</p>");
            for(var j=0; j<listaAllAnnotazioni[i].listaGrafi.length; j++){
                for(var z=0; z<listaAllAnnotazioni[i].listaGrafi[j].annotazioni.length; z++){
                    var fragmentPath = listaAllAnnotazioni[i].listaGrafi[j].annotazioni[z]["fs_value"]["value"];
                    // se l'annotazione non ha fragment path (= se e' sull intero documento)
                    if(fragmentPath == "" || fragmentPath == "document" || fragmentPath == "Document" || fragmentPath == "html/body/" || fragmentPath == "html/body"){
                        var out = displayAnnSuDoc(listaAllAnnotazioni[i].listaGrafi[j].annotazioni[z]);
                        if (out != ""){
                            $("#ann_sul_doc").append(out);
                            numAnn++;
                        }
                    }
                }
            }
            break;
        }
    }
    if(numAnn == 0){
        $("#ann_sul_doc").html("<p>Non ci sono annotazioni sull' intero documento</p>");
    }
}


$( document ).ready(function() {
    //Quando il modal per vedere le annotazioni di un frammento viene chiuso allora viene svuotato
    $('#modalAnnotazioneSingola').on('hide.bs.modal', function(e){
        $('#infoAnnotazione').html("");
    });


    // quando si cambia documento (quando ci si sposta sulle tab)
    $(document).on("click", "ul.nav.nav-tabs>li>a", function(){
        //vengono visualizzate nel pannello le annotazioni senza fragment path del doc corrente
        var url_doc_corrente = $(this).attr("id");
        if(url_doc_corrente != "homeTab"){
            annotazioniSuDoc(url_doc_corrente);
        } else {
            // la tab attiva e' la tab home
            $("#ann_sul_doc").html('<p>Nessun documento selezionato</p>');
        }
    });

});