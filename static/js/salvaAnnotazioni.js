

   // invia le query insert e delete-insert
   $("#salvaGest").click(function(){

        var annotazioni = {"annotazioni": [
                       {
                           "data": "2016-1-27T21:20",
                           "end": 15,
                           "id": "form1_table3_tbody_tr_td_table5_tbody1_tr1_td1_table1_tbody1_tr1_td2_p2",
                           "oggetto": "Daniel Stein",
                           "provenance": "silviaperrino93@gmail.com",
                           "source": "http://www.dlib.org/dlib/september14/jettka/09jettka.html",
                           "start": 0,
                           "target": "target",
                           "tipo": "Autore"
                       },
                       {
                           "data": "2016-1-27T21:21",
                           "end": 171,
                           "id": "form1_table3_tbody_tr_td_table5_tbody1_tr1_td1_table1_tbody1_tr1_td2_p2",
                           "oggetto": "Il doi del documento",
                           "provenance": "silviaperrino93@gmail.com",
                           "source": "http://www.dlib.org/dlib/september14/jettka/09jettka.html",
                           "start": 139,
                           "target": "target",
                           "tipo": "DOI"
                       },
                       {
                           "data": "2016-1-27T21:22",
                           "end": 160,
                           "id": "form1_table3_tbody_tr_td_table5_tbody1_tr1_td1_table1_tbody1_tr1_td2_p2",
                           "oggetto": "L'url è http://www.dlib.org/dlib/september14/jettka/09jettka.html",
                           "provenance": "silviaperrino93@gmail.com",
                           "source": "http://www.dlib.org/dlib/september14/jettka/09jettka.html",
                           "start": 148,
                           "target": "target",
                           "tipo": "URL"
                       },
                       {
                           "data": "2016-1-27T21:22",
                           "end": 171,
                           "id": "form1_table3_tbody_tr_td_table5_tbody1_tr1_td1_table1_tbody1_tr1_td2_p2",
                           "oggetto": "2014",
                           "provenance": "silviaperrino93@gmail.com",
                           "source": "http://www.dlib.org/dlib/september14/jettka/09jettka.html",
                           "start": 139,
                           "target": "target",
                           "tipo": "Anno pubblicazione"
                       },
                       {
                           "data": "2016-1-27T21:22",
                           "end": 7,
                           "id": "form1_table3_tbody_tr_td_table5_tbody1_tr1_td1_table1_tbody1_tr1_td2_p3_a1",
                           "oggetto": "bla",
                           "provenance": "silviaperrino93@gmail.com",
                           "source": "http://www.dlib.org/dlib/september14/jettka/09jettka.html",
                           "start": 0,
                           "target": "target",
                           "tipo": "Commento"
                       },
                       {
                           "data": "2016-1-27T21:23",
                           "end": "",
                           "id": "",
                           "oggetto": "Abstract",
                           "provenance": "silviaperrino93@gmail.com",
                           "source": "http://www.dlib.org/dlib/september14/jettka/09jettka.html",
                           "start": "",
                           "target": "target",
                           "tipo": "Funzione retorica"
                       },
                       {
                           "data": "2016-1-27T21:23",
                           "end": 104,
                           "id": "form1_table3_tbody_tr_td_table5_tbody1_tr1_td1_table1_tbody1_tr1_td2_h32",
                           "oggetto": "Titolo del doc",
                           "provenance": "silviaperrino93@gmail.com",
                           "source": "http://www.dlib.org/dlib/september14/jettka/09jettka.html",
                           "start": 0,
                           "target": "target",
                           "tipo": "Titolo"
                       }
                   ]
              };
        var query = creaQueryInsertAnnotazioni(annotazioni);
//        $.ajax({
//            url: "/salvaAnnotazioni",
//            data: {"query": query},
//            success: function(result) {
//                $('#alertMessage').text("Le nuove annotazioni sono state aggiunte.");
//                $('#alertDoc').modal('show');
//                //TODO svuotare l'oggetto!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//            }
//        });
   });

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
        'PREFIX foaf: <http://xmlns.com/foaf/0.1/>';

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

    //var url_doc = "http://www.dlib.org/dlib/july15/downs/07downs.html";
    //queryFRBRdocument(url_doc);

    /* gestione nomi autori articoli per IRI*/
    function setIRIautore(nome_autore){
        nome_autore = nome_autore.trim();
        nome_autore = nome_autore.toLowerCase();
        nome_autore = nome_autore.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        var rExps=[
            {re:/[\xE0-\xE6]/g, ch:'a'},
            {re:/[\xE8-\xEB]/g, ch:'e'},
            {re:/[\xEC-\xEF]/g, ch:'i'},
            {re:/[\xF2-\xF6]/g, ch:'o'},
            {re:/[\xF9-\xFC]/g, ch:'u'}];
        var len = rExps.length;
        for(var i = 0; i < len; i++){
            nome_autore = nome_autore.replace(rExps[i].re, rExps[i].ch);
        }
        var prefix_rsch = "http://vitali.web.cs.unibo.it/raschietto/person/";
        var uri = prefix_rsch;  //=prefix/[inizialeprimonome]-[cognome]
        var array = nome_autore.split(" ");
        var length = array.length;
        if (length == 1){
            uri += array[0];
        } else if (length == 2){
            uri += array[0].substring(0, 1) + "-" + array[1];
        } else if (length == 3){
            uri += array[0].substring(0, 1) + "-" + array[1] + array[2];
        } else {
            uri += array[0].substring(0, 1) + "-" + array[length-2] + array[length-1];
        }
        return uri;
    }

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
        var annotazione = "";
        mailautore =  sessionStorage.email;
        var url_nohtml = url.slice(0, -5);
        if (path == ""){
            path = "document";
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
                '[] a oa:Annotation ;' +
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
                    '<' + url_nohtml + 'ver1_cited1> rdfs:label ' + valore + '^^xsd:string.';
        }

        var documentFRBR = queryFRBRdocument(url);
        annotazione += documentFRBR;
        return annotazione;
    }

    function creaQueryInsertAnnotazioni(lista){
        var triple = "";
        for (var i=0; i<lista.annotazioni.length; i++){
            var item = lista.annotazioni[i];
            triple += annotazione(item.source, item.tipo, item.data, item.id, item.start, item.end, item.oggetto, item.provenance);
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

function creaQueryUpdate(annotazione){
    query_delete = ' WITH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537> '+
            ' DELETE { '+
            '?a oa:annotatedAt "'+ annotazione.date.value+'"^^xsd:dateTime; '+
            'oa:annotatedBy <'+ annotazione.provenance.value+'> . ';
    query_insert = 'INSERT { '+
                   '?a oa:annotatedAt "'+ annotazione.update.data_mod+'"^^xsd:dateTime; '+
                   'oa:annotatedBy '+ annotazione.update.autore +' . ';
    query_end = 'WHERE { '+
                '?a a oa:Annotation; '+
                'oa:annotatedAt "'+ annotazione.date.value+'"^^xsd:dateTime; '+
                'oa:annotatedBy <'+ annotazione.provenance.value+">; "+
                'rsch:type "'+annotazione.type.value+'"^^xsd:string . '+
                '?a oa:hasBody ?body . '+
                '?a oa:hasTarget ?target . '+
                '?target oa:hasSelector ?sel . '+
                '?body rdf:subject <'+annotazione.body_s.value+'> . }';

    if(typeof(annotazione.update.tipo) != "undefined"){
        query_delete += '?a rsch:type "'+annotazione.type.value+'"^^xsd:string . '+
                 '?a rdfs:label "'+annotazione.label.value+'"^^xsd:string . ';
        query_insert += '?a rsch:type "'+typeToIng(annotazione.update.tipo)+'"^^xsd:string . '+
                        '?a rdfs:label "'+annotazione.update.label_tipo+'"^^xsd:string . ';
    }

    if(typeof(annotazione.update.oggetto) != "undefined"){
        if(typeof(annotazione.update.tipo) != "undefined"){
            tipo = annotazione.update.tipo;
        } else {
            tipo = annotazione.label.value;
        }
        if(tipo.toLowerCase() == "doi" || tipo.toLowerCase() == "titolo" || tipo.toLowerCase() == "commento"){
            query_delete += '?body rdf:object "'+ annotazione.body_o.value+'"^^xsd:string; '+
                        'rdfs:label "'+annotazione.body_l.value+'"^^xsd:string . ';
            query_insert += '?body rdf:object "'+ annotazione.update.oggetto+'"^^xsd:string ; '+
                        'rdfs:label "'+annotazione.update.label_oggetto+'"^^xsd:string . ';
        } else if(tipo.toLowerCase() == "url"){
            query_delete += '?body rdf:object "'+ annotazione.body_o.value+'"^^xsd:anyURL; '+
                        'rdfs:label "'+annotazione.body_l.value+'"^^xsd:string . ';
            query_insert += '?body rdf:object "'+ annotazione.update.oggetto+'"^^xsd:anyURL ; '+
                        'rdfs:label "'+annotazione.update.label_oggetto+'"^^xsd:string . ';
        } else if(tipo.toLowerCase() == "anno"){
            query_delete += '?body rdf:object "'+ annotazione.body_o.value+'"^^xsd:date; '+
                        'rdfs:label "'+annotazione.body_l.value+'"^^xsd:string . ';
            query_insert += '?body rdf:object "'+ annotazione.update.oggetto+'"^^xsd:date ; '+
                        'rdfs:label "'+annotazione.update.label_oggetto+'"^^xsd:string . ';
        } else if(tipo.toLowerCase() == "autore"){
            query_delete += '?body rdf:object <'+ annotazione.body_o.value+'> ; '+
                    'rdfs:label "'+annotazione.body_l.value+'"^^xsd:string . ';
            query_insert += '?body rdf:object <'+ setIRIautore(annotazione.update.oggetto) +'> ; '+
                    'rdfs:label "'+annotazione.update.label_oggetto+'"^^xsd:string . ';
        } else if(tipo.toLowerCase() == "retorica"){
            query_delete += '?body rdf:object <'+ annotazione.body_o.value +'> ; '+
                    'rdfs:label "'+annotazione.body_l.value+'"^^xsd:string . ';
            query_insert += '?body rdf:object '+ switchRetorica(annotazione.update.oggetto) +' ; '+
                    'rdfs:label "'+annotazione.update.label_oggetto+'"^^xsd:string . ';
        } else if(tipo.toLowerCase() == "citazione"){
            query_delete += '?body rdf:object <'+ annotazione.body_o.value +'> ; '+
                    'rdfs:label "'+annotazione.body_l.value+'"^^xsd:string . ';
            query_insert += '?body rdf:object <'+ annotazione.update.oggetto +'> ; '+
                    'rdfs:label "'+annotazione.update.label_oggetto+'"^^xsd:string . ';
        }
    }

    if(typeof(annotazione.update.path) != "undefined"){
        query_delete += '?sel rdf:value "'+annotazione.fs_value.value+'"^^xsd:string; '+
                 'oa:start "'+annotazione.start.value+'"^^xsd:nonNegativeInteger; '+
                 'oa:end "'+annotazione.end.value+'"^^xsd:nonNegativeInteger . ';

        query_insert += '?sel rdf:value "'+annotazione.update.path+'"^^xsd:string; '+
                        'oa:start "'+annotazione.update.start_fragm+'"^^xsd:nonNegativeInteger ; '+
                        'oa:end "'+annotazione.update.end_fragm+'"^^xsd:nonNegativeInteger . ';

        // se e' stato modificato il path di un'annotazione di tipo commento o retorica, si deve aggiornare anche il soggetto del body
        if(tipo.toLowerCase() == "commento" || tipo.toLowerCase() == "retorica"){
            query_delete += '?body rdf:subject <'+ annotazione.body_s.value+'> . ';
            query_insert += '?body rdf:subject <'+annotazione.target.value.replace('.html', '_ver1#')+annotazione.update.path+'-'+annotazione.update.start_fragm+'-'+annotazione.update.end_fragm+'> . ';
        }
    }

    query_delete += ' } ';
    query_insert += ' } ';
    query = prefissi + query_delete + query_insert + query_end;
    return query;
}

function creaQueryDelete(annotazione){
    var oggetto = "";
    if(annotazione.type.value == "hasPublicationYear"){
        oggetto = '"'+annotazione.body_o.value+'"^^xsd:date';
    } else if(annotazione.type.value == "hasURL"){
        oggetto = '"'+annotazione.body_o.value+'"^^xsd:anyURL';
    } else if(annotazione.type.value == "cites" || annotazione.type.value == "denotesRhetoric" || annotazione.type.value == "hasAuthor"){
        oggetto = annotazione.body_o.value;
    } else {
        oggetto = '"'+annotazione.body_o.value+'"^^xsd:string';
    }

    var query = prefissi;
    var urlDoc = $("ul.nav.nav-tabs li.active a").attr("id");
    query += ' WITH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537> '+
             'DELETE { ?a ?p ?o . ?body ?bp ?bo . ?target ?tp ?to . ?selector ?sp ?so .} '+
            ' WHERE { ' +
            '?a a oa:Annotation . '+
            '?a rdfs:label "'+  annotazione.label.value +'"^^xsd:string . ' +
            '?a rsch:type "'+ annotazione.type.value +'"^^xsd:string . ' +
            '?a oa:annotatedAt "'+ annotazione.date.value +'"^^xsd:dateTime . ' +
            '?a oa:annotatedBy <'+ annotazione.provenance.value +'>  . ' +
            '?a oa:hasBody ?body . '+
            '?a oa:hasTarget ?target . '+
            '?target a oa:SpecificResource . '+
            '?target oa:hasSelector ?selector . ' +
            '?selector a oa:FragmentSelector . ' +
            '?selector rdf:value "'+ annotazione.fs_value.value +'"^^xsd:string . ' +
            '?selector oa:start "'+ annotazione.start.value +'"^^xsd:nonNegativeInteger . '+
            '?selector oa:end "'+ annotazione.end.value +'"^^xsd:nonNegativeInteger . ' +
            '?target oa:hasSource <'+ urlDoc +'> . '+
            '?body a rdf:Statement . '+
            '?body rdfs:label "'+ annotazione.body_l.value +'"^^xsd:string . ' +
            '?body rdf:subject <'+ annotazione.body_s.value +'> . '+
            '?body rdf:predicate <'+ annotazione.body_p.value +'> . '+
            '?body rdf:object '+ oggetto +' . '+
            '?a ?p ?o . '+
            '?target ?tp ?to . '+
            '?selector ?sp ?so . '+
            '?body ?bp ?bo . }';
    return query;
}

function creaTripleAutore(nome, urlDoc){
    triple ='PREFIX foaf:  <http://xmlns.com/foaf/0.1/> '+
            'PREFIX rdfs:  <http://www.w3.org/2000/01/rdf-schema#> '+
            'PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#> '+
            '<'+setIRIautore(nome)+'> a foaf:Person; '+
            'rdfs:label "'+nome+'"^^xsd:string; '+
            'foaf:made <'+urlDoc+'> .';
    return triple;
}

function creaTriplaCit(urlDoc, citazione){
    //if(urlDoc.indexOf(".html") != -1){
    urlDoc = urlDoc.replace(".html", "_ver1");
    //TODO completare con numero citazione
    cit = "<"+urlDoc+">";
    return cit;
}