from pyquery import PyQuery
from urlparse import urlparse
import json
from bs4 import BeautifulSoup
import mechanize

  #Browser mechanize
br= mechanize.Browser


def scraping_titolo(url):

    #metodo per trovare titoli degli articoli di statistica

    #resp = br.open(url_articoli_statistica_almatorism)
    #raw_html = resp.read()
    #soup = BeautifulSoup(raw_html)
    #result = soup.select("div h3")

    return "ccccccc"


def scraping_titolo_dlib(url):

    #metodo per trovare titoli degli articoli di statistica

    resp = br.open(url)
    raw_html = resp.read()
    soup = BeautifulSoup(raw_html)
    result = soup.select("h3.blue-space")


def scarping_autore(url):

    #metodo per trovare autore degli articoli statistica

    resp = br.open(url)
    raw_html = resp.read()
    soup = BeautifulSoup(raw_html)
    result = soup.find("div",{"id":"authorString"})


def scraping_autore_dlib(url):

     #metodo per trovare autori degli articoli di dlib

    resp = br.open(url)
    raw_html = resp.read()
    soup = BeautifulSoup(raw_html)
    result = soup.select("p.blue b")


def scraping_doi(url):

    #metodo per trovare i DOI degli articoli di statistica

    resp = br.open(url)
    raw_html = resp.read()
    soup = BeautifulSoup(raw_html)
    result = soup.slect ("a",{"id":"pub-id::doi"})

#manca DOI DLIB


def scrapin_anno(url):

    #metodo per ottenere l'anno di un articolo DLIB

    resp = br.open(url)
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





def main():
    # url = "http://rivista-statistica.unibo.it/article/view/4594"
    scraping_titolo()




if __name__ == "__main__":
    print "this script (scrapingAutomatico) is being run directly from %s" % __name__
    main()
else:
    main()
    print "this script (scrapingAutomatico) is being imported into another module"





