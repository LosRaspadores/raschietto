/*  Setup of Sgvizler trunk version on Trac 0.11.  */

// Wait until page is ready to configure Sgvizler:
$(document).ready(
    function (){
        sgvizler
            .defaultEndpointOutputFormat('jsonp')
            // Add prefixes used in examples:
            .prefix('w',     "http://sws.ifi.uio.no/ont/world.owl#")
            .prefix('dbpo',  "http://dbpedia.org/ontology/")
            .prefix('geo',   "http://www.w3.org/2003/01/geo/wgs84_pos#")
            .prefix('dct',   "http://purl.org/dc/terms/")
            .prefix('fn',    "http://www.w3.org/2005/xpath-functions#")
            .prefix('afn',   "http://jena.hpl.hp.com/ARQ/function#")
            .prefix('npdv',  "http://sws.ifi.uio.no/vocab/npd#")
	        .prefix('npdv2', "http://sws.ifi.uio.no/vocab/npd-v2#")
	        .prefix('geos',  "http://www.opengis.net/ont/geosparql#")

            // Draw all sgvizler containers on page:
            .containerDrawAll();
    }

    /*
    Q = new sgvizler.Query();
    mySuccessFunc = function () {
      //Do what you want with the datatable
      alert('ok');
    };
    myFailFunc = function () {
      // Handle the failue
      alert('no');
    };

    Q.query(query)
        .endpointURL("http://tweb2015.cs.unibo.it:8080/data/query")
        .getDataTable(mySuccessFunc, myFailFunc);
    */



);

/* Trac 0.11 uses an old version of jQuery. Sgvizler requires a newer
   version. We re-introduce some old jQuery functions used by Trac but
   not in the new version:
   - loadStylesheet
*/
jQuery.extend(
    {
        loadStyleSheet: function(file, type) {
            $('<link>').attr('rel', 'stylesheet')
                .attr('type', type)
                .attr('href', file)
                .appendTo('head');
        }
    }
);
