$(document).ready(function() {

    prefix_rsch: "<http://vitali.web.cs.unibo.it/raschietto/>"


        //nome = nome.replace("_", "").replace("-", "").replace(".", "").replace(",", "");
        //nome = nome.replace("à", "a").replace("è", "e")
        //return nome


    // gestione autori articoli TODO incompleto!!!
    function autore(nome_autore){
        nome_autore=nome_autore.toLowerCase();
        nome_autore=nome_autore.replace(/./g,'');
        nome_autore = nome_autore.split(" ");
        num = nome_autore.length;
        nome_autore=nome_autore.replace(/\s/g,'');
        iri_autore = prefix_rsch+":person/"+nome_autore;
    };


    /* ottenere data e ora nel formato specificato YYYY-MM-DDTHH:mm */
    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    };

    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-"
                    + (currentdate.getMonth())  + "-"
                    + currentdate.getDay() + "T"
                    + currentdate.getHours() + ":"
                    + addZero(currentdate.getMinutes());


});

