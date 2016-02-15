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
from SPARQLWrapper import SPARQLWrapper, JSON, N3, TURTLE # per interrogare uno SPARQL end-point
from rdflib import Namespace  # modulo Namespace per crearne di nuovi
import re
import datetime
from time import strftime, localtime


# endpoint
sparql_endpoint_remoto = "http://tweb2015.cs.unibo.it:8080/data"
sparql_endpoint_locale = "http://localhost:3030/data"

# user e pass autenticazione grafo
PASS = "FF79%bAW"
USER = "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537"

nome_grafo_gruppo = "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537"

# provenance gruppo
PROVENANCE = """<mailto:los.raspadores@gmail.com> a <http://xmlns.com/foaf/0.1/mbox> ;
    <http://www.w3.org/2000/01/rdf-schema#label> "LosRaspadores"^^<http://www.w3.org/2001/XMLSchema#string> ;
    <http://schema.org/email> "los.raspadores@gmail.com" ;
    <http://xmlns.com/foaf/0.1/name> "LosRaspadores"^^<http://www.w3.org/2001/XMLSchema#string> ."""

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
    nome_autore = nome_autore.encode("utf-8")
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
    prefix_rsch = "http://vitali.web.cs.unibo.it/raschietto/person/"
    uri = prefix_rsch   # =prefix/[inizialeprimonome]-[cognome]
    list = nome_autore.split(" ")
    length = len(list)
    if length == 1:
        uri += list[0]
    elif length == 2:
        uri += list[0][0:1] + "-" + list[1]
    elif length == 3:
        uri += list[0][0:1] + "-" + list[1] + list[2]
    else:
        uri += list[0][0:1] + "-" + list[length-2] + list[length-1]
    uri = uri.decode("utf-8")
    return uri


# ottenere data e ora locale nel formato specificato YYYY-MM-DDTHH:mm
def getDateTime():
    datetime.datetime.now()
    return strftime("%Y-%m-%dT%H:%M", localtime())


# triple ontologia frbr e fabio relative a un documento annotato
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


def costruisciAnnotazione(urldoc, path, start, end, tipo, valore, numcit):
    data = getDateTime()  # data e ora locale nel formato specificato YYYY-MM-DDTHH:mm
    valore = valore.replace('"', "'")
    valore = valore.replace("\n", "")

    if urldoc.find(".html"):
        urlnohtml = urldoc[:-len(".html")]
    else:  # gli url di alcuni documenti non finiscono con .html
        urlnohtml = urldoc
    target = "oa:hasTarget [ a oa:SpecificResource ;"\
                "oa:hasSelector [ a oa:FragmentSelector ;"\
                    "rdf:value \"" + path + "\"^^xsd:string ;"\
                    "oa:start \"" + str(start) + "\"^^xsd:nonNegativeInteger ;"\
                    "oa:end  \"" + str(end) + "\"^^xsd:nonNegativeInteger ] ;"\
                "oa:hasSource <" + str(urldoc) + "> ] ."

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
        author = setIRIautore(valore)  # iri autore formato corretto (cioe' come da specifiche)
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
                rdf:object \"""" + valore + """\"^^xsd:string ."""
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
    elif tipo == "cites":
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


def xpathToFragmentPath(xpath):
    xpath = xpath.replace("/html/body/", "")
    xpath = xpath.replace("/text()", "")
    xpath_steps = xpath.split("/")
    fragment_path = ""
    for step in xpath_steps:
        if not contains_digits(step):
            step += "1"
        if step == "h1" or step == "h2" or step == "h3" or step == "h4" or step == "h5" or step == "h6":
            if len(step) == 2:
                step += "1"
        fragment_path += step + "_"
    fragment_path = fragment_path[:-1]
    fragment_path = fragment_path.replace("[", "")
    fragment_path = fragment_path.replace("]", "")
    return fragment_path


def main():
    print "insertquery"


if __name__ == "__main__":
    main()