#!/usr/bin/python
# -*- coding: utf-8 -*-

# python v 2.7

__author__ = 'Los Raspadores'


"""
    pip install pyquery

    La libreria PyQuery aggiunge a Python la comodità di jQuery e permette la selezione degli elementi nella pagina web
    tramite selettori CSS
"""


# moduli importati
from pyquery import PyQuery
from urlparse import urlparse
import json



# url dove si trova l'elenco dei gruppi
url_grafi = "http://vitali.web.cs.unibo.it/TechWeb15/GrafiGruppi"

# il nome (=l'IRI) di ogni grafo ha struttura: "http://vitali.web.cs.unibo.it/raschietto/graph/[idgruppo]"
base_name = "http://vitali.web.cs.unibo.it/raschietto/graph/"

# nostri dati
our_graph = "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537"

our_group_id = "ltw1537"

our_group_name = "Los Raspadores"


# strip scheme and slash from url
def strip_scheme(url):

    """
        parsed = urlparse(url)
        scheme = "%s://" % parsed.scheme
        parsed = parsed.geturl().replace(scheme, '')  # strip scheme
        parsed = parsed.strip("/")  # strip slash
        return parsed[:-16]
    """

    parsed_url = urlparse(url)
    return parsed_url.netloc[:-16]


def get_lista_grafi(url):
    lista = list()
    S = PyQuery(url)  # S e' come $ in JQuery

    # per ogni a dal target="_top" si estrae a.attr(href) = il nome dello spazio web di ogni gruppo
    for a in S('.twikiTopic a[target="_top"]'):
        web_gruppo = S(a).attr("href")  # spazio web del gruppo
        idgruppo = strip_scheme(web_gruppo)  # id del gruppo
        nome_grafo = base_name + idgruppo  # nome di base + idgruppo
        lista.append(nome_grafo)

    lista.append(our_graph)
    return lista


def get_nome_id_gruppo(url):
    lista = list()
    S = PyQuery(url)  # S e' come $ in JQuery

    # per ogni a dal target="_top" si estrae a.attr(href) = il nome dello spazio web di ogni gruppo
    for a in S('.twikiTopic a[target="_top"]'):
        web_gruppo = S(a).attr("href")  # spazio web del gruppo
        idgruppo = strip_scheme(web_gruppo)  # id del gruppo
        lista.append(idgruppo)

    lista.append(our_group_id)
    return lista


def main():
    lista_grafi = get_lista_grafi(url_grafi)
    for grafo in lista_grafi:
        print grafo

    lista_gruppi = get_nome_id_gruppo(url_grafi)
    for gruppo in lista_gruppi:
        print gruppo


def scraping_gruppi():
    data = [
        {
            "id": "idgruppo1",
            "nome": "nomegruppo1"
        },
        {
            "id": "idgruppo2",
            "nome": "nomegruppo2"
        },
    ]

    # Writing JSON object
    return json.dumps(data)


if __name__ == "__main__":
    print "this script (scrapingGruppi) is being run directly from %s" % __name__
    main()
else:
    print "this script (scrapingGruppi) is being imported into another module"
