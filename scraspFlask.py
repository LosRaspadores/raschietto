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

@app.route('/scrapingCitazioni')
def return_citazioni():
    urlD = request.args.get('url')
    data = scraping_citazioni(urlD)
    return data

@app.route('/scrapingAutomaticoAutore')
def return_autore():
     urlD = request.args.get('url')
     data = scarping_autore(urlD)
     return data

@app.route('/scrapingAutomaticoDoi')
def return_doi():
     urlD = request.args.get('url')
     data = scraping_doi(urlD)
     return data

@app.route('/scrapingAutomaticoYears')
def return_years():
     urlD = request.args.get('url')
     data = scraping_anno(urlD)
     return data

@app.route('/scrapingAutomaticoTitolo')
def return_auto_titolo():
    urlD = request.args.get('url')
    data = scraping_automatico_titolo(urlD)
    return data


@app.route('/scrapingTitolo')    #prende il titolo dei docuemnti quando vengono caricati
def return_titolo():
    url = request.args.get('url')
    item_list = json.loads(url)
    read_file = open('cacheDoc.json', 'r')
    result = read_file.read()
    read_file.close()
    if (result):
        data = result
    else:
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
        print (res["url"])
        if url_doc == res["url"]:
            is_in = 1
            break

    dict = []
    dict.append(url_doc)
    lista = scraping_titolo(dict)  # string
    item = lista[1:]
    item = item[:-1]

    if(is_in == 0):
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

sparql_endpoint_loc = "http://localhost:3030/dataset1"

@app.route('/salvaAnnotazioni')
def salvaAnnotazioni():
    query = request.args.get('query')
    ## do_query_post(sparql_endpoint_remoto, query)
    do_query_post(sparql_endpoint_loc, query)
    print query
    return "ok"

# launch app
if __name__ == "__main__":
    #app.run(host='bla', port=8080) host server
    app.run(host='127.0.0.1', port=5000) # host server (macchina local)

    # in locale: run on default port localhost:5000
    app.run()