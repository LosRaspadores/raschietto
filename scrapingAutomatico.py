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
import json
from urlparse import urlparse



# Browser mechanize
br = mechanize.Browser()
br.set_handle_robots(False) #
br.set_handle_refresh(False)
br.addheaders = [('user-agent', '   Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.3) Gecko/20100423 Ubuntu/10.04 (lucid) Firefox/3.6.3')]


def main():
     scraping_titolo()
    # scarping_autore()
    # scraping_doi()
    # scraping_anno()

def scraping_titolo(urlDoc):
    lista = []

    for doc in urlDoc:
        parsed_uri = urlparse(doc)
        try:
            resp = br.open(doc)
        except:
            print "Connection failed with "+doc
            continue
        raw_html = resp.read()
        soup = BeautifulSoup(raw_html)

        if parsed_uri[1] == 'www.dlib.org' or parsed_uri[1] == 'dlib.org':
            result = soup.select("h3.blue-space")
            for res in result:
                if (res.text != 'D-Lib Magazine'):
                    data = {}
                    data['url'] = doc;
                    data['titolo'] = res.text
                    lista.append(data)
        elif parsed_uri[1] == 'antropologiaeteatro.unibo.it' or parsed_uri[1] == 'almatourism.unibo.it' or parsed_uri[1] == 'rivista-statistica.unibo.it' or parsed_uri[1].find('unibo.it') != -1:
            if len(parsed_uri[2]) > 2 and parsed_uri[2].find("article") != -1:
                result = soup.find('div', {"id": "articleTitle"})
                res = result.find('h3')
                data = {}
                data['url'] = doc
                data['titolo'] = res.string
                lista.append(data)
            else:
                data={}
                data['url'] = doc
                data['titolo'] = soup.find('title').string
                lista.append(data)
        else:
            title = soup.find('title')
            data={}
            data['url'] = doc
            if title is None:
                data['titolo'] = doc
            else:
                data['titolo'] = title.string
            lista.append(data)
    print json.dumps(lista)
    return json.dumps(lista)

def scarping_autore(urlDoc):
    lista = []
    resp = br.open(urlDoc)
    raw_html = resp.read()
    soup = BeautifulSoup(raw_html)

    parsed_uri = urlparse(urlDoc)
    domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
    print domain

    if domain == 'http://www.dlib.org/':
        result = soup.select("p.blue b")
        for res in result:
            data = {}
            data["autore"] = res.string
            lista.append(data)


    elif domain == 'http://antropologiaeteatro.unibo.it/' \
            or 'http://almatourism.unibo.it/' \
            or 'http://rivista-statistica.unibo.it/':
        result = soup.find("div", {"id": "authorString"})
        for res in result:
            data = {}
            data["autore"] = res.string
            lista.append(data)


    print json.dumps(lista)
    return json.dumps(lista)


def scraping_doi(urlDoc):

    lista = []
    resp = br.open(urlDoc)
    raw_html = resp.read()
    soup = BeautifulSoup(raw_html)

    parsed_uri = urlparse(urlDoc)
    domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
    print domain

    if domain == 'http://www.dlib.org/':
        result = soup.select("p.blue")
        for res in result:
            pos = res.text.find('DOI:')
            pos1 = res.text.find('doi:')
            if (pos>-1):
              value = res.text[pos+4:]
              print value
              data = {}
              data["Doi"] = value
              lista.append(data)
            if (pos1>-1):
              value = res.text[pos1+4:]
              print value
              data = {}
              data["Doi"] = value
              lista.append(data)



    elif domain == 'http://antropologiaeteatro.unibo.it/' \
            or 'http://almatourism.unibo.it/' \
            or 'http://rivista-statistica.unibo.it/':
        result = soup.find("a", {"id": "pub-id::doi"})
        for res in result:
            data = {}
            data["Doi"] = res.string
            lista.append(data)

    print json.dumps(lista)
    return json.dumps(lista)


def scraping_anno(urlDoc):
    lista = []
    resp = br.open(urlDoc)
    raw_html = resp.read()
    soup = BeautifulSoup(raw_html)

    parsed_uri = urlparse(urlDoc)
    domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
    print domain

    if domain == 'http://www.dlib.org/':
        result = soup.select("p.blue")
        for res in result:
            pos = res.text.find('November')
            pos1 = res.text.find('September')
            if (pos >-1):
               value = res.text[pos+18:]
               value1 = value[:pos+4]
               data = {}
               data["anno"] = value1
               lista.append(data)
            if (pos1>-1):
                value= res.text[pos1+18:]
                value1 = value[:pos1+4]
                print value1
                data = {}
                data["anno"] = value1
                lista.append(data)

    elif domain == 'http://antropologiaeteatro.unibo.it/' \
            or 'http://almatourism.unibo.it/' \
            or 'http://rivista-statistica.unibo.it/':
        result = soup.find_all("p")
        for res in result:
            if (res.text.find('Registration')>-1 or res.text.find('Registrazione')>-1):
                elements=res.text.split(' ')
                currele = ''
                for ele in elements:
                   if (len(ele) ==  4):
                       currele = ele
                       print "ele=" + ele
                data = {}
                data["anno"] = currele
                lista.append(data)

    print json.dumps(lista)
    return json.dumps(lista)

def scraping_citazioni(url):
    lista = []
    try:
        resp = br.open(url)
    except:
        print "Connection failed with "+url
    html = resp.read()
    soup = BeautifulSoup(html, 'html.parser')

    parsed_uri = urlparse(url)

    if parsed_uri[1] == 'www.dlib.org' or parsed_uri[1] == 'dlib.org':
        tag = soup.findAll('h3')
        for t in tag:
            if 'References' in t.string or 'Bibliography' in t.string:
                while t.find_next_sibling('p'):
                    t = t.find_next_sibling('p')
                    data = {}
                    data['cit'] = t.get_text()
                    lista.append(data)

    elif parsed_uri[1] == 'antropologiaeteatro.unibo.it' or parsed_uri[1] == 'almatourism.unibo.it' or parsed_uri[1] == 'rivista-statistica.unibo.it' or parsed_uri[1].find('unibo.it') != -1:
        if len(parsed_uri[2]) > 2 and parsed_uri[2].find("article") != -1:
            html = soup.find('div', {'id': 'articleCitations'})
            if html is None:
                print "citazioni non presenti"
                # data = {}
                # data['cit'] = ""
                # lista.append(data)
            else:
                for p in html.findAll('p'):
                    data = {}
                    data['cit'] = p.text
                    lista.append(data)
        # else:
        #     data = {}
        #     data['cit'] = ""
        #     lista.append(data)
    # else:
    #     data = {}
    #     data['cit'] = ""
    #     lista.append(data)

    return json.dumps(lista)


if __name__ == "__main__":
    print "this script (scrapingAutomatico) is being run directly from %s" % __name__
    main()
else:
    print "this script (scrapingAutomatico) is being imported into another module"
