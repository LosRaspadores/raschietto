$(document).ready(function() {

    var urldoc = "http://www.dlib.org/dlib/july15/downs/07downs.html"

    function get_all_annotazioni(doc){
        var query = 'SELECT ?graph ?label ?type ?date ?prov_nome ?prov_email ?prov_label ?body_s ?body_p ?body_o ?body_l ?fs_value '+
                '?start ?end '+
                'WHERE {'+
                'GRAPH ?graph {?a a oa:Annotation;'+
                    'rdfs:label ?label; '+
                    'rsch:type ?type; '+
                    'oa:annotatedAt ?date; '+
                    'oa:annotatedBy ?provenance. '+
                    '?provenance foaf:name ?prov_nome; '+
                                'schema:email ?prov_email. '+
                    'OPTIONAL {?provenance rdfs:label ?prov_label} '+
                    '?a oa:hasBody ?body. '+
                    '?body rdf:subject ?body_s; '+
                          'rdf:object ?body_o; '+
                          'rdf:predicate ?body_p; '+
                    'OPTIONAL {?body rdfs:label ?body_l} '+
                    '?a oa:hasTarget ?target. '+
                    '?target oa:hasSelector ?fragment_selector. '+
                    '?fragment_selector rdf:value ?fs_value; '+
                                       'oa:start ?start; '+
                                       'oa:end ?end. '+
                    '?target oa:hasSource <'+doc+'> '+
                    '} } ';
        return query;
    }


    /* parse formato data e ora YYYY-MM-DDTHH:mm */
    function parseDatetime(dataAnn){
        return dataAnn = " in data "+dataAnn.replace("T", " alle ")+ ".";
    };

    function displayAnnotazioni(anns) {
        $('#numeroAnnotazioni').text("Numero annotazioni: "+anns["results"]["bindings"].length);
        $('#modalAnnotazioni').modal({backdrop: 'static', keyboard: false});  // before modal show line!
        $('#modalAnnotazioni').modal('show');
        var out = "";
        var i;
        for(i = 0; i < anns["results"]["bindings"].length; i++) {
            ann = anns["results"]["bindings"][i];
            out += '<div>Annotazione di tipo: ' + ann["label"]["value"] + '</div>';
            out += '<p>Provenance: ' + ann["prov_nome"]["value"] + " - " + ann["prov_email"]["value"] + parseDatetime(ann["date"]["value"]);
            if (typeof(ann["prov_label"]) === "undefined") {
                out += '</p>';
            } else {
                out += ann["prov_label"]["value"] + '</p>';
            }
            out += '<p>' + ann["body_o"]["value"]
            if (typeof(ann["body_l"]) === "undefined") {
                out += '</p>';
            } else {
                out += ann["body_l"]["value"] + '</p>';
            }
            out += "</div><br>";
        }
        $('#listaAnnotazioni').html(out);
    }

    query = get_all_annotazioni(urldoc);

    $.ajax({
        url: '/getAllAnnotazioni',
        type: 'GET',
        data: {data: query},
        success: function(result) {
            //convert json string to json object
            lista_annotazioni = JSON.parse(result);
            if(lista_annotazioni["results"]["bindings"].length==0){
                alert("Non ci sono annotazioni per il documento selezionato.");
            } else {
                displayAnnotazioni(lista_annotazioni);
            }
        },
        error: function(error) {
            alert("Error: " + error);
        }
    });



});