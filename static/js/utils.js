/*
            var lista_annotazioni = {
                {
                    "url": "urlDoc",
                    "listaGrafi": [
                        {
                            "grafo": "nomeGrafo",
                            "annotazioni": [
                                {},
                                {}
                            ]
                        },
                        {}
                    ]
                },
                {
                    "url": "urldDoc2",
                    "listaGrafi": [
                        {
                            "grafo": "nomeGrafo",
                            "annotazioni": [
                                {},
                                {}
                            ]
                        },
                        {}
                    ]
                }
            }


*/

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

/*
console.log(setIRIautore(" M�rio  "));
console.log(setIRIautore("Mar�o   Rossi"));
console.log(setIRIautore("Ma&rio D� R�ssi  "));
console.log(setIRIautore("M. D� Rossi"));
console.log(setIRIautore("M{ar}io De Rossi B*ian;chi"));
console.log(setIRIautore("M[a]ri� De Rossi Bianc.;h:i V�rdi Gialli"));
*/


/* ottenere data e ora nel formato specificato YYYY-MM-DDTHH:mm */
function getDateTime(){
    console.log("date time")
    var currentdate = new Date();
    return datetime = currentdate.getFullYear() + "-"
                    + addZero(currentdate.getMonth()+1)  + "-"
                    + addZero(currentdate.getUTCDate()) + "T"
                    + addZero(currentdate.getHours()) + ":"
                    + addZero(currentdate.getMinutes());

}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

/* provenance di un annotazione fatta dall'utente correntemente autenticato */
function setProvenanceUtente(){
    var provenance;
    if(sessionStorage.length !== 0){
        provenance = "<mailto:" + sessionStorage.email + "> a foaf:mbox ; " +
            "schema:email " + sessionStorage.email + " ;"+
            "foaf:name " + sessionStorage.nomecognome  + "^^xsd:string ; " +
            "rdfs:label " + sessionStorage.nomecognome + "^^xsd:string . ";
        }
    return provenance;
}

/* provenance di un annotazione fatta dallo scraper automatico  */
function setProvenanceGruppo(){
    var provenance;
    if(sessionStorage.length !== 0){
        provenance = '<mailto:los.raspadores@gmail.com> a foaf:mbox ; ' +
            'schema:email los.raspadores@gmail.com ; ' +
            'foaf:name "LosRaspadores"^^xsd:string ; ' +
            'rdfs:label "LosRaspadores"^^xsd:string . ' ;
    }
    return provenance;
}

var listaAllAnnotazioni = [];
var listaAnnotGrafo1537 = [];

 
function salvaAnnotazioniJSON(url, listaAnnotazioni){
    annot_grafo = {};
    annot_grafo['url'] = url;
    annot_grafo['listaGrafi'] = [];
    for(j = 0; j < listaGruppiCompleta.length; j++){
        item = {};
        item['grafo'] = listaGruppiCompleta[j]['url'];
        item['annotazioni'] = searchAnnot(listaGruppiCompleta[j]['url'].substring(47, 54), listaAnnotazioni);
        annot_grafo['listaGrafi'].push(item);
    }

    listaAllAnnotazioni.push(annot_grafo);
}

function searchAnnot(gruppo, listaAnnotazioni){
    lista = [];
    for(i = 0; i < listaAnnotazioni.length; i++){
        if(listaAnnotazioni[i].graph.value.indexOf(gruppo) >= 0){
            lista.push(listaAnnotazioni[i]);
        }
    }
    return lista;
}

function annotDaGestire(url, gruppo){
    annot_doc = {};
    annot_doc['url'] = url;
    annot_doc['annotazioni'] = [];
    for(k = 0; k < listaAllAnnotazioni.length; k++){
        if(listaAllAnnotazioni[k].url == url){
            for(s = 0; s < listaAllAnnotazioni[k].listaGrafi.length; s++){
                if(listaAllAnnotazioni[k].listaGrafi[s].grafo == gruppo){
                    for(t = 0; t < listaAllAnnotazioni[k].listaGrafi[s].annotazioni.length; t++){
                        console.log(listaAllAnnotazioni[k].listaGrafi[s].annotazioni[t]);
                        annot_doc['annotazioni'].push(listaAllAnnotazioni[k].listaGrafi[s].annotazioni[t]);
                    }
                    break;
                } else if(gruppo == 'all'){
                    for(t = 0; t < listaAllAnnotazioni[k].listaGrafi[s].annotazioni.length; t++){
                        console.log(listaAllAnnotazioni[k].listaGrafi[s].annotazioni[t]);
                        annot_doc['annotazioni'].push(listaAllAnnotazioni[k].listaGrafi[s].annotazioni[t]);
                    }
                }
            }
            break;
        }
    }
    listaAnnotGrafo1537.push(annot_doc);
    return annot_doc['annotazioni'];
}

function filtriGruppo(gruppo, urlDoc){
    ann_filtri = annotDaGestire(urlDoc, gruppo);

    if(ann_filtri.length == 0){
        $('#alertMessage').text("Non ci sono annotazioni di questo gruppo per il documento selezionato.");
        $('#alertDoc').modal('show');
    } else {
        $('span[class*="highlight"]').contents().unwrap();
        for(l = 0; l < ann_filtri.length; l++){
            fragmentPath = ann_filtri[l]["fs_value"]["value"];
            if(fragmentPath == "" || fragmentPath == "document" || fragmentPath == "Document" || fragmentPath == "html/body/" || fragmentPath == "html/body"){
                console.log("ANNOTAZIONE SUL DOCUMENTO SENZA FRAGMENT PATH");
            } else {
                highligthFragment(fragmentPath, ann_filtri[l], urlDoc);
            }
        }
    }
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

function typeToIta(type){
    out = "";
    switch(type){
        case "hasURL":
            out = 'URL';
            break;
        case "hasTitle":
            out = 'Titolo';
            break;
        case "hasPublicationYear":
            out = 'Anno pubblicazione';
            break;
        case "hasDOI":
            out = 'DOI';
            break;
        case "hasAuthor":
            out = 'Autore';
            break;
        case "hasComment":
            out = 'Commento';
            break;
        case "denotesRhetoric":
            out = 'Funzione retorica';
            break;
        case "cites":
            out = 'Citazione';
            break;
    }
    return out;
};

function typeToIng(type){
    out = "";
    switch(type){
        case "URL":
            out = 'hasURL';
            break;
        case "Titolo":
            out = 'hasTitle';
            break;
        case "Anno pubblicazione":
            out = 'hasPublicationYear';
            break;
        case "DOI":
            out = 'hasDOI';
            break;
        case "Autore":
            out = 'hasAuthor';
            break;
        case "Commento":
            out = 'hasComment';
            break;
        case "Funzione retorica":
            out = 'denotesRhetoric';
            break;
        case "Citazione":
            out = 'cites';
            break;
    }
    return out;
}

function getPredicato(type){
    out = "";
    switch(type){
        case "url":
            out = ' rdf:predicate fabio:hasURL . ';
            break;
        case "titolo":
            out = ' rdf:predicate dcterms:title . ';
            break;
        case "anno pubblicazione":
            out = ' rdf:predicate fabio:hasPublicationYear . ';
            break;
        case "doi":
            out = ' rdf:predicate prism:doi . ';
            break;
        case "autore":
            out = ' rdf:predicate dcterms:creator . ';
            break;
        case "commento":
            out = ' rdf:predicate schema:comment . ';
            break;
        case "funzione retorica":
            out = ' rdf:predicate sem:denotes . ';
            break;
        case "citazione":
            out = ' rdf:predicate cito:cites . ';
            break;
    }
    return out;
}

/* Sostituire tutte le occorrenze di un carattere */
String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};

function getRangeContent(fragmentPath, start, end, urlDoc){
	var content = "";
	var path = getXPath(fragmentPath);
	var id = urlDoc.replace(/([/|_.|_:|_-])/g, '');
        if (path.indexOf('tbody') == -1 ) { // se non c'� tbody
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
                content = getContent(nodo, start, end);
            };
        } catch (ex) {
            //The expression is NOT a legal expression.
            //se per esempio il fragmentPath � incompleto o relativo
            //l'annotazione viene scartata
        }
	return content;
}


function getContent(nodo, start, end){

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
            break;
        } else {
            if(start >= lunghezzaNodoCorrente){
                if(!trovatoNodoStart){
                    start = start - lunghezzaNodoCorrente;
                    end = end -lunghezzaNodoCorrente;
                    // si passa al  al nodo successivo
                }
            } else {  // cio� if(start < lunghezzaNodoCorrente)
                // lo start offset � nel nodo corrente
                if(!trovatoNodoStart){
                    rangeObject.setStart(nodoCorrente, start);
                };
                trovatoNodoStart = true;
                charParsed = charParsed + (lunghezzaNodoCorrente - start);
                end = caratteriTot - charParsed; // caratteri mancanti
            }
        }
    }
    var content = "";
    content = rangeObject.toString();
    return content;

}
