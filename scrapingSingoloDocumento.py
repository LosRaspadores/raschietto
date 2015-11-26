#!/usr/bin/python
# -*- coding: utf-8 -*-

# python v 2.7

__author__ = 'Los Raspadores'

"""
    pip install BeautifulSoup4

    Beautiful Soup automatically converts incoming documents to Unicode and outgoing documents to UTF-8

"""

from bs4 import BeautifulSoup
import mechanize
import re
from urlparse import urlparse, urljoin
import urllib2, httplib
import json

# Browser mechanize
br = mechanize.Browser()


def main():
    # url = "http://rivista-statistica.unibo.it/article/view/4594"
    scraping_singolo_documento()


def scraping_singolo_documento(url):
    print("url " + url)
    parsed_uri = urlparse(url)
    domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
    #print ("domain: " + domain)
    doc_html = br.open(url).read()
    soup = BeautifulSoup(doc_html, 'html.parser')
    html = domain_manager(url, domain, soup)

    for a in soup.findAll('a', href=True):
        del a['href']
    for t in soup.findAll('a', target=True):
        del t['target']

    # print(html)
    return str(html)


def domain_manager(url, domain, soup):

    if domain == 'http://www.dlib.org/':
        html = soup.find("table", {
            "width": "100%",
            "border": "0",
            "align": "center",
            "cellpadding": "0",
            "cellspacing": "0"
        })
        for i in soup.findAll('img'):  # ('img', {'src': re.compile(r'(jpe?g)|(png)$')})
            relative = i["src"]
            absolute = urljoin(url, relative)
            # print(absolute)  # http://www.dlib.org/dlib/november14/brook/
            i["src"] = absolute
        return html
    elif domain == 'http://rivista-statistica.unibo.it/' \
            or 'http://almatourism.unibo.it/':
        html = soup.find("div", {"id": "content"})
        return html
    elif domain == 'http://antropologiaeteatro.unibo.it/':  # non funziona
        html = soup.find("div", {"id": "content"})
        return html


if __name__ == "__main__":
    print "this script (scrapingSingoloDocumento) is being run directly from %s" % __name__
    main()
else:
    print "this script (scrapingSingoloDocumento) is being imported into another module"
