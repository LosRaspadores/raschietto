#!/usr/bin/python
# -*- coding: utf-8 -*-

__author__ = 'Los Raspadores'


# moduli importati

# pyquery: aggiunge a python la comodità di JQuery e permette quindi la selezione degli elementi tramite selettori CSS
from pyquery import PyQuery  # pip install pyquery
from urlparse import urlparse


# url dell'elenco degli indirizzi dei grafi degli altri gruppi
url_grafi = "http://vitali.web.cs.unibo.it/TechWeb15/GrafiGruppi"

# il nome, ovvero l'IRI di ogni grafo ha struttura: "http://vitali.web.cs.unibo.it/raschietto/graph/[idgruppo]"
base_url = "http://vitali.web.cs.unibo.it/raschietto/graph/"

our_url = "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537"

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


def find_graphs(url):
    lista = list()
    S = PyQuery(url)  # S e' come $ in JQuery

    # per ogni a dal target="_top" si estrae a.attr(href) = il nome dello spazio web di ogni gruppo
    for a in S('.twikiTopic a[target="_top"]'):
        graph = S(a).attr("href")
        graph = strip_scheme(graph)  # si prende solo l'idgruppo dal nome
        graph_url = base_url+graph  # url di base + idgruppo
        lista.append(graph_url)

    return lista


def main():
    lista = find_graphs(url_grafi)
    lista.append(our_url)

    for graph in lista:
        print graph


main()
