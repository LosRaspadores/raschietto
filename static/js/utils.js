$(document).ready(function() {


    prefix_rsch: "<http://vitali.web.cs.unibo.it/raschietto/>"

    // gestione autori articoli
    function autore(nome_autore){
        nome_autore=nome_autore.toLowerCase();
        nome_autore=nome_autore.replace(/./g,'');
        nome_autore = nome_autore.split(" ");
        num = nome_autore.length;
        nome_autore=nome_autore.replace(/\s/g,'');
        iri_autore = prefix_rsch+":person/"+nome_autore;
    }

}