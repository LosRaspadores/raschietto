#!/usr/bin/python
# -*- coding: utf-8 -*-

# python v 2.7

__author__ = 'Los Raspadores'

"""
    pip install beautifulsoup4

    Beautiful Soup automatically converts incoming documents to Unicode and outgoing documents to UTF-8
"""

from BeautifulSoup import BeautifulSoup
from urlparse import urlparse, urljoin
import mechanize


# Browser mechanize
br = mechanize.Browser()
br.set_handle_robots(False)
br.set_handle_refresh(False)
br.addheaders = [('user-agent', 'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.3) Gecko/20100423 Ubuntu/10.04 (lucid) Firefox/3.6.3')]


def main():
    scraping_singolo_documento()


def scraping_singolo_documento(url):
    parsed_uri = urlparse(url)
    doc_html = br.open(url).read()
    soup = BeautifulSoup(doc_html)
    html = domain_manager(parsed_uri[1], parsed_uri[2], soup)

    for a in soup.findAll('a', href=True):
        del a['href']

    for t in soup.findAll('a', target=True):
        del t['target']

    [s.extract() for s in soup.findAll('script')]

    for i in soup.findAll('img'):
        relative = i["src"]
        absolute = urljoin(url, relative)
        i["src"] = absolute

    return str(html)


def domain_manager(domain, path, soup):
    if domain == 'www.dlib.org' or domain == 'dlib.org':
        html = soup.find("table", {
            "width": "100%",
            "border": "0",
            "align": "center",
            "cellpadding": "0",
            "cellspacing": "0"
        })
        return html

    elif domain == 'antropologiaeteatro.unibo.it' or domain == 'almatourism.unibo.it' or domain == 'rivista-statistica.unibo.it' or domain.find('unibo.it') != -1:
        if len(path) > 2 and path.find("article") != -1:
            html = soup.find("div", {"id": "content"})
            return html
        else:
            html = soup.find("body")
            return html
    else:
        html = soup.find("body")
        return html

if __name__ == "__main__":
    main()
