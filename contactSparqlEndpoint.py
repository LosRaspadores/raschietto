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

# user e pass autenticazione grafo
PASS = "FF79%bAW"
USER = "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537"


# dichiarazione namespace
FOAF = Namespace("http://xmlns.com/foaf/0.1/")
MY = Namespace("http://www.essepuntato.it/")
DATA = Namespace("http://www.essepuntato.it/2013/citalo/test/data/")
OA = Namespace("http://www.openannotation.org/spec/core/")
SIOC = Namespace("http://rdfs.org/sioc/ns#")


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


def contact_sparql_endpoint():
    rdf_graph = rdflib.Graph()  # nuovo grafo RDF vuoto
    rdf_graph.load("data\\annotazione.owl")  # dati caricati da un file .owl

    nome_grafo = "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537"

    nome_grafo1 = "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537"
    nome_grafo2 = "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1538"

    # 'INSERT' per inserire dati dal triplestore (servizio /update, metodo POST)
    query_insert = """INSERT DATA {
                        GRAPH <%s> { %s }
                    }""" % (nome_grafo, rdf_graph.serialize(format="nt"))

    # 'DELETE' per rimuovere  dati dal triplestore (servizio /update, metodo POST)
    query_delete = """DELETE DATA {
                        GRAPH <%s>  { %s }
                    }""" % (nome_grafo2, rdf_graph.serialize(format="nt"))

    # Remove all triples
    query_remove_all_triples = """CLEAR GRAPH <%s>""" % nome_grafo2


    # dataset SPARQL endpoint locale
    sparql_endpoint = SPARQLWrapper("http://localhost:3030/data/update?user=%s&pass=%s" % (USER, PASS), returnFormat=JSON)

    # set della query SPARQL
    sparql_endpoint.setQuery(query_insert)
    sparql_endpoint.setMethod('POST')

    # esecuzione della query
    sparql_endpoint.query()



    """
        >>> su localhost

        grafo specificato

        SELECT ?subject ?predicate ?object
        FROM NAMED <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537>
        WHERE {
        GRAPH ?g {?subject ?predicate ?object}}

        grafo di default

        SELECT ?subject ?predicate ?object
            WHERE {
            GRAPH ?g {?subject ?predicate ?object}
        }
    }
    """

    # query SPARQL che ritorna tutte le triple del grafo specificato (se nn specificato >>> quello di default)
    query_all = """
                SELECT ?subject ?predicate ?object
            FROM NAMED <%s>
            WHERE {
              GRAPH ?g {?subject ?predicate ?object}
            }
            LIMIT 17
        """ % nome_grafo2

    sparql_endpoint = SPARQLWrapper("http://tweb2015.cs.unibo.it:8080/data/query", returnFormat="json")

    #sparql_endpoint = SPARQLWrapper("http://localhost:3030/data/query?user=%s&pass=%s" % (USER, PASS), returnFormat="json")  # servizio query = servizio sparql
    sparql_endpoint = SPARQLWrapper("http://localhost:3030/data/query", returnFormat="json")
    # set della query SPARQL
    sparql_endpoint.setQuery(query_all)
    sparql_endpoint.setMethod('GET')

    # esecuzione della query
    results = sparql_endpoint.query().convert()

    for result in results["results"]["bindings"]:
        print(result["subject"]["value"])+"  "+(result["predicate"]["value"])+"  "+(result["object"]["value"])


def main():
    contact_sparql_endpoint()

    
main()