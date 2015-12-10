/* gestione nomi autori articoli per IRI*/
function setIRIautore(nome_autore){
    prefix_rsch = "http://vitali.web.cs.unibo.it/raschietto/person/";
    nome_autore = nome_autore.toLowerCase();
    nome_autore = nome_autore.replace(/\./g, '');
    var rExps=[
        {re:/[\xE0-\xE6]/g, ch:'a'},
        {re:/[\xE8-\xEB]/g, ch:'e'},
        {re:/[\xEC-\xEF]/g, ch:'i'},
        {re:/[\xF2-\xF6]/g, ch:'o'},
        {re:/[\xF9-\xFC]/g, ch:'u'}];
    for(var i=0, len=rExps.length; i<len; i++){
        nome_autore = nome_autore.replace(rExps[i].re, rExps[i].ch);
    }
    nome_autore = nome_autore.replace(/é/g, 'e');
    array = nome_autore.split(" ");
    length = array.length;
    if (length == 1){
        uri = array[0];
    } else if (length == 2){
        uri = array[0].substring(0, 1) + "-" + array[1];
    } else if (length == 3){
        uri = array[0].substring(0, 1) + "-" + array[1] + array[2];
    } else {
        uri = array[0].substring(0, 1) + "-" + array[length-2] + array[length-1];
    }
    uri = prefix_rsch + uri;
    return uri;
}

console.log(setIRIautore("Màrio"));
console.log(setIRIautore("Marìo Rossi"));
console.log(setIRIautore("Mario Dè Rùssi"));
console.log(setIRIautore("M. Dé Rossi"));
console.log(setIRIautore("Mario De Rossi Bianchi"));
console.log(setIRIautore("Mariò De Rossi Bianchi Vèrdi Gialli"));


/* ottenere data e ora nel formato specificato YYYY-MM-DDTHH:mm */
function getDateTime(){
    currentdate = new Date();
    return datetime = currentdate.getFullYear() + "-"
                    + (currentdate.getMonth())  + "-"
                    + currentdate.getDay() + "T"
                    + currentdate.getHours() + ":"
                    + addZero(currentdate.getMinutes());

}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
};

console.log(getDateTime());

/* provenance di un annotazione fatta dall'utente correntemente autenticato */
function setProvenanceUtente(){
    if(sessionStorage.length !== 0){
        provenance = "<mailto:" + sessionStorage.email + "> a foaf:mbox ; " +
            "schema:email " + sessionStorage.email + " ;"+
            "foaf:name " + sessionStorage.nomecognome  + "^^xsd:string ; " +
            "rdfs:label " + sessionStorage.nomecognome + "^^xsd:string . ";
        }
    return provenance
}

console.log(setProvenanceUtente());


/* provenance di un annotazione fatta dallo scraper automatico  */
function setProvenanceGruppo(){
    if(sessionStorage.length !== 0){
        provenance = '<mailto:los.raspadores@gmail.com> a foaf:mbox ; ' +
            'schema:email los.raspadores@gmail.com ; ' +
            'foaf:name "LosRaspadores"^^xsd:string ; ' +
            'rdfs:label "LosRaspadores"^^xsd:string . ';
    }
    return provenance
}

console.log(setProvenanceGruppo());