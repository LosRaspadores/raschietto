
#!/usr/bin/python
# -*- coding: utf-8 -*-

# python v 2.7

__author__ = 'Los Raspadores'


from BeautifulSoup import BeautifulSoup
import mechanize
import json
import urlparse


def main():

    scraping_documenti()


def scraping_documenti():

    # Browser mechanize
    br = mechanize.Browser()

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
    divclass = soup.findAll('div', attrs={'class': 'tocTitle'})  # lista

    for div in divclass:
        results = div.findAll("a")
        for res in results:
            url = res["href"]
            data = {}
            data['url'] = url
            data['title'] = res.text
            lista_docs.append(data)



    """
        articoli del volume 20 issue 11/12
        -http://www.dlib.org/dlib/november14/11contents.html
    """
    url_base = "http://www.dlib.org/dlib/november14/11contents.html"
    resp = br.open("http://www.dlib.org/dlib/november14/11contents.html")
    raw_html = resp.read()  # raw html source code
    soup = BeautifulSoup(raw_html)
    divclass = soup.findAll('p', attrs={'class': 'contents'})  # lista

    for div in divclass:
        results = div.findAll("a")
        for res in results:
            url = res["href"]
            url = urlparse.urljoin(url_base, url)
            data = {}
            data['url'] = url
            data['title'] = res.text
            lista_docs.append(data)


    """
        tutti gli articoli di una issue a scelta su dilib
        -http://www.dlib.org/dlib/july15/07contents.html
    """

    url_base = "http://www.dlib.org/dlib/july15/07contents.html"
    resp = br.open(url_base)
    raw_html = resp.read()  # raw html source code
    soup = BeautifulSoup(raw_html)
    divclass = soup.findAll('p', attrs={'class': 'contents'})  # lista

    for div in divclass:
        results = div.findAll("a")
        for res in results:
            url = res["href"]
            url = urlparse.urljoin(url_base, url)
            data = {}
            data['url'] = url
            data['title'] = res.text
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
    resp = br.open(url_base)
    raw_html = resp.read()  # raw html source code
    soup = BeautifulSoup(raw_html)
    divclass = soup.findAll('div', attrs={'class': 'tocTitle'})  # lista

    for div in divclass:
        results = div.findAll("a")
        for res in results:
            url = res["href"]
            data = {}
            data['url'] = url
            data['title'] = res.text
            lista_docs.append(data)


    #print json.dumps(lista_docs)
    return lista_docs

if __name__ == "__main__":
    main()
