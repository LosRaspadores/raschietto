#!/usr/bin/python
# -*- coding: utf-8 -*-

# python v 2.7
import lxml
import re
from lxml import etree, html
import unicodedata

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
from urllib2 import urlopen
from urlparse import urlparse
from lxml import etree, html




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
            if  parsed_uri[2].find("article") != -1: #len(parsed_uri[2]) > 2 and
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
    return json.dumps(lista)



def scraping_automatico_titolo(url):
    global data
    print("url " + url)
    lista = []
    resp = br.open(url)
    raw_html = resp.read()
    soup = BeautifulSoup(raw_html)
    titolo=""
    tree = etree.HTML(raw_html)


    parsed_uri = urlparse(url)
    domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
    print domain

    if domain == 'http://www.dlib.org/':
    #if domain == 'www.dlib.org' or domain == 'dlib.org':
        result = soup.select("h3.blue-space")
        for res in result:
            data = {}
            data["titolo"] = res.text
            titolo=res.text  #prendo l'utlimo valore della lista
            lista.append(data)


    elif domain == 'http://antropologiaeteatro.unibo.it/' \
            or 'http://almatourism.unibo.it/' \
            or 'http://rivista-statistica.unibo.it/':
        result = soup.find("h3")
        for res in result:
            data = {}
            data["titolo"] = res.string
            titolo =res.string   #prende l'ultimo valore
            lista.append(data)

    else:
        title = soup.find('title')
        data ={}
        data ['url'] = title.string
        lista.append(data)


    s_string = str(soup)   #trasforma il soup in valore stringa
    #start = s_string.rfind(str(titolo))  #in posI trova l'ultimo valore stringa di titolo, per prendere l'ultimo si scrive RFIND
    start=0
    end= start + len(str(titolo))
    print (end)
    print(start)
    print("json.dumps(lista)="+json.dumps(lista))

    if(url.find("unibo") !=-1):
        xpath_titolo = '//*[@id="articleTitle"]/h3/text()'
        titoloP = tree.xpath(xpath_titolo)[0]  #prendo il primo valore degli h3
        print("titolo=="+titoloP)
        xpath_titolo='html/body/div/div[3]/div[2]/div[3]/div[2]/h3'
        path_step_list =xpath_titolo.split("/")
        path=""
        for step in path_step_list:
            if not contains_digits(step):
                step +="[1]"
            path += step +"/"
        path = path[:-1]
        path = path.replace("[", "")
        path = path.replace("]", "")
        path = path.replace("/", "_")
        print path
    elif (url.find("http://www.dlib.org") != -1):      #portale dlib
        xpath_titolo='/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/h3[2]/text()'
        titoloP= tree.xpath(xpath_titolo)[0]
        print("risultato titolo xpath")
        print titoloP
        path_step_list =xpath_titolo.split("/")
        path=""
        for step in path_step_list:
            if not contains_digits(step):
                step +="[1]"
            path += step +"/"
        path = path[:-1]
        path = path.replace("[", "")
        path = path.replace("]", "")
        path = path.replace("/", "_")
        print path

    #print json.dumps(lista)
    return json.dumps(lista)

def scarping_autore(urlDoc):
    lista = []
    resp = br.open(urlDoc)
    raw_html = resp.read()
    soup = BeautifulSoup(raw_html)
    listautori = []
    tree = etree.HTML(raw_html)
    parsed_uri = urlparse(urlDoc)
    domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
    print domain

    if domain == 'http://www.dlib.org/':
        result = soup.select("p.blue b")
        for res in result:
            data = {}
            data["autore"] = res.string
            listautori.append(res.string)
            lista.append(data)

    elif domain == 'http://antropologiaeteatro.unibo.it/' \
            or 'http://almatourism.unibo.it/' \
            or 'http://rivista-statistica.unibo.it/':
        result = soup.find("div", {"id": "authorString"})
        for res in result:
            data = {}
            data["autore"] = res.string
            listautori.append(res.string)
            lista.append(data)

        #print (a_string[start:end])   #stampa la stringa tra start e end

    if (urlDoc.find("unibo") != -1):
        xpath_autori = '//*[@id="authorString"]/em/text()'
        html_autori = tree.xpath(xpath_autori)[0]
        print("autore da xpath="+html_autori)
        autori = html_autori.split(', ')
        for res in autori:
            xpath_autori="html/body/div/div[3]/div[2]/div[3]/div[3]/em"
            start = html_autori.index(res)
            end = start + len(res)
            print("start autore modificato")
            print(start)
            print("end autore modificato")
            print(end)
            path_step_list =xpath_autori.split("/")
            path=""
            for step in path_step_list:
                if not contains_digits(step):
                    step +="[1]"
                path += step +"/"
            path = path[:-1]
            path = path.replace("[", "")
            path = path.replace("]", "")
            path = path.replace("/", "_")
            print path

    elif (urlDoc.find("http://www.dlib.org") != -1): #portale dlib
        xpath_autori = '/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/table/tr/td[2]/p/b/text()'
        autori = tree.xpath(xpath_autori)    #stampa gli autori
        print("autori trovati da xpath")
        print(autori)
        indice = 1
        for aut in autori:
            xpath_autori = "/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/table[" + str(indice) + "]/tr/td[2]/p"
            indice = indice+1
            start = 0
            print("start autori ciclo")
            print(start)
            end = len(aut)
            print("end autori ciclo")
            print(end)
            print("xpath autore")
            print(xpath_autori)
            path_step_list =xpath_autori.split("/")
            path=""
            for step in path_step_list:
                if not contains_digits(step):
                    step +="[1]"
                path += step +"/"
            path = path[:-1]
            path = path.replace("[", "")
            path = path.replace("]", "")
            path = path.replace("/", "_")
            print path


    print json.dumps(lista)
    return json.dumps(lista)


def scraping_doi(urlDoc):

    lista = []
    resp = br.open(urlDoc)
    raw_html = resp.read()
    soup = BeautifulSoup(raw_html)
    tree = etree.HTML(raw_html)

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
              doi=value
              lista.append(data)
            if (pos1>-1):
              value = res.text[pos1+4:]
              print value
              data = {}
              data["Doi"] = value
              doi= value
              lista.append(data)



    elif domain == 'http://antropologiaeteatro.unibo.it/' \
            or 'http://almatourism.unibo.it/' \
            or 'http://rivista-statistica.unibo.it/':
        result = soup.find("a", {"id": "pub-id::doi"})
        for res in result:
            data = {}
            data["Doi"] = res.string
            doi= res.string
            lista.append(data)


    if (urlDoc.find("unibo") != -1):
        xpath_doi='//*[@id="pub-id::doi"]/text()'
        doi=tree.xpath(xpath_doi)[0]
        start_doi=0
        end_doi=len(doi)
        print(start_doi)
        print(end_doi)
        path_step_list =xpath_doi.split("/")
        path=""
        for step in path_step_list:
            if not contains_digits(step):
                step +="[1]"
            path += step +"/"
        path = path[:-1]
        path = path.replace("[", "")
        path = path.replace("]", "")
        path = path.replace("/", "_")
        print (path)


    elif (urlDoc.find("http://www.dlib.org") != -1):
        start_doi=0
        end_doi = 0
        xpath_doi_meta='/html/head/meta[2]/@content'
        doi=tree.xpath(xpath_doi_meta)[0]
        dup = BeautifulSoup(urllib2.urlopen(urlDoc))     #controllo tutti i paragrafi e se trovo il doi dentro prendo lo start e l'end
        for paragrafo in dup.findAll("p"):
            #normalizza i caratteri, ovvero toglie gli accenti e caratteri stranieri sulle vocali/consonanti
            doi_stringa = unicodedata.normalize('NFKD', paragrafo.getText()).encode('ascii', 'ignore')
            if doi_stringa.find(doi) != -1:
                d = doi_stringa
                start_doi = doi_stringa.index(doi)
                end_doi = start_doi + len(doi)
                print("inizio doi modificato")
                print(start_doi)
                print("fine doi modificato")
                print(end_doi)
        xpath_doi= "/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/p[2]/text()"
        path_step_list =xpath_doi.split("/")
        path=""
        for step in path_step_list:
            if not contains_digits(step):
                step +="[1]"
            path += step +"/"
        path = path[:-1]
        path = path.replace("[", "")
        path = path.replace("]", "")
        path = path.replace("/", "_")
        print (path)




    #print json.dumps(lista)
    return json.dumps(lista)

def scraping_anno(urlDoc):
    lista = []
    resp = br.open(urlDoc)
    raw_html = resp.read()
    soup = BeautifulSoup(raw_html)
    tree = etree.HTML(raw_html)

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
               anno= value1
               lista.append(data)
            if (pos1>-1):
                value= res.text[pos1+18:]
                value1 = value[:pos1+4]
                print value1
                data = {}
                data["anno"] = value1
                anno= value1
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
                anno = currele
                lista.append(data)


    if (urlDoc.find("unibo") != -1):
        xpath_anno='/html/head/meta[8]/@content' #come per il doi, anche l'anno non e presente nella pagina
        pubyear_full=tree.xpath(xpath_anno)[0]  #viene estratta l'intera data, a me serve solo l'anno per Start e End
        print("anno trovato dall'xpath")
        print (pubyear_full)
        pubyear=pubyear_full.split("-")[0] #perche viene estratta l'intera data(anno-mese-giorno) ma ci serve solo l'anno
        start_pubyear = pubyear_full.index(pubyear)
        end_pubyear = start_pubyear + len(pubyear)
        print("start anno")
        print (start_pubyear)
        print("end anno")
        print (end_pubyear)
        path_step_list =xpath_anno.split("/")
        path=""
        for step in path_step_list:
            if not contains_digits(step):
                step +="[1]"
            path += step +"/"
        path = path[:-1]
        path = path.replace("[", "")
        path = path.replace("]", "")
        path = path.replace("/", "_")
        print("path codificato")
        print path


    elif (urlDoc.find("http://www.dlib.org") != -1): #portale dlib
        xpath_anno='/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/p[1]/text()[1]'
        pubyear_full=tree.xpath(xpath_anno)[0]
        print("anno trovato dall'xpath")
        print (pubyear_full)
        pubyear=pubyear_full.split(" ")[1]   #prendo l'uno perche l'anno si trova in seconda posizione
        start_pubyear = pubyear_full.index(pubyear)
        print("start anno")
        print(start_pubyear)
        end_pubyear = start_pubyear + len(pubyear)
        print("end anno")
        print(end_pubyear)
        path_step_list =xpath_anno.split("/")
        path=""
        for step in path_step_list:
            if not contains_digits(step):
                step +="[1]"
            path += step +"/"
        path = path[:-1]
        path = path.replace("[", "")
        path = path.replace("]", "")
        path = path.replace("/", "_")
        print("path codificato")
        print path


    #print json.dumps(lista)
    return json.dumps(lista)

def scraping_citazioni(url):
    lista = []
    listacitazioni = []
    try:
        resp = br.open(url)
    except:
        print "Connection failed with "+url
    html = resp.read()
    soup = BeautifulSoup(html, 'html.parser')

    parsed_uri = urlparse(url)

    if parsed_uri[1] == 'www.dlib.org' or parsed_uri[1] == 'dlib.org':
        tag = soup.findAll('h3')
        print(tag)
        print("ciao")
        for t in tag:
            if 'References' in t.string or 'Bibliography' in t.string:
                while t.find_next_sibling('p'):
                    t = t.find_next_sibling('p')
                    data = {}
                    data['cit'] = t.get_text()
                    listacitazioni.append(t.get_text())
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
                    listacitazioni.append(p.text)
                    lista.append(data)

    print('citazione')
    print(lista)
    current=0
    a_string= str(soup)
    #print('intero doc=')
    #print(a_string)

    
    if parsed_uri[1] == 'www.dlib.org' or parsed_uri[1] == 'dlib.org':
        print("lista===")
        print(listacitazioni)
        print("numero===")
        print(len(listacitazioni))
        # while (current < len(listacitazioni)):
        #     print("cit="+str(current))
        #     print(listacitazioni[current])
        #     n = listacitazioni[current].index("]")
        #     if n==-1:
        #        n=0
        #     n=n+2
        #     citazione = listacitazioni[current][n:20]
        #     print(citazione)
        #     start = a_string.find(citazione.encode("utf-8"))
        #     end = start + len(listacitazioni[current])
        #     print(start)
        #     print(end)
        #     current = current+1

    elif parsed_uri[1] == 'antropologiaeteatro.unibo.it' or parsed_uri[1] == 'almatourism.unibo.it' or parsed_uri[1] == 'rivista-statistica.unibo.it' or parsed_uri[1].find('unibo.it') != -1:
        print("lista==")
        print(listacitazioni)
        print("numero==")
        print(len(listacitazioni))
        while(current<len(listacitazioni)):
            print(listacitazioni[current])
            print("sono qui==")
            citazione = listacitazioni[current][0:40]
            print(citazione)
            start = a_string.find(citazione.encode("utf-8"))
            end = start + len(listacitazioni[current])
            print(start)
            print(end)
            current = current+1


    return json.dumps(lista)
def contains_digits(string):
    digits =re.compile('\d')
    return bool(digits.search(string))



if __name__ == "__main__":
    print "this script (scrapingAutomatico) is being run directly from %s" % __name__
    main()
else:
    print "this script (scrapingAutomatico) is being imported into another module"