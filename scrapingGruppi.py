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
from bs4 import BeautifulSoup
import mechanize

# Browser mechanize
br = mechanize.Browser()

# url dove si trova l'elenco dei gruppi
url_grafi = "http://vitali.web.cs.unibo.it/TechWeb15/GrafiGruppi"

# il nome (=l'IRI) di ogni grafo ha struttura: "http://vitali.web.cs.unibo.it/raschietto/graph/[idgruppo]"
base_name = "http://vitali.web.cs.unibo.it/raschietto/graph/"

# nostri dati
our_graph = "http://vitali.web.cs.unibo.it/raschietto/graph/ltw1537"

our_group_id = "ltw1537"

our_group_name = "Los Raspadores"


def main():
    scraping_gruppi()




def scraping_gruppi():
    lista = []
    url_gruppi = "http://vitali.web.cs.unibo.it/TechWeb15/ProgettoDelCorso"
    page = br.open(url_gruppi)
    html = page.read()
    soup = BeautifulSoup(html)
    table = soup.find("table", cellpadding="5")
    for r in table.findAll('tr')[1:]:
        list =  r.findAll("font")
        data = {}
        data['id'] = list[0].text
        data['nome'] = list[1].text
        lista.append(data)

    print json.dumps(lista)
    return  json.dumps(lista)


if __name__ == "__main__":
    print "this script (scrapingGruppi) is being run directly from %s" % __name__
    main()
else:
    main()
    print "this script (scrapingGruppi) is being imported into another module"
