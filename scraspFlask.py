#!/usr/bin/python
# -*- coding: utf-8 -*-

# python v 2.7

__author__ = 'Los Raspadores'

"""
    pip install Flask

    spazio web nostro gruppo url: http://ltw1537.web.cs.unibo.it/
"""

from flask import Flask, render_template, request

# script importati
from scrapingGruppi import scraping_gruppi
from scrapingDocumenti import scraping_documenti
from scrapingSingoloDocumento import scraping_singolo_documento
from contactSparqlEndpoint import do_query_get, do_query_post, prefissi, sparql_endpoint_remoto, rfrbDocToEndpoint
import json
from scrapingAutomatico import scraping_titolo, scarping_autore, scraping_doi, scraping_anno, scraping_citazioni, scraping_automatico_titolo
from insertQuery import *
import traceback


# inizializzazione applicazione
app = Flask(__name__)


# valori di configurazione TODO DEBUG=True >>> eliminare dopo la migrazione sul server!!
app.config.update(
    DEBUG=True,
)


# controllers
@app.route('/')
def index(name=None):
    return render_template('index.html', name=name)


@app.route('/scrapingDocumenti')
def return_documenti():
    data = scraping_documenti()
    return data


@app.route('/scrapingGruppi')
def return_gruppi():
    data = scraping_gruppi()
    return data


@app.route('/scrapingAutomatico')
def scrapingAutomatico():
    urlD = request.args.get('url')

    listaAnnotazioni = scraping(urlD)

    result = {}
    result["numero"] = len(listaAnnotazioni)
    return json.dumps(result)


@app.route('/scrapingForzato')
def scrapingForzato():
    urlD = request.args.get('url')

    # elimitazione delle annotazioni automatiche del documento corrente (automatiche = quelle con la nostra provenance)
    query_delete = query_delete_all_doc_nostraprovenance(urlD)
    do_query_post(sparql_endpoint_remoto, query_delete)

    listaAnnotazioni = scraping(urlD)

    result = {}
    result["numero"] = len(listaAnnotazioni)
    return json.dumps(result)


def scraping(urlD):

    # aggiunte sull'endpoint triple relative alla nostra provenance
    query_provenance = query_annotazione(nome_grafo_gruppo, PROVENANCE)
    do_query_post(sparql_endpoint_remoto, query_provenance)

    listaAnnotazioni = []

    """
    try:
        anno = scraping_anno(urlD)
        annAnno = costruisciAnnotazione(urlD, anno["xpath"], anno["start"], anno["end"], "hasPublicationYear", anno["anno"], 0)
        query_Anno = query_annotazione(nome_grafo_gruppo, annAnno)
        do_query_post(sparql_endpoint_remoto,query_Anno)
        listaAnnotazioni.append(annAnno)
        print "anno ok"
    except Exception:
        print "exc anno"
        traceback.print_exc()
        pass

    try:
        annUrl = costruisciAnnotazione(urlD, "document", "0", "0", "hasURL", urlD, 0)
        query_url = query_annotazione(nome_grafo_gruppo, annUrl)
        do_query_post(sparql_endpoint_remoto, query_url)
        listaAnnotazioni.append(annUrl)
        print "url ok"
    except Exception:
        print "exc url"
        traceback.print_exc()
        pass

    try:
        listaAutori = scarping_autore(urlD)
        for autore in listaAutori:
            annAutore = costruisciAnnotazione(urlD, autore["path"], autore["start"], autore["end"], "hasAuthor", autore["autori"].decode("utf-8"), 0)
            query_autore = query_annotazione(nome_grafo_gruppo, annAutore)
            do_query_post(sparql_endpoint_remoto, query_autore)
            listaAnnotazioni.append(annAutore)
        print "autori ok"
    except Exception:
        print "exc autori"
        traceback.print_exc()
        pass

    try:
        titolo = scraping_automatico_titolo(urlD)
        annTitolo = costruisciAnnotazione(urlD, titolo["path"], titolo["start"], titolo["end"], "hasTitle", titolo["titolo"].decode("utf-8"), 0)
        query_titolo = query_annotazione(nome_grafo_gruppo, annTitolo)
        do_query_post(sparql_endpoint_remoto, query_titolo)
        listaAnnotazioni.append(annTitolo)
        print "titolo ok"
    except Exception:
        print "exc titolo"
        traceback.print_exc()
        pass

    try:
        doi = scraping_doi(urlD)  # dict
        annDoi = costruisciAnnotazione(urlD, doi["xpath"], doi["start"], doi["end"], "hasDOI", doi["doi"], 0)
        query_doi = query_annotazione(nome_grafo_gruppo, annDoi)
        do_query_post(sparql_endpoint_remoto,query_doi)
        listaAnnotazioni.append(annDoi)
        print "doi ok"
    except Exception:
        print "exc doi"
        traceback.print_exc()
        pass"""

    try:
        listaCitazioni = scraping_citazioni(urlD)
        print "tot citazioni"
        print len(listaAnnotazioni)
        i = 1
        for citazione in listaCitazioni:
            annCitazione = costruisciAnnotazione(urlD, citazione["path"], citazione["start"], citazione["end"], "cites", citazione["citazione"].decode("utf-8"), i)
            query_citazione = query_annotazione(nome_grafo_gruppo, annCitazione)
            do_query_post(sparql_endpoint_remoto, query_citazione)
            listaAnnotazioni.append(annCitazione)
            i += 1
        print "citazioni ok"
    except Exception:
        print "exc citazioni"
        traceback.print_exc()
        pass

    print "scraping"

    return listaAnnotazioni

@app.route('/scrapingCitazioni')
def return_citazioni():
    urlD = request.args.get('url')
    data = scraping_citazioni(urlD)
    return json.dumps(data)



@app.route('/getDocumenti', methods=['GET', 'POST'])  # prende il titolo dei documenti quando vengono caricati
def return_titolo():

    item_list = []
    read_file = open('cacheDoc.json', 'r')
    result = read_file.read()
    read_file.close()
    if (result):
        data = result
    else:
        docFromScraping = scraping_documenti();
        query = "PREFIX fabio: <http://purl.org/spar/fabio/> SELECT DISTINCT ?doc WHERE { ?doc a fabio:Item . FILTER NOT EXISTS { ?doc a fabio:Item . FILTER regex(str(?doc), 'cited')} FILTER NOT EXISTS { ?doc a fabio:Item . FILTER regex(str(?doc), 'Reference')} FILTER NOT EXISTS { ?doc a fabio:Item . FILTER regex(str(?doc), '_ver')}}";
        docFromSPARQL = do_query_get(sparql_endpoint_remoto, query)

        for d in docFromScraping:
            item_list.append(d['url'])

        for doc in docFromSPARQL['results']['bindings']:
            if doc['doc']['value'] in item_list:
                continue
            else:
                item_list.append(doc['doc']['value'])
        # if url is not None:
        data = scraping_titolo(item_list)
        out_file = open('cacheDoc.json', 'w')
        out_file.write(data)
        out_file.close()
    return data


@app.route('/scrapingSingoloDocumento')
def return_singolo_documento():
    url = request.args.get('url')
    data = scraping_singolo_documento(url)
    return data


@app.route('/checkDocumentoInCache')
def check_Documento_In_Cache():
    url_doc = request.args.get('url')
    with open('cacheDoc.json') as fp:
        content = fp.read()
        result = json.loads(content)

    is_in = 0
    for res in result:
        if url_doc == res["url"]:
            is_in = 1
            break

    dict = []
    dict.append(url_doc)
    lista = scraping_titolo(dict)  # string
    item = lista[1:]
    item = item[:-1]

    if (is_in == 0):
        with open("cacheDoc.json", "r") as fp:
            content = fp.read()
            value = json.loads(content)
            jitem = json.loads(item)
            value.append(jitem)

        with open("cacheDoc.json", "w") as fp:
            json.dump(value, fp)

        rfrbDocToEndpoint(url_doc)
    else:
        lista = []
        data = {}
        data['url'] = "no"
        data['titolo'] = "no"
        lista.append(data)
        lista = json.dumps(lista)

    return lista


@app.route('/salvaAnnotazioni')
def salvaAnnotazioni():
    query = request.args.get('query')
    lista_query = json.loads(query)
    for q in lista_query:
        do_query_post(sparql_endpoint_remoto, q)
    return "ok"


# launch app
if __name__ == "__main__":
    # app.run(host='bla', port=8080) host server
    app.run(host='127.0.0.1', port=5000)  # host server (macchina local)

    # in locale: run on default port localhost:5000
    # app.run()
