#!/usr/bin/python
# -*- coding: utf-8 -*-

# python v 2.7

__author__ = 'Los Raspadores'

"""
    pip install beautifulsoup4

    Beautiful Soup automatically converts incoming documents to Unicode and outgoing documents to UTF-8
"""

from bs4 import BeautifulSoup
from urlparse import urlparse, urljoin
import mechanize

# Browser mechanize
br = mechanize.Browser()


def main():
    scraping_singolo_documento()


def scraping_singolo_documento(url):
    print("url " + url)
    parsed_uri = urlparse(url)
    domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
    doc_html = br.open(url).read()
    soup = BeautifulSoup(doc_html, 'html.parser')
    html = domain_manager(domain, soup)

    for a in soup.findAll('a', href=True):
        del a['href']

    for t in soup.findAll('a', target=True):
        del t['target']

    [s.extract() for s in soup.findAll('script')]

    for i in soup.findAll('img'):
        relative = i["src"]
        absolute = urljoin(url, relative)
        i["src"] = absolute

    # print(html)
    return str(html)


def domain_manager(domain, soup):
    if domain == 'http://www.dlib.org/':
        html = soup.find("table", {
            "width": "100%",
            "border": "0",
            "align": "center",
            "cellpadding": "0",
            "cellspacing": "0"
        })
        return html

    elif domain == 'http://rivista-statistica.unibo.it/' \
            or 'http://almatourism.unibo.it/' or 'http://antropologiaeteatro.unibo.it/':
        html = soup.find("div", {"id": "content"})
        return html

if __name__ == "__main__":
    print "this script (scrapingSingoloDocumento) is being run directly from %s" % __name__
    main()
else:
    print "this script (scrapingSingoloDocumento) is being imported into another module"
