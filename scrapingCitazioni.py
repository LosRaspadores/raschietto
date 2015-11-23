__author__ = 'Francesco'

from bs4 import BeautifulSoup
import mechanize
from urlparse import urlparse, urljoin


br = mechanize.Browser()

def main():
    scraping_citazioni()

def scraping_citazioni(url):
    # url = 'http://almatourism.unibo.it/article/view/5290'
    page = br.open(url)
    html = page.read()
    soup = BeautifulSoup(html)

    parsed_uri = urlparse(url)
    domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
    if domain == 'http://almatourism.unibo.it/':
        html = soup.find('div', {'id': 'articleCitations'})
        print json.dumps(html)


    # return str(html)


if __name__ == "__main__":
    print "this script (scrapingSingoloDocumento) is being run directly from %s" % __name__
    main()
else:
    print "this script (scrapingSingoloDocumento) is being imported into another module"