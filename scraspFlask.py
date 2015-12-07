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
from contactSparqlEndpoint import do_query_get, do_query_post, prefissi, sparql_endpoint_remoto
import json
from scrapingCitazioni import scraping_citazioni
from scrapingAutomatico import scraping_titolo, scarping_autore,scraping_doi,scraping_anno


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

@app.route('/scrapingAutomatico')
def return_titolo():
    data = scraping_titolo(urlDoc="http://rivista-statistica.unibo.it/article/view/4600")
    #data = scarping_autore(urlDoc="http://rivista-statistica.unibo.it/article/view/4600")
    #data = scraping_doi(urlDoc="http://www.dlib.org/dlib/september15/wu/09wu.html")
    #data = scraping_anno(urlDoc="http://www.dlib.org/dlib/november14/fedoryszak/11fedoryszak.html")
    return data


@app.route('/scrapingSingoloDocumento')
def return_singolo_documento():
    url = request.args.get('url')
    data = scraping_singolo_documento(url)
    return data


@app.route('/getAllAnnotazioni')
def return_all_annotazioni():
    query = request.args.get('data')
    results = do_query_get(sparql_endpoint_remoto, prefissi+query)
    return json.dumps(results)  #dict to json


# launch app
if __name__ == "__main__":
    # app.run(host='bla', port=8080)

    # in locale: run on default port localhost:5000
    app.run()
