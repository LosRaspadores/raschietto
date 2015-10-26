__author__ = 'Alice'

# Beautiful Soup automatically converts incoming documents to Unicode and outgoing documents to UTF-8
from bs4 import BeautifulSoup
import mechanize
import urllib2
import re


# Browser mechanize
br = mechanize.Browser()


resp = br.open("http://rivista-statistica.unibo.it/article/view/4594")
raw_html = resp.read()  # raw html source code
soup = BeautifulSoup(raw_html)
text_html = soup.get_text().encode("utf-8")  # html no tags
#print soup.find(id="content").get_text()
#print soup.title.string


# trova glu url degli articoli
resp = br.open("http://rivista-statistica.unibo.it/issue/view/467")
raw_html = resp.read()  # raw html source code
soup = BeautifulSoup(raw_html)
text_html = soup.get_text().encode("utf-8")  # html no tags
results = soup.select("div.tocTitle a")
for res in results:
    print res["href"]
#print soup.title.string


resp = br.open("http://www.dlib.org/dlib/november14/beel/11beel.html")
raw_html = resp.read()  # raw html source code
soup = BeautifulSoup(raw_html)
text_html = soup.get_text().encode("utf-8")  # html no tags
#print soup.findAll('td', valign='top')


resp = br.open("http://www.dlib.org/dlib/november14/brook/11brook.html")
raw_html = resp.read()  # raw html source code
soup = BeautifulSoup(raw_html)
text_html = soup.get_text().encode("utf-8")  # html no tags
#print soup.findAll('td', valign='top')

#







"""
metadata = soup.find_all('meta')  # metadata per chunk
for meta in metadata:
    print meta

# metadata dictionary versione 1
meta_dict = {}
for meta in metadata:
    meta_dict[str(metadata.index(meta))] = str(meta)
    print str(meta)
"""