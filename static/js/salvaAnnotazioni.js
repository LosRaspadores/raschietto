function inviaQuery(listaQuery){
    $.ajax({
        url: "/salvaAnnotazioni",
        data: {"query": listaQuery},
        success: function(result) {
            $('#alertMessage').text("Le nuove annotazioni sono state aggiunte.");
            $('#alertDoc').modal('show');
            //TODO svuotare l'oggetto!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        }
    });
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

function queryFRBRdocument(url_doc){
    if (endsWith(url_doc, ".html")){
        var url_nohtml = url_doc.slice(0, -5);
    } else {
        var url_nohtml = url_doc;
    };
    var query = '<' + url_doc + '> a fabio:item. ' +
        '<' + url_nohtml + '_ver1> a fabio:Expression; ' +
        'fabio:hasRepresentation <' + url_doc + '>. ' +
        '<' + url_nohtml + '> a fabio:Work; ' +
        'fabio:hasPortrayal <' + url_doc + '>; ' +
        'frbr:realization <' + url_nohtml + '_ver1>. ';
    return query;
};

/* ottenere data e ora nel formato specificato YYYY-MM-DDTHH:mm */
function getDateTime(){
    var currentdate = new Date();
    return datetime = currentdate.getFullYear() + "-"
                    + (currentdate.getMonth() + 1) + "-"
                    + currentdate.getUTCDate() + "T"
                    + currentdate.getHours() + ":"
                    + addZero(currentdate.getMinutes());

}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    };
    return i;
}


/* provenance di un annotazione fatta dall'utente correntemente autenticato */
function setProvenanceUtente(){
    var provenance;
    if(sessionStorage.length !== 0){
        provenance = '<mailto:' + sessionStorage.email + '> a foaf:mbox ; ' +
            'schema:email "' + sessionStorage.email + '" ;' +
            'foaf:name "' + sessionStorage.nomecognome  + '"^^xsd:string ; ' +
            'rdfs:label "' + sessionStorage.nomecognome + '"^^xsd:string . ';
    }
    return provenance;
}


function annotazione(url, tipo, datetime, path, start, end, valore, mailautore){
    //TODO controllare annotazioni su citazioni
    var annotazione = "";
    mailautore =  sessionStorage.email;
    var url_nohtml = url.slice(0, -5);
    if (path == "document"){
        start = 0;
        end = 0;
    }

    var target = 'oa:hasTarget [ a oa:SpecificResource ;' +
                 'oa:hasSelector [ a oa:FragmentSelector ;' +
                            'rdf:value "' + path + '"^^xsd:string ;' +
                            'oa:start "' + start + '"^^xsd:nonNegativeInteger ;' +
                            'oa:end "' + end + '"^^xsd:nonNegativeInteger ] ;' +
                 'oa:hasSource <' + url + '> ] .';
    if(tipo == "Titolo"){
            annotazione = '[] a oa:Annotation ;' +
            'rdfs:label "Titolo"^^xsd:string ;' +
            'rsch:type "hasTitle"^^xsd:string ;' +
            'oa:annotatedAt "' + datetime + '"^^xsd:dateTime ;' +
            'oa:annotatedBy <mailto:' + mailautore + '> ;' +
            'oa:hasBody _:title ;' + target +
            '_:title a rdf:Statement;' +
                'rdfs:label "' + valore + '"^^xsd:string ;' +
                'rdf:subject <' + url_nohtml + '_ver1> ;' +
                'rdf:predicate dcterms:title ;' +
                'rdf:object "' + valore + '"^^xsd:string .';
    } else if (tipo == "URL"){
            annotazione = '[] a oa:Annotation ;' +
            'rdfs:label "URL"^^xsd:string ;' +
            'rsch:type "hasURL"^^xsd:string ;' +
            'oa:annotatedAt "' + datetime + '"^^xsd:dateTime ;' +
            'oa:annotatedBy <mailto:' + mailautore + '> ;' +
            'oa:hasBody _:url ;' + target +
            '_:url a rdf:Statement;' +
                'rdfs:label "' + valore + '"^^xsd:string ;' +
                'rdf:subject <' + url_nohtml + '_ver1> ;' +
                'rdf:predicate fabio:hasURL ;' +
                'rdf:object "' + valore + '"^^xsd:anyURL .';
    } else if (tipo == "Anno pubblicazione"){
                annotazione = '[] a oa:Annotation ;' +
                'rdfs:label "Anno di pubblicazione"^^xsd:string ;' +
                'rsch:type "hasPublicationYear"^^xsd:string ;' +
                'oa:annotatedAt "' + datetime + '"^^xsd:dateTime ;' +
                'oa:annotatedBy <mailto:' + mailautore + '> ;' +
                'oa:hasBody _:year ;' + target +
                '_:year a rdf:Statement;' +
                    'rdfs:label "' + valore + '"^^xsd:string ;' +
                    'rdf:subject <' + url_nohtml + '_ver1> ;' +
                    'rdf:predicate fabio:hasPublicationYear ;' +
                    'rdf:object "' + valore + '"^^xsd:date .';
    } else if (tipo == "Autore"){
            uri_autore = setIRIautore(valore);
            annotazione = '[] a oa:Annotation ;' +
                'rdfs:label "Autore"^^xsd:string ;' +
                'rsch:type "hasAuthor"^^xsd:string ;' +
                'oa:annotatedAt "' + datetime + '"^^xsd:dateTime ;' +
                'oa:annotatedBy <mailto:' + mailautore + '> ;' +
                'oa:hasBody _:author ;' + target +
                '_:author a rdf:Statement;' +
                    'rdfs:label "' + valore + '"^^xsd:string ;' +
                    'rdf:subject <' + url_nohtml + '_ver1> ;' +
                    'rdf:predicate dcterms:creator;' +
                    'rdf:object <' + uri_autore +  '>.' +
                '<' + uri_autore +  '> a foaf:Person;' +
                'rdfs:label "' + valore + '"^^xsd:string;' +
                'foaf:made <' + url + '> .';
    } else if (tipo == "DOI"){
            annotazione = '[] a oa:Annotation ;' +
                'rdfs:label "DOI"^^xsd:string ;' +
                'rsch:type "hasDOI"^^xsd:string ;' +
                'oa:annotatedAt "' + datetime + '"^^xsd:dateTime ;' +
                'oa:annotatedBy <mailto:' + mailautore + '> ;' +
                'oa:hasBody _:doi ;' + target +
                '_:doi a rdf:Statement;' +
                    'rdfs:label "' + valore + '"^^xsd:string ;' +
                    'rdf:subject <' + url_nohtml + '_ver1> ;' +
                    'rdf:predicate prism:doi ;' +
                    'rdf:object "' + valore + '"^^xsd:string .';
    } else if (tipo == "Commento"){
            annotazione = '[] a oa:Annotation ;' +
                'rdfs:label "Commento"^^xsd:string ;' +
                'rsch:type "hasComment"^^xsd:string ;' +
                'oa:annotatedAt "' + datetime + '"^^xsd:dateTime ;' +
                'oa:annotatedBy <mailto:' + mailautore + '> ;' +
                'oa:hasBody _:commento ;' + target +
                '_:commento a rdf:Statement;' +
                    'rdfs:label "' + valore + '"^^xsd:string ;' +
                    'rdf:subject <' + url + '#' + path + '> ;' +
                    'rdf:predicate schema:comment;' +
                    'rdf:object "' + valore + '"^^xsd:string .';
    } else if (tipo == "Funzione retorica"){
            annotazione = '[] a oa:Annotation ;' +
                'rdfs:label "Retorica"^^xsd:string ;' +
                'rsch:type "denotesRhetoric"^^xsd:string ;' +
                'oa:annotatedAt "' + datetime + '"^^xsd:dateTime ;' +
                'oa:annotatedBy <mailto:' + mailautore + '> ;' +
                'oa:hasBody _:retoric ;' + target +
                '_:retoric a rdf:Statement;' +
                    'rdfs:label "' + valore + '"^^xsd:string ;' +
                    'rdf:subject <' + url + '#' + path + '> ;' +
                    'rdf:predicate sem:denotes ;' +
                    'rdf:object ' + switchRetorica(valore) + '.';
    } else if (tipo == "Citazione"){
            alert("valore: "+valore)
            annotazione = '[] a oa:Annotation ;' +
                'rdfs:label "Citazione"^^xsd:string ;' +
                'rsch:type "cites"^^xsd:string ;' +
                'oa:annotatedAt "' + datetime + '"^^xsd:dateTime ;' +
                'oa:annotatedBy <mailto:' + mailautore + '> ;' +
                'oa:hasBody _:cite ;' + target +
                '_:cite a rdf:Statement;' +
                    'rdfs:label "' + valore + '"^^xsd:string ;' +
                    'rdf:subject <' + url_nohtml + '_ver1> ;' +
                    'rdf:predicate cito:cites ;' +
                    'rdf:object <' + url_nohtml + 'ver1_cited1>.'+
                '<' + url_nohtml + 'ver1_cited1> rdfs:label "' + valore + '"^^xsd:string.';
    }
    //TODO per quanto riguarda le ANNOTAZIONI SULLE CITAZIONI: il soggetto è già impostato come url_ver1_cited[n] (ciò che si chiama url)

    var documentFRBR = queryFRBRdocument(url);
    annotazione += documentFRBR;
    alert(annotazione)
    return annotazione;
}

function creaQueryInsertAnnotazioni(lista){
    var triple = "";
    for (var i=0; i<lista.annotazioni.length; i++){
        var item = lista.annotazioni[i];
        triple += annotazione(item.url, item.tipo, item.data, item.id, item.start, item.end, item.valore, item.provenance);
    }
    triple += setProvenanceUtente();
    var query = prefissi + "INSERT DATA {GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537> {" + triple + "}}";
    return query;
}

function switchRetorica(valore){
    if(valore == "Abstract"){
        valore = "sro:Abstract";
    }else if(valore == "Introduction"){
        valore = "deo:Introduction";
    }else if(valore == "Materials"){
        valore = "deo:Materials";
    }else if(valore == "Methods"){
        valore = "deo:Methods";
    }else if(valore == "Results"){
         valore = "deo:Results";
    }else if(valore == "Discussion"){
        valore = "sro:Discussion";
    }else if(valore == "Conclusion"){
         valore = "sro:Conclusion";
    }
    return valore;
}
