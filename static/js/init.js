$( document ).ready(function() {

    getGruppi();
    //getDocumenti();

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


    $(function() {
      addTab = function(text, urlP){
            var url = urlP.replace(/([/|_.|_:|_-])/g, '');
            $("ul.nav.nav-tabs").append("<li><a data-toggle='tab' href='#"+url+"' id="+urlP+" >Doc<button class='close closeTab' type='button' onclick='closeTab(this)'>x</button></a></li>");
            $("div.tab-content").append("<div class='tab-pane fade' id='"+url+"'><div id='"+url+"t'></div></div>");
            $("#"+url+"t").html(text);
       }
    });

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

        //var s = window.getSelection().toString();
});


function mostraDocumento(element){
    var urlDoc = $(element).attr('value');
    // aggiunge lo stile al div selezionato e deseleziona quello precedente
    $(element).addClass("active").siblings().removeClass("active");
    $.ajax({
        url: '/scrapingSingoloDocumento',
        type: 'GET',
        data: {url: urlDoc},
        success: function(result) {
            singoloDocumento(result, urlDoc);
        },
        error: function(error) {
            alert("Error: " + error);
        }
    });
}

function singoloDocumento(str, url){
    //$("#singoloDocumento").html(str);
    addTab(str, url);
}

function mostraAnnotGruppo(element){
        $(element).addClass("active").siblings().removeClass("active");
    }

function closeTab(element){
    var tabContentId = $(element).parent().attr("href");
    $(element).parent().parent().remove(); //remove li of tab
    $('ul.nav.nav-tabs a:last').tab('show'); // Select first tab
//    $('ul.nav.nav-tabs li:last').addClass('active');
//    $('div.tab-content div.tab-pane.fade:last').addClass('active');
    $(tabContentId).remove(); //remove respective tab content
}