#!/usr/bin/python
# -*- coding: utf-8 -*-

# python v 2.7

__author__ = 'Los Raspadores'

"""
    pip install Flask
"""

from flask import Flask, render_template

# script importati
from scrapingGruppi import scraping_gruppi
from scrapingDocumenti import scraping_documenti


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


# launch app
if __name__ == "__main__":

    # app.run(host='bla', port=8080)

    # in locale: run on default port localhost:5000
    app.run()