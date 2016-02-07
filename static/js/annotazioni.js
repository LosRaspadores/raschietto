/* funzioni annotazioni */

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
//    query += 'FROM NAMED <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537> '
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
    uriQuery = encodeURIComponent(query), // rende la query parte dell'uri
    $.ajax({
        url: "http://tweb2015.cs.unibo.it:8080/data/query?query=" + uriQuery + "&format=json",
        // url: "http://localhost:3030/data/query?query=" + uriQuery + "&format=json",
        dataType: "jsonp",  // Cross-Origin Resource Sharing (for accessing data from from other domains)
        success: function(result) {
            lista_annotazioni = result["results"]["bindings"];
            var numeroAnnotazioni = 0;
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
                    };
                };
                //TODO aggionare numero ann totali per il documento
                displayAnnotazioni(lista_annotazioni);
                stileAnnotazioniMultiple();

            } else {
                $('#alertMessage').text("Non ci sono annotazioni per il documento selezionato.");
                $('#alertDoc').modal('show');
            };
            //scraper(lista_annotazioni,urlDoc);
        },
        //there is no error handling for JSONP request
        //workaround: jQuery ajax Timeout
        timeout: 20000,
        error: function(request, status, error) {
            //if(status==="timeout") {
                $('#alertMessage').text("Errore nel caricamento delle annotazioni.\nIl server non è attualmente disponibile per elaborare la richiesta.");
                $('#alertDoc').modal('show');
            //}
            $('body').removeClass("loading");
        },
        beforeSend: function() { $('body').addClass("loading"); },
        complete: function() { $('body').removeClass("loading"); }
    });
};


function scraper(anns,urlDoc){
    alert('ciao2...'+urlDoc);
    $findTitle = false;
    $findAuthor = false;
    $findDoi = false;
    $findYears = false;
    $findCitazioni = false;

     for (i = 0; i < anns.length; i++) {
        ann = anns[i];
        // alert('ann='+ann);
        ann_out = displaySingolaAnnotazione("",ann);
        if(typeof(ann["type"]) !== "undefined"){
           tipo_ann = gestioneTipoType(ann["type"]["value"]);
           //console.log("tipo ann="+ann["type"]["value"]);

           if(ann["type"]["value"]=="hasTitle"){
             if(typeof(ann["prov_nome"]) !== "undefined"){
               if(ann["prov_nome"]["value"] == "Heisenbergg"){
                console.log("annot titolo="+ann_out);
                $findTitle = true;
               }
             }
           }
           if(ann["type"]["value"]== "hasAuthor"){
             if(typeof(ann["prov_nome"]) !== "undefined"){
               if(ann["prov_nome"]["value"] == "Heisenbergg"){
                    console.log("annot autore="+ann_out);
                    $findAuthor = true;
               }
             }
           }
           if(ann["type"]["value"]== "hasDOI"){
             if(typeof(ann["prov_nome"]) !== "undefined"){
               if(ann["prov_nome"]["value"] == "Heisenbergg"){
                    console.log("annotazione doi="+ann_out);
                    $findDoi = true;
               }
             }
           }
           if(ann["type"]["value"]== "hasPublicationYear"){
             if(typeof(ann["prov_nome"]) !== "undefined"){
               if(ann["prov_nome"]["value"] == "Heisenbergg"){
                    console.log("annotazione anno="+ann_out);
                    $findYears = true;
               }
             }
           }

            if(ann["type"]["value"]== "cites"){
             if(typeof(ann["prov_nome"]) !== "undefined"){
               if(ann["prov_nome"]["value"] == "Heisenbergg"){
                    console.log("annotazione anno="+ann_out);
                    $findYears = true;
               }
             }
           }


        }
    }

    if($findTitle == false){
        console.log($findTitle);
        console.log("chiamare scraper titolo");

        $.ajax({
             url: '/scrapingAutomaticoTitolo',
             type: 'GET',
             data: {url: urlDoc},
             success: function(result) {
                   alert("scraping titolo="+result);
             },
             error: function(error) {
                   alert("Error: " + error);
             }
        });

    }

     if($findAuthor == false){
        console.log($findTitle);
        console.log("chiamare scraper autore");

        $.ajax({
             url: '/scrapingAutomaticoAutore',
             type: 'GET',
             data: {url: urlDoc},
             success: function(result) {
                   alert("scraping autore="+result);
             },
             error: function(error) {
                   alert("Error: " + error);
             }
        });

    }

    if ($findDoi ==false) {
       console.log($findDoi);
       console.log("chiamare scraper doi");

       $.ajax({
             url: '/scrapingAutomaticoDoi',
             type: 'GET',
             data: {url: urlDoc},
             success: function(result) {
                   alert("scraping Doi="+result);
             },
             error: function(error) {
                   alert("Error: " + error);
             }
        });
    }

    if($findYears == false){
        console.log($findYears);
        console.log("chiamare scraper anno");

        $.ajax({
             url: '/scrapingAutomaticoYears',
             type: 'GET',
             data: {url: urlDoc},
             success: function(result) {
                   alert("scraping anno="+result);
             },
             error: function(error) {
                   alert("Error: " + error);
             }
        });

    }

        if($findCitazioni == false){
        console.log($findCitazioni);
        console.log("chiamare scraper citazioni");

        $.ajax({
             url: '/scrapingCitazioni',
             type: 'GET',
             data: {url: urlDoc},
             success: function(result) {
                   alert("scraping citazioni="+result);
             },
             error: function(error) {
                   alert("Error: " + error);
             }
        });

    }


}

// modal
function displayAnnotazioni(anns) {
    var numeroAnnotazioni = 0;
    var out = "";
    var i;
    for (i = 0; i < anns.length; i++) {
        var ann = anns[i];
        var subject = ann["body_s"]["value"];
        if(subject.indexOf("cited") != -1) {
            var ann_out = displaySingolaAnnotazione("citazione", ann);
        } else {
            var ann_out = displaySingolaAnnotazione("semplice", ann);
        }
        if(ann_out != ""){
            //out += ann_out;
            numeroAnnotazioni += 1;
        }
    }
    console.log("Numero totale annotazioni: " + anns.length + ", effettive non scartate: " + numeroAnnotazioni);

    /*if(numeroAnnotazioni != 0){
        $('#modalAnnotazioni').modal({backdrop: 'static', keyboard: false});  // before modal show line!
        $('#modalAnnotazioni').modal('show');
        $('#numeroAnnotazioni').text("Numero totale annotazioni: " + numeroAnnotazioni);
        $('#listaAnnotazioni').html(out);
    } else {
        $('#alertMessage').text("Non ci sono annotazioni per il documento selezionato.");
        $('#alertDoc').modal('show');
    }*/
};

// formattazione singola annotazione da visualizzare
function displaySingolaAnnotazione(str, ann){

    var out = "";
    if(typeof(ann["type"]) != "undefined"){
        var tipo_ann = typeToIta(ann["type"]["value"]);
        var classCSS = getClassNameType(ann["type"]["value"]);
        col = '<span class="glyphicon glyphicon-tint label' + classCSS.substring(9, classCSS.length)+ '"></span>';
        //var tipo_ann = typeToIta(ann["type"]["value"]);
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
                out += ann["prov_label"]["value"] + " "
            } else if(typeof(ann["prov_nome"]) != "undefined"){
                out += ann["prov_nome"]["value"] + " "
            } else if(typeof(ann["provenance"]) != "undefined"){
                out += ann["provenance"]["value"];
            }
            if(typeof(ann["prov_email"]) != "undefined"){
                out += ann["prov_email"]["value"];
            }
            out += "</td>"
            out += "<tr>";
        }
    }
//    alert("ann " + out);
    return out;
}

function highligthFragment(fragmentPath, ann, urlDoc) {

    var start = ann["start"]["value"];
    var end = ann["end"]["value"];

    if(typeof(ann["type"]) != "undefined"){
        var classCSS = getClassNameType(ann["type"]["value"]);
    }else {
        console.log("annotazione scartata" + ann);
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
        //TODO perchè //table/ e non /table/
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
        console.log("path locale app " + path);
        try {
            //The expression is a legal expression.
            var nodo = document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (nodo != null){
                //findCorrectNodo(nodo, start, end, classCSS, ann);
                setSelectionRange(nodo, start, end, classCSS, ann);
            };
        } catch (ex) {
            //The expression is NOT a legal expression.
            //se per esempio il fragmentPath è incompleto o relativo
        }
    }
}

function findCorrectNodo(nodo, start, end, classCSS, ann){
    var out;
    if (nodo.nodeType == 3){
        //se è un nodo di tipo testo
        out = check(nodo, start, end, classCSS, ann);
    } else {
        //scorro tutti i nodi (di qualsiasi tipo) figli del nodo iniziale
        var children = nodo.childNodes;
        var i = 0;
        while(i < children.length){
            var result = findCorrectNodo(children[i], start, end, classCSS, ann);
            if (result.exit) {
                return result;
            } else {
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
    // compreso
    if(start < lunghezza && end <= lunghezza){
        console.log("nonuovonodo")
        var frammentoEvidenziato = document.createRange();
        frammentoEvidenziato.setStart(nodo, parseInt(start));
        frammentoEvidenziato.setEnd(nodo, parseInt(end));
        var span = document.createElement('span');

        var subject = ann["body_s"]["value"];
        span.className = classCSS;
        span.ondblclick = function () {
            $("#modalAnnotazioneSingola").modal({backdrop: 'static', keyboard: false});  // before modal show line!
            $("#modalAnnotazioneSingola").modal('show');
            if(subject.indexOf("cited") != -1) { //ann su cit
                var out_ann = displaySingolaAnnotazione("citazione", ann);
            } else {
                var out_ann  = displaySingolaAnnotazione("semplice", ann);
            }
            $('#infoAnnotazione').append(out_ann);
        };
        frammentoEvidenziato.surroundContents(span);
        output = {exit: true}
    }
    if(start < lunghezza && end > lunghezza){
        var frammentoEvidenziato = document.createRange();
        frammentoEvidenziato.setStart(nodo, parseInt(start));
        frammentoEvidenziato.setEnd(nodo, parseInt(lunghezza));
        var span = document.createElement('span');
        var subject = ann["body_s"]["value"];
        span.className = classCSS;
        span.ondblclick = function () {
            $("#modalAnnotazioneSingola").modal({backdrop: 'static', keyboard: false});  // before modal show line!
            $("#modalAnnotazioneSingola").modal('show');
            if(subject.indexOf("cited") != -1) {
                var out_ann = displaySingolaAnnotazione("citazione", ann);
            } else {
                var out_ann  = displaySingolaAnnotazione("semplice", ann);
            }
            $('#infoAnnotazione').append(out_ann);
        };
        frammentoEvidenziato.surroundContents(span);
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


function mostraAnnotGruppo(element){
    $(element).addClass("active").siblings().removeClass("active");
    var numeroAnnotazioniGruppo = 0;
    if(numeroAnnotazioniGruppo != 0){
        $("#modalAnnotazioneSingola").modal({backdrop: 'static', keyboard: false});  // before modal show line!
        $("#modalAnnotazioneSingola").modal('show');
    } else {
        $('#alertMessage').text("Non ci sono annotazioni di questo gruppo per il documento selezionato.");
        $('#alertDoc').modal('show');
    }
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

function stileAnnotazioniMultiple(){

    //nodo figlio di span high ma preceduto da fratello nodo text
    $('span[class^="highlight"]>span[class^="highlight"]').each(function(){

        var className = $(this).attr('class').split(" ")[0]; //prima classe del nodo
        console.log(className)
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


function getTextNodesIn(node) {
    var textNodes = [];
    if (node.nodeType == 3) { // se il nodo è di tipo testo
        textNodes.push(node);
    } else {
        var children = node.childNodes;
        for (var i = 0, len = children.length; i < len; ++i) {
            textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
        }
    }
    return textNodes;
}

function setSelectionRange(el, start, end, classCSS, ann) {
    if (document.createRange && window.getSelection) {
        var range = document.createRange();
        //range.selectNodeContents(el); // Il Node i cui contenuti devono essere selezionati dentro il Range
        var textNodes = getTextNodesIn(el);
        var foundStart = false;
        var charCount = 0, endCharCount;

        for (var i = 0, textNode; textNode = textNodes[i++]; ) {
            endCharCount = charCount + textNode.length;
            if (!foundStart && start >= charCount && (start < endCharCount || (start == endCharCount && i <= textNodes.length))) {
                range.setStart(textNode, start - charCount);
                foundStart = true;
                thisStart = start - charCount;
            }
            if (foundStart && end <= endCharCount) {
                range.setEnd(textNode, end - charCount);
                thisEnd = end - charCount;
                break;
            }
            charCount = endCharCount;
        }

        var span = document.createElement('span');
        var subject = ann["body_s"]["value"];
        span.className = classCSS;
        span.ondblclick = function () {
            $("#modalAnnotazioneSingola").modal({backdrop: 'static', keyboard: false});  // before modal show line!
            $("#modalAnnotazioneSingola").modal('show');
            if(subject.indexOf("cited") != -1) {
                var out_ann = displaySingolaAnnotazione("citazione", ann);
            } else {
                var out_ann  = displaySingolaAnnotazione("semplice", ann);
            }
            console.log(ann);
            $('#infoAnnotazione').append(out_ann);
        };
        range.surroundContents(span);

    } else if (document.selection && document.body.createTextRange) {
        alert("else if document.selection");
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(true);
        textRange.moveEnd("character", end);
        textRange.moveStart("character", start);
        textRange.select();
    }
}


$( document ).ready(function() {
    //Quando il modal per vedere le annotazioni di un frammento viene chiuso allora viene svuotato
    $('#modalAnnotazioneSingola').on('hide.bs.modal', function(e){
        $('#infoAnnotazione').html("");
    });
});