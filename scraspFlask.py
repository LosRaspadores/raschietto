#!/usr/bin/python
# -*- coding: utf-8 -*-

# python v 2.7

__author__ = 'Los Raspadores'

"""
    pip install Flask

    spazio web nostro gruppo url: http://ltw1537.web.cs.unibo.it/
"""

from flask import Flask, render_template, request, jsonify

# script importati
from scrapingGruppi import scraping_gruppi
from scrapingDocumenti import scraping_documenti
from contactSparqlEndpoint import do_query_get, do_query_post, prefissi, sparql_endpoint_remoto
import json


# initializzazione applicazione
app = Flask(__name__)

# valori di configurazione, DEBUG=True >>> eliminare dopo la migrazione sul server!!
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

@app.route('/getAllAnnotazioni')
def return_all_annotazioni():
    query = request.args.get('data')
    results = do_query_get(sparql_endpoint_remoto, prefissi+query)
    """
    for result in results["results"]["bindings"]:  #result["body_l"]["value"]+" "
        print(result["graph"]["value"]+" "+result["label"]["value"]+" "+result["type"]["value"]+" "\
             +result["date"]["value"]+" "+result["prov_nome"]["value"]+" "+result["prov_email"]["value"]+" "\
             +result["body_s"]["value"]+" "+result["body_p"]["value"]+" "+result["body_o"]["value"]+" "\
             +result["fs_value"]["value"]+" "+result["start"]["value"]+" "\
             +result["end"]["value"])
    """
    return json.dumps(results)  #dict to json



# launch app
if __name__ == "__main__":

    # app.run(host='bla', port=8080)

    # in locale: run on default port localhost:5000
    app.run()