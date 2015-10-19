__author__ = 'Alice'

from bs4 import BeautifulSoup
import mechanize
import urllib2
import re

html_doc = """
<html><head><title>The Dormouse's story</title></head>
<body>
<p class="title"><b>The Dormouse's story</b></p>

<p class="story">Once upon a time there were three little sisters; and their names were
<a href="http://example.com/elsie" class="sister" id="link1">Elsie</a>,
<a href="http://example.com/lacie" class="sister" id="link2">Lacie</a> and
<a href="http://example.com/tillie" class="sister" id="link3">Tillie</a>;
and they lived at the bottom of a well.</p>

<p class="story">...</p>
"""

#soup = BeautifulSoup(html_doc, 'html.parser')
#soup = BeautifulSoup(open("http://www.dlib.org/dlib/november14/11contents.html"))

# Browser mechanize
br = mechanize.Browser()
resp = br.open("http://rivista-statistica.unibo.it/article/view/4594")
raw_html = resp.read()  # raw html source code
soup = BeautifulSoup(raw_html)
text_html = soup.get_text().encode("utf-8")  # html no tags
print soup.title.string


metadata = soup.find_all('meta')  # metadata per chunk
for meta in metadata:
    print meta

# metadata dictionary versione 1
meta_dict = {}
for meta in metadata:
    meta_dict[str(metadata.index(meta))] = str(meta)
    print str(meta)
