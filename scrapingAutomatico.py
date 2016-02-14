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
import urllib2
import re
from urlparse import urlparse
from lxml import etree
import unicodedata


def main():
    print("scrapingAutomatico")
    # scraping_automatico_titolo("http://www.dlib.org/dlib/july15/linek/07linek.html")
    # scraping_titolo()
    # scraping_citazioni("http://www.dlib.org/dlib/july15/linek/07linek.html")
    # scraping_citazioni("http://www.dlib.org/dlib/july15/lorang/07lorang.html")
    # scraping_citazioni("http://almatourism.unibo.it/article/view/5292")
    # scarping_autore("http://www.dlib.org/dlib/july15/linek/07linek.html")
    # #scraping_doi("http://www.dlib.org/dlib/july15/linek/07linek.html")
    # #scraping_anno("http://www.dlib.org/dlib/july15/linek/07linek.html")


def scraping_titolo(urlDoc):
    # Browser mechanize
    br = mechanize.Browser()
    br.set_handle_robots(False)
    br.set_handle_refresh(False)
    br.addheaders = [('user-agent',
                      '   Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.3) Gecko/20100423 Ubuntu/10.04 (lucid) Firefox/3.6.3')]
    lista = []

    for doc in urlDoc:
        parsed_uri = urlparse(doc)
        try:
            resp = br.open(doc)
        except:
            print "Connection failed with " + doc
            continue
        raw_html = resp.read()
        soup = BeautifulSoup(raw_html)

        if parsed_uri[1] == 'www.dlib.org' or parsed_uri[1] == 'dlib.org':
            result = soup.select("h3.blue-space")  # prendo gli h3 classe blue.space
            for res in result:
                if (res.text != 'D-Lib Magazine'):  # se è dlib
                    data = {}
                    data['url'] = doc
                    data['titolo'] = res.text
                    lista.append(data)
        elif parsed_uri[1] == 'antropologiaeteatro.unibo.it' or parsed_uri[1] == 'almatourism.unibo.it' or parsed_uri[
            1] == 'rivista-statistica.unibo.it' or parsed_uri[1].find('unibo.it') != -1:
            if parsed_uri[2].find("article") != -1:  # len(parsed_uri[2]) > 2 and
                result = soup.find('div', {"id": "articleTitle"})  # prendo i div con ID=articleTitle
                res = result.find('h3')
                data = {}
                data['url'] = doc
                data['titolo'] = res.string
                lista.append(data)
            else:
                data = {}
                data['url'] = doc
                data['titolo'] = soup.find('title').string
                lista.append(data)
        else:
            title = soup.find('title')
            data = {}
            data['url'] = doc
            if title is None:
                data['titolo'] = doc
            else:
                data['titolo'] = title.string
            lista.append(data)
    # print json.dumps(lista)
    return json.dumps(lista)


def scraping_automatico_titolo(url):
    br = mechanize.Browser()
    br.set_handle_robots(False)
    br.set_handle_refresh(False)
    br.addheaders = [('user-agent',
                      '   Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.3) Gecko/20100423 Ubuntu/10.04 (lucid) Firefox/3.6.3')]
    lista = {}
    resp = br.open(url)
    raw_html = resp.read()
    # soup = BeautifulSoup(raw_html)
    tree = etree.HTML(raw_html)

    parsed_uri = urlparse(url)
    domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
    # print domain

    if parsed_uri[1] == 'antropologiaeteatro.unibo.it' or parsed_uri[1] == 'almatourism.unibo.it' or parsed_uri[
        1] == 'rivista-statistica.unibo.it' or parsed_uri[1].find('unibo.it') != -1:
        xpath_titolo = '//*[@id="articleTitle"]/h3/text()'
        titoloP = tree.xpath(xpath_titolo)[0]  # prendo il primo valore degli h3
        titoloP = titoloP.encode("utf-8")
        start = 0
        lista["start"] = start
        end = start + len(str(titoloP))
        lista["start"] = str(start)
        lista["end"] = str(end)
        xpath_titolo = '/html/body/div[1]/div[3]/div[2]/div[3]/div[2]/h3/text()'
        path = trascodifica_path(xpath_titolo)
        lista["path"] = str(path)
        lista["titolo"] = str(titoloP)

    elif parsed_uri[1] == 'www.dlib.org' or parsed_uri[1] == 'dlib.org':
        xpath_titolo = '/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/h3[2]/text()'
        titoloP = tree.xpath(xpath_titolo)[0]
        titoloP = titoloP.encode("utf-8")
        start = 0
        end = start + len(titoloP)
        lista["start"] = str(start)
        lista["end"] = str(end)
        path = trascodifica_path(xpath_titolo)
        lista["path"] = str(path)
        lista["titolo"] = str(titoloP)

    return lista


def scarping_autore(urlDoc):
    # Browser mechanize
    br = mechanize.Browser()
    br.set_handle_robots(False)
    br.set_handle_refresh(False)
    br.addheaders = [('user-agent',
                      '   Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.3) Gecko/20100423 Ubuntu/10.04 (lucid) Firefox/3.6.3')]

    listaAutori = []
    resp = br.open(urlDoc)
    raw_html = resp.read()
    # soup = BeautifulSoup(raw_html)
    tree = etree.HTML(raw_html)
    parsed_uri = urlparse(urlDoc)
    domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
    print domain

    if parsed_uri[1] == 'antropologiaeteatro.unibo.it' or parsed_uri[1] == 'almatourism.unibo.it' or parsed_uri[
        1] == 'rivista-statistica.unibo.it' or parsed_uri[1].find('unibo.it') != -1:
        xpath_autori = '//*[@id="authorString"]/em/text()'
        html_autori = tree.xpath(xpath_autori)[0]  # prendo il primo perchè è il valore che m'interessa
        autori = html_autori.split(', ')
        for res in autori:
            xpath_autori = "/html/body/div/div[3]/div[2]/div[3]/div[3]/em/text()"
            # ret = tree.xpath(xpath_autori)
            autore = {}
            start = html_autori.index(res)  # vado a ricavarmi lo start relativo al valore ritornatomi dal xpath
            end = start + len(res)
            autore["start"] = str(start)
            autore["end"] = str(end)
            path = trascodifica_path(xpath_autori)
            autore["path"] = path
            autore["autori"] = res.encode("utf-8")
            listaAutori.append(autore)



    elif parsed_uri[1] == 'www.dlib.org' or parsed_uri[1] == 'dlib.org':
        xpath_autori = '/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/table/tr/td[2]/p/b/text()'
        autori = tree.xpath(xpath_autori)

        xpath_tag = "/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/p[2]/text()"  # xpath relativo al tag dove sono presenti gli autori
        autori_list = tree.xpath(xpath_tag)

        autori_html = ''.join(autori_list)

        for aut in autori:
            autore = {}
            start = autori_html.find(aut)
            end = start + len(aut)
            autore["start"] = str(start)
            autore["end"] = str(end)
            path = trascodifica_path(xpath_tag)
            autore["path"] = str(path)
            aut = aut.encode("utf-8")
            autore["autori"] = str(aut)
            listaAutori.append(autore)

    br.close()
    return listaAutori


def scraping_doi(urlDoc):
    br = mechanize.Browser()
    br.set_handle_robots(False)  #
    br.set_handle_refresh(False)
    br.addheaders = [('user-agent',
                      '   Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.3) Gecko/20100423 Ubuntu/10.04 (lucid) Firefox/3.6.3')]
    lista = {}
    resp = br.open(urlDoc)
    raw_html = resp.read()
    tree = etree.HTML(raw_html)

    parsed_uri = urlparse(urlDoc)
    domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
    # print domain

    if parsed_uri[1] == 'antropologiaeteatro.unibo.it' or parsed_uri[1] == 'almatourism.unibo.it' or parsed_uri[
        1] == 'rivista-statistica.unibo.it' or parsed_uri[1].find('unibo.it') != -1:
        xpath_doi = '//*[@id="pub-id::doi"]/text()'
        doi = tree.xpath(xpath_doi)[0]
        start = 0
        end = start + len(doi)
        lista["start"] = str(start)
        lista["end"] = str(end)
        path = "/html/body/div[1]/div[3]/div[2]/div[3]/a/text()"
        path = trascodifica_path(path)
        lista["xpath"] = str(path)
        lista["doi"] = str(doi)


    elif parsed_uri[1] == 'www.dlib.org' or parsed_uri[1] == 'dlib.org':
        xpath_doi_meta = '/html/head/meta[2]/@content'
        doi = tree.xpath(xpath_doi_meta)[0]
        dup = BeautifulSoup(
            urllib2.urlopen(urlDoc))  # controllo tutti i paragrafi e se trovo il doi dentro prendo lo start e l'end
        for paragrafo in dup.findAll("p"):
            doi_stringa = unicodedata.normalize('NFKD', paragrafo.getText()).encode('ascii',
                                                                                    'ignore')  # modifico la stringa doi, tolgo gli accenti e caratteri stranieri sulle vocali/consonanti
            if doi_stringa.find(
                    doi) != -1:  # se trovo il paragrafo preciso con all'interno il doi allora  mi prendo lo start
                start_doi = doi_stringa.index(doi)
                end_doi = start_doi + len(doi)
                lista["start"] = str(start_doi)
                lista["end"] = str(end_doi)
        xpath_doi = "/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/p[2]/text()"  # non mi ritorna il doi da questo xpath
        path = trascodifica_path(xpath_doi)
        lista["xpath"] = str(path)
        lista["doi"] = str(doi)

    br.close()
    return lista


def scraping_anno(urlDoc):
    br = mechanize.Browser()
    br.set_handle_robots(False)
    br.set_handle_refresh(False)
    br.addheaders = [('user-agent',
                      '   Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.3) Gecko/20100423 Ubuntu/10.04 (lucid) Firefox/3.6.3')]
    lista = {}
    resp = br.open(urlDoc)
    raw_html = resp.read()
    # soup = BeautifulSoup(raw_html)
    tree = etree.HTML(raw_html)

    parsed_uri = urlparse(urlDoc)
    domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
    print domain

    if parsed_uri[1] == 'antropologiaeteatro.unibo.it' or parsed_uri[1] == 'almatourism.unibo.it' or parsed_uri[
        1] == 'rivista-statistica.unibo.it' or parsed_uri[1].find('unibo.it') != -1:
        xpath_pubyear = '/html/head/meta[8]/@content'  # prendo l'anno del documento dai meta dati
        date_xpath = tree.xpath(xpath_pubyear)[0]
        anno = date_xpath.split("-")[0]  # siccome viene estratta l'intera data(anno-mese-giorno) prende solo l'anno
        start_anno = date_xpath.index(anno)
        end_anno = start_anno + len(anno)
        xpath_pubyear = '/html/body/head/meta[8]/@content'
        path = trascodifica_path(xpath_pubyear)
        lista["xpath"] = str(path)
        lista["start"] = str(start_anno)
        lista["end"] = str(end_anno)
        lista["anno"] = str(anno)



    elif parsed_uri[1] == 'www.dlib.org' or parsed_uri[1] == 'dlib.org':
        xpath_anno = '/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/p[1]/text()[1]'
        pubyear_full = tree.xpath(xpath_anno)[0]
        pubyear = pubyear_full.split(" ")[1]  # prendo l'uno perche l'anno si trova in seconda posizione
        start_anno = pubyear_full.index(pubyear)
        end_anno = start_anno + len(pubyear)
        lista["start"] = str(start_anno)
        lista["end"] = str(end_anno)
        path = trascodifica_path(xpath_anno)
        lista["xpath"] = str(path)
        lista["anno"] = str(pubyear)

    br.close()
    return lista


def scraping_citazioni(url):
    # Browser mechanize
    br = mechanize.Browser()
    br.set_handle_robots(False)
    br.set_handle_refresh(False)
    br.addheaders = [('user-agent',
                      '   Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.3) Gecko/20100423 Ubuntu/10.04 (lucid) Firefox/3.6.3')]

    try:
        resp = br.open(url)
    except:
        print "Connection failed with " + url
    html = resp.read()
    # soup = BeautifulSoup(html, 'html.parser')

    parsed_uri = urlparse(url)
    tree = etree.HTML(html)
    listaCitazioni = []

    if parsed_uri[1] == 'antropologiaeteatro.unibo.it' or parsed_uri[1] == 'almatourism.unibo.it' or parsed_uri[
        1] == 'rivista-statistica.unibo.it' or parsed_uri[1].find('unibo.it') != -1:
        reference_list = tree.xpath('//*[@id="articleCitations"]/div//p/text()')
        i = 1
        for refer in reference_list:
            xpath_ref = '/html/body/div/div[3]/div[2]/div[3]/div[7]/div/p[' + str(i) + ']'
            refer = refer.encode("utf-8")
            citazione = {}
            path = trascodifica_path(xpath_ref)
            citazione["path"] = str(path)
            citazione["start"] = str(0)
            citazione["end"] = len(str(refer))
            citazione["citazione"] = str(refer)
            listaCitazioni.append(citazione)
            i += 1

    elif parsed_uri[1] == 'www.dlib.org' or parsed_uri[1] == 'dlib.org':
        listaCitazioni = []
        reference_list = []
        listaCitazioniNotes = []
        # uso BeautifulSoup per poter prendere una dopo l'altra le references
        soup = BeautifulSoup(urllib2.urlopen(url))
        for paraText in soup.findAll("h3"):  # prendo tutti gli h3 della pagina
            p = paraText.contents[0]

            if p.find("Reference") != -1 or p.find("Bibliography") != -1:
                print("Reference")
                check = True
                while check:
                    stringa = paraText.findNext('p')
                    if stringa.getText().startswith('[') or stringa.getText()[0].isdigit():
                        print("trovato")
                        reference_list.append(stringa.getText().encode("utf-8"))
                        paraText = stringa  # cosi alla prossima iterazione posso passare alla reference successiva
                        check = True
                    else:  # se non ci sono altre reference esco dal ciclo
                        check = False
            elif p.find("Notes") != -1:  # <--------------------------------
                check = True
                while check:
                    for sibling in paraText.next_siblings:
                        if sibling.name == "p":
                            if sibling.getText()[0].isdigit():
                                check = True
                                # trovata citazione -> fai cose
                                listaCitazioniNotes.append(sibling)
                        elif sibling.name == "div":
                            check = False

                print(listaCitazioniNotes)


        count = True
        i = 0
        xpath_ref = []
        # ricevo un array di xpath  per le reference nei casi di url specificati, navigo tutti i paragrafi alla ricerca di "["
        # di ogni reference controllo sempre la successiva per sapere quando devo uscire dal ciclo e fermare.
        if (url.find('09summerlin') != -1) or (url.find('09vanbergen') != -1) or (url.find('09westervelt') != -1):
            while (count):
                xp_span = '/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/p[' + str(i) + ']/span/a/@name'
                xp1_span = tree.xpath(xp_span)
                if xp1_span:
                    xp2_span = xp1_span[0].encode("utf-8")
                    if xp2_span:
                        xpath_ref.append('/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/p[' + str(i) + ']/text()')
                        xp_sec_span = '/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/p[' + str(i + 1) + ']/span/a/@name'
                        xp1_sec_span = tree.xpath(xp_sec_span)
                        if xp1_sec_span:
                            xp2_sec_span = xp1_sec_span[0].encode("utf-8")
                            if xp2_sec_span == "":
                                count = False
                        else:
                            count = False
                i += 1
        elif url.find('09zuniga') != -1:
            xpath_ref.append("/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/p[14]/text()")
        elif url.find("11smith-unna") != -1:  # la pagina non ha reference, l'array e vuoto
            xpath_ref = []
        else:
            while (count):
                xp = '/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/p[' + str(i) + ']/a/text()'
                xp1 = tree.xpath(xp)
                if xp1:
                    xp2 = xp1[0].encode("utf-8")
                    if xp2.startswith("[") == True:
                        xpath_ref.append(
                            '/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/p[' + str(i) + ']/text()')
                        xp_sec = '/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/p[' + str(
                            i + 1) + ']/a/text()'
                        xp1_sec = tree.xpath(xp_sec)
                        if xp1_sec:
                            xp2_sec = xp1_sec[0].encode("utf-8")
                            if xp2_sec.startswith("[") == False:
                                count = False
                        else:
                            count = False
                i += 1
        i = 0

        for refer in reference_list:
            citazione = {}
            citazione["citazione"] = str(refer)
            citazione["start"] = str(0)
            citazione["end"] = len(str(refer))
            path = trascodifica_path(xpath_ref[i])
            citazione["path"] = str(path)
            listaCitazioni.append(citazione)
            i += 1

    br.close()
    return listaCitazioni


def trascodifica_path(xpath):
    xpath = xpath[11:]
    path_step_list = xpath.split("/")
    path = ""
    for step in path_step_list:
        if not contains_digits(step):
            step += "[1]"
        path += step + "/"
    path = path[:-1]
    path = path.replace("[", "")
    path = path.replace("]", "")
    path = path.replace("/", "_")
    path = path.replace("_text()1", "")

    arr = path.split("_")
    for i in range(len(arr)):
        if "h" in arr[i]:
            if len(arr[i]) == 2:
                arr[i] = arr[i] + "1"
    path = "_".join(arr)

    return path


def contains_digits(string):
    digits = re.compile('\d')
    return bool(digits.search(string))


if __name__ == "__main__":
    print "this script (scrapingAutomatico) is being run directly from %s" % __name__
    main()
else:
    print "this script (scrapingAutomatico) is being imported into another module"
