function getGruppi(){
    var listaGruppiCompleta = [];
    var gruppiSPARQL;
    var gruppiScraping;

    var query = "SELECT (COUNT(?a) as ?tot) ?g WHERE { graph ?g{ ?a a <http://www.w3.org/ns/oa#Annotation> . }} GROUP BY ?g ";
    var urlQuery = encodeURIComponent(query); // rende la query parte dell'uri
    var urlG = "http://tweb2015.cs.unibo.it:8080/data/query?query=" + urlQuery + "&format=json";
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
                },
                error: function() {
                    alert("Errore nel caricamento dei grafi!");
                }
            });
        },
        error: function(){
            alert("Errore nel caricamento dei grafi!");
        }
    });
}

function listaGruppi(arr) {
    var output = "";
    var i;
    for(i = 0; i < arr.length; i++) {
        //out += '<input type="checkbox"/><label>' + arr[i].id + ' - ' +arr[i].nome + '</label><br>';
        output += '<a class="list-group-item" value="' + arr[i]['url'] + '" onclick="mostraAnnotGruppo(this)">' +arr[i]['nome'] + '</a><br>';
    }
    $('div#lista_gruppi').html(output);
    $('#numGru').html(arr.length);
}

//function getDocumenti(){
//    var listaDocCompleta;
//    var docAnnotati;
//    var docScraping;
//    var query = "PREFIX fabio: <http://purl.org/spar/fabio/> . SELECT DISTINCT ?doc WHERE { ?doc fabio:Item . FILTER NOT EXISTS { ?doc a fabio:Item . FILTER regex(str(?doc), 'cited')} FILTER NOT EXISTS { ?doc a fabio:Item . FILTER regex(str(?doc), 'Reference')}}";
//    var urlQuery = encodeURIComponent(query); // rende la query parte dell'uri
//    var urlG = "http://tweb2015.cs.unibo.it:8080/data/query?query=" + urlQuery + "&format=json";
//    $.ajax({
//        url: urlG,
//        dataType: 'jsonp',
//        success: function(data){
//            docAnnotati = = data.results.bindings;
//
//            $.ajax({
//                url: '/scrapingDocumenti',
//                type: 'GET',
//                success: function(result) {
//                    //convert json string to json object
//                    docScraping = JSON.parse(result);
//                    listaDocumenti(docScraping);
//                    //for('')
//                },
//                error: function(error) {
//                    alert("Errore nel caricamento dei documenti!");
//                }
//            });
//        },
//        error: function(){
//            alert("Errore nel caricamento dei documenti!");
//        }
//    });
//}
//
//function listaDocumenti(arr) {
//        var i;
//        for(i = 0; i < arr.length; i++) {
//            //out += '<a class="list-group-item" value="' + arr[i].url + '" onclick="mostraDocumento(this)">' +arr[i].title + '</a><br>';
//            $('div#lista_doc').append('<a class="list-group-item" value="' + arr[i].url + '" onclick="mostraDocumento(this)">' +arr[i].title + '</a><br>');
//        }
//       //$('div#lista_doc').html(out);
//       $('#numDoc').html(arr.length);
//    }