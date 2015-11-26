#!/usr/bin/python
# -*- coding: utf-8 -*-

# python v 2.7

__author__ = 'Los Raspadores'

"""
    pip install BeautifulSoup4

    Beautiful Soup automatically converts incoming documents to Unicode and outgoing documents to UTF-8

    >>> Documenti da annotare obbligatoramente:
        articoli del volume 20 issue 11/12
        -http://www.dlib.org/dlib/november14/11contents.html

        articoli del volume 74 n 1 statistica
        -http://rivista-statistica.unibo.it/issue/view/467

        tutti gli articoli di una issue a scelta su dilib
        -http://www.dlib.org/dlib/july15/07contents.html

        -tutti gli articoli di questa issue
        http://almatourism.unibo.it/issue/view/512

        -tutti gli articoli di questa issue
        http://antropologiaeteatro.unibo.it/issue/view/513

"""


from bs4 import BeautifulSoup
import mechanize
import json
import urlparse


# Browser mechanize
br = mechanize.Browser()


def get_contenuto_articolo_statistica(url_articolo):

    # url = "http://rivista-statistica.unibo.it/article/view/4594"

    resp = br.open(url_articolo)
    raw_html = resp.read()  # raw html source code
    soup = BeautifulSoup(raw_html)
    text_html = soup.get_text().encode("utf-8")  # html no tags
    soup.find(id="content").get_text()
    soup.title.string  # contenuto del title tag

def get_contenuto_articolo_dlib(url):

    url = "http://www.dlib.org/dlib/november14/beel/11beel.htm"  # "http://www.dlib.org/dlib/november14/brook/11brook.html"
    resp = br.open(url)
    raw_html = resp.read()  # raw html source code
    soup = BeautifulSoup(raw_html)
    text_html = soup.get_text().encode("utf-8")  # html no tags
    #print soup.findAll('td', valign='top')


def main():

    """
        url_base = "http://www.dlib.org/dlib/november14/11contents.html"
        url_relativo = "beel/11beel.html"
        url_assoluto = urlparse.urljoin(url_base, url_relativo)
        print url_assoluto
    """

    scraping_documenti()


def scraping_documenti():
    # Empty dict
    lista_docs = []

    """
        articoli del volume 74 n 1 statistica
        -http://rivista-statistica.unibo.it/issue/view/467
    """
    # trova gli url degli articoli
    resp = br.open("http://rivista-statistica.unibo.it/issue/view/467")
    raw_html = resp.read()  # raw html source code
    soup = BeautifulSoup(raw_html)
    results = soup.select("div.tocTitle a")

    for res in results:
        url = res["href"]
        data = {}
        data["url"] = url
        data["title"] = res.text
        lista_docs.append(data)

    """
        articoli del volume 20 issue 11/12
        -http://www.dlib.org/dlib/november14/11contents.html
    """
    url_base = "http://www.dlib.org/dlib/november14/11contents.html"
    resp = br.open("http://www.dlib.org/dlib/november14/11contents.html")
    raw_html = resp.read()  # raw html source code
    soup = BeautifulSoup(raw_html)
    results = soup.select("p.contents a")

    for res in results:
        url = res["href"]
        url = urlparse.urljoin(url_base, url)
        data = {}
        data["url"] = url
        data["title"] = res.text
        lista_docs.append(data)


    """
        tutti gli articoli di una issue a scelta su dilib
        -http://www.dlib.org/dlib/july15/07contents.html
    """

    url_base = "http://www.dlib.org/dlib/july15/07contents.html"
    resp = br.open(url_base)
    raw_html = resp.read()  # raw html source code
    soup = BeautifulSoup(raw_html)
    results = soup.select("p.contents a")

    for res in results:
        url = res["href"]
        url = urlparse.urljoin(url_base, url)
        data = {}
        data["url"] = url
        data["title"] = res.text
        lista_docs.append(data)


    """
        tutti gli articoli di questa issue
        http://almatourism.unibo.it/issue/view/512
    """

    url_base = "http://almatourism.unibo.it/issue/view/512"
    resp = br.open("http://almatourism.unibo.it/issue/view/512")
    raw_html = resp.read()  # raw html source code
    soup = BeautifulSoup(raw_html)
    results = soup.select("div.tocTitle a")

    for res in results:
        url = res["href"]
        url = urlparse.urljoin(url_base, url)
        data = {}
        data["url"] = url
        data["title"] = res.text
        lista_docs.append(data)


    """
        tutti gli articoli di questa issue
        http://antropologiaeteatro.unibo.it/issue/view/513
    """

    url_base = "http://antropologiaeteatro.unibo.it/issue/view/513"
    resp = br.open("http://antropologiaeteatro.unibo.it/issue/view/513")
    raw_html = resp.read()  # raw html source code
    soup = BeautifulSoup(raw_html)
    results = soup.select("div.tocTitle a")

    for res in results:
        url = res["href"]
        url = urlparse.urljoin(url_base, url)
        data = {}
        data["url"] = url
        data["title"] = res.text
        lista_docs.append(data)


    # print json.dumps(lista_docs)

    return json.dumps(lista_docs)


if __name__ == "__main__":
    print "this script (scrapingDocumenti) is being run directly from %s" % __name__
    main()
else:
    print "this script (scrapingDocumenti) is being imported into another module"
