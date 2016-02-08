//globale
listaGruppiCompleta = [];

function getGruppi(){

//    gruppiSPARQL;
//    gruppiScraping;

    query = "SELECT (COUNT(?a) as ?tot) ?g WHERE { graph ?g{ ?a a <http://www.w3.org/ns/oa#Annotation> . }} GROUP BY ?g ";
    urlQuery = encodeURIComponent(query); // rende la query parte dell'uri
    urlG = "http://tweb2015.cs.unibo.it:8080/data/query?query=" + urlQuery + "&format=json";
    $.ajax({
        url: urlG,
        dataType: "jsonp",
        success: function(data){
            gruppiSPARQL = data.results.bindings;

            $.ajax({
                url: '/scrapingGruppi',
                type: 'GET',
                success: function(result) {
                    //convert json string to json object
                    gruppiScraping = JSON.parse(result);
                    //non prende il gruppo 1529 non so perche'!!!
                    for(i = 0; i < gruppiSPARQL.length; i++){
                        for(j = 0; j < gruppiScraping.length; j++){
                            //se il nome del grafo contiene l'id preso dallo scraping
                            if(gruppiSPARQL[i].g.value.indexOf(gruppiScraping[j].id) >= 0){
                                data = {}
                                data['id'] = gruppiScraping[j].id;
                                data['url'] = gruppiSPARQL[i].g.value;
                                data['numAnnot'] = gruppiSPARQL[i].tot.value;
                                data['nome'] = gruppiScraping[j].nome;
                                listaGruppiCompleta.push(data);
                            }
                        }
                    }

                    listaGruppi(listaGruppiCompleta);
                }
            });
        },
        error: function(){
            $('#alertMessage').text("Errore nel caricamento della lista dei grafi.");
            $('#alertDoc').modal('show');
        }
    });
}

function listaGruppi(arr) {
    var output = "";
    var i;
    output+= '<a class="list-group-item" value="all" onclick="mostraAnnotGruppo(this)"> Tutti </a><br>';
    for(i = 0; i < arr.length; i++) {
        output += '<a class="list-group-item" value="' + arr[i]['url'] + '" onclick="mostraAnnotGruppo(this)">' +arr[i]['nome'] + '</a><br>';
    }
    $('div#lista_gruppi').html(output);
    $('#numGru').html(arr.length);
}

function getDocFromSparql(){
    query = "PREFIX fabio: <http://purl.org/spar/fabio/> SELECT DISTINCT ?doc WHERE { ?doc a fabio:Item . FILTER NOT EXISTS { ?doc a fabio:Item . FILTER regex(str(?doc), 'cited')} FILTER NOT EXISTS { ?doc a fabio:Item . FILTER regex(str(?doc), 'Reference')} FILTER NOT EXISTS { ?doc a fabio:Item . FILTER regex(str(?doc), '_ver')}}";
    urlQuery = encodeURIComponent(query); // rende la query parte dell'uri
    urlG = "http://tweb2015.cs.unibo.it:8080/data/query?query=" + urlQuery + "&format=json";
    return $.ajax({
        url: urlG,
        dataType: 'jsonp',
    });
}

function getDocFromScraping(){
    return $.ajax({
        url: '/scrapingDocumenti',
        type: 'GET'
    });
}

//function getDocumenti(docAnnotati, docScraping){
function getDocumenti(){
//    docTemp = [];
//
//    for(i = 0; i < docScraping.length; i++){
//        docTemp.push(docScraping[i].url);
//    }
//
//    for(i = 0; i < docAnnotati.length; i++){
//        if(!($.inArray(docAnnotati[i].doc.value, docTemp))){
//            docTemp.push(docAnnotati[i].doc.value);
//        }
//    }
//
//    urlDoc = JSON.stringify(docTemp);
    $.ajax({
        url: '/scrapingTitolo',
        type: 'GET',
        data: {url: urlDoc},
        success: function(result){
            res = JSON.parse(result);
            $('#numDoc').html(res.length);
            for(j = 0; j < res.length; j++){
                $('div#lista_doc').append('<a class="list-group-item" value="' + res[j].url + '">' + res[j].titolo + '</a><br>');
            }
        },
        error: function(){
            $('#alertMessage').text("Errore nel caricamento dei documenti!");
            $('#alertDoc').modal('show');
        }
    });
}
