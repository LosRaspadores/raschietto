$(document).ready(function() {

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

});