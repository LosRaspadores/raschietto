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







def main():
     #scraping_automatico_titolo("http://www.dlib.org/dlib/july15/linek/07linek.html")
     #scraping_titolo()
     #scraping_citazioni("http://www.dlib.org/dlib/july15/linek/07linek.html")
     #scraping_citazioni()
     #scarping_autore("http://www.dlib.org/dlib/july15/linek/07linek.html")
     #scraping_doi("http://www.dlib.org/dlib/july15/linek/07linek.html")
     scraping_anno("http://www.dlib.org/dlib/july15/linek/07linek.html")

def scraping_titolo(urlDoc):
    # Browser mechanize
    br = mechanize.Browser()
    br.set_handle_robots(False) #
    br.set_handle_refresh(False)
    br.addheaders = [('user-agent', '   Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.3) Gecko/20100423 Ubuntu/10.04 (lucid) Firefox/3.6.3')]
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
            result = soup.select("h3.blue-space")    #prendo gli h3 classe blue.space
            for res in result:
                if (res.text != 'D-Lib Magazine'):    #se è dlib
                    data = {}
                    data['url'] = doc;
                    data['titolo'] = res.text
                    lista.append(data)
        elif parsed_uri[1] == 'antropologiaeteatro.unibo.it' or parsed_uri[1] == 'almatourism.unibo.it' or parsed_uri[1] == 'rivista-statistica.unibo.it' or parsed_uri[1].find('unibo.it') != -1:
            if  parsed_uri[2].find("article") != -1: #len(parsed_uri[2]) > 2 and
                result = soup.find('div', {"id": "articleTitle"})       #prendo i div con ID=articleTitle
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
    #global data
    # Browser mechanize
    br = mechanize.Browser()
    br.set_handle_robots(False) #
    br.set_handle_refresh(False)
    br.addheaders = [('user-agent', '   Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.3) Gecko/20100423 Ubuntu/10.04 (lucid) Firefox/3.6.3')]
    print("url " + url)
    lista = {}
    resp = br.open(url)
    raw_html = resp.read()
    soup = BeautifulSoup(raw_html)
    titolo=""
    tree = etree.HTML(raw_html)


    parsed_uri = urlparse(url)
    domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
    print domain


    s_string = str(soup)   #trasforma il soup in valore stringa
    #start = s_string.rfind(str(titolo))  #in posI trova l'ultimo valore stringa di titolo, per prendere l'ultimo si scrive RFIND


    if(url.find("unibo") !=-1):
        xpath_titolo = '//*[@id="articleTitle"]/h3/text()'
        titoloP = tree.xpath(xpath_titolo)[0]  #prendo il primo valore degli h3
        start = 0
        lista["start"]=start
        end = start+len(str(titoloP))
        lista["end"]=end
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
        path = path.replace("_text()1","")
        print path
        lista["path"]=path
        lista["titolo"]=titoloP
        print lista["path"]

    elif (url.find("http://www.dlib.org") != -1):      #portale dlib
        xpath_titolo='/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/h3[2]/text()'
        titoloP= tree.xpath(xpath_titolo)[0]
        lista["start"]=0
        lista["end"]=len(str(titoloP))
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
        path = path.replace("_text()1","")
        print path
        lista["path"]=path
        lista["titolo"]=titoloP

    return lista


def scarping_autore(urlDoc):
    # Browser mechanize
    br = mechanize.Browser()
    br.set_handle_robots(False) #
    br.set_handle_refresh(False)
    br.addheaders = [('user-agent', '   Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.3) Gecko/20100423 Ubuntu/10.04 (lucid) Firefox/3.6.3')]
    lista = {}
    resp = br.open(urlDoc)
    raw_html = resp.read()
    soup = BeautifulSoup(raw_html)
    listautori = []
    tree = etree.HTML(raw_html)
    parsed_uri = urlparse(urlDoc)
    domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
    print domain

    # if parsed_uri[1] == 'www.dlib.org' or parsed_uri[1] == 'dlib.org':
    #     result = soup.select("p.blue b")
    #     for res in result:
    #         data = {}
    #         data["autore"] = res.string
    #         listautori.append(res.string)
    #         lista.append(data)
    #
    # elif parsed_uri[1] == 'antropologiaeteatro.unibo.it' or parsed_uri[1] == 'almatourism.unibo.it' or parsed_uri[1] == 'rivista-statistica.unibo.it' or parsed_uri[1].find('unibo.it') != -1:
    #     result = soup.find("div", {"id": "authorString"})
    #     for res in result:
    #         data = {}
    #         data["autore"] = res.string
    #         listautori.append(res.string)
    #         lista.append(data)

        #print (a_string[start:end])   #stampa la stringa tra start e end per controllare se  quello che considero è corretto

    if (urlDoc.find("unibo") != -1):
        xpath_autori = '//*[@id="authorString"]/em/text()'
        html_autori = tree.xpath(xpath_autori)[0]    #prendo il primo perchè è il valore che m'interessa
        print("autore da xpath="+html_autori)
        autori = html_autori.split(', ')
        for res in autori:
            xpath_autori="html/body/div/div[3]/div[2]/div[3]/div[3]/em"
            start = html_autori.index(res)        #vado a ricavarmi lo start relativo al valore ritornatomi dal xpath
            end = start + len(res)
            lista["start"]=start
            lista["end"]=end
            path_step_list =xpath_autori.split("/")      #effettuo la codifica dell'xpath
            path=""
            for step in path_step_list:
                if not contains_digits(step):
                    step +="[1]"
                path += step +"/"
            path = path[:-1]
            path = path.replace("[", "")
            path = path.replace("]", "")
            path = path.replace("/", "_")
            path = path.replace("_text()1","")
            print path
            lista["path"]=path
            lista["autori"]=html_autori


    elif (urlDoc.find("http://www.dlib.org") != -1): #portale dlib
        xpath_autori = '/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/table/tr/td[2]/p/b/text()'
        autori = tree.xpath(xpath_autori)    #stampa gli autori
        print("autori trovati da xpath")
        print(autori)
        indice = 1
        for aut in autori:              #inserisco la ricerca dello start all'interno di un ciclo perchè gli autori possono essere più di uno
            xpath_autori = "/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/table[" + str(indice) + "]/tr/td[2]/p"
            indice = indice+1       #per ogni autore trovato l'xpath cambia, si inserisce l'indice all'interno del valore dell'utlima tabella
            start = 0
            end = len(aut)
            lista["start"]=start
            lista["end"]=end
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
            path = path.replace("_text()1","")
            print path
            lista["path"]=path
            lista["autori"]=autori

    br.close()
    return lista


def scraping_doi(urlDoc):
    # Browser mechanize
    br = mechanize.Browser()
    br.set_handle_robots(False) #
    br.set_handle_refresh(False)
    br.addheaders = [('user-agent', '   Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.3) Gecko/20100423 Ubuntu/10.04 (lucid) Firefox/3.6.3')]
    lista = {}
    resp = br.open(urlDoc)
    raw_html = resp.read()
    tree = etree.HTML(raw_html)

    parsed_uri = urlparse(urlDoc)
    domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
    print domain


    if (urlDoc.find("unibo") != -1):
        xpath_doi='//*[@id="pub-id::doi"]/text()'
        doi=tree.xpath(xpath_doi)[0]
        lista["start"]=str(0)
        lista["end"]=str(len(doi))
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
        path = path.replace("_text()1","")
        print (path)
        lista["xpath"]=path
        lista["doi"]=doi


    elif (urlDoc.find("http://www.dlib.org") != -1):

        start_doi=0
        end_doi = 0
        xpath_doi_meta='/html/head/meta[2]/@content'
        doi=tree.xpath(xpath_doi_meta)[0]
        dup = BeautifulSoup(urllib2.urlopen(urlDoc))     #controllo tutti i paragrafi e se trovo il doi dentro prendo lo start e l'end
        for paragrafo in dup.findAll("p"):
            #modifico la scringa doi, tolgo gli accenti e caratteri stranieri sulle vocali/consonanti
            doi_stringa = unicodedata.normalize('NFKD', paragrafo.getText()).encode('ascii', 'ignore')
            if doi_stringa.find(doi) != -1:     #se trovo il paragrafo preciso con all'interno il doi allora  mi prendo lo start
                d = doi_stringa
                start_doi = doi_stringa.index(doi)
                end_doi = start_doi + len(doi)
                lista["start"]=str(start_doi)
                lista["end"]=str(end_doi)
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
        path = path.replace("_text()1","")
        print (path)
        lista["xpath"]=path
        lista["doi"]=doi


    br.close()
    #print json.dumps(lista)
    print json.dumps(lista)
    return json.dumps(lista)

def scraping_anno(urlDoc):
    # Browser mechanize
    br = mechanize.Browser()
    br.set_handle_robots(False) #
    br.set_handle_refresh(False)
    br.addheaders = [('user-agent', '   Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.3) Gecko/20100423 Ubuntu/10.04 (lucid) Firefox/3.6.3')]
    lista = {}
    resp = br.open(urlDoc)
    raw_html = resp.read()
    soup = BeautifulSoup(raw_html)
    tree = etree.HTML(raw_html)

    parsed_uri = urlparse(urlDoc)
    domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
    print domain


    # if parsed_uri[1] == 'www.dlib.org' or parsed_uri[1] == 'dlib.org':
    #     result = soup.select("p.blue")
    #     for res in result:
    #         pos = res.text.find('November')
    #         pos1 = res.text.find('September')
    #         if (pos >-1):
    #            value = res.text[pos+18:]
    #            value1 = value[:pos+4]
    #            data = {}
    #            data["anno"] = value1
    #            anno= value1
    #            lista.append(data)
    #         if (pos1>-1):
    #             value= res.text[pos1+18:]
    #             value1 = value[:pos1+4]
    #             print value1
    #             data = {}
    #             data["anno"] = value1
    #             anno= value1
    #             lista.append(data)
    #
    # elif parsed_uri[1] == 'antropologiaeteatro.unibo.it' or parsed_uri[1] == 'almatourism.unibo.it' or parsed_uri[1] == 'rivista-statistica.unibo.it' or parsed_uri[1].find('unibo.it') != -1:
    #     result = soup.find_all("p")
    #     for res in result:
    #         if (res.text.find('Registration')>-1 or res.text.find('Registrazione')>-1):     #prendo gli elemendi dove trovo le perole"registration" o "registrazione"
    #             elements=res.text.split(' ')
    #             currele = ''
    #             for ele in elements:
    #                if (len(ele) ==  4):
    #                    currele = ele
    #                    print "ele=" + ele
    #             data = {}
    #             data["anno"] = currele
    #             anno = currele
    #             lista.append(data)


    if (urlDoc.find("unibo") != -1):
        xpath_anno='/html/head/meta[8]/@content' #come per il doi, anche l'anno non e presente nella pagina
        pubyear_full=tree.xpath(xpath_anno)[0]  #viene estratta l'intera data, a me serve solo l'anno per Start e End
        print("anno trovato dall'xpath")
        print (pubyear_full)
        pubyear=pubyear_full.split("-")[0] #perche viene estratta l'intera data(anno-mese-giorno) ma ci serve solo l'anno
        start_anno = pubyear_full.index(pubyear)
        end_anno = start_anno + len(pubyear)
        lista["start"]=str(start_anno)
        lista["end"]=str(end_anno)
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
        path = path.replace("_text()1","")
        print("path codificato")
        print path
        lista["xpath"]=path
        lista["anno"]=pubyear_full



    elif (urlDoc.find("http://www.dlib.org") != -1): #portale dlib
        xpath_anno='/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/p[1]/text()[1]'
        pubyear_full=tree.xpath(xpath_anno)[0]
        pubyear=pubyear_full.split(" ")[1]   #prendo l'uno perche l'anno si trova in seconda posizione
        start_anno = pubyear_full.index(pubyear)
        end_anno = start_anno + len(pubyear)
        lista["start"]=str(start_anno)
        lista["end"]=str(end_anno)
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
        path = path.replace("_text()1","")
        print("path codificato")
        print path
        lista["xpath"]=path
        lista["anno"]=pubyear_full

    br.close()
    #print json.dumps(lista)
    return lista

def scraping_citazioni(url):
    lista = []
    listacitazioni = []
    # Browser mechanize
    br = mechanize.Browser()
    br.set_handle_robots(False) #
    br.set_handle_refresh(False)
    br.addheaders = [('user-agent', '   Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.3) Gecko/20100423 Ubuntu/10.04 (lucid) Firefox/3.6.3')]
    listona = []
    try:
        resp = br.open(url)
    except:
        print "Connection failed with "+url
    html = resp.read()
    soup = BeautifulSoup(html, 'html.parser')

    parsed_uri = urlparse(url)
    tree = etree.HTML(html)



    if parsed_uri[1] == 'www.dlib.org' or parsed_uri[1] == 'dlib.org':
        reference_list=[]
        check = True
        #uso BeautifulSoup per poter prendere una dopo l'altra le references
        soup = BeautifulSoup(urllib2.urlopen(url))
        for paraText in soup.findAll("h3"):
            p = paraText.contents[0].strip()
            if url.find("09behnk") != -1:
                if p.find("Bibliography") != -1: #p != "Notes"
                    while check:
                        stringa = paraText.findNext('p')
                        if stringa.getText().startswith('[') or stringa.getText()[0].isdigit():
                            #encode perche alcune hanno caratteri speciali che poi non vengono riconosciuti (lettere accentate)
                            reference_list.append(stringa.getText().encode("utf-8"))
                            #cosi alla prossima iterazione posso passare alla reference successiva
                            paraText = stringa
                            check = True
                        else: #nel caso non ci siano altre reference esco dal ciclo
                            check = False
            elif url.find("11smith-unna") != -1:
                reference_list = []
            elif url.find("09zuniga") != -1:
                if p.find("Reference") != -1:
                    stringa = paraText.findNext('p')
                    reference_list.append(stringa.getText().encode("utf-8"))
            else:
                if p.find("Reference") != -1 or p.find("Notes") != -1 or p.find("Bibliography") != -1:
                    if url.find("11brook") != -1 or url.find("11beel") != -1:
                        if p.find("Reference") != -1:
                            check = True
                        else:
                            check = False
                    while check:
                        stringa = paraText.findNext('p')
                        if stringa.getText().startswith('[') or stringa.getText()[0].isdigit():
                            #encode perche alcune hanno caratteri speciali che poi non vengono riconosciuti (lettere accentate)
                            reference_list.append(stringa.getText().encode("utf-8"))
                            #cosi alla prossima iterazione posso passare alla reference successiva
                            paraText = stringa
                            check = True
                        else: #nel caso non ci siano altre reference esco dal ciclo
                            check = False
        count = True
        i = 0
        xpath_ref=[]
        #ricavo un array di xpath per le reference nei casi di url specificati
        #navigo tutti i paragrafi della pagina finche non trovo una "[" (caso else, diverso per il primo if) che indica
        #l'inizio di una ref, e di ogni reference controllo sempre anche la successiva per sapere quando mi devo fermare
        if (url.find('09summerlin') != -1) or (url.find('09vanbergen') != -1) or (url.find('09westervelt') != -1):
            while(count):
                xp_span='/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/p[' + str(i) + ']/span/a/@name'
                xp1_span = tree.xpath(xp_span)
                if xp1_span:
                    xp2_span = xp1_span[0].encode("utf-8")
                    if xp2_span:
                        xpath_ref.append('/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/p[' + str(i) + ']/text()')
                        xp_sec_span='/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/p[' + str(i+1) + ']/span/a/@name'
                        xp1_sec_span = tree.xpath(xp_sec_span)
                        if xp1_sec_span:
                            xp2_sec_span = xp1_sec_span[0].encode("utf-8")
                            if xp2_sec_span == "":
                                count=False
                        else:
                            count=False
                i = i + 1
        elif url.find('09zuniga') != -1:
            xpath_ref.append("/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/p[14]/text()")
        elif url.find("11smith-unna") != -1: #la pagina non ha reference, l'array e vuoto
            xpath_ref=[]
        else:
            while(count):
                xp='/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/p[' + str(i) + ']/a/text()'
                xp1 = tree.xpath(xp)
                if xp1:
                    xp2 = xp1[0].encode("utf-8")
                    if xp2.startswith("[") == True:
                        xpath_ref.append('/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/p[' + str(i) + ']/text()')
                        xp_sec='/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/p[' + str(i+1) + ']/a/text()'
                        xp1_sec = tree.xpath(xp_sec)
                        if xp1_sec:
                            xp2_sec = xp1_sec[0].encode("utf-8")
                            if xp2_sec.startswith("[") == False:
                                count=False
                        else:
                            count=False
                i = i+1
        i=0
        print("dimensione reference")
        print (len(reference_list))
        for refer in reference_list:
            print("refer")
            print(refer)
            #uso ref per gli indici che mi servono per l'inizio e la fine della stringa che sto analizzano, che sia anno,
            #titolo o autori. Sotto tolgo tutti i caratteri "a capo" e i "doppi spazi" che vengono convertiti in uno spazio
            #fa il join attraverso il carattere " "(spazio) tra le righe che sono divise dal "\n"
            ref = " ".join(refer.split("\n"))
            ref = " ".join(ref.split("  ",1))
            #faccio la stessa cosa per refer, che pero usero per ricavare i veri dati
            refer = " ".join(refer.split("\n"))
            refer = refer.replace("  ", " ", 1)
            #tolgo l'indice della reference
            if url.find("09zuniga") != -1:
                riga = refer
            else:
                riga = refer.split(" ",1)[1]
            #nel caso di articolo 09behnk.html
            if url.find("09behnk") != -1:
                #anno della ref, uso di una regular expression che prende tutte le serie di 4 caratteri numerici
                lista_anno = re.findall("\d\d\d\d",refer)
                for a in lista_anno:
                    #solo se il numero nella lista e compreso tra 1950 e 2015
                    if int(a) >= 1950 and int(a) <= 2015:
                        anno = a
                        autori_temp = riga.split(': ',1)[0]
                        titolo_ref = riga.split(': ',1)[1]
                        if autori_temp.find(". In") != -1:
                            autori_temp = autori_temp.replace(". In", "")
                        elif autori_temp.find(" In") != -1:
                            autori_temp = autori_temp.replace(" In", "")
                        autori_ref = autori_temp.split('; ')

                        start_tit = ref.index(titolo_ref)
                        end_tit = start_tit + len(titolo_ref)
                        start_year = ref.index(anno)
                        end_year = start_year + len(anno)
                        aut_ref = []
                        for aut in autori_ref:
                            start = ref.index(aut)
                            end = start + len(aut)
                            #trasformo l'autore in minuscolo e senza lettere accentate
                            aut_norm = unicode(aut.lower(), 'utf-8')
                            aut_norm = unicodedata.normalize('NFKD', aut_norm)
                            aut_norm = aut_norm.encode('ascii', 'ignore')
                            aut_norm = aut_norm.decode("utf-8")
                            aut_norm = re.sub("[^\w\s]", " ", aut_norm) #sostituisco qualsiasi carattere non sia una lettera con uno spazio
                            nome_aut = aut_norm.split(" ")
                            nome_aut = filter(None, nome_aut)
                            nome=""
                            cognome = ""
                            if len(nome_aut) == 1:
                                nome_aut = nome_aut[0]
                                nome_aut = "".join(nome_aut.split(" "))
                                autore_da_mandare = {"testo":aut, "valore":"http://vitali.web.cs.unibo.it/raschietto/person/" + nome_aut}
                            elif len(nome_aut) == 2:
                                nome = "".join(nome_aut[0].split(" "))[0]
                                cognome = "".join(nome_aut[1].split(" "))
                                autore_da_mandare = {"testo":aut, "valore":"http://vitali.web.cs.unibo.it/raschietto/person/" + nome + "-" + cognome}
                            else:
                                nome = nome_aut[0]
                                nome = "".join(nome.split(" "))[0]
                                cognome = nome_aut[len(nome_aut)-2]+nome_aut[len(nome_aut)-1]
                                cognome = "".join(cognome.split(" "))
                                autore_da_mandare = {"testo":aut, "valore":"http://vitali.web.cs.unibo.it/raschietto/person/" + nome + "-" + cognome}
                            aut_ref.append({"tipo":"creator", "xpath":xpath_ref[i], "inizio": start, "fine": end, "object": autore_da_mandare})
                        break
                if not lista_anno: #nel caso in cui ci sia una reference senza anno
                    titolo_ref = ""
                    autori_ref = ""
                    anno = ""
                    start_tit = 0
                    end_tit = 0
                    start_year = 0
                    end_year = 0
                    aut_ref = []
                    autore_da_mandare = ""
                    aut_ref.append({"tipo":"creator", "xpath":xpath_ref[i], "inizio": 0, "fine": 0, "object": autore_da_mandare})
                tit_ref = {"tipo":"title", "xpath":xpath_ref[i], "inizio": start_tit, "fine": end_tit, "object": titolo_ref}
                yea_ref = {"tipo":"hasPublicationYear", "xpath":xpath_ref[i], "inizio": start_year, "fine": end_year, "object": anno}
                full_ref = {"tipo":"cites", "xpath":xpath_ref[i],"inizio":0,"fine":len(refer),"object":refer, "titolo": tit_ref, "anno":yea_ref, "autori":aut_ref}
                listona.append(full_ref)
                print(full_ref)
            else:
                #anno della ref, uso di una regular expression che prende tutte le serie di 4 caratteri numerici
                lista_anno = re.findall("\d\d\d\d",refer)
                for a in lista_anno:
                    #solo se il numero nella lista e compreso tra 1950 e 2015
                    if int(a) >= 1950 and int(a) <= 2015:
                        anno = a
                        if (riga.find('"') != -1): #CASO 1: nella riga trovo un carattere virgolette
                            #nel caso in cui titolo (che inizia con ") viene prima dell'anno, allora devo fare la split con
                            #quel carattere (") per riuscire a ricavare gli autori e il titolo
                            autori_temp = ""
                            if riga.index('"') < riga.index(anno):
                                autori_temp = riga.split('"',1)[0]
                                titolo_ref = riga.split('"',1)[1]
                            else: #nel caso in cui l'anno viene prima di "
                                #tolgo " (" dagli autori che hanno questi caratteri
                                if riga.find(" ("+anno) != -1:
                                    autori_temp = riga.split(" ("+anno,1)[0]
                                else:
                                    autori_temp = riga.split(anno,1)[0]
                                titolo_ref = riga.split(anno,1)[1]
                            #alcune reference hanno gli autori separati da un and, quindi lo sostituisco con la virgola che
                            #successivamente verra usato per splittare(separare) gli autori
                            if autori_temp.find("and ") != -1: #GLI IF SUI REPLACE SI POSSONO OMETTERE
                                if url.find("09leetaru") != -1:
                                    autori_temp = autori_temp.replace(" and ", " , ")
                                else:
                                    autori_temp = autori_temp.replace("and ", ", ")
                            #alcune reference hanno et al. (e altri), quindi lo tolgo
                            if autori_temp.find(" et al. ") != -1:
                                autori_temp = autori_temp.replace(" et al. ", ", ")
                            autori_ref = autori_temp.split(", ")
                            autori_ref = filter(None, autori_ref) #toglie elementi nulli dalla lista
                            #se uno degli elementi contiene almeno un carattere e un . o solo uno o piu caratteri lo aggiungo
                            #al precedente perche significa che e il nome abbreviato dell'autore
                            if url.find("09latif") != -1: #solo caso latif
                                for idx, aut in enumerate(autori_ref):
                                    if aut.find(".") != -1:
                                        autori_ref[idx-1] = str(autori_ref[idx-1]) + ", " + str(aut)
                                        del autori_ref[idx]
                                    elif len(aut) == 1 or len(aut) == 2:
                                        autori_ref[idx-1] = str(autori_ref[idx-1]) + ", " + str(aut)
                                        del autori_ref[idx]
                            #nel caso in cui il titolo inizi con la parentesi e/o altri caratteri li tolgo
                            if titolo_ref.startswith("). ") == True:
                                titolo_ref = titolo_ref.replace("). ", "", 1) #solo la prima
                            if titolo_ref.startswith("), ") == True:
                                titolo_ref = titolo_ref.replace("), ", "", 1) #solo la prima
                            if titolo_ref.startswith(") ") == True:
                                titolo_ref = titolo_ref.replace(") ", "", 1) #solo la prima
                            if titolo_ref.startswith(". ") == True:
                                titolo_ref = titolo_ref.replace(". ", "", 1) #solo la prima
                            #ricavo gli indici del titolo, dell'anno e di uno o piu autori
                            start_tit = ref.index(titolo_ref)
                            end_tit = start_tit + len(titolo_ref)
                            start_year = ref.index(anno)
                            end_year = start_year + len(anno)
                            aut_ref = []
                            for aut in autori_ref:
                                start = ref.index(aut)
                                end = start + len(aut)
                                #trasformo l'autore in minuscolo e senza lettere accentate
                                aut_norm = unicode(aut.lower(), 'utf-8')
                                aut_norm = unicodedata.normalize('NFKD', aut_norm)
                                aut_norm = aut_norm.encode('ascii', 'ignore')
                                aut_norm = aut_norm.decode("utf-8")
                                aut_norm = re.sub("[^\w\s]", " ", aut_norm) #sostituisco qualsiasi carattere non sia una lettera con uno spazio
                                nome_aut = aut_norm.split(" ")
                                nome_aut = filter(None, nome_aut)
                                nome=""
                                cognome = ""
                                if len(nome_aut) == 1:
                                    nome_aut = nome_aut[0]
                                    nome_aut = "".join(nome_aut.split(" "))
                                    autore_da_mandare = {"testo":aut, "valore":"http://vitali.web.cs.unibo.it/raschietto/person/" + nome_aut}
                                elif len(nome_aut) == 2:
                                    nome = "".join(nome_aut[0].split(" "))[0]
                                    cognome = "".join(nome_aut[1].split(" "))
                                    autore_da_mandare = {"testo":aut, "valore":"http://vitali.web.cs.unibo.it/raschietto/person/" + nome + "-" + cognome}
                                else:
                                    nome = nome_aut[0]
                                    nome = "".join(nome.split(" "))[0]
                                    cognome = nome_aut[len(nome_aut)-2]+nome_aut[len(nome_aut)-1]
                                    cognome = "".join(cognome.split(" "))
                                    autore_da_mandare = {"testo":aut, "valore":"http://vitali.web.cs.unibo.it/raschietto/person/" + nome + "-" + cognome}
                                aut_ref.append({"tipo":"creator", "xpath":xpath_ref[i], "inizio": start, "fine": end, "object": autore_da_mandare})
                        else: #CASO 2: nella riga non trovo un carattere virgolette
                            #try-except per le reference che non riusciamo a gestire, quelle che non vengono analizzate
                            try:
                                #dividiamo i casi per url perche alcuni sono molto diversi tra loro e risulta complicato creare
                                #un metodo che vada bene per tutti
                                if url.find("09zuniga") != -1: #dato che l'url ha una sola reference semplifichiamo
                                    riga = riga.replace("& ", ", ", 1)
                                    autori_temp = riga.split(' (2013, September). ')[0]
                                    titolo_ref = riga.split(' (2013, September). ')[1]
                                    autori_ref= autori_temp.split(", ")
                                    autori_ref = filter(None, autori_ref)
                                    #se uno degli elementi contiene almeno un carattere e un . lo aggiungo al precedente perche
                                    #significa che e il nome abbreviato dell'autore
                                    for idx, aut in enumerate(autori_ref):
                                        if aut.find(".") != -1:
                                            autori_ref[idx-1] = str(autori_ref[idx-1]) + ", " + str(aut)
                                            del autori_ref[idx]
                                    #ricavo gli indici del titolo, dell'anno e di uno o piu autori
                                    start_tit = ref.index(titolo_ref)
                                    end_tit = start_tit + len(titolo_ref)
                                    start_year = ref.index(anno)
                                    end_year = start_year + len(anno)
                                    aut_ref = []
                                    for aut in autori_ref:
                                        start = ref.index(aut)
                                        end = start + len(aut)
                                        #trasformo l'autore in minuscolo e senza lettere accentate
                                        aut_norm = unicode(aut.lower(), 'utf-8')
                                        aut_norm = unicodedata.normalize('NFKD', aut_norm)
                                        aut_norm = aut_norm.encode('ascii', 'ignore')
                                        aut_norm = aut_norm.decode("utf-8")
                                        aut_norm = re.sub("[^\w\s]", " ", aut_norm) #sostituisco qualsiasi carattere non sia una lettera con uno spazio
                                        nome_aut = aut_norm.split(" ")
                                        nome_aut = filter(None, nome_aut)
                                        nome=""
                                        cognome = ""
                                        if len(nome_aut) == 1:
                                            nome_aut = nome_aut[0]
                                            nome_aut = "".join(nome_aut.split(" "))
                                            autore_da_mandare = {"testo":aut, "valore":"http://vitali.web.cs.unibo.it/raschietto/person/" + nome_aut}
                                        elif len(nome_aut) == 2:
                                            nome = "".join(nome_aut[0].split(" "))[0]
                                            cognome = "".join(nome_aut[1].split(" "))
                                            autore_da_mandare = {"testo":aut, "valore":"http://vitali.web.cs.unibo.it/raschietto/person/" + nome + "-" + cognome}
                                        else:
                                            nome = nome_aut[0]
                                            nome = "".join(nome.split(" "))[0]
                                            cognome = nome_aut[len(nome_aut)-2]+nome_aut[len(nome_aut)-1]
                                            cognome = "".join(cognome.split(" "))
                                            autore_da_mandare = {"testo":aut, "valore":"http://vitali.web.cs.unibo.it/raschietto/person/" + nome + "-" + cognome}
                                        aut_ref.append({"tipo":"creator", "xpath":xpath_ref[i], "inizio": start, "fine": end, "object": autore_da_mandare})
                                elif url.find("11brook") != -1:
                                    #PER SCELTA PROGETTUALE estraggo autori, titolo e anno della reference solo se questa ha piu
                                    #di 2 virgole, perche se ne ha di meno significa che non ha uno o piu dati che ci servono
                                    if riga.count(",") >= 2:
                                        sp = riga.split(', ')
                                        if sp[1].find(".") != -1:
                                            sp[0] = str(sp[0]) + ", " + str(sp[1])
                                            del sp[1]
                                        tit = riga.split(sp[0] + ", ")[1] #il primo e vuoto per lo split
                                        titolo_ref = tit.split(", ")[0]
                                        aut = sp[0].replace(" and ", ", ")
                                        autori_ref = aut.split(", ")
                                        autori_ref = filter(None, autori_ref)
                                        anno = re.findall("\d\d\d\d",refer)[0]
                                        #ricavo gli indici del titolo, dell'anno e di uno o piu autori
                                        start_tit = ref.index(titolo_ref)
                                        end_tit = start_tit + len(titolo_ref)
                                        start_year = ref.index(anno)
                                        end_year = start_year + len(anno)
                                        aut_ref = []
                                        for aut in autori_ref:
                                            start = ref.index(aut)
                                            end = start + len(aut)
                                            #trasformo l'autore in minuscolo e senza lettere accentate
                                            aut_norm = unicode(aut.lower(), 'utf-8')
                                            aut_norm = unicodedata.normalize('NFKD', aut_norm)
                                            aut_norm = aut_norm.encode('ascii', 'ignore')
                                            aut_norm = aut_norm.decode("utf-8")
                                            aut_norm = re.sub("[^\w\s]", " ", aut_norm) #sostituisco qualsiasi carattere non sia una lettera con uno spazio
                                            nome_aut = aut_norm.split(" ")
                                            nome_aut = filter(None, nome_aut)
                                            nome=""
                                            cognome = ""
                                            if len(nome_aut) == 1:
                                                nome_aut = nome_aut[0]
                                                nome_aut = "".join(nome_aut.split(" "))
                                                autore_da_mandare = {"testo":aut, "valore":"http://vitali.web.cs.unibo.it/raschietto/person/" + nome_aut}
                                            elif len(nome_aut) == 2:
                                                nome = "".join(nome_aut[0].split(" "))[0]
                                                cognome = "".join(nome_aut[1].split(" "))
                                                autore_da_mandare = {"testo":aut, "valore":"http://vitali.web.cs.unibo.it/raschietto/person/" + nome + "-" + cognome}
                                            else:
                                                nome = nome_aut[0]
                                                nome = "".join(nome.split(" "))[0]
                                                cognome = nome_aut[len(nome_aut)-2]+nome_aut[len(nome_aut)-1]
                                                cognome = "".join(cognome.split(" "))
                                                autore_da_mandare = {"testo":aut, "valore":"http://vitali.web.cs.unibo.it/raschietto/person/" + nome + "-" + cognome}
                                            aut_ref.append({"tipo":"creator", "xpath":xpath_ref[i], "inizio": start, "fine": end, "object": autore_da_mandare})
                                    else:
                                        titolo_ref = ""
                                        autori_ref = ""
                                        anno = ""
                                        start_tit = 0
                                        end_tit = 0
                                        start_year = 0
                                        end_year = 0
                                        aut_ref = []
                                        autore_da_mandare = ""
                                        aut_ref.append({"tipo":"creator", "xpath":xpath_ref[i], "inizio": 0, "fine": 0, "object": autore_da_mandare})
                                elif url.find("09leetaru") != -1:
                                    autori_ref=[]
                                    autori_ref.append(riga.split(", " + anno, 1)[0])
                                    titolo_ref = riga.split(", " + anno + ". ", 1)[1]
                                    start_tit = ref.index(titolo_ref)
                                    end_tit = start_tit + len(titolo_ref)
                                    start_year = ref.index(anno)
                                    end_year = start_year + len(anno)
                                    aut_ref = []
                                    #ricavo gli indici del titolo, dell'anno e di uno o piu autori
                                    for aut in autori_ref:
                                        start = ref.index(aut)
                                        end = start + len(aut)
                                        #trasformo l'autore in minuscolo e senza lettere accentate
                                        aut_norm = unicode(aut.lower(), 'utf-8')
                                        aut_norm = unicodedata.normalize('NFKD', aut_norm)
                                        aut_norm = aut_norm.encode('ascii', 'ignore')
                                        aut_norm = aut_norm.decode("utf-8")
                                        aut_norm = re.sub("[^\w\s]", " ", aut_norm) #sostituisco qualsiasi carattere non sia una lettera con uno spazio
                                        nome_aut = aut_norm.split(" ")
                                        nome_aut = filter(None, nome_aut)
                                        nome=""
                                        cognome = ""
                                        if len(nome_aut) == 1:
                                            nome_aut = nome_aut[0]
                                            nome_aut = "".join(nome_aut.split(" "))
                                            autore_da_mandare = {"testo":aut, "valore":"http://vitali.web.cs.unibo.it/raschietto/person/" + nome_aut}
                                        elif len(nome_aut) == 2:
                                            nome = "".join(nome_aut[0].split(" "))[0]
                                            cognome = "".join(nome_aut[1].split(" "))
                                            autore_da_mandare = {"testo":aut, "valore":"http://vitali.web.cs.unibo.it/raschietto/person/" + nome + "-" + cognome}
                                        else:
                                            nome = nome_aut[0]
                                            nome = "".join(nome.split(" "))[0]
                                            cognome = nome_aut[len(nome_aut)-2]+nome_aut[len(nome_aut)-1]
                                            cognome = "".join(cognome.split(" "))
                                            autore_da_mandare = {"testo":aut, "valore":"http://vitali.web.cs.unibo.it/raschietto/person/" + nome + "-" + cognome}
                                        aut_ref.append({"tipo":"creator", "xpath":xpath_ref[i], "inizio": start, "fine": end, "object": autore_da_mandare})
                                else:
                                    #tolgo il primo and che trovo nella ref, perche cosi ho modo di separare gli autori
                                    riga = riga.replace("and ", ", ", 1)
                                    limite = 0
                                    #estraggo gli autori temporanei
                                    autori_1 = riga.split(', ')
                                    autori_1 = filter(None, autori_1)
                                    for idx, autori_temp in enumerate(autori_1):
                                        #se un autore contiene anche l'anno mi salvo l'indice e il suo valore
                                        if autori_temp.find("(" + anno + ")") != -1:
                                            #parto dal carattere 5 perche ci potrebbero essere autori con piu di un nome puntati
                                            ultimo = autori_1[idx][0: autori_1[idx].find(".", 5) ]
                                            limite = idx
                                            break
                                        elif len(autori_temp) > 25: #caso in cui l'autore non contenga l'anno ma abbia solo una lunghezza maggiore di 25 (numero arbitrario scelto da noi)
                                            #parto dal carattere 5 perche ci potrebbero essere autori con piu di un nome
                                            ultimo = autori_1[idx][0: autori_1[idx].find(".", 5) ]
                                            limite = idx
                                            break
                                    autori_ref=[]
                                    #creo nuovo array con dentro tutti gli autori tranne l'ultimo, mi fermo grazie all'indice che
                                    #ho ricavato prima
                                    for idx, autori_temp in enumerate(autori_1):
                                        if (idx < limite):
                                            autori_ref.append(autori_temp)
                                    #dall'ultimo autore rimuovo l'anno
                                    if ultimo.find(" (" + anno) != -1:
                                        ultimo_autore = ultimo.replace(" (" + anno, "")
                                    else:
                                        ultimo_autore = ultimo.replace(" " + anno, "")
                                    #ora e pronto per essere aggiunto all'array di autori
                                    autori_ref.append(ultimo_autore)
                                    #se uno degli elementi contiene almeno un carattere e un . lo aggiungo al precedente perche
                                    #significa che e il nome abbreviato dell'autore
                                    if url.find("09latif") != -1 or url.find("11holub") != -1 or url.find("11kroell") != -1 or url.find("11murray-rust") != -1:
                                        for idx, aut in enumerate(autori_ref):
                                            if aut.find(".") != -1:
                                                autori_ref[idx-1] = str(autori_ref[idx-1]) + ", " + str(aut)
                                                del autori_ref[idx]
                                    if url.find("11knoth") != -1 and ref.startswith("[20]"):
                                        for idx, aut in enumerate(autori_ref):
                                            if aut.find(".") != -1:
                                                autori_ref[idx-1] = str(autori_ref[idx-1]) + ", " + str(aut)
                                                del autori_ref[idx]
                                    #per trovare il titolo splittare la riga di partenza con caratteri: ultimo + ". " o "), "
                                    if ultimo.find(" (" + anno) != -1:
                                        titolo_ref = riga.split(ultimo + "), ")[1]
                                    else:
                                        titolo_ref = riga.split(ultimo + ". ")[1]
                                    #nel caso ci sia un solo autore nella reference sicuramente c'e stato un errore, questo rimedia
                                    titolo_ref = titolo_ref.replace(" , ", " and ", 1)
                                    if titolo_ref.startswith(anno) == True:
                                        titolo_ref=titolo_ref.replace(anno + ". ", "")
                                    #ricavo gli indici del titolo, dell'anno e di uno o piu autori
                                    start_tit = ref.index(titolo_ref)
                                    end_tit = start_tit + len(titolo_ref)
                                    start_year = ref.index(anno)
                                    end_year = start_year + len(anno)
                                    aut_ref = []
                                    for aut in autori_ref:
                                        start = ref.index(aut)
                                        end = start + len(aut)
                                        #trasformo l'autore in minuscolo e senza lettere accentate
                                        aut_norm = unicode(aut.lower(), 'utf-8')
                                        aut_norm = unicodedata.normalize('NFKD', aut_norm)
                                        aut_norm = aut_norm.encode('ascii', 'ignore')
                                        aut_norm = aut_norm.decode("utf-8")
                                        aut_norm = re.sub("[^\w\s]", " ", aut_norm) #sostituisco qualsiasi carattere non sia una lettera con uno spazio
                                        nome_aut = aut_norm.split(" ")
                                        nome_aut = filter(None, nome_aut)
                                        nome=""
                                        cognome = ""
                                        if len(nome_aut) == 1:
                                            nome_aut = nome_aut[0]
                                            nome_aut = "".join(nome_aut.split(" "))
                                            autore_da_mandare = {"testo":aut, "valore":"http://vitali.web.cs.unibo.it/raschietto/person/" + nome_aut}
                                        elif len(nome_aut) == 2:
                                            nome = "".join(nome_aut[0].split(" "))[0]
                                            cognome = "".join(nome_aut[1].split(" "))
                                            autore_da_mandare = {"testo":aut, "valore":"http://vitali.web.cs.unibo.it/raschietto/person/" + nome + "-" + cognome}
                                        else:
                                            nome = nome_aut[0]
                                            nome = "".join(nome.split(" "))[0]
                                            cognome = nome_aut[len(nome_aut)-2]+nome_aut[len(nome_aut)-1]
                                            cognome = "".join(cognome.split(" "))
                                            autore_da_mandare = {"testo":aut, "valore":"http://vitali.web.cs.unibo.it/raschietto/person/" + nome + "-" + cognome}
                                        aut_ref.append({"tipo":"creator", "xpath":xpath_ref[i], "inizio": start, "fine": end, "object": autore_da_mandare})
                            except IndexError: #se ho un errore nel trovare gli autori o il titolo finisco qui, e salto la reference
                                titolo_ref = ""
                                autori_ref = ""
                                anno = ""
                                start_tit = 0
                                end_tit = 0
                                start_year = 0
                                end_year = 0
                                aut_ref = []
                                autore_da_mandare = ""
                                aut_ref.append({"tipo":"creator", "xpath":xpath_ref[i], "inizio": 0, "fine": 0, "object": autore_da_mandare})
                        break #si ferma al primo anno trovato
                if not lista_anno: #nel caso in cui ci sia una reference senza anno
                    titolo_ref = ""
                    autori_ref = ""
                    anno = ""
                    start_tit = 0
                    end_tit = 0
                    start_year = 0
                    end_year = 0
                    aut_ref = []
                    autore_da_mandare = ""
                    aut_ref.append({"tipo":"creator", "xpath": xpath_ref[i], "inizio": 0, "fine": 0, "object": autore_da_mandare})
                tit_ref = {"tipo":"title", "xpath": xpath_ref[i], "inizio": start_tit, "fine": end_tit, "object": titolo_ref}
                yea_ref = {"tipo":"hasPublicationYear", "xpath": xpath_ref[i], "inizio": start_year, "fine": end_year, "object": anno}

                full_ref = {"tipo":"cites", "xpath": xpath_ref[i],"inizio": 0,"fine": len(refer),"object": refer, "titolo": tit_ref, "anno": yea_ref, "autori": aut_ref}
                i=i+1
            for res in full_ref:
                path_step_list = full_ref["xpath"].split("/")
                path=""
                for step in path_step_list:
                    if not contains_digits(step):
                        step +="[1]"
                    path += step +"/"
                path = path[:-1]
                path = path.replace("[", "")
                path = path.replace("]", "")
                path = path.replace("/", "_")
                path = path.replace("_text()1","")
            full_ref = {"tipo":"cites", "xpath": path,"inizio": 0,"fine": len(refer),"object": refer}

            listona.append(full_ref)
            print(full_ref)


    elif parsed_uri[1] == 'antropologiaeteatro.unibo.it' or parsed_uri[1] == 'almatourism.unibo.it' or parsed_uri[1] == 'rivista-statistica.unibo.it' or parsed_uri[1].find('unibo.it') != -1:
        reference_list=tree.xpath('//*[@id="articleCitations"]/div//p/text()')
        i = 1
        aut_ref = []
        #per ogni reference cerco autore, titolo e anno
        for refer in reference_list:
            xpath_ref='html/body/div/div[3]/div[2]/div[3]/div[7]/div/p['+str(i)+']'
            refer = refer.encode("utf-8")
            #la prendo solo nel caso non sia un url(DOI), ma una vera e propria reference, con anno, autore/i e titolo
            if refer.startswith("http") == False:
                #anno della ref, uso di una regular expression che prende tutte le serie di 4 caratteri numerici
                lista_anno = re.findall("\d\d\d\d",refer)
                for a in lista_anno:
                    #analizzo la refer solo se ha l'anno e nel caso questo sia compreso, se non ce l'ha passo alla successiva
                    if int(a) >= 1950 and int(a) <= 2015:
                        anno = a
                        stringa_split = re.findall(anno+"+[a-z]{1}",refer) #prende gli anni con una lettera attaccata
                        if stringa_split: #se lo trova la splitta
                            stringa_split = stringa_split[0]
                            if refer.find(stringa_split) != -1: #nel caso sia "(anno)" splitto comprese le stesse parentesi
                                st = refer.split("(" + stringa_split + ")",1)
                            else: #altrimenti splitto solo per l'anno
                                st = refer.split(stringa_split,1)
                        else: #se non lo trova
                            if refer.find("(" + anno + ")") != -1: #nel caso sia (anno) splitto comprese le stesse parentesi
                                st = refer.split("(" + anno + ")",1)
                            else: #altrimenti splitto solo per l'anno
                                st = refer.split(anno,1)
                        #alcuni articoli hanno il carattere "&" invece della parola "and" e di questi faccio il replace con la
                        #virgola sugli autori (st[0])
                        if url.find("5290") != -1 or url.find("5292") != -1 or url.find("5294") != -1:
                            st[0] = st[0].replace("& ", ", ")
                        else: #per gli altri sostituisco "and" o ";" con ","
                            st[0] = st[0].replace("; ", ", ")
                            st[0] = st[0].replace(" and ", ", ")
                        #spezzo gli autori
                        autori_ref = st[0].split(", ") #autori della reference
                        autori_ref = filter(None, autori_ref) #toglie elementi nulli dalla lista
                        #funziona solo per alcuni almatourism, non 5293 e 4647
                        if url.find("5293") == -1 and url.find("4647") == -1 and url.find("rivista-statistica") == -1 and url.find("eqa") == -1:
                            for idx, aut in enumerate(autori_ref):
                                if len(autori_ref) != 1:
                                    if aut.find(".") != -1 and aut.count(".") <= 3 and aut.find(".") <= 4:
                                        autori_ref[idx-1] = str(autori_ref[idx-1]) + ", " + str(aut)
                                        del autori_ref[idx]
                                    elif len(aut) == 1 or len(aut) == 2:
                                        autori_ref[idx-1] = str(autori_ref[idx-1]) + ", " + str(aut)
                                        del autori_ref[idx]
                        #estraggo il titolo
                        tit = st[1]
                        #tolgo alcuni caratteri "sgradevoli" dal titolo
                        if tit[0] == "." or tit[0] == ",": #titoli della reference
                            titolo_ref = tit[2:]
                        else: #se non c'e punto o virgola allora tolgo solo lo spazio
                            titolo_ref = tit[1:]
                        start_tit = refer.index(titolo_ref)
                        end_tit = start_tit + len(titolo_ref)
                        start_year = refer.index(anno)
                        end_year = start_year + len(anno)
                        aut_ref = []
                        for aut in autori_ref:
                            start = refer.index(aut)
                            end = start + len(aut)
                            #trasformo l'autore in minuscolo e senza lettere accentate
                            aut_norm = unicode(aut.lower(), 'utf-8')
                            aut_norm = unicodedata.normalize('NFKD', aut_norm)
                            aut_norm = aut_norm.encode('ascii', 'ignore')
                            aut_norm = aut_norm.decode("utf-8")
                            aut_norm = re.sub("[^\w\s]", " ", aut_norm) #sostituisco qualsiasi carattere non sia una lettera con uno spazio
                            nome_aut = aut_norm.split(" ")
                            nome_aut = filter(None, nome_aut)
                            nome=""
                            cognome = ""
                            if len(nome_aut) == 1:
                                nome_aut = nome_aut[0]
                                nome_aut = "".join(nome_aut.split(" "))
                                autore_da_mandare = {"testo":aut, "valore":"http://vitali.web.cs.unibo.it/raschietto/person/" + nome_aut}
                            elif len(nome_aut) == 2:
                                nome = "".join(nome_aut[0].split(" "))[0]
                                cognome = "".join(nome_aut[1].split(" "))
                                autore_da_mandare = {"testo":aut, "valore":"http://vitali.web.cs.unibo.it/raschietto/person/" + nome + "-" + cognome}
                            else:
                                nome = nome_aut[0]
                                nome = "".join(nome.split(" "))[0]
                                cognome = nome_aut[len(nome_aut)-2]+nome_aut[len(nome_aut)-1]
                                cognome = "".join(cognome.split(" "))
                                autore_da_mandare = {"testo":aut, "valore":"http://vitali.web.cs.unibo.it/raschietto/person/" + nome + "-" + cognome}
                            #print autore_da_mandare
                            #print "\n"
                            aut_ref.append({"tipo":"creator", "xpath":xpath_ref, "inizio": start, "fine": end, "object": autore_da_mandare})
                        break
                if not lista_anno: #nel caso la ref non abbia un anno allora non la considero valida
                    titolo_ref = ""
                    autori_ref = ""
                    anno = ""
                    start_tit = 0
                    end_tit = 0
                    start_year = 0
                    end_year = 0
                    aut_ref = []
                    autore_da_mandare = ""
                    aut_ref.append({"tipo":"creator", "xpath":xpath_ref, "inizio": 0, "fine": 0, "object": autore_da_mandare})
            else: #nel caso la reference sia un url
                titolo_ref = ""
                autori_ref = ""
                anno = ""
                start_tit = 0
                end_tit = 0
                start_year = 0
                end_year = 0
                aut_ref = []
                autore_da_mandare = ""
                #path=trascodifica_path(xpath_ref)
                aut_ref.append({"tipo":"creator", "xpath":xpath_ref, "inizio": 0, "fine": 0, "object": autore_da_mandare})
            #Preparo Json per ritorno.
            tit_ref = {"tipo":"title", "xpath":xpath_ref, "inizio": start_tit, "fine": end_tit, "object": titolo_ref}
            yea_ref = {"tipo":"hasPublicationYear", "xpath":xpath_ref, "inizio": start_year, "fine": end_year, "object": anno}
            #full_ref = {"tipo":"cites", "xpath":xpath_ref,"inizio":0,"fine":len(refer),"object":refer, "titolo": tit_ref, "anno":yea_ref, "autori":aut_ref}
            #path_step_list =xpath_ref.split("/")
            path=trascodifica_path(xpath_ref)
            full_ref = {"tipo":"cites", "xpath":path,"inizio":0,"fine":len(refer),"object":refer}
            listona.append(full_ref)
            print(full_ref)
            i = i + 1



    br.close()
    return listona

def trascodifica_path(xpath):
            path_step_list =xpath.split("/")
            path=""
            for step in path_step_list:
                if not contains_digits(step):
                    step +="[1]"
                path += step +"/"
            path = path[:-1]
            path = path.replace("[", "")
            path = path.replace("]", "")
            path = path.replace("/", "_")
            return path

def contains_digits(string):
    digits =re.compile('\d')
    return bool(digits.search(string))



if __name__ == "__main__":
    print "this script (scrapingAutomatico) is being run directly from %s" % __name__
    main()
else:
    print "this script (scrapingAutomatico) is being imported into another module"