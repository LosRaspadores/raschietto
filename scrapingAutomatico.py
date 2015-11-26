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
from bs4 import BeautifulSoup
import mechanize
import requests
import json
import urlparse



# Browser mechanize
br = mechanize.Browser()


def main():
    # scraping_titolo()
    #scraping_titolo_dlib()
    #scarping_autore()
    #scraping_autore_dlib()
    scraping_doi()

def scraping_titolo():
    # metodo per trovare titoli degli articoli di statistica

    urlDoc = "http://almatourism.unibo.it/article/view/5294";
    # http://almatourism.unibo.it/article/view/5290
    # http://almatourism.unibo.it/article/view/5293
    # http://almatourism.unibo.it/article/view/5294
    # http://almatourism.unibo.it/article/view/5292
    # http://almatourism.unibo.it/article/view/4647

    # http://antropologiaeteatro.unibo.it/article/view/5295
    # http://antropologiaeteatro.unibo.it/article/view/5296
    # http://antropologiaeteatro.unibo.it/article/view/5297
    # http://antropologiaeteatro.unibo.it/article/view/5298
    # http://antropologiaeteatro.unibo.it/article/view/5429
    # http://antropologiaeteatro.unibo.it/article/view/5581
    # http://antropologiaeteatro.unibo.it/article/view/5588

    # http://rivista-statistica.unibo.it/article/view/4594
    # http://rivista-statistica.unibo.it/article/view/4595
    # http://rivista-statistica.unibo.it/article/view/4597
    # http://rivista-statistica.unibo.it/article/view/4598
    # http://rivista-statistica.unibo.it/article/view/4599
    # http://rivista-statistica.unibo.it/article/view/4600
    # http://rivista-statistica.unibo.it/article/view/4601

    resp = br.open(urlDoc)
    raw_html = resp.read()
    soup = BeautifulSoup(raw_html)
    result = soup.find("h3")

    # per togliere i tag
    for res in result:
        print "<h3>%s</h3>" % res.string

    print json.dumps(res)
    return json.dumps(res)



def scraping_titolo_dlib():
    # metodo per trovare titoli degli articoli di statistica
    lista= []
    urlDoc = "http://www.dlib.org/dlib/september15/buddenbohm/09buddenbohm.html";
    # articoli d_lib ( h3 class=“blue-space”)
    # http://www.dlib.org/dlib/november14/beel/11beel.html
    # http://www.dlib.org/dlib/november14/brook/11brook.html
    # http://www.dlib.org/dlib/november14/fedoryszak/11fedoryszak.html
    # http://www.dlib.org/dlib/november14/giannakopoulos/11giannakopoulos.html
    # http://www.dlib.org/dlib/november14/holub/11holub.html
    # http://www.dlib.org/dlib/november14/jahja/11jahja.html
    # http://www.dlib.org/dlib/november14/klampfl/11klampfl.html
    # http://www.dlib.org/dlib/november14/knoth/11knoth.html
    # http://www.dlib.org/dlib/november14/kristianto/11kristianto.html
    # http://www.dlib.org/dlib/november14/kroell/11kroell.html
    # http://www.dlib.org/dlib/november14/murray-rust/11murray-rust.html
    # http://www.dlib.org/dlib/november14/smith-unna/11smith-unna.html
    # http://www.dlib.org/dlib/november14/tkaczyk/11tkaczyk.html
    # http://www.dlib.org/dlib/november14/voelske/11voelske.html
    # http://www.dlib.org/dlib/november14/meleco/11meleco.html

    # articoli d_lib 2 (h3 class=“blue-space”)
    # http://www.dlib.org/dlib/september15/buddenbohm/09buddenbohm.html
    # http://www.dlib.org/dlib/september15/casad/09casad.html
    # http://www.dlib.org/dlib/september15/rosenthal/09rosenthal.html
    # http://www.dlib.org/dlib/september15/parilla/09parilla.html
    # http://www.dlib.org/dlib/september15/stein/09stein.html
    # http://www.dlib.org/dlib/september15/wu/09wu.html

    resp = br.open(urlDoc)
    raw_html = resp.read()
    soup = BeautifulSoup(raw_html)
    result = soup.select("h3.blue-space")

    for res in result:
        data={}
        data["titolo"]= res.text
        lista.append(data)

    print json.dumps(lista)
    return json.dumps(lista)

    #for res in result:
    #   print "<h3>%s</h3>" % res.string
    # print res.contents[0].string




def scarping_autore():
    # metodo per trovare autore degli articoli statistica

    #Articoli Almatourism
    #http://almatourism.unibo.it/article/view/5290
    #http://almatourism.unibo.it/article/view/5293
    #http://almatourism.unibo.it/article/view/5294
    #http://almatourism.unibo.it/article/view/5292
    #http://almatourism.unibo.it/article/view/4647

    #articoli antropologia e teatro (h3) (titolo/autori)
    #http://antropologiaeteatro.unibo.it/article/view/5295
    #http://antropologiaeteatro.unibo.it/article/view/5296
    #http://antropologiaeteatro.unibo.it/article/view/5297
    #http://antropologiaeteatro.unibo.it/article/view/5298
    #http://antropologiaeteatro.unibo.it/article/view/5429
    #http://antropologiaeteatro.unibo.it/article/view/5581
    #http://antropologiaeteatro.unibo.it/article/view/5588

    #articoli statistica (h3) (titolo/autori)
    #http://rivista-statistica.unibo.it/article/view/4594
    #http://rivista-statistica.unibo.it/article/view/4595
    #http://rivista-statistica.unibo.it/article/view/4597
    #http://rivista-statistica.unibo.it/article/view/4598
    #http://rivista-statistica.unibo.it/article/view/4599
    #http://rivista-statistica.unibo.it/article/view/4600
    #http://rivista-statistica.unibo.it/article/view/4601

    lista=[]
    urlDoc = "http://antropologiaeteatro.unibo.it/article/view/5298";
    resp = br.open(urlDoc)
    raw_html = resp.read()
    soup = BeautifulSoup(raw_html)
    result = soup.find("div", {"id": "authorString"})

    for res in result:
        soup.select("em")
        data={}
        data["autore"]=res.text
        lista.append(data)

    print json.dumps(lista)
    return json.dumps(lista)



def scraping_autore_dlib():
    # metodo per trovare autori degli articoli di dlib

    lista=[]
    urlDoc = "http://www.dlib.org/dlib/september15/buddenbohm/09buddenbohm.html";
    resp = br.open(urlDoc)
    raw_html = resp.read()
    soup = BeautifulSoup(raw_html)
    result = soup.select("p.blue b")

    for res in result:
        data={}
        data["autore"]=res.string
        lista.append(data)


    print json.dumps(lista)
    return json.dumps(lista)



def scraping_doi():
    # metodo per trovare i DOI degli articoli di statistica etc
    lista=[]
    urlDoc = "http://almatourism.unibo.it/article/view/5290";
    resp = br.open(urlDoc)
    raw_html = resp.read()
    soup = BeautifulSoup(raw_html)
    result = soup.find("a", {"id": "pub-id::doi"})

    for res in result:
        data={}
        data["Doi"]=res.string
        lista.append(data)

    print json.dumps(lista)
    return json.dumps(lista)


def scraping_doi_dlib():
    lista=[]
    urlDoc = "http://www.dlib.org/dlib/november14/beel/11beel.html";
    resp = br.open(urlDoc)
    raw_html = resp.read()
    soup = BeautifulSoup(raw_html)
    result= soup.find("p.blue")      #modificare la selezione //non funzionante

    print result
    return urlDoc


# manca DOI DLIB


def scraping_anno():
    # metodo per ottenere l'anno di un articolo DLIB

    resp = br.open()
    raw_html = resp.read()
    soup = BeautifulSoup(raw_html)
    result = soup.select("p.blue")


# Questo metodo invece recupera l'anno per un articolo di dlib
def getYear(month, url):
    year = url.partition(month)[2];
    year = year[0:2];
    return int(year);


# questo metodo verifica che l'articolo di dlib sia recente (>= 2010)
def isRecent(year):
    if year >= 10 and year <= 15:
        return "yes";
    else:
        return "no";


if __name__ == "__main__":
    print "this script (scrapingAutomatico) is being run directly from %s" % __name__
    main()
else:
    print "this script (scrapingAutomatico) is being imported into another module"
