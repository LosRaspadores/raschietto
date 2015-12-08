$( document ).ready(function() {

    getGruppi();

    $.when(getDocFromScraping(), getDocFromSparql()).done(function(r1, r2){
        docS = JSON.parse(r1[0]);
        docA = r2[0].results.bindings;

        getDocumenti(docA, docS);
    });

    $('[data-toggle="tooltip"]').tooltip();
    $('[data-tooltip="tooltip"]').tooltip();

    $('#insertAutore').css('display', 'none');
    $('#insertAnnoPub').css('display', 'none');
    $('#insertTitolo').css('display', 'none');
    $('#insertURL').css('display', 'none');
    $('#insertDOI').css('display', 'none');
    $('#insertComm').css('display', 'none');
    $('#insertfunzRet').css('display', 'none');

    $('#salvaInsert').attr('disabled', 'disabled');

    $('ul#bottoniAnnotator button').click(function(e){
        if($("ul.nav.nav-tabs li.active a").attr("id") == 'homeTab'){
            $('#alertDoc').modal('show');
            e.stopPropagation();
        }
    });

    var year = new Date().getFullYear();
    for(i = year; i >=  1800; i--){
        $('select#anno').append('<option value="'+i+'">'+i+'</option>');
    }

    var stickyNavTop = $('#secondnav').offset().top;

    var stickyNav = function(){
        var scrollTop = $(window).scrollTop();
        if (scrollTop > stickyNavTop) {
            $('#secondnav').addClass('sticky');
        } else {
            $('#secondnav').removeClass('sticky');
        }
    };

    stickyNav();

    $(window).scroll(function() {
        stickyNav();
    });

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

    $('#modalAnnotCit').draggable({
        handle: ".modal-content"
    });

    $('#modalAnnotDoc').on('hide.bs.modal', function(e){
        $('#selectTipoAnnot').val('');
        $('#insertAutore').css('display', 'none');
        $('#insertAnnoPub').css('display', 'none');
        $('#insertTitolo').css('display', 'none');
        $('#insertURL').css('display', 'none');
        $('#insertDOI').css('display', 'none');
        $('#insertComm').css('display', 'none');
        $('#insertfunzRet').css('display', 'none');
    });

    $('#modalAnnotDoc').draggable({
        handle: ".modal-content"
    });

    $('#selectTipoAnnot').change(function(){
        var annot = $(this).val();
        switch (annot) {
            case "autore":
                $('#insertAutore').css('display', 'block');
                $('#insertAnnoPub').css('display', 'none');
                $('#insertTitolo').css('display', 'none');
                $('#insertURL').css('display', 'none');
                $('#insertDOI').css('display', 'none');
                $('#insertComm').css('display', 'none');
                $('#insertfunzRet').css('display', 'none');
                $('#salvaInsert').removeAttr('disabled', 'disabled');
                break;
            case "anno":
                $('#insertAutore').css('display', 'none');
                $('#insertAnnoPub').css('display', 'block');
                $('#insertTitolo').css('display', 'none');
                $('#insertURL').css('display', 'none');
                $('#insertDOI').css('display', 'none');
                $('#insertComm').css('display', 'none');
                $('#insertfunzRet').css('display', 'none');
                $('#salvaInsert').removeAttr('disabled', 'disabled');
                break;
            case "titolo":
                $('#insertAutore').css('display', 'none');
                $('#insertAnnoPub').css('display', 'none');
                $('#insertTitolo').css('display', 'block');
                $('#insertURL').css('display', 'none');
                $('#insertDOI').css('display', 'none');
                $('#insertComm').css('display', 'none');
                $('#insertfunzRet').css('display', 'none');
                $('#salvaInsert').removeAttr('disabled', 'disabled');
                break;
            case "url":
                $('#insertAutore').css('display', 'none');
                $('#insertAnnoPub').css('display', 'none');
                $('#insertTitolo').css('display', 'none');
                $('#insertURL').css('display', 'block');
                $('#insertDOI').css('display', 'none');
                $('#insertComm').css('display', 'none');
                $('#insertfunzRet').css('display', 'none');
                $('#salvaInsert').removeAttr('disabled', 'disabled');
                break;
            case "doi":
                $('#insertAutore').css('display', 'none');
                $('#insertAnnoPub').css('display', 'none');
                $('#insertTitolo').css('display', 'none');
                $('#insertURL').css('display', 'none');
                $('#insertDOI').css('display', 'block');
                $('#insertComm').css('display', 'none');
                $('#insertfunzRet').css('display', 'none');
                $('#salvaInsert').removeAttr('disabled', 'disabled');
                break;
            case "commento":
                $('#insertAutore').css('display', 'none');
                $('#insertAnnoPub').css('display', 'none');
                $('#insertTitolo').css('display', 'none');
                $('#insertURL').css('display', 'none');
                $('#insertDOI').css('display', 'none');
                $('#insertComm').css('display', 'block');
                $('#insertfunzRet').css('display', 'none');
                $('#salvaInsert').removeAttr('disabled', 'disabled');
                break;
            case "funzione":
                $('#insertAutore').css('display', 'none');
                $('#insertAnnoPub').css('display', 'none');
                $('#insertTitolo').css('display', 'none');
                $('#insertURL').css('display', 'none');
                $('#insertDOI').css('display', 'none');
                $('#insertComm').css('display', 'none');
                $('#insertfunzRet').css('display', 'block');
                $('#salvaInsert').removeAttr('disabled', 'disabled');
                break;
            case "":
                $('#insertAutore').css('display', 'none');
                $('#insertAnnoPub').css('display', 'none');
                $('#insertTitolo').css('display', 'none');
                $('#insertURL').css('display', 'none');
                $('#insertDOI').css('display', 'none');
                $('#insertComm').css('display', 'none');
                $('#insertfunzRet').css('display', 'none');
                $('#salvaInsert').attr('disabled', 'disabled');
                break;
        }
   });

   function citazioniWidget(lista_cit){

        var cit = '';
        $('#modalAnnotCit div.modal-body').html('<form><div class="form-group" id="insertCit"><label for="selectCit">Scegli un riferimento bibliografico</label>'
                                   + '<select class="form-control" id="selectCit"><option value=""></option></select></div></form>');
         for(i = 0; i < lista_cit.length; i++){
         if(lista_cit[i].cit.length > 50){
            cit = lista_cit[i].cit.substring(0, 50)+'...';
         } else {
            cit = lista_cit[i].cit;
         }
            $('#selectCit').append('<option value="">'+cit+'</option>');
         }
   };

    function getCitazioni(urlDoc){
        //var urlDoc = 'http://www.dlib.org/dlib/november14/brook/11brook.html';
        $.ajax({
            url: '/scrapingCitazioni',
            type: 'GET',
            data: {url: urlDoc},
            success: function(result) {
                lista_cit = JSON.parse(result);
                if(lista_cit.length > 0){
                    citazioniWidget(lista_cit)
                } else {
                $('#modalAnnotCit div.modal-body').html('<div class="alert alert-warning alert-dismissible" role="alert">'
                              +'<strong>Attenzione!</strong> Nessuna citazione presente.'
                            +'</div>');
                }
//                alert(result);
            },
            error: function(error) {
                alert("Error: " + error);
            }
        });
    }

    $('#buttonCit').click(function(){
        var id = $("ul.nav.nav-tabs li.active a").attr("id");
        if(id != 'homeTab'){
            getCitazioni(id);
        }
    });


    /* Chiamata ajax per ottenere il documento selezionato */
    $(document).on("click", "a.list-group-item", function(){
        var urlDoc = $(this).attr('value');

        if(isOpen(urlDoc)){
            $("ul.nav.nav-tabs a[id='" + urlDoc + "']").tab("show");
        }else{
            var numTabs = $("ul.nav.nav-tabs").children().length;
            if(numTabs <= 4){
                var title = $(this).text()
                $(this).addClass("active").siblings().removeClass("active");
                $.ajax({
                    url: '/scrapingSingoloDocumento',
                    type: 'GET',
                    data: {url: urlDoc},
                    success: function(result) {
                        addTab(result, urlDoc, title);
                    },
                    error: function(error) {
                        alert("Error: " + error);
                    }
                });
            }else{
                alert("Puoi aprire 4 documenti contemporaneamente.")
            }
        }
    });
    
    function lanciaScraper() {
        alert("ciao");
        var urlDoc = "http://almatourism.unibo.it/article/view/5290?acceptCookies=1";
        $.ajax({
            url: '/scrapingAutomatico',
            type: 'GET',
            data: {url: urlDoc},
            success: function(result) {
                alert(result,urlDoc);
            },
            error: function(error) {
                alert("Error2222: " + error);
            }
        });

        return "";
    }

    $('#buttonScraper').click(function(){
        var href = $("ul.nav.nav-tabs li.active a").attr("id");
        lanciaScraper(href);
    });
    
});

/* Funzioni per la gestione delle tab in cui visualizzare i documenti */
function isOpen(url){
    var res = false;
    $("ul.nav.nav-tabs").children().each(function() {
        if(url == $(this).children().attr("id")){
            res = true;
            return res;
        }
    });
    return res;
}
function addTab(text, urlP, title){
    $('.active').removeClass('active');
    var url = urlP.replace(/([/|_.|_:|_-])/g, '');
    $("ul.nav.nav-tabs").append("<li class='active'><a data-toggle='tab' href='#"+url+"' id='"+urlP+"'><label>"+title+"</label><span class='glyphicon glyphicon-remove' title='Chiudi' onclick='closeTab(this)'></span></a></li>");
    $("div.tab-content").append("<div class='tab-pane fade active in' id='"+url+"'><div id='"+url+"t'></div></div>");
    $("#"+url+"t").html(text);
}
function closeTab(element){
    var tabContentId = $(element).parent().attr("href");
    $(element).parent().parent().remove(); //remove li of tab
    $(tabContentId).remove(); //remove respective tab content
    $('ul.nav.nav-tabs a:last').tab('show'); // Select first tab
}


function mostraAnnotGruppo(element){
    $(element).addClass("active").siblings().removeClass("active");
}