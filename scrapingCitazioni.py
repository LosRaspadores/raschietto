__author__ = 'Francesco'

from bs4 import BeautifulSoup
import mechanize
from urlparse import urlparse, urljoin
import json


br = mechanize.Browser()

def main():
    scraping_citazioni()

def scraping_citazioni(url):
    lista = []
    # url = 'http://www.dlib.org/dlib/november14/brook/11brook.html'
    # url ="http://almatourism.unibo.it/article/view/5290?acceptCookies=1"
    page = br.open(url)
    html = page.read()
    soup = BeautifulSoup(html)

    parsed_uri = urlparse(url)
    domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
    print domain

    if domain == 'http://www.dlib.org/':
        tag = soup.findAll('h3')
        for t in tag:
            if t.string == 'References' or t.string == 'Bibliography':
                while t.find_next_sibling('p'):

                    t = t.find_next_sibling('p')
                    data = {}
                    data['cit'] = t.get_text()
                    lista.append(data)

    elif domain == 'http://almatourism.unibo.it/' \
            or 'http://rivista-statistica.unibo.it/':
        html = soup.find('div', {'id': 'articleCitations'})
        for p in html.findAll('p'):
            data = {}
            data['cit'] = p.text
            lista.append(data)

    print json.dumps(lista)
    return json.dumps(lista)

    # return str(html)


if __name__ == "__main__":
    print "this script (scrapingSingoloDocumento) is being run directly from %s" % __name__
    main()
else:
    print "this script (scrapingSingoloDocumento) is being imported into another module"