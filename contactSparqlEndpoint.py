#!/usr/bin/python
# -*- coding: utf-8 -*-

# python v 2.7

"""
pip install rdflib
pip install SPARQLWrapper

spazio web: http://ltw1537.web.cs.unibo.it/
grafo RDF: http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537
SPARQL endopoint: http://tweb2015.cs.unibo.it:8080/data/get
gruppi: http://vitali.web.cs.unibo.it/TechWeb15/GrafiGruppi
per raggiungere i dati : /get


http://*host*/dataset/query -- the SPARQL query endpoint. (readonly)
http://localhost:3030/ltw1537/query?query=SELECT%20*%20%7B%3Fs%20%3Fp%20%3Fo%7D%20limit%205
http://*host*/dataset/update -- the SPARQL Update language endpoint.
http://*host*/dataset/data -- the SPARQL Graph Store Protocol endpoint. (readonly)
http://*host*/dataset/upload -- the file upload endpoint.

"""

# moduli importati
import logging
import rdflib  # per leggere e manipolare grafi RDF
from SPARQLWrapper import SPARQLWrapper  # per interrogare uno SPARQL end-point
from rdflib.namespace import RDF  # namespace per RDF
from rdflib import Namespace, Literal, BNode  # modulo Namespace per crearne di nuovi
import itertools


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
    # si possono visualizzare triple RDF serializzate in XML, Turtle, N-triples et.
    # nel nostro caso si preferisce il grafo serializzato nel formato N-Ttriple
    print graph.serialize(format="nt")  # serializzazione in N-triples
    # print graph.serialize(format="turtle")  # serializzazione in Turtle


def contact_sparql_endpoint():
    """
        Si contatta lo SPARQL endpoint per accedere a un certo dataset (nome dataset = /data)
        SPARQL service = SPARQL endpoint = triplestore che si occupa di memorizzare le annotazioni
        si chiede di restituire i risultati in formato JSON

        Lo SPARQL endpoint locale del progetto è raggiungibile al seguente URL: http://localhost:3030/data/query
        sparql_endpoint = SPARQLWrapper("http://localhost:3030/data/query", returnFormat="json")

        Lo SPARQL endpoint ufficiale del progetto è raggiungibile al seguente URL: http://tweb2015.cs.unibo.it:8080/data
        ogni gruppo ha un grafo su questo stesso endpoint per cui è necessaria l'autenticazione tramite
        PASS: "FF79%bAW",
        IRI: "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537”
        sparql_endpoint = SPARQLWrapper("http://tweb2015.cs.unibo.it:8080/data", returnFormat="json")

        SPARQL endpoint di esempio
        sparql_endpoint = SPARQLWrapper("http://dbpedia.org/sparql", returnFormat="json")
    """

    rdf_graph = rdflib.Graph()  # nuovo grafo RDF vuoto
    rdf_graph.load("data\data.owl")  # dati caricati da un file .owl

    iri_graph = "http://localhost:3030/ltw1537/"

    query = """INSERT DATA {
        GRAPH <%s> { %s }
    }""" % (iri_graph, rdf_graph.serialize(format="nt"))

    # NB: Usare 'DELETE' al posto di 'INSERT' per rimuovere
    # i dati dal triplestore
    # UPDATE …/update?user=%s&pass=%s” % (your_user, your_pass))

    sparql_endpoint = SPARQLWrapper("http://localhost:3030/ltw1537/update", returnFormat="json")

    # set della query SPARQL
    sparql_endpoint.setQuery(query)
    sparql_endpoint.setMethod('POST')

    # esecuzione della query
    sparql_endpoint.query()


    # query di esempio
    query = """
        SELECT ?subject ?predicate ?object
            WHERE {
              ?subject ?predicate ?object
            }
    """
    sparql_endpoint = SPARQLWrapper("http://localhost:3030/ltw1537/query", returnFormat="json")

    # set della query SPARQL
    sparql_endpoint.setQuery(query)
    sparql_endpoint.setMethod('GET')

    # esecuzione della query
    results = sparql_endpoint.query().convert()

    for row in results:
        print row

    print sparql_endpoint.query().convert()

def main():

    rdf_graph = rdflib.Graph()  # nuovo grafo RDF vuoto
    rdf_graph.load("data\data.owl")  # dati caricati da un file .owl
    #print_triples(rdf_graph)

    contact_sparql_endpoint()
main()
