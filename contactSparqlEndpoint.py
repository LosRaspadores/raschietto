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

annotazione_prova = """
    [] a oa:Annotation ;
        rdfs:label "DOI"^^xsd:string ;
        rsch:type "hasDoi"^^xsd:string ;
        oa:annotatedAt "2015-11-10T16:31"^^xsd:dateTime ;
        oa:annotatedBy <mailto:los.raspadores@gmail.com>  ;
        oa:hasBody _:doi ;
        oa:hasTarget [ a oa:SpecificResource ;
                oa:hasSelector [ a oa:FragmentSelector ;
                        rdf:value "/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/p[2]"^^xsd:string ;
                        oa:end "355"^^xsd:nonNegativeInteger ;
                        oa:start "328"^^xsd:nonNegativeInteger ] ;
                oa:hasSource <http://www.dlib.org/dlib/july15/downs/07downs.html> ] .

    <mailto:los.raspadores@gmail.com> a foaf:mbox ;
        schema:email "los.raspadores@gmail.com" ;
        foaf:name "LosRaspadores"^^xsd:string ;
        rdfs:label "LosRaspadores"^^xsd:string .

    _:doi a rdf:Statement;
        rdfs:label "Il work ha come DOI 10.1045/july2015-downs "^^xsd:string ;
        rdf:subject <http://www.dlib.org/dlib/july15/downs/07downs_ver1> ;
        rdf:predicate prism:doi ;
        rdf:object "10.1045/july2015-downs "^^xsd:string .

    <http://www.dlib.org/dlib/july15/downs/07downs_ver1> a fabio:Expression . """

def get_lista_grafi():
    lista_grafi = list()
    with open('listagrafi.json') as data_file:
        data = json.load(data_file)

    for dato in data:
        id = dato['id'].strip()
        nome_grafo = base_name + id
        lista_grafi.append(nome_grafo)

    return lista_grafi


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
    query = query + "WHERE {GRAPH ?g {?subject ?predicate ?object} }"
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

    lista = get_lista_grafi()
    lista2 = list()
    lista2.append("http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537")
    lista2.append("http://vitali.web.cs.unibo.it/raschietto/graph/ltw1538")
    lista2.append("http://vitali.web.cs.unibo.it/raschietto/graph/ltw1539")

    """
    query = query_insert_file(nome_grafo_gruppo, "travel.owl")
    do_query_post(sparql_endpoint_locale, query)


    query = query_clear_graph(nome_grafo_gruppo)
    do_query_post(sparql_endpoint_locale, query)


    query = query_annotazione(nome_grafo_gruppo, annotazione_prova)
    do_query_post(sparql_endpoint_locale, query)


    query = query_clear_graph(nome_grafo_gruppo)
    do_query_post(sparql_endpoint_remoto, query)


    query = query_annotazione(nome_grafo_gruppo, annotazione_prova)
    do_query_post(sparql_endpoint_remoto, query)


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
