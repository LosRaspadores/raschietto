#!/usr/bin/python
# -*- coding: utf-8 -*-

# python v 2.7
import json

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
#from scrapingCitazioni import scraping_citazioni
from scrapingAutomatico import scraping_titolo, scarping_autore,scraping_doi,scraping_anno, scraping_citazioni


# initializzazione applicazione
app = Flask(__name__)

# valori di configurazione
app.config.update(
    DEBUG=True,
)


# controllers
@app.route("/hello")
def hello():
    return "Hello from Python!"


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

@app.route('/scrapingTitolo')
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

# @app.route('/scrapingAutomatico')
# def return_titolo():
#     data = scraping_titolo(urlDoc="http://rivista-statistica.unibo.it/article/view/4600")
#     #data = scarping_autore(urlDoc="http://rivista-statistica.unibo.it/article/view/4600")
#     #data = scraping_doi(urlDoc="http://www.dlib.org/dlib/september15/wu/09wu.html")
#     #data = scraping_anno(urlDoc="http://www.dlib.org/dlib/november14/fedoryszak/11fedoryszak.html")
#     return data


@app.route('/scrapingSingoloDocumento')
def return_singolo_documento():
    url = request.args.get('url')
    data = scraping_singolo_documento(url)
    return data


# launch app
if __name__ == "__main__":
    # app.run(host='bla', port=8080)

    # in locale: run on default port localhost:5000
    app.run()
