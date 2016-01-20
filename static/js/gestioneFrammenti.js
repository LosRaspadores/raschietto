function verificaTab(){
    if($('ul.nav.nav-tabs').children().length == 1){
        alert('Selezionare un documento')
    }else{
        verificaFrammento()
    }

}

function getHostname(url) {
    var m = url.match(/^http:\/\/[^/]+/);
    return m ? m[0] : null;
}

function verificaFrammento(){
    var selection = rangy.getSelection();
    if(selection.toString() != ""){
        $('#selezione').html(selection.toString())
        var range = selection.getRangeAt(0);
        var bookmark = selection.getBookmark(range.commonAncestorContainer).rangeBookmarks[0];
        var container = bookmark.containerNode; //contenuto del tag a cui appartiene la selezione
        var startOffset = bookmark.start;
        var endOffset = bookmark.end;

        if (container.nodeType == 3) { //text
            var temp = container.parentNode; //tag completo a cui appartiene la selezione

            var textNodes = getTextNodes(temp);
            var offset = 0;
            var foundNode = false;

            for (var i = 0; (i < textNodes.length) && (!foundNode); i++) {
                if (textNodes[i] == container) {
                    foundNode = true;
                } else {
                    offset += textNodes[i].length;
                }
            };
            startOffset += offset;
            endOffset += offset;
            container = temp;
        };
        var url = $('.active a').attr('id')
        var domain = getHostname(url)
        var originalPath = ''
        var d = ''
        if(domain == 'http://www.dlib.org'){
            d = 0
            originalPath = 'form_table3_tbody_tr_td_table5'
        }else if(domain == 'http://rivista-statistica.unibo.it' || domain == 'http://antropologiaeteatro.unibo.it' || domain == 'http://almatourism.unibo.it'){
            d = 1
            originalPath = 'div1_div3_div2_div3'
        }
        var path = url+'#'+originalPath+'_'+getElementPath($(container), d)+'/'+startOffset+'-'+endOffset
        console.log(path);

        //apri modale per inserire annotazione sul frammento
        $('#selezione').css('display', 'block');
        $('#commento').css('display', 'block');
        $('#funzione').css('display', 'block');
//        $('body').addClass('modal-open')
        $('#modalAnnotDoc').modal('show');

    }else{
        $('#selezione').css('display', 'none');
        $('#commento').css('display', 'none');
        $('#funzione').css('display', 'none');
//        $('body').addClass('modal-open')
        $('#modalTipoAnnotazione').modal('show');
    }
}


function getElementPath($element, d){
    var tag = $element[0].tagName.toLowerCase()
    var index = $element.parent().children(tag).index($element) + 1;
    var path = []
    $element.parents().not('html').not('body').each(function() {
        if(d == 0){
            var f = $(this).attr('width') == '100%' && $(this).attr('cellspacing') == '0' && $(this).attr('cellpadding') == '0' && $(this).attr('border') == '0' && $(this).attr('align') == 'center'
        }else{
            var f =  $(this).attr('id') == 'content'
        }
        if(f){
            return false
        }else{
            var tag = this.tagName.toLowerCase();
            var index = $(this).parent().children(tag).index(this) + 1;
            path.push(tag+""+ index)
        }
    });
    path.reverse()
    return path.join("_")+"_"+$element[0].tagName.toLowerCase()+index
}

/* modificare !! */
function getTextNodes(node) {
    var textNodes = [];
    if (node.nodeType == 3) {
        textNodes.push(node);

    } else {
        var children = node.childNodes;

        for (var i = 0, len = children.length; i < len; ++i) {
            textNodes.push.apply(textNodes, getTextNodes(children[i]));
        }
    }
    return textNodes;
}

//var myJsonString = JSON.stringify(yourArray);
var annotazioniSessione = []; //da svuotare quando !?!?!

$('#salvaInsert').on('click', function(){
    //document.getElementById("formAnnotazione").submit();
    var tipoAnnotazione = $('#selectTipoAnnot').find(":selected").text();
    var testo = ''
    switch (tipoAnnotazione) {
            case "Autore":
                testo = $('#autore').val()
                break;
            case "Anno pubblicazione":
                testo = $('#anno').find(":selected").text()
                break;
            case "DOI":
                testo = $('#doi').val()
                break;
            case "Titolo":
                testo = $('#titolo').val()
                break;
            case "URL":
                testo = $('#url').val()
                break;
            case "Commento":
                testo = $('#comm').val()
                break;
            case "Funzione retorica":
                testo = $('#funcRet').find(":selected").text()
                break;
    }
//    alert(testo)
    //informazioni da mostrare nel modale di gestione
    // serve anche il tipo !! <-----------------------------------------------------------
    var annotazione = {
        "selezione": $('#selezione').val(),
        "testo": testo
    }
    //aggiunge questa annotazione nell'oggetto con tutte le annotazioni della sessione (mostrate nel modale di gestione)
    annotazioniSessione.push(annotazione);
    for(i = 0; i<annotazioniSessione.length; i++){
        alert("Selezione: "+annotazioniSessione[i].selezione+" - Testo: "+annotazioniSessione[i].testo)
//        annotazioniSessione.pop()
    }

    //aggiungi al modale di gestione
    popolaModaleGestioneAnnotazione(annotazione)

    //chiudi modale
    $('#modalAnnotDoc').modal('toggle'); //bo !!

//    gestisciAnnotazioni(annotazione)
});

//function gestisciAnnotazioni(obj){
//    // 1-salva annotazione appena inserita nell'oggetto con tutte le annotazioni della sessione in corso
//    // 2-aggiunge tale annotazione nel modale ?!
////    $('#modalGestioneAnnotazioni').modal('show'); ///da togliere, era una prova
//}

function popolaModaleGestioneAnnotazione(obj){
    //aggiunge righe al modal

}

$(document).ready(function(){

     $('#autore').keyup(function() {
        if($(this).val().length != 0) {
           $('#salvaInsert').removeAttr('disabled', 'disabled');
        }else{
            $('#salvaInsert').attr('disabled', 'disabled');
        }
     });
     $('#anno').change(function(){
        if($('#anno').find(":selected").text().length != 0) {
           $('#salvaInsert').removeAttr('disabled', 'disabled');
        }else{
           $('#salvaInsert').attr('disabled', 'disabled');
        }
     });

     $('#titolo').keyup(function() {
        if($(this).val().length != 0) {
           $('#salvaInsert').removeAttr('disabled', 'disabled');
        }else{
            $('#salvaInsert').attr('disabled', 'disabled');
        }
     });
     $('#url').keyup(function() {
        if($(this).val() != '') {
           $('#salvaInsert').removeAttr('disabled', 'disabled');
        }else{
            $('#salvaInsert').attr('disabled', 'disabled');
        }
     });
     $('#doi').keyup(function() {
        if($(this).val().length != 0) {
           $('#salvaInsert').removeAttr('disabled', 'disabled');
        }else{
            $('#salvaInsert').attr('disabled', 'disabled');
        }
     });
     $('#comm').keyup(function() {
        if($(this).val().length != 0) {
           $('#salvaInsert').removeAttr('disabled', 'disabled');
        }else{
            $('#salvaInsert').attr('disabled', 'disabled');
        }
     });
     $('#funcRet').change(function() {
        if($('#funcRet').find(":selected").text().length != 0) {
           $('#salvaInsert').removeAttr('disabled', 'disabled');
        }else{
           $('#salvaInsert').attr('disabled', 'disabled');
        }
     });
});