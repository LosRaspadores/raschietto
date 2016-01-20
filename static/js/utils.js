        /*
            var lista_annotazioni = {
                {
                    "url": "urlDoc",
                    "listaGrafi": [
                        {
                            "grafo": "nomeGrafo",
                            "annotazioni": [
                                {},
                                {}
                            ]
                        },
                        {}
                    ]
                },
                {
                    "url": "urldDoc2",
                    "listaGrafi": [
                        {
                            "grafo": "nomeGrafo",
                            "annotazioni": [
                                {},
                                {}
                            ]
                        },
                        {}
                    ]
                }
            }


        */
    var listaAllAnnotazioni = [];

    function salvaAnnotazioniJSON(url, listaAnnotazioni){
        annot_grafo = {};
        annot_grafo['url'] = url;
        annot_grafo['listaGrafi'] = [];
        for(j = 0; j < listaGruppiCompleta.length; j++){
            item = {};
            item['grafo'] = listaGruppiCompleta[j]['url'];
            item['annotazioni'] = searchAnnot(listaGruppiCompleta[j]['url'].substring(47, 54), listaAnnotazioni);
            annot_grafo['listaGrafi'].push(item);
        }

        if(JSON.parse(localStorage.getItem('annotStorage')) != null){
            listaAllAnnotazioni = JSON.parse(localStorage.getItem('annotStorage'));
        }
        listaAllAnnotazioni.push(annot_grafo);
        localStorage.setItem('annotStorage', JSON.stringify(listaAllAnnotazioni));
        console.log(listaAllAnnotazioni);
    }

    function searchAnnot(gruppo, listaAnnotazioni){
        lista = [];
        for(i = 0; i < listaAnnotazioni.length; i++){
            if(listaAnnotazioni[i].graph.value.indexOf(gruppo) >= 0){
                lista.push(listaAnnotazioni[i]);
            }
        }
        return lista;
    }

    function annotDaGestire(url, gruppo){
        annot_gest = [];
        for(k = 0; k < listaAllAnnotazioni.length; k++){
            if(listaAllAnnotazioni[k].url == url){
                for(s = 0; s < listaAllAnnotazioni[k].listaGrafi.length; s++){
                    if(listaAllAnnotazioni[k].listaGrafi[s].grafo == gruppo){
                        for(t = 0; t < listaAllAnnotazioni[k].listaGrafi[s].annotazioni.length; t++){
                            console.log(listaAllAnnotazioni[k].listaGrafi[s].annotazioni[t]);
                            annot_gest.push(listaAllAnnotazioni[k].listaGrafi[s].annotazioni[t]);
                        }
                        break;
                    } else if(gruppo == 'all'){
                        for(t = 0; t < listaAllAnnotazioni[k].listaGrafi[s].annotazioni.length; t++){
                            console.log(listaAllAnnotazioni[k].listaGrafi[s].annotazioni[t]);
                            annot_gest.push(listaAllAnnotazioni[k].listaGrafi[s].annotazioni[t]);
                        }
                    }
                }
                break;
            }
        }
        return annot_gest;
    }

    function filtriGruppo(gruppo, urlDoc){
        $('span[class*="highlight"]').contents().unwrap();
        ann_filtri = annotDaGestire(urlDoc, gruppo);
        for(l = 0; l < ann_filtri.length; l++){
            fragmentPath = ann_filtri[l]["fs_value"]["value"];
            if(fragmentPath == "" || fragmentPath == "document" || fragmentPath == "Document" || fragmentPath == "html/body/" || fragmentPath == "html/body"){
                console.log("ANNOTAZIONE SUL DOCUMENTO SENZA FRAGMENT PATH");
            } else {
                highligthFragment(fragmentPath, ann_filtri[l], urlDoc);
            }
        }
    }

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




