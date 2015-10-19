#!/usr/bin/python
# -*- coding: utf-8 -*-

# python v 2.7

"""
pip install rdflib
pip install SPARQLwrapper

spazio web: http://ltw1537.web.cs.unibo.it/
grafo RDF: http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537
SPARQL endopoint: http://tweb2015.cs.unibo.it:8080/data/get
gruppi: http://vitali.web.cs.unibo.it/TechWeb15/GrafiGruppi
per raggiungere i dati : /get

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


logging.basicConfig()

# funzione per caricare dati da un file .owl su nuovo grafo RDF
def load_graph(file_name):
    rdf_graph = rdflib.Graph()  # nuovo grafo RDF vuoto
    rdf_graph.load(file_name)  # dati caricati da un file /TechWeb/data/data.owl
    return rdf_graph


def createNewData():
    rdf = load_graph("..\data\data.owl")

    person5 = DATA.person5
    # with DATA.person5 you create a resource having URI "http://www.essepuntato.it/2013/citalo/test/data/person5"
    rdf.add((person5, RDF.type, FOAF.Person))

    # Add names and ages (foaf:name and foaf:age) to the new person
    rdf.add((person5, FOAF.name, Literal("Pippo")))
    rdf.add((person5, FOAF.age, Literal(30)))  # it uses Python types
    # use rdf.remove to remove triples
    # use rdf.set to change existing triples

    people = []  # create an empty list
    for s, p, o in rdf.triples((None, RDF.type, FOAF.Person)):
        people += [s]  # add the element "s" (which is a person) to the list

    pairs = itertools.combinations(people, 2)  # all the combination between people

    for pair in pairs:
        person1 = pair[0]
        person2 = pair[1]
        rdf.add((person1, FOAF.knows, person2))

    rdf.serialize("..\data\data-updated.owl", format="pretty-xml")

    rdf_graph = load_graph("..\data\data-updated.owl")
    print_triples(rdf_graph)


# funzione per visualizzare le triple presenti in un grafo RDF
def print_triples(graph):
    # primo modo (sconsigliato)
    # for s, p, o in graph:
        # print s, p, o


    # for s, p, o in graph.triples((None, RDF.type, FOAF.Person)):
        #print s + " is a person"


    # secondo modo (migliore)
    # si possono visualizzare triple RDF serializzate in XML, Turtle, N-triples et.
    # nel nostro caso si preferisce il grafo serializzato nel formato N-Ttriple
    print graph.serialize(format="nt")  # serializzazione in N-triples
    # print graph.serialize(format="turtle")  # serializzazione in Turtle


def reification():
    rdf = rdflib.Graph()
    # Creo un blank node che rappresenta il mio statement da reificare
    reifiedStatement = BNode("myblank")
    # Aggiungo il soggetto, predicato e oggetto dello statement
    rdf.add((reifiedStatement, RDF.subject, DATA.person5))
    rdf.add((reifiedStatement, RDF.predicate, FOAF.age))
    rdf.add((reifiedStatement, RDF.object, Literal(30)))

    # Dico che un'altra risorsa crede nello statement reificato
    rdf.add((MY.me, MY.believes, reifiedStatement))
    rdf.add((reifiedStatement, RDF.type, RDF.Statement))

    # Stampo a video
    print rdf.serialize(format="turtle")


def contact_sparql_endpoint():
    # si contatta lo SPARQL endpoint per un certo dataset (nome dataset = /data)
    # SPARQL service = SPARQL endpoint = triplestore che si occupa di memorizzare le annotazioni
    # si chiede di restituire i risultati in formato JSON

    # Lo SPARQL endpoint locale del progetto è raggiungibile al seguente URL: http://localhost:3030/data/query
    # sparql_endpoint = SPARQLWrapper("http://localhost:3030/data/query", returnFormat="json")

    # Lo SPARQL endpoint ufficiale del progetto è raggiungibile al seguente URL: http://tweb2015.cs.unibo.it:8080/data
    # ogni gruppo ha un grafo su questo stesso endpoint, l'IRI é: http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537
    # necessaria l'autenticazione ttramite user=ltw1537, password=
    # sparql_endpoint = SPARQLWrapper("http://tweb2015.cs.unibo.it:8080/data", returnFormat="json")

    # SPARQL endpoint di esempio
    sparql_endpoint = SPARQLWrapper("http://dbpedia.org/sparql", returnFormat="json")

    # query di esempio
    query = """
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        SELECT ?label
        WHERE { <http://dbpedia.org/resource/Asturias> rdfs:label ?label }
    """

    # set della query SPARQL
    sparql_endpoint.setQuery(query)

    # esecuzione della query
    results = sparql_endpoint.query().convert()

    # visualizzazione dei risultati
    for result in results["results"]["bindings"]:
        print(result["label"]["value"])


def main():
    rdf_graph = load_graph("..\data\data.owl")  # da \Server (dir corrente) si torna indietro (coi ..)e si entra in \data
    # print_triples(rdf_graph)

    # contact_sparql_endpoint()

    createNewData()

main()