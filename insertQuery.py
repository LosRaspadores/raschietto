#!/usr/bin/python
# -*- coding: utf-8 -*-

# python v 2.7

__author__ = 'Los Raspadores'

"""
    pip install rdflib
    pip install SPARQLWrapper
    pip install unidecode
"""


# moduli importati
import rdflib  # per leggere e manipolare grafi RDF
from SPARQLWrapper import SPARQLWrapper, JSON, N3, TURTLE # per interrogare uno SPARQL end-point
from rdflib.namespace import RDF  # namespace per RDF
from rdflib import Namespace  # modulo Namespace per crearne di nuovi
import json
from urlparse import urljoin
import re
import datetime
from time import gmtime, strftime
from bs4 import BeautifulSoup
import mechanize
import json
import urlparse
from lxml import etree, html
import lxml
import urllib
from lxml.cssselect import CSSSelector
import unicodedata
from unidecode import unidecode
from os import sys

# endpoint
sparql_endpoint_remoto = "http://tweb2015.cs.unibo.it:8080/data"
sparql_endpoint_locale = "http://localhost:3030/data"

# user e pass autenticazione grafo
PASS = "FF79%bAW"
USER = "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537"

nome_grafo_gruppo = "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537"

# provenance gruppo
PROVENANCE = """<mailto:los.raspadores@gmail.com> a foaf:mbox ;
            schema:email "los.raspadores@gmail.com" ;
            foaf:name "LosRaspadores"^^xsd:string ;
            rdfs:label "LosRaspadores"^^xsd:string ."""

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
                PREFIX deo:   <http://purl.org/spar/deo/>"""


# gestione nomi autori articoli per IRI
def setIRIautore(nome_autore):
    nome_autore = nome_autore.strip()
    nome_autore = nome_autore.lower()
    for ch in ['\\', ';', '&', '`', '*', '_', '{', '}', '[', ']', '(', ')', '>', '#', '+', '-', '.', '!', '$', '\'']:
        if ch in nome_autore:
            nome_autore = nome_autore.replace(ch, "")

    for ch in ['à']:
        if ch in nome_autore:
            nome_autore = nome_autore.replace(ch, "a")
    for ch in ['è', 'é']:
        if ch in nome_autore:
            nome_autore = nome_autore.replace(ch, "e")
    for ch in ['ì']:
        if ch in nome_autore:
            nome_autore = nome_autore.replace(ch, "i")
    for ch in ['ò']:
        if ch in nome_autore:
            nome_autore = nome_autore.replace(ch, "o")
    for ch in ['ù']:
        if ch in nome_autore:
            nome_autore = nome_autore.replace(ch, "u")
    """
    rExps = [{'re': '/[\xE0-\xE6]/g', 'ch': 'a'},
             {'re': '/[\xE8-\xEB]/g', 'ch': 'e'},
             {'re': '/[\xEC-\xEF]/g', 'ch': 'i'},
             {'re': '/[\xF2-\xF6]/g', 'ch': 'o'},
             {'re': '/[\xF9-\xFC]/g', 'ch': 'u'}]
    for item in rExps:
        nome_autore = re.sub(item["re"], item["ch"], nome_autore)
    """

    prefix_rsch = "http://vitali.web.cs.unibo.it/raschietto/person/"
    uri = prefix_rsch   # =prefix/[inizialeprimonome]-[cognome]
    list = nome_autore.split(" ")
    print list
    length = len(list)
    if length == 1:
        uri += list[0]
    elif length == 2:
        uri += list[0][0:1] + "-" + list[1]
    elif length == 3:
        uri += list[0][0:1] + "-" + list[1] + list[2]
    else:
        uri += list[0][0:1] + "-" + list[length-2] + list[length-1]

    return uri


# ottenere data e ora nel formato specificato YYYY-MM-DDTHH:mm
def getDateTime():
    datetime.datetime.now()
    return strftime("%Y-%m-%dT%H:%M", gmtime())


def tripleFRBRdocument(url_doc):
    if url_doc.endswith(".html"):
        url_nohtml = url_doc[:-len(".html")]
    else:
        url_nohtml = url_doc
    tripleRFBR = "<" + url_doc + "> a fabio:item."\
        "<" + url_nohtml + "_ver1> a fabio:Expression;"\
        "fabio:hasRepresentation <" + url_doc + ">."\
        "<" + url_nohtml + "> a fabio:Work;"\
        "fabio:hasPortrayal <" + url_doc + ">;"\
        "frbr:realization <" + url_nohtml + "_ver1>. "
    return tripleRFBR


# urldoc, path, end, start, tipo, valore("bla") # titolo url autore anno doi
def costruisciAnnotazione(urldoc, path, start, end, tipo, valore, numcit):
    data = getDateTime()  # formatted
    urlnohtml = urldoc[:-len(".html")]
    target = "oa:hasTarget [ a oa:SpecificResource ;"\
                "oa:hasSelector [ a oa:FragmentSelector ;"\
                    "rdf:value \"" + path + "\"^^xsd:string ;"\
                    "oa:start \"" + start + "\"^^xsd:nonNegativeInteger ;"\
                    "oa:end  \"" + end + "\"^^xsd:nonNegativeInteger ] ;"\
                "oa:hasSource <" + urldoc + "> ] ."

    if tipo == "hasTitle":
        ann = """[] a oa:Annotation ;
            rdfs:label "Titolo"^^xsd:string ;
            rsch:type "hasTitle"^^xsd:string ;
            oa:annotatedAt \"""" + data + """\"^^xsd:dateTime ;
            oa:annotatedBy <mailto:los.raspadores@gmail.com> ;
            oa:hasBody _:title ; """ + target + """
            _:title a rdf:Statement;
            rdfs:label \"""" + valore + """\"^^xsd:string ;
            rdf:subject <""" + urlnohtml + """_ver1> ;
            rdf:predicate dcterms:title ;
            rdf:object \"""" + valore + """\"^^xsd:string ."""
    elif tipo == "hasAuthor":
        author = setIRIautore(valore)
        ann = """[] a oa:Annotation ;
            rdfs:label "Autore"^^xsd:string ;
            rsch:type "hasAuthor"^^xsd:string ;
            oa:annotatedAt \"""" + data + """\"^^xsd:dateTime ;
            oa:annotatedBy <mailto:los.raspadores@gmail.com>  ;
            oa:hasBody _:author ; """ + target + """
        _:author a rdf:Statement;
            rdfs:label \"""" + valore + """\"^^xsd:string ;
            rdf:subject  <""" + urlnohtml + """_ver1> ;
            rdf:predicate dcterms:creator;
            rdf:object <""" + author + """>. <""" + author + """> a foaf:Person ;
            rdfs:label \"""" + valore + """\"^^xsd:string ;
            foaf:made <""" + urldoc + """> ."""
    elif tipo == "hasPublicationYear":
        ann = """[] a oa:Annotation ;
            rdfs:label "Anno di pubblicazione"^^xsd:string ;
            rsch:type "hasPublicationYear"^^xsd:string ;
            oa:annotatedAt \"""" + data + """\"^^xsd:dateTime ;
            oa:annotatedBy <mailto:los.raspadores@gmail.com>  ;
            oa:hasBody _:year ; """ + target + """
        _:year a rdf:Statement;
            rdfs:label \"""" + valore + """\"^^xsd:string ;
            rdf:subject <""" + urlnohtml + """_ver1> ;
            rdf:predicate fabio:hasPublicationYear ;
            rdf:object \"""" + valore + """\"^^xsd:date ."""
    elif tipo == "hasDOI":
        ann = """[] a oa:Annotation ;
                rdfs:label "DOI"^^xsd:string ;
                rsch:type "hasDOI"^^xsd:string ;
                oa:annotatedAt \"""" + data + """\"^^xsd:dateTime ;
            oa:annotatedBy <mailto:los.raspadores@gmail.com>  ;
                oa:hasBody _:doi ; """ + target + """
            _:doi a rdf:Statement;
                rdfs:label \"""" + valore + """\"^^xsd:string ;
                rdf:subject <""" + urlnohtml + """_ver1> ;
                rdf:predicate prism:doi ;
                rdf:object \"""" + valore + """\"^^xsd:date ."""
    elif tipo == "hasURL":
        ann = """[] a oa:Annotation ;
            rdfs:label "URL"^^xsd:string ;
            rsch:type "hasURL"^^xsd:string ;
            oa:annotatedAt \"""" + data + """\"^^xsd:dateTime ;
            oa:annotatedBy <mailto:los.raspadores@gmail.com>  ;
            oa:hasBody _:url ; """ + target + """
        _:url a rdf:Statement;
            rdfs:label \"""" + urldoc + """\"^^xsd:string ;
            rdf:subject  <""" + urlnohtml + """_ver1> ;
            rdf:predicate fabio:hasURL ;
            rdf:object \"""" + urldoc + """\"^^xsd:anyURL ."""
    elif tipo == "cites":  # citazione
        ann = """[] a oa:Annotation ;
            rdfs:label "Citazione"^^xsd:string ;
            rsch:type "cites"^^xsd:string ;
            oa:annotatedAt \"""" + data + """\"^^xsd:dateTime ;
            oa:annotatedBy <mailto:los.raspadores@gmail.com>  ;
            oa:hasBody _:cite ; """ + target + """
        _:cite a rdf:Statement;
            rdfs:label \"""" + valore + """\"^^xsd:string ;
            rdf:subject  <""" + urlnohtml + """_ver1> ;
            rdf:predicate cito:cites ;
            rdf:object <""" + urldoc + "ver1_cited""" + str(numcit) + """>.
        <""" + urlnohtml + """_ver1_cited""" + str(numcit) + """> rdfs:label \"""" + valore + """\"^^xsd:string ."""
    return ann


def get_fragment_path(path):
    arr = path.split("_")
    for i in range(len(arr)):
        if not(contains_digits(arr[i])):
            arr[i] = arr[i] + "1"
        else:
            if "h" in arr[i]:
                if len(arr[i]) == 2:
                    arr[i] = arr[i]+"1"
    path = "_".join(arr)
    path = path.replace("1_html1_body1_", "")
    return path

# per query insert e delete
def do_query_post(endpoint, query):
    sparql_endpoint = SPARQLWrapper(endpoint+"/update?user=%s&pass=%s" % (USER, PASS), returnFormat="json")
    sparql_endpoint.setQuery(query)
    sparql_endpoint.setMethod('POST')
    sparql_endpoint.query()


def query_annotazione(nome_grafo, annotazione):
    query = prefissi + """
                INSERT DATA {
                    GRAPH <%s> { %s }
                }""" % (nome_grafo, annotazione)
    return query



def query_delete_all_doc_nostraprovenance(url_doc):
    query = prefissi + " WITH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537> " \
                    " DELETE {?a ?p ?o. ?body ?bp ?bo. ?target ?tp ?to. ?fragment ?fsp ?fso.} WHERE { "\
                    "?a ?p ?o. "\
                    "?a oa:hasBody ?body. "\
                    "?body ?bp ?bo. "\
                    "?a oa:annotatedBy <mailto:los.raspadores@gmail.com>. "\
                    "?a oa:hasTarget ?target. "\
                    "?target oa:hasSelector ?fragment. "\
                    "?target ?tp ?to. "\
                    "?fragment ?fsp ?fso. "\
                    "?target oa:hasSource <" + url_doc + ">.}"
    return query


def contains_digits(string):
    digits = re.compile('\d')
    return bool(digits.search(string))

def get_fragment_path(path):
    arr = path.split("_")
    for i in range(len(arr)):
        if not(contains_digits(arr[i])):
            arr[i] = arr[i] + "1"
        else:
            if "h" in arr[i]:
                if len(arr[i]) == 2:
                    arr[i] = arr[i]+"1"
    path = "_".join(arr)
    path = path.replace("html1_body1_", "")
    return path

def main():
    """
    print(setIRIautore(" Màrio  "))
    print(setIRIautore("Marìo   Rossi"))
    print(setIRIautore("Ma&rio Dè Rùssi  "))
    print(setIRIautore("M. Dé Rossi"))
    print(setIRIautore("M{ar}io De Rossi B*ian;chi"))
    print(setIRIautore("M[a]riò De Rossi Bianc.;h:i Vèrdi Gialli"))
    """

    path = "form1_table3_tbody1_tr1_td1_table5_tbody1_tr1_td1_table1_tbody1_tr1_td2_p2"
    start = "0"
    end = "20"
    url = "http://www.dlib.org/dlib/july15/downs/07downs.html"
    # (urldoc, path, start, end, tipo, valore):

    triple = ""

    titolo = "Data Stewardship in the Earth Sciences"
    ann = costruisciAnnotazione(url, path, start, end, "hasTitle", titolo, -1)
    triple += ann
    #query = query_annotazione(nome_grafo_gruppo, ann)
    #do_query_post(sparql_endpoint_remoto, query)

    ann = costruisciAnnotazione(url, path, start, end, "hasURL", url, -1)
    triple += ann

    autore = "Robert R. Downs"
    ann = costruisciAnnotazione(url, path, start, end, "hasAuthor", autore, -1)
    #triple += ann

    anno = "2015"
    ann = costruisciAnnotazione(url, path, start, end, "hasPublicationYear", anno, -1)
    triple += ann

    doi = "10.1045/july2015-downs"
    ann = costruisciAnnotazione(url, path, start, end, "hasDOI", doi, -1)
    triple += ann

    cit = "Between Memory and Paperbooks: Baconianism and Natural History in Sevent"
    ann = costruisciAnnotazione(url, path, start, end, "cites", cit, 1)
    triple += ann


    # per ogni cosa trovata dallo scraper

    # triple relative al documento
    documentFRBR = tripleFRBRdocument(url)
    triple += PROVENANCE + documentFRBR

    query = query_delete_all_doc_nostraprovenance(url)
    do_query_post(sparql_endpoint_locale, query)

    query = query_annotazione(nome_grafo_gruppo, triple)
    do_query_post(sparql_endpoint_locale, query)



    """
    reload(sys)
    sys.setdefaultencoding("utf-8")
    url = "http://rpd.unibo.it/article/view/5355"
    pathgenerale = "/html/body/div/div/div[2]/div[3]/"
    pathparziale = "div[2]/h3/text()"
    titolo = "La valutazione"


    #albero nodi metodo 1
    br = mechanize.Browser()
    response = br.open(url)
    dochtml = response.read()  # raw html source code
    albero = etree.HTML(dochtml)
    nodo = albero.xpath(pathgenerale + pathparziale)
    nodo = '\n'.join(nodo)
    start = nodo.find(titolo)
    end = start + len(titolo)
    print start
    print end

    # open url metodo 2
    url = "http://rpd.unibo.it/article/view/5355"
    url = "http://www.dlib.org/dlib/july15/downs/07downs.html"
    pathgenerale = "/html/body/div/div/div[2]/div[3]/"
    pathparziale = "div[2]/h3/text()"
    path = pathgenerale + pathparziale
    albero = lxml.html.parse(url).getroot()
    nodo = albero.xpath(pathgenerale + pathparziale)  # lista
    start = nodo[0].find(titolo)  # indice del
    if start == -1:
        print "qualcosa non va"
    end = start + len(titolo)
    print path
    path = path[11:-7]
    path_step_list = path.split("/")
    path = ""
    for step in path_step_list:
        if not contains_digits(step):
            step += "[1]"
        # h
        path += step + "/"
    path = path[:-1]
    # mpath = '/'.join(path_step_list) not work
    path = path.replace("[", "")
    path = path.replace("]", "")
    path = path.replace("/", "_")
    print path
    print start
    print end
    """


if __name__ == "__main__":
    print "this script (contactSparqlEndpoint) is being run directly from %s" % __name__
    main()
else:
    print "this script (contactSparqlEndpoint) is being imported into another module"