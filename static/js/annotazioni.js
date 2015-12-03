
/* funzioni annotazioni */

// query che ritorna tutte le annotazioni di un determinato documento all'interno di un determinato grafo
function query_all_annotazioni(nome_grafo, url_documento){
    var query = 'SELECT ?graph ?label ?type ?date ?provenance ?prov_nome ?prov_email ?prov_label ?body_s ?body_p ?body_o ?body_l ?fs_value '+
            '?start ?end '+
            //'FROM NAMED <' + nome_grafo + '>'+
            'WHERE {'+
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
                      'rdf:predicate ?body_p; '+
                'OPTIONAL {?body_o rdfs:label ?body_l} '+
                '?a oa:hasTarget ?target. '+
                '?target oa:hasSelector ?fragment_selector. '+
                '?fragment_selector rdf:value ?fs_value; '+
                                   'oa:start ?start; '+
                                   'oa:end ?end. '+
                '?target oa:hasSource <' + url_documento + '> '+
                '} } ORDER BY DESC(?date)';
    return query;
};

// modal
function displayAnnotazioni(anns) {
    $('#numeroAnnotazioni').text("Numero annotazioni: " + anns["results"]["bindings"].length);
    $('#modalAnnotazioni').modal({backdrop: 'static', keyboard: false});  // before modal show line!
    $('#modalAnnotazioni').modal('show');
    var out = "";
    var i;
    for (i = 0; i < anns["results"]["bindings"].length; i++) {
        ann = anns["results"]["bindings"][i];
        out += displaySingolaAnnotazione(ann)
    }
    $('#listaAnnotazioni').html(out);
};

// formattazione singola annotazione da visualizzare
function displaySingolaAnnotazione(ann){
    //tipo e contenuto
    out = "";
    if(typeof(ann["type"]) !== "undefined"){
        if(gestioneTipoType(ann["type"]["value"] !== "")){
            out = '<div>Annotazione di tipo type >>> ' + ann["type"]["value"] + " <<< " + gestioneTipoType(ann["type"]["value"]);
            if(ann["type"]["value"] == "denotesRhetoric"){
                out += gestioneRetoriche(ann["body_o"]["value"]) + " >>>" + ann["body_o"]["value"] + '</p>';
            } else {
                if (typeof(ann["body_l"]) !== "undefined") {
                    out += ann["body_l"]["value"] + '</p>';
                } else if (typeof(ann["body_o"]) !== "undefined") {
                    out += ann["body_o"]["value"] + '</p>';
                } else {
                    out += "</p>";
                }
            }
            // provenance e dataora
            out += '<p>Inserita da: '
            if(typeof(ann["prov_label"]) !== "undefined"){
                out += ann["prov_label"]["value"] + " "
            } else if(typeof(ann["prov_nome"]) !== "undefined"){
                out += ann["prov_nome"]["value"] + " "
            } else if(typeof(ann["provenance"]) !== "undefined"){
                out += ann["provenance"]["value"] + " "
            }
            if(typeof(ann["prov_email"]) !== "undefined"){
                out += ann["prov_email"]["value"] + " "
            }
            out += parseDatetime(ann["date"]["value"]) + "</p>";
            out += "</div><br>";
        }
    } else if (typeof(ann["label"]) !== "undefined"){
        out = '<div>Annotazione di tipo label >>> ' + ann["label"]["value"] + " <<< " + gestioneTipoLabel(ann["label"]["value"]);
        if(ann["label"]["value"] == "Retorica" || ann["label"]["value"] == "Rhetoric"){
            out += gestioneRetoriche(ann["body_o"]["value"]) + " >>>" + ann["body_o"]["value"] + '</p>';
        } else {
            if (typeof(ann["body_l"]) !== "undefined") {
                out += ann["body_l"]["value"] + '</p>';
            } else if (typeof(ann["body_o"]) !== "undefined") {
                out += ann["body_o"]["value"] + '</p>';
            } else {
                out += "</p>";
            }
        }
        // provenance e dataora
        out += '<p>Inserita da: '
        if(typeof(ann["prov_label"]) !== "undefined"){
            out += ann["prov_label"]["value"] + " "
        } else if(typeof(ann["prov_nome"]) !== "undefined"){
            out += ann["prov_nome"]["value"] + " "
        } else if(typeof(ann["provenance"]) !== "undefined"){
            out += ann["provenance"]["value"] + " "
        }
        if(typeof(ann["prov_email"]) !== "undefined"){
            out += ann["prov_email"]["value"] + " "
        }
        out += parseDatetime(ann["date"]["value"]) + "</p>";
        out += "</div><br>";
    }
    return out;
}

function get_annotazioni(query, urlDoc){
    $.ajax({
        url: '/getAllAnnotazioni',
        type: 'GET',
        data: {data: query},
        success: function(result) {
            //convert json string to json object
            lista_annotazioni = JSON.parse(result);
            if(lista_annotazioni["results"]["bindings"].length==0){
                //TODO aggionare numero ann di ogni gruppo
                $("#numAnn").text("0");
            } else {
                var init = parseInt($("#numAnn").text());
                var numero = parseInt(lista_annotazioni["results"]["bindings"].length);
                $("#numAnn").text( init + numero );
                displayAnnotazioni(lista_annotazioni); //modale
                highligthFragments(lista_annotazioni, urlDoc); //frammenti evidenziati
            }
        },
        error: function(error) {
            alert("Error: " + error);
        }
    });
};


function highligthFragments(anns, urlDoc){
    for (i = 0; i < anns["results"]["bindings"].length; i++) {
        ann = anns["results"]["bindings"][i];
        fragmentPath = ann["fs_value"]["value"];
        start = ann["start"]["value"];
        end = ann["end"]["value"];

        if(typeof(ann["type"]) !== "undefined"){
            classCSS = getClassNameType(ann["type"]["value"]);
        } else if (typeof(ann["label"]) !== "undefined"){
            classCSS = getClassNameLabel(ann["label"]["value"]);
        } else {
            //se il tipo di annotazione non c'è nè nel campo type nè in label
            classCSS = "";
        }
        if(classCSS !== ""){
            //fragmentPath trasformato in xPath (del documento originale)
            path = getDomXPath(fragmentPath);

            //xPath (del documento originale) trasformato in xPath locale
            var id = urlDoc.replace(/([/|_.|_:|_-])/g, '');
            //if dilib
            path = path.replace("html/body/form/table[3]/tbody/tr/td/table[5]", ".//*[@id='" + id +"']//table/");
            //if rivista statistica
            path = path.replace("html/body/div/div[2]/div[2]/div[3]/", ".//*[@id='" + id +"']/div/div/");

            if(path !== "html/body/"){
                nodo = document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                findCorrectNodo(nodo, start, end, classCSS, ann);
            }
        }
    }
}

function findCorrectNodo(nodo, start, end, classCSS, ann){
    var out;
    if (nodo !== null){
    if (nodo.nodeType == 3){
        //è un nodo di testo
        out = check(nodo, start, end, classCSS, ann);
    } else {
        //scorro tutti i nodi figli del nodo iniziale
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
    }}
    return out;
}

function check(nodo, start, end, classCSS, ann){
    var output;
    lunghezza = nodo.length;

    if (start < 0) {
        start = 0;
    }

    //allora il nodo non è quello corretto
    if(start>=lunghezza){
        output = {inizio: start-lunghezza, fine:end-lunghezza}
    }
    if(start < lunghezza && end <= lunghezza){
        //OK
        fragment = document.createRange();
        fragment.setStart(nodo, parseInt(start));
        fragment.setEnd(nodo, parseInt(end));
        nuovoNodo = document.createElement('span');
        nuovoNodo.className=classCSS;
        nuovoNodo.onclick = function () {
            $("#modalAnnotazioneSingola").modal({backdrop: 'static', keyboard: false});  // before modal show line!
            $("#modalAnnotazioneSingola").modal('show');
            out = displaySingolaAnnotazione(ann);
            $('#infoAnnotazione').html(out);
        };
        fragment.surroundContents(nuovoNodo);
        output = {exit: true}
    }
    if(start < lunghezza && end > lunghezza){
        //OK l'ann si estende anche a un altro nodo
        fragment = document.createRange();
        fragment.setStart(nodo, parseInt(start));
        fragment.setEnd(nodo, parseInt(lunghezza));
        nuovoNodo = document.createElement('span');
        nuovoNodo.className=classCSS;
        nuovoNodo.onclick = function () {
            $("#modalAnnotazioneSingola").modal({backdrop: 'static', keyboard: false});  // before modal show line!
            $("#modalAnnotazioneSingola").modal('show');
            out = displaySingolaAnnotazione(ann);
            $('#infoAnnotazione').html(out);

        };
        fragment.surroundContents(nuovoNodo);
        output={inizio: 0, fine: end-lunghezza, altroNodo: true}

    }
    return output;
}


//trasformazione del fragment path (scritto nel corpo dell'annotazione) in un espressione xPath valida
function getDomXPath(x){
    x = x.toLowerCase();
    if(x.endsWith('_text()')){
        x = x.substring(0, x.length - 7)
    }
    if(x.substring(0, 1) == "/"){
       x = x.substr(1);
    }
    x = x.replace(/\_/g, '/');
    x = x.replace(/\/tr/g, '/tbody/tr');
    x = x.replace(/\[/g, '');
    x = x.replace(/\]/g, '');
    x = x.replace(/0/g, '');
    x = x.replace(/1/g, '');
    if(x.substring(0, 10) == "html/body/"){
       x = x.substr(10);
    }
    if(x.substring(0, 10) !== "html/body/"){
        x = "html/body/" + x;
    }
    var array = x.split("/");
    for (var i = 0; i < array.length; i++) {
        //se contiene numeri
        if (array[i].match(/\d+/)) {
            if (array[i].indexOf('h3') !== -1){
                var suffix = array[i].toString().substring(2, array[i].length);
                if (suffix != 1 && suffix != "")
                {
                    array[i] = 'h3[' + suffix + ']';
                }
                else array[i] = 'h3';
            } else if (array[i].indexOf('h4') !== -1){
                var suffix = array[i].toString().substring(2, array[i].length);
                if (suffix != 1 && suffix != "")
                {
                    array[i] = 'h4[' + suffix + ']';
                }
                else array[i] = 'h4';
            } else if (array[i].indexOf('h2') !== -1){
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
        }
    }
    array.join('/');
    x = array.join('/');
    return x;
}

function gestioneRetoriche(retorica){
    var out = ""
    switch(retorica){
        case "sro:Abstract":
            out = "Abstract.";
            break;
        case "deo:Introduction":
            out = "Introduction.";
            break;
        case "deo:Materials":
            out = "Materials.";
            break;
        case "deo:Methods":
            out = "Methods.";
            break;
        case "deo:Results":
            out = "Results.";
            break;
        case "sro:Discussion":
            out = "Discussion.";
            break;
        case "sro:Conclusion":
            out = "Conclusion.";
            break;
    }
    return out;
};

function getClassNameType(type){
    var classCSS = ""
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
        case "cites":
            classCSS = "highlightCites";
            break;
    }
    return classCSS;
};

function getClassNameLabel(label){
    var classCSS = ""
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
        case "Anno di pubblicazione":
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
            classCSS = "highlightDenotesRhetoric";
            break;
        case "Citation":
        case "Citazione":
            classCSS = "highlightCites";
            break;
    }
    return classCSS;
};

//
function gestioneTipoType(type){
    out = '<span class="filtri, ';
    switch(type){
        case "hasURL":
        case "hasUrl":
            out += 'labelURL"> URL </span> <p>L\'URL di questo documento è ';
            break;
        case "hasTitle":
            out += 'labelTitle"> Title </span> <p>Il titolo di questo documento è ';
            break;
        case "hasPublicationYear":
            out += 'labelPublicationYear"> PublicationYear </span> <p> L\'anno di pubblicazione di questo documento è il ';
            break;
        case "hasDoi":
        case "hasDOI":
            out += 'labelDOI"> DOI </span> <p> Il DOI di questo documento è ';
            break;
        case "hasAuthor":
            out += 'labelAuthor"> Author </span> <p> Un autore di questo documento è ';
            break;
        case "hasComment":
            out += 'labelComment"> Commento </span> <p> Un commento a questo documento è ';
            break;
        case "denotesRhetoric":
            out += 'labelDenotesRhetoric"> DenotesRhetoric </span> </p> <span> Una retorica di questo documento è ';
            break;
        case "cites":
            out += 'labelCites"> Cites </span> <p> Questo documento cita ';
            break;
    }
    return out;
};

function gestioneTipoLabel(label){
    out = '<span class="filtri, ';
    switch(label){
        case "URL":
        case "Url":
            out += 'labelURL"> URL </span> <p> L\'URL di questo documento è ';
            break;
        case "Titolo":
        case "Title":
            out += 'labelTitle"> Title </span> <p> Il titolo di questo documento è ';
            break;
        case "Publication Year":
        case "Anno di pubblicazione":
            out += 'labelPublicationYear"> PublicationYear </span> <p> L\'anno di pubblicazione di questo documento è il ';
            break;
        case "DOI":
        case "Doi":
            out += 'labelDOI"> DOI </span> <p> Il DOI di questo documento è ';
            break;
        case "Autore":
        case "Author":
            out += 'labelAuthor"> Author </span> <p> Un autore di questo documento è ';
            break;
        case "Commento":
            out += 'labelComment"> Commento </span> <p> Un commento a questo documento è ';
            break;
        case "Retorica":
        case "Rhetoric":
            out += 'labelDenotesRhetoric"> DenotesRhetoric </span> <p> Una retorica di questo documento è ';
            break;
        case "Citation":
        case "Citazione":
            out += 'labelCites"> Cites </span> <p> Questo documento cita ';
            break;
    }
    return out;
}

/* parse formato data e ora YYYY-MM-DDTHH:mm */
function parseDatetime(dataAnn){
    return dataAnn = " in data " + dataAnn.replace("T", " alle ") + ".";
};