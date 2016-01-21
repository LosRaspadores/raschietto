/* funzioni annotazioni */

// query che restituisce tutte le annotazioni di un determinato documento
function query_all_annotazioni(nome_grafo, url_documento){
    var query = 'SELECT ?graph ?label ?type ?date ?provenance ?prov_nome ?prov_email ?prov_label ?body_s ?body_p ?body_o ?body_l ?fs_value '+
                '?start ?end '+
                //'FROM NAMED <' + nome_grafo + '>'+
                //'FROM NAMED <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537> ' +
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
                    '} } ORDER BY DESC(?date) ';
    return query;
};

//chiamata ajax
function get_annotazioni(query, urlDoc){
    $.ajax({
        url: '/getAllAnnotazioni',
        type: 'GET',
        data: {data: query},
        success: function(result) {
            //convert json string to json object
            lista_annotazioni = JSON.parse(result);
            if(lista_annotazioni["results"]["bindings"].length !== 0){
                for (i = 0; i < lista_annotazioni["results"]["bindings"].length; i++) {
                    ann = lista_annotazioni["results"]["bindings"][i];
                    fragmentPath = ann["fs_value"]["value"];
                    if(fragmentPath === "" || fragmentPath === "document" || fragmentPath === "Document" || fragmentPath==="html/body/" || fragmentPath==="html/body"){
                        console.log("ANNOTAZIONE SUL DOCUMENTO SENZA FRAGMENT PATH");
                    } else {
                        //Vengono evidenziate sul testo solo le annotazioni su frammento (ovviamente)
                        highligthFragment(fragmentPath, ann, urlDoc);
                    }
                }
                //TODO aggionare numero ann totali per il documento
                displayAnnotazioni(lista_annotazioni); //modale
            } else {
                alert("Non ci sono annotazioni per il documento selezionato.");
            }
             scraper(lista_annotazioni,urlDoc);
        },
        error: function(error) {
            alert("Error: " + error);
        }
    });

};

function scraper(anns,urlDoc){
    alert('ciao222...'+urlDoc);
    $findTitle = false;
    $findAuthor = false;
    $findDoi = false;
    $findYears = false;

    for (i = 0; i < anns["results"]["bindings"].length; i++) {
        ann = anns["results"]["bindings"][i];
        ann_out = displaySingolaAnnotazione(ann);
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

}



           /*
            if(tipo_ann !== "") {
            //alert("tipo="+ tipo_ann);  //tipi_ann == definisce i tipi delle annotazioni
            out = '<div><span class ="filtri">Annotazione di tipo ' + tipo_ann;
            if(ann["type"]["value"] === "denotesRhetoric"){
                ret = gestioneRetoriche(ann["body_o"]["value"]);
                if(ret !== ""){
                    out += ret + '</p>';
                } else {
                    out += ann["body_o"]["value"];
                }
            } else {
                if (typeof(ann["body_l"]) !== "undefined") {
                    out += ann["body_l"]["value"] + " ";
                    //alert("body_l "+out);
                }
                if (typeof(ann["body_o"]) !== "undefined") {
                    out += ann["body_o"]["value"];
                    //alert("body_o "+ out);
                }
                out += ".</p>";   // ottengo l'annotazione completa di tipo
                //alert("out111="+ out);
                }
                //console.log("111="+out);
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
            }    //console.log("222="+out);
        } else if (typeof(ann["label"]) !== "undefined"){
            tipo_ann = gestioneTipoLabel(ann["label"]["value"]);
            if(tipo_ann !== ""){
                 out = '<div><span class="filtri">Annotazione di tipo ' + tipo_ann;
            if(ann["label"]["value"] === "Retorica" || ann["label"]["value"] === "Rhetoric"){
                ret = gestioneRetoriche(ann["body_o"]["value"]);
                if(ret !== ""){
                    out += ret + '</p>';
                } else {
                    out += ann["body_o"]["value"];
                }
            } else {
                if (typeof(ann["body_l"]) !== "undefined") {
                    out += ann["body_l"]["value"] + " ";
                }
                if (typeof(ann["body_o"]) !== "undefined") {
                    out += ann["body_o"]["value"];
                }
                out += ".</p>";
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
        } console.log("elenco delle annotazioni complete"+out); // mi stampo sulla console l'elenco delle annotazioni completete
   */






         // if((ann["type"]["value"]) == "hasTitle") {
          //   console.log("trovato il titolo="+ out);
          //    //console.log("prevenance="+ann["prov_label"]["value"]);
          // }


       /* if((ann["type"]["value"]) == "hasDOI") {
          console.log("trovato il DOI="+ out);
        }

        if((ann["type"]["value"]) == "hasAuthor") {
        console.log("trovato l'autore="+ out);
        }

        if((ann["type"]["value"]) == "hasPublicationYear") {
        console.log("trovato l'anno="+ out);
        }


       */




    //console.log("fine="+out);
    //return out;

    $('#buttonScraper').click(function(){
        var href = $("ul.nav.nav-tabs li.active a").attr("id");
        scraper();
    });


// modal
function displayAnnotazioni(anns) {
    var numeroAnnotazioni = 0;
    $('#modalAnnotazioni').modal({backdrop: 'static', keyboard: false});  // before modal show line!
    $('#modalAnnotazioni').modal('show');
    var out = "";
    var i;
    for (i = 0; i < anns["results"]["bindings"].length; i++) {
        ann = anns["results"]["bindings"][i];
        ann_out = displaySingolaAnnotazione(ann);
        if(ann_out !== ""){
            out += ann_out;
            numeroAnnotazioni += 1;
        }
    }
    console.log("Numero totale annotazioni: " + anns["results"]["bindings"].length + ", effettive non scartate: " + numeroAnnotazioni);
    $('#numeroAnnotazioni').text("Numero totale annotazioni: " + numeroAnnotazioni);
    $('#listaAnnotazioni').html(out);
};

// formattazione singola annotazione da visualizzare
function displaySingolaAnnotazione(ann){
    //tipo e contenuto
    out = "";
    if(typeof(ann["type"]) !== "undefined"){
        tipo_ann = gestioneTipoType(ann["type"]["value"]);
        if(tipo_ann !== "") {
            //alert("tipo="+ tipo_ann);  //tipi_ann == definisce i tipi delle annotazioni
            out = '<div><span class ="filtri">Annotazione di tipo ' + tipo_ann;
            if(ann["type"]["value"] === "denotesRhetoric"){
                ret = gestioneRetoriche(ann["body_o"]["value"]);
                if(ret !== ""){
                    out += ret + '</p>';
                } else {
                    out += ann["body_o"]["value"];
                }
            } else {
                if (typeof(ann["body_l"]) !== "undefined") {
                    out += ann["body_l"]["value"] + " ";
                    //alert("body_l "+out);
                }
                if (typeof(ann["body_o"]) !== "undefined") {
                    out += ann["body_o"]["value"];
                    //alert("body_o "+ out);
                }
                out += ".</p>";   // ottengo l'annotazione completa di tipo
                //alert("out111="+ out);
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
        tipo_ann = gestioneTipoLabel(ann["label"]["value"]);
        if(tipo_ann !== ""){
            out = '<div><span class="filtri">Annotazione di tipo ' + tipo_ann;
            if(ann["label"]["value"] === "Retorica" || ann["label"]["value"] === "Rhetoric"){
                ret = gestioneRetoriche(ann["body_o"]["value"]);
                if(ret !== ""){
                    out += ret + '</p>';
                } else {
                    out += ann["body_o"]["value"];
                }
            } else {
                if (typeof(ann["body_l"]) !== "undefined") {
                    out += ann["body_l"]["value"] + " ";
                }
                if (typeof(ann["body_o"]) !== "undefined") {
                    out += ann["body_o"]["value"];
                }
                out += ".</p>";
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
    }
    return out;
}



function highligthFragment(fragmentPath, ann, urlDoc) {

    start = ann["start"]["value"];
    end = ann["end"]["value"];

    if(typeof(ann["type"]) !== "undefined"){
        classCSS = getClassNameType(ann["type"]["value"]);      //collega tipo del fragment alla classe definita per tipo
    } else if (typeof(ann["label"]) !== "undefined"){
        classCSS = getClassNameLabel(ann["label"]["value"]);
    } else {
        //se il tipo di annotazione non c'è nè nel campo type nè in label l'annotazione viene scartata
        classCSS = "";
    }
    if(classCSS !== ""){
        //fragmentPath trasformato in xPath (del documento originale)
        path = getDomXPath(fragmentPath);

        //xPath (del documento originale) trasformato in xPath locale
        var id = urlDoc.replace(/([/|_.|_:|_-])/g, '');

        //if dilib
        if (path.indexOf('tbody') == -1 ) { // se non c'è tbody
            path = path.replace(/\/tr/g, '/tbody[1]/tr[1]');
        }
        path = path.replace("form[1]/table[3]/tbody[1]/tbody/tr[1]/td[1]/table[5]", ".//*[@id='" + id +"']//table/");
        path = path.replace("form[1]/table[3]/tbody[1]/tr[1]/td[1]/table[5]", ".//*[@id='" + id +"']//table/");
        path = path.replace("form[1]/table[3]/tbody/tr[1]/td[1]/table[5]", ".//*[@id='" + id +"']//table/");
        path = path.replace("form[1]/table[3]/tr[1]/td[1]/table[5]", ".//*[@id='" + id +"']//table/");
        path = path.replace("form/table[3]/tbody[1]/tbody/tr[1]/td[1]/table[5]", ".//*[@id='" + id +"']//table/");
        path = path.replace("form/table[3]/tbody[1]/tr[1]/td[1]/table[5]", ".//*[@id='" + id +"']//table/");
        path = path.replace("form/table[3]/tbody[1]/tr[1]/td/table[5]", ".//*[@id='" + id +"']//table/");
        path = path.replace("form/table[3]/tbody[1]/tr/td/table[5]", ".//*[@id='" + id +"']//table/");
        path = path.replace("form/table[3]/tbody/tr[1]/td[1]/table[5]", ".//*[@id='" + id +"']//table/");
        path = path.replace("form/table[3]/tbody/tr[1]/td/table[5]", ".//*[@id='" + id +"']//table/");
        path = path.replace("form/table[3]/tbody/tr/td/table[5]", ".//*[@id='" + id +"']//table/");
        path = path.replace("form/table[3]/tr[1]/td/table[5]", ".//*[@id='" + id +"']//table/");
        path = path.replace("form/table[3]/tr/td/table[5]", ".//*[@id='" + id +"']//table/");

        //if rivista statistica
        path = path.replace("div/div[2]/div[2]/div[3]/", ".//*[@id='" + id +"']/div/div/");
        path = path.replace("div[1]/div[2]/div[2]/div[2]/", ".//*[@id='" + id +"']/div/div/");
        path = path.replace("div[1]/div[2]/div[2]/div[3]/", ".//*[@id='" + id +"']/div/div/");

        //if antropologia e teatro
        path = path.replace("div/div/div/div/", ".//*[@id='" + id +"']/div/div/");
        path = path.replace("div/div[3]/div[2]/div[3]/", ".//*[@id='" + id +"']/div/div/");

        //if rivista statistica o if antropologia e teatro
        path = path.replace("div/div[2]/div[2]/div[2]/", ".//*[@id='" + id +"']/div/div/");

        nodo = document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        findCorrectNodo(nodo, start, end, classCSS, ann);
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
        }
    }
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
        //OK nodo corretto
        fragment = document.createRange();
        fragment.setStart(nodo, parseInt(start));
        fragment.setEnd(nodo, parseInt(end));        //sezioni del documento
        //alert("fragment="+fragment);
        nuovoNodo = document.createElement('span');
        nuovoNodo.className=classCSS;     //ottiene le sezioni del documento divise per classe-tipo

        //alert("nuovoNodo"+ nuovoNodo.className)

        nuovoNodo.onclick = function () {
            $("#modalAnnotazioneSingola").modal({backdrop: 'static', keyboard: false});  // before modal show line!
            $("#modalAnnotazioneSingola").modal('show');
            out_ann = displaySingolaAnnotazione(ann);

            ////
            //alert("out_ann1"+out_ann);
            //alert("tipo="+gestioneTipoType(ann["type"]["value"]));
            ////
            $('#infoAnnotazione').append(out_ann);
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
            out_ann = displaySingolaAnnotazione(ann);
            alert("out_ann2"+out_ann);
            $('#infoAnnotazione').append(out_ann);
        };
        fragment.surroundContents(nuovoNodo);

        output={inizio: 0, fine: end-lunghezza, altroNodo: true}
    }
    return output;
}


//trasformazione del fragment path (scritto nel corpo dell'annotazione) in un espressione xPath valida
function getDomXPath(x){
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
            out = '<span class="filtri labelTitle"> Title </span> </span> <p>Il titolo di questo documento è ';
            break;
        case "hasPublicationYear":
            out = '<span class="filtri labelPublicationYear"> PublicationYear </span> </span> <p> L\'anno di pubblicazione di questo documento è il ';
            break;
        case "hasDoi":
        case "hasDOI":
            out = '<span class="filtri labelDOI"> DOI </span> </span> <p> Il DOI di questo documento è ';
            break;
        case "hasAuthor":
            out = '<span class="filtri labelAuthor"> Author </span> </span> <p> Un autore di questo documento è ';
            break;
        case "hasComment":
            out = '<span class="filtri labelComment"> Commento </span> </span> <p> Un commento a questo documento è ';
            break;
        case "denotesRhetoric":
            out = '<span class="filtri labelDenotesRhetoric"> DenotesRhetoric </span> </span> </p> <span> Una retorica di questo documento è ';
            break;
        case "Cites":
        case "cites":
        //case "references":
        //case "Reference":
            out = '<span class="filtri labelCites"> Cites </span> </span> <p> Questo documento cita ';
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
            out = '<span class="filtri labelTitle"> Title </span> </span> <p> Il titolo di questo documento è ';
            break;
        case "PublicationYear":
        case "Publication Year":
        case "Anno di pubblicazione":
            out = '<span class="filtri labelPublicationYear"> PublicationYear </span> </span> <p> L\'anno di pubblicazione di questo documento è il ';
            break;
        case "DOI":
        case "Doi":
            out = '<span class="filtri labelDOI"> DOI </span> </span> <p> Il DOI di questo documento è ';
            break;
        case "Autore":
        case "Author":
            out = '<span class="filtri labelAuthor"> Author </span> </span> <p> Un autore di questo documento è ';
            break;
        case "Commento":
            out = '<span class="filtri labelComment"> Commento </span> </span> <p> Un commento a questo documento è ';
            break;
        case "Retorica":
        case "Rhetoric":
            out = '<span class="filtri labelDenotesRhetoric"> DenotesRhetoric </span> </span> <p> Una retorica di questo documento è ';
            break;
        case "Citation":
        case "Citazione":
        //case "refecences":
        //case "Reference":
            out = '<span class="filtri labelCites"> Cites </span> </span> <p> Questo documento cita ';
            break;
    }
    return out;
}

/* parse formato data e ora YYYY-MM-DDTHH:mm */
function parseDatetime(dataAnn){
    return dataAnn = " in data " + dataAnn.replace("T", " alle ") + ".";
}