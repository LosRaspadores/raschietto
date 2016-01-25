#!/usr/bin/python
# -*- coding: utf-8 -*-

# python v 2.7

__author__ = 'Los Raspadores'


"""
    pip install rdflib
    pip install SPARQLWrapper

    CONTENT TYPE dei risultati ritornati(select):JSON O XML;  CONTENT TYPE del grafo inserito(graph):TURTLE, N3


    *** SPARQL Service - endpoint ufficiale del progetto = triplestore che si occupa di memorizzare le annotazioni ***
        SPARQL endpoint (server Apache Jena Fuseki) URL >>> http://tweb2015.cs.unibo.it:8080/
        endpoint dataset name = "data"   >>> http://tweb2015.cs.unibo.it:8080/data/

        L'endpoint ha al suo interno un grafo RDF per ogni gruppo per cui è necessaria l'autenticazione tramite pass
        nome grafo RDF nostro gruppo: "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537"
            --PASS: "FF79%bAW",
            --IRI=USER=NOME GRAFO: "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537”

    per accedere all'intero dataset: URL >>> http://tweb2015.cs.unibo.it:8080/data/get

    *** SPARQL endpoint locale ***
        SPARQL endpoint (server Apache Jena Fuseki) URL >>> http://localhost:3030/
        endpoint dataset name = "data"  >>> http://localhost:3030/data/

        nome grafo RDF: "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537"

        http://localhost:3030/data/http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537


    >>> SERVIZI DEGLI SPARQL ENDPOINT APACHE JENA FUSEKI:

    http://*host*/dataset/get  -- SPARQL Graph Store Protocol endpoint >>> per leggerle sul browser
    http://*host*/dataset/data -- SPARQL Graph Store Protocol endpoint >>> per leggerle sul browser

    http://*host*/dataset/query  -- SPARQL query endpoint, metodo GET >>> per le query
    http://*host*/dataset/sparql -- SPARQL query endpoint, metodo GET >>> per le query

    http://*host*/dataset/update -- SPARQL Update endpoint, metodo POST >>> per inserire o eliminare dati (grafi)

    http://*host*/dataset/upload -- SPARQL endpoint per l'upload di >>> file
    http://*host*/dataset/delete -- delete the endpoint? o grafo?

"""

# moduli importati
import rdflib  # per leggere e manipolare grafi RDF
from SPARQLWrapper import SPARQLWrapper, JSON, N3, TURTLE # per interrogare uno SPARQL end-point
from rdflib.namespace import RDF  # namespace per RDF
from rdflib import Namespace  # modulo Namespace per crearne di nuovi
import json
from urlparse import urljoin

# endpoint
sparql_endpoint_remoto = "http://tweb2015.cs.unibo.it:8080/data"
sparql_endpoint_locale = "http://localhost:3030/data"

# user e pass autenticazione grafo
PASS = "FF79%bAW"
USER = "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537"

# grafi
# il nome (=l'IRI) di ogni grafo ha struttura: "http://vitali.web.cs.unibo.it/raschietto/graph/[idgruppo]"
base_name = "http://vitali.web.cs.unibo.it/raschietto/graph/"

nome_grafo_gruppo = "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537"
nome_grafo_25_ = "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1525"
nome_grafo_38 = "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1538"


# dichiarazione namespace
FOAF = Namespace("http://xmlns.com/foaf/0.1/")
MY = Namespace("http://www.essepuntato.it/")
DATA = Namespace("http://www.essepuntato.it/2013/citalo/test/data/")
OA = Namespace("http://www.openannotation.org/spec/core/")
SIOC = Namespace("http://rdfs.org/sioc/ns#")


prefissi = """  PREFIX foaf:  <http://xmlns.com/foaf/0.1/>
                PREFIX frbr:  <http://purl.org/vocab/frbr/core#>
                PREFIX cito:  <http://purl.org/spar/cito/>
                PREFIX fabio: <http://purl.org/spar/fabio/>
                PREFIX sro:   <http://salt.semanticauthoring.org/ontologies/sro#>
                PREFIX dcterms: <http://purl.org/dc/terms/>
                PREFIX schema: <http://schema.org/>
                PREFIX rdfs:  <http://www.w3.org/2000/01/rdf-schema#>
                PREFIX oa:    <http://www.w3.org/ns/oa#>
                PREFIX rsch:  <http://vitali.web.cs.unibo.it/raschietto/>
                PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#>
                PREFIX rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                PREFIX sem:   <http://www.ontologydesignpatterns.org/cp/owl/semiotics.owl#>
                PREFIX skos:  <http://www.w3.org/2009/08/skos-reference/skos.html>
                PREFIX prism: <http://prismstandard.org/namespaces/basic/2.0/>
                PREFIX deo:   <http://purl.org/spar/deo/>
                PREFIX foaf: <http://xmlns.com/foaf/0.1/> """

annotazione_prova_doi = """
    [] a oa:Annotation ;
        rdfs:label "DOI"^^xsd:string ;
        rsch:type "hasDOI"^^xsd:string ;
        oa:annotatedAt "2015-11-10T16:31"^^xsd:dateTime ;
        oa:annotatedBy <mailto:los.raspadores@gmail.com>  ;
        oa:hasBody _:doi ;
        oa:hasTarget [ a oa:SpecificResource ;
                oa:hasSelector [ a oa:FragmentSelector ;
                        rdf:value "form1_table3_tbody1_tr1_td1_table5_tbody1_tr1_td1_table1_tbody1_tr1_td2_p2"^^xsd:string ;
                        oa:start "328"^^xsd:nonNegativeInteger ;
                        oa:end "355"^^xsd:nonNegativeInteger ] ;
                oa:hasSource <http://www.dlib.org/dlib/july15/downs/07downs.html> ] .

    <mailto:los.raspadores@gmail.com> a foaf:mbox ;
        schema:email "los.raspadores@gmail.com" ;
        foaf:name "LosRaspadores"^^xsd:string ;
        rdfs:label "LosRaspadores"^^xsd:string .

    _:doi a rdf:Statement;
        rdfs:label "DOI = 10.1045/july2015-downs"^^xsd:string ;
        rdf:subject <http://www.dlib.org/dlib/july15/downs/07downs_ver1> ;
        rdf:predicate prism:doi ;
        rdf:object "10.1045/july2015-downs"^^xsd:string .

    <http://www.dlib.org/dlib/july15/downs/07downs_ver1> a fabio:Expression;
        fabio:hasRepresentation <http://www.dlib.org/dlib/july15/downs/07downs.html>.
    <http://www.dlib.org/dlib/july15/downs/07downs.html> a fabio:item. """


annotazione_prova_url = """
    [] a oa:Annotation ;
        rdfs:label "URl"^^xsd:string ;
        rsch:type "hasURL"^^xsd:string ;
        oa:annotatedAt "2015-11-10T16:31"^^xsd:dateTime ;
        oa:annotatedBy <mailto:los.raspadores@gmail.com>  ;
        oa:hasBody _:url ;
        oa:hasTarget [ a oa:SpecificResource ;
                oa:hasSelector [ a oa:FragmentSelector ;
                        rdf:value "form1_table3_tbody1_tr1_td1_table5_tbody1_tr1_td1_table1_tbody1_tr1_td2_p3_a1"^^xsd:string ;
                        oa:start "0"^^xsd:nonNegativeInteger ;
                        oa:end "24"^^xsd:nonNegativeInteger ] ;
                oa:hasSource <http://www.dlib.org/dlib/july15/downs/07downs.html> ] .

    <mailto:los.raspadores@gmail.com> a foaf:mbox ;
        schema:email "los.raspadores@gmail.com" ;
        foaf:name "LosRaspadores"^^xsd:string ;
        rdfs:label "LosRaspadores"^^xsd:string .

    _:url a rdf:Statement;
        rdfs:label "URL = http://www.dlib.org/dlib/july15/downs/07downs.html"^^xsd:string ;
        rdf:subject <http://www.dlib.org/dlib/july15/downs/07downs_ver1> ;
        rdf:predicate fabio:hasURL ;
        rdf:object "http://www.dlib.org/dlib/july15/downs/07downs.html"^^xsd:anyURL .

    <http://www.dlib.org/dlib/july15/downs/07downs.html> a fabio:item.

    <http://www.dlib.org/dlib/july15/downs/07downs_ver1> a fabio:Expression;
        fabio:hasRepresentation <http://www.dlib.org/dlib/july15/downs/07downs.html>. """

annotazione_prova_author = """
    [] a oa:Annotation ;
        rdfs:label "Autore"^^xsd:string ;
        rsch:type "hasAuthor"^^xsd:string ;
        oa:annotatedAt "2015-11-10T16:31"^^xsd:dateTime ;
        oa:annotatedBy <mailto:los.raspadores@gmail.com>  ;
        oa:hasBody _:author ;
        oa:hasTarget [ a oa:SpecificResource ;
                oa:hasSelector [ a oa:FragmentSelector ;
                        rdf:value "form1_table3_tbody1_tr1_td1_table5_tbody1_tr1_td1_table1_tbody1_tr1_td2_p2"^^xsd:string ;
                        oa:start "1"^^xsd:nonNegativeInteger ;
                        oa:end "16"^^xsd:nonNegativeInteger ] ;
                oa:hasSource <http://www.dlib.org/dlib/july15/downs/07downs.html> ] .

    <mailto:los.raspadores@gmail.com> a foaf:mbox ;
        schema:email "los.raspadores@gmail.com" ;
        foaf:name "LosRaspadores"^^xsd:string ;
        rdfs:label "LosRaspadores"^^xsd:string .

    _:author a rdf:Statement;
        rdfs:label "AUTORE = Robert R. Downs"^^xsd:string ;
        rdf:subject <http://www.dlib.org/dlib/july15/downs/07downs>;
        rdf:predicate dcterms:creator;
        rdf:object rsch:r-downs .

    rsch:r-downs a foaf:Person;
        rdfs:label "Robert Downs".

    <http://www.dlib.org/dlib/july15/downs/07downs.html> a fabio:item.

    <http://www.dlib.org/dlib/july15/downs/07downs_ver1> a fabio:Expression;
        fabio:hasRepresentation <http://www.dlib.org/dlib/july15/downs/07downs.html>.

    <http://www.dlib.org/dlib/july15/downs/07downs> a fabio:Work;
        fabio:hasPortrayal <http://www.dlib.org/dlib/july15/downs/07downs.html>;
        frbr:realization <http://www.dlib.org/dlib/july15/downs/07downs_ver1>. """

annotazione_prova_anno = """
    [] a oa:Annotation ;
        rdfs:label "Anno di pubblicazione"^^xsd:string ;
        rsch:type "hasPublicationYear"^^xsd:string ;
        oa:annotatedAt "2015-11-10T16:31"^^xsd:dateTime ;
        oa:annotatedBy <mailto:los.raspadores@gmail.com>  ;
        oa:hasBody _:year ;
        oa:hasTarget [ a oa:SpecificResource ;
                oa:hasSelector [ a oa:FragmentSelector ;
                        rdf:value "form1_table3_tbody1_tr1_td1_table5_tbody1_tr1_td1_table1_tbody1_tr1_td2_p1"^^xsd:string ;
                        oa:start "12"^^xsd:nonNegativeInteger ;
                        oa:end "16"^^xsd:nonNegativeInteger ] ;
                oa:hasSource <http://www.dlib.org/dlib/july15/downs/07downs.html> ] .

    <mailto:los.raspadores@gmail.com> a foaf:mbox ;
        schema:email "los.raspadores@gmail.com" ;
        foaf:name "LosRaspadores"^^xsd:string ;
        rdfs:label "LosRaspadores"^^xsd:string .

    _:year a rdf:Statement;
        rdfs:label "ANNO = 2015"^^xsd:string ;
        rdf:subject <http://www.dlib.org/dlib/july15/downs/07downs_ver1> ;
        rdf:predicate fabio:hasPublicationYear ;
        rdf:object "2015"^^xsd:date .

    <http://www.dlib.org/dlib/july15/downs/07downs.html> a fabio:item.

    <http://www.dlib.org/dlib/july15/downs/07downs_ver1> a fabio:Expression;
        fabio:hasRepresentation <http://www.dlib.org/dlib/july15/downs/07downs.html>."""

annotazione_prova_title = """
    [] a oa:Annotation ;
        rdfs:label "Titolo"^^xsd:string ;
        rsch:type "hasTitle"^^xsd:string ;
        oa:annotatedAt "2015-11-10T16:31"^^xsd:dateTime ;
        oa:annotatedBy <mailto:los.raspadores@gmail.com>  ;
        oa:hasBody _:title ;
        oa:hasTarget [ a oa:SpecificResource ;
                oa:hasSelector [ a oa:FragmentSelector ;
                        rdf:value "form1_table3_tbody1_tr1_td1_table5_tbody1_tr1_td1_table1_tbody1_tr1_td2_h32"^^xsd:string ;
                        oa:start "0"^^xsd:nonNegativeInteger ;
                        oa:end "38"^^xsd:nonNegativeInteger ] ;
                oa:hasSource <http://www.dlib.org/dlib/july15/downs/07downs.html> ] .

    <mailto:los.raspadores@gmail.com> a foaf:mbox ;
        schema:email "los.raspadores@gmail.com" ;
        foaf:name "LosRaspadores"^^xsd:string ;
        rdfs:label "LosRaspadores"^^xsd:string .

    _:title a rdf:Statement;
        rdfs:label "TITOLO = Data Stewardship in the Earth Sciences"^^xsd:string ;
        rdf:subject <http://www.dlib.org/dlib/july15/downs/07downs_ver1> ;
        rdf:predicate dcterms:title ;
        rdf:object "Data Stewardship in the Earth Sciences"^^xsd:string .

    <http://www.dlib.org/dlib/july15/downs/07downs.html> a fabio:item.

    <http://www.dlib.org/dlib/july15/downs/07downs_ver1> a fabio:Expression;
        fabio:hasRepresentation <http://www.dlib.org/dlib/july15/downs/07downs.html>."""

annotazione_prova_commento = """
    [] a oa:Annotation ;
        rdfs:label "Commento"^^xsd:string ;
        rsch:type "hasComment"^^xsd:string ;
        oa:annotatedAt "2015-11-10T16:31"^^xsd:dateTime ;
        oa:annotatedBy <mailto:los.raspadores@gmail.com>  ;
        oa:hasBody _:commento ;
        oa:hasTarget [ a oa:SpecificResource ;
                oa:hasSelector [ a oa:FragmentSelector ;
                        rdf:value "form1_table3_tbody1_tr1_td1_table5_tbody1_tr1_td1_table1_tbody1_tr1_td2_p6"^^xsd:string ;
                        oa:start "0"^^xsd:nonNegativeInteger ;
                        oa:end "200"^^xsd:nonNegativeInteger ] ;
                oa:hasSource <http://www.dlib.org/dlib/july15/downs/07downs.html> ] .

    <mailto:los.raspadores@gmail.com> a foaf:mbox ;
        schema:email "los.raspadores@gmail.com" ;
        foaf:name "LosRaspadores"^^xsd:string ;
        rdfs:label "LosRaspadores"^^xsd:string .

    _:commento a rdf:Statement;
        rdfs:label "COMMENTO = Il documento è interessantissimo"^^xsd:string ;
        rdf:subject <http://www.dlib.org/dlib/july15/downs/07downs_ver1#form1_table3_tbody1_tr1_td1_table5_tbody1_tr1_td1_table1_tbody1_tr1_td2_h32>;
        rdf:predicate schema:comment;
        rdf:object "Il documento è interessantissimo"^^xsd:string .

    <http://www.dlib.org/dlib/july15/downs/07downs.html> a fabio:item.

    <http://www.dlib.org/dlib/july15/downs/07downs_ver1> a fabio:Expression;
        fabio:hasRepresentation <http://www.dlib.org/dlib/july15/downs/07downs.html>."""

# http://www.dlib.org/dlib/march15/moulaison/03moulaison.html

annotazione_prova_retorica = """
    [] a oa:Annotation ;
        rdfs:label "Retorica"^^xsd:string ;
        rsch:type "denotesRhetoric"^^xsd:string ;
        oa:annotatedAt "2015-11-10T16:31"^^xsd:dateTime ;
        oa:annotatedBy <mailto:los.raspadores@gmail.com>  ;
        oa:hasBody _:retoric ;
        oa:hasTarget [ a oa:SpecificResource ;
                oa:hasSelector [ a oa:FragmentSelector ;
                        rdf:value "form1_table3_tbody1_tr1_td1_table5_tbody1_tr1_td1_table1_tbody1_tr1_td2_h33"^^xsd:string ;
                        oa:start "0"^^xsd:nonNegativeInteger ;
                        oa:end "8"^^xsd:nonNegativeInteger ] ;
                oa:hasSource <http://www.dlib.org/dlib/july15/downs/07downs.html> ] .

    <mailto:los.raspadores@gmail.com> a foaf:mbox ;
        schema:email "los.raspadores@gmail.com" ;
        foaf:name "LosRaspadores"^^xsd:string ;
        rdfs:label "LosRaspadores"^^xsd:string .

    _:retoric a rdf:Statement;
        rdfs:label "RETORICA = Introduction"^^xsd:string ;
        rdf:subject <http://www.dlib.org/dlib/july15/downs/07downs_ver1#form1_table3_tbody1_tr1_td1_table5_tbody1_tr1_td1_table1_tbody1_tr1_td2_h33>;
        rdf:predicate sem:denotes ;
        rdf:object deo:Introduction.

    <http://www.dlib.org/dlib/july15/downs/07downs.html> a fabio:item.

    <http://www.dlib.org/dlib/july15/downs/07downs_ver1> a fabio:Expression;
        fabio:hasRepresentation <http://www.dlib.org/dlib/july15/downs/07downs.html>."""

annotazione_prova_multipla = """
    [] a oa:Annotation ;
        rdfs:label "Citazione"^^xsd:string ;
        rsch:type "cites"^^xsd:string ;
        oa:annotatedAt "2015-11-10T16:31"^^xsd:dateTime ;
        oa:annotatedBy <mailto:los.raspadores@gmail.com>  ;
        oa:hasBody _:cite ;
        oa:hasTarget [ a oa:SpecificResource ;
                oa:hasSelector [ a oa:FragmentSelector ;
                        rdf:value "form1_table3_tbody1_tr1_td1_table5_tbody1_tr1_td1_table1_tbody1_tr1_td2_p42"^^xsd:string ;
                        oa:start "0"^^xsd:nonNegativeInteger ;
                        oa:end "179"^^xsd:nonNegativeInteger
                        ] ;
                oa:hasSource <http://www.dlib.org/dlib/july15/downs/07downs.html> ] .

    <mailto:los.raspadores@gmail.com> a foaf:mbox ;
        schema:email "los.raspadores@gmail.com" ;
        foaf:name "LosRaspadores"^^xsd:string ;
        rdfs:label "LosRaspadores"^^xsd:string .

    _:cite a rdf:Statement;
        rdfs:label "CITAZIONE = Between Memory and Paperbooks: Baconianism and Natural History in Seventeenth-Century England."^^xsd:string ;
        rdf:subject <http://www.dlib.org/dlib/july15/downs/07downs_ver1> ;
        rdf:predicate cito:cites ;
        rdf:object <http://www.dlib.org/dlib/july15/downs/07downs_ver1_cited1>.

    <http://www.dlib.org/dlib/july15/downs/07downs_ver1> a fabio:Expression;
        fabio:hasRepresentation <http://www.dlib.org/dlib/july15/downs/07downs.html>.

    <http://www.dlib.org/dlib/july15/downs/07downs_ver1_cited1> rdfs:label "[1] Yeo, Richard. 2007. Betwee...gland. History of Science 45 (March): 1—46"^^xsd:string .

    [] a oa:Annotation ;
        rdfs:label "Titolo"^^xsd:string ;
        rsch:type "hasTitle"^^xsd:string ;
        oa:annotatedAt "2015-11-10T16:31"^^xsd:dateTime ;
        oa:annotatedBy <mailto:los.raspadores@gmail.com>  ;
        oa:hasBody _:titolo;
        oa:hasTarget [ a oa:SpecificResource ;
                oa:hasSelector [ a oa:FragmentSelector ;
                        rdf:value "form1_table3_tbody1_tr1_td1_table5_tbody1_tr1_td2_p42"^^xsd:string ;
                        oa:start "0"^^xsd:nonNegativeInteger ;
                        oa:end "179"^^xsd:nonNegativeInteger
                        ] ;
                oa:hasSource <http://www.dlib.org/dlib/july15/downs/07downs.html> ] .

        _:titolo a rdf:Statement ;
            rdfs:label "TITOLO = Between Memory and Paperbooks: Baconianism and Natural History in Seventeenth-Century England"^^xsd:string ;
            rdf:subject <http://www.dlib.org/dlib/july15/downs/07downs_ver1_cited1> ;
            rdf:predicate dcterms:title ;
            rdf:object "Between Memory and Paperbooks: Baconianism and Natural History in Seventeenth-Century England"^^xsd:string .

    <http://www.dlib.org/dlib/july15/downs/07downs_ver1_cited1> a fabio:Expression. """


# funzione per visualizzare le triple presenti in un grafo RDF
def print_triples(graph):
    # primo modo (sconsigliato)
    # for s, p, o in graph:
        # print s, p, o

    # secondo modo (migliore)
    # si possono visualizzare triple RDF serializzate in XML, Turtle, N-triples etc.
    # nel nostro caso si preferisce il grafo serializzato nel formato N-Triple
    print graph.serialize(format="nt")  # serializzazione in N-triples
    # print graph.serialize(format="turtle")  # serializzazione in Turtle


# 'INSERT' per inserire dati da un file in un grafo (servizio /update, metodo POST)
def query_insert_file(nome_grafo, file):
    rdf_graph = rdflib.Graph()  # nuovo grafo RDF vuoto
    rdf_graph.load("data\\"+file)  # dati caricati da un file .owl
    query = """INSERT DATA {
                   GRAPH <%s> { %s }
               }""" % (nome_grafo, rdf_graph.serialize(format="nt"))
    return query


# 'DELETE' per rimuovere  dati di un file da un grafo (servizio /update, metodo POST)
def query_delete_file(nome_grafo, file):
    rdf_graph = rdflib.Graph()  # nuovo grafo RDF vuoto
    rdf_graph.load("data\\"+file)  # dati caricati da un file .owl
    query = """DELETE DATA {
                        GRAPH <%s>  { %s }
                    }""" % (nome_grafo, rdf_graph.serialize(format="nt"))
    return query


# 'CLEAR GRAPH' per rimuovere le triple da un grafo
def query_clear_graph(nome_grafo):
    query = """CLEAR GRAPH <%s>""" % nome_grafo
    return query


def query_delete_annotazioni_documento(url_doc):
    query = prefissi + " WITH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537>" \
                       " DELETE { ?a ?p ?o } WHERE { ?a oa:hasTarget ?target. " \
                       " ?target oa:hasSource <" + url_doc + ">.} "
    return query


# 'SELECT' all dal grafo di default
def query_select_all_default():
    query = """
        SELECT ?subject ?predicate ?object
            WHERE {
            GRAPH ?g {?subject ?predicate ?object}
        }"""
    return query

# 'SELECT' all dal grafo specificato >>> LIMIT numero
def query_select_all_grafo(nome_grafo):
    query = """
        SELECT ?subject ?predicate ?object
        FROM NAMED <%s>
        WHERE {
            GRAPH ?g {?subject ?predicate ?object}
        }""" % (nome_grafo)
    return query


# 'SELECT' all dal grafo specificato >>> LIMIT numero
def query_select_from_tuttigafi(lista_grafi):
    query = """SELECT ?subject ?predicate ?object
            """
    for grafo in lista_grafi:
        query = query + "FROM NAMED <"+grafo+">"
    query += "WHERE {GRAPH ?g {?subject ?predicate ?object} }"
    return query


# per query insert e delete
def do_query_post(endpoint, query):
    sparql_endpoint = SPARQLWrapper(endpoint+"/update?user=%s&pass=%s" % (USER, PASS), returnFormat="json")
    sparql_endpoint.setQuery(query)
    sparql_endpoint.setMethod('POST')
    sparql_endpoint.query()


# per query select
def do_query_get(endpoint, query):
    sparql_endpoint = SPARQLWrapper(endpoint+"/query", returnFormat="json")
    sparql_endpoint.setQuery(query)
    sparql_endpoint.setMethod('GET')
    results = sparql_endpoint.query().convert()
    return results


def query_annotazione(nome_grafo, annotazione):
    query = prefissi + """
                INSERT DATA {
                    GRAPH <%s> { %s }
                }""" % (nome_grafo, annotazione)
    return query


def main():

    """
    query = query_insert_file(nome_grafo_gruppo, "travel.owl")
    do_query_post(sparql_endpoint_locale, query)


    query = query_clear_graph(nome_grafo_gruppo)
    do_query_post(sparql_endpoint_locale, query)

"""
    query = query_clear_graph(nome_grafo_gruppo)
    do_query_post(sparql_endpoint_remoto, query)
    do_query_post(sparql_endpoint_locale, query)

    url_doc = "http://www.dlib.org/dlib/july15/downs/07downs.html"
    query = query_delete_annotazioni_documento(url_doc)
    do_query_post(sparql_endpoint_remoto, query)
    do_query_post(sparql_endpoint_locale, query)

    query = query_annotazione(nome_grafo_gruppo, annotazione_prova_doi)
    do_query_post(sparql_endpoint_remoto, query)
    do_query_post(sparql_endpoint_locale, query)

    query = query_annotazione(nome_grafo_gruppo, annotazione_prova_url)
    do_query_post(sparql_endpoint_remoto, query)
    do_query_post(sparql_endpoint_locale, query)

    query = query_annotazione(nome_grafo_gruppo, annotazione_prova_anno)
    do_query_post(sparql_endpoint_remoto, query)
    do_query_post(sparql_endpoint_locale, query)

    query = query_annotazione(nome_grafo_gruppo, annotazione_prova_author)
    do_query_post(sparql_endpoint_remoto, query)
    do_query_post(sparql_endpoint_locale, query)

    query = query_annotazione(nome_grafo_gruppo, annotazione_prova_commento)
    do_query_post(sparql_endpoint_remoto, query)
    do_query_post(sparql_endpoint_locale, query)

    query = query_annotazione(nome_grafo_gruppo, annotazione_prova_title)
    do_query_post(sparql_endpoint_remoto, query)
    do_query_post(sparql_endpoint_locale, query)

    query = query_annotazione(nome_grafo_gruppo, annotazione_prova_retorica)
    do_query_post(sparql_endpoint_remoto, query)
    do_query_post(sparql_endpoint_locale, query)

    query = query_annotazione(nome_grafo_gruppo, annotazione_prova_multipla)
    do_query_post(sparql_endpoint_remoto, query)
    do_query_post(sparql_endpoint_locale, query)


"""
    query = query_select_from_tuttigafi(lista)
    do_query_get(sparql_endpoint_locale, query)

    query = query_select_all_grafo(nome_grafo_gruppo)
    do_query_get(sparql_endpoint_remoto, query)
    """


if __name__ == "__main__":
    print "this script (contactSparqlEndpoint) is being run directly from %s" % __name__
    main()
else:
    print "this script (contactSparqlEndpoint) is being imported into another module"
