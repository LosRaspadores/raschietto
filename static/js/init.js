$( document ).ready(function() {

    //$('[data-toggle="tooltip"]').tooltip();
    $('[data-tooltip="tooltip"]').tooltip();

    $('#insertAutore').css('display', 'none');
    $('#insertAnnoPub').css('display', 'none');
    $('#insertTitolo').css('display', 'none');
    $('#insertURL').css('display', 'none');
    $('#insertDOI').css('display', 'none');
    $('#insertComm').css('display', 'none');
    $('#insertfunzRet').css('display', 'none');

    $('#salvaInsert').attr('disabled', 'disabled');

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

    $.ajax({
        url: '/scrapingGruppi',
        type: 'GET',
        success: function(result) {
            //convert json string to json object
            lista_gruppi = JSON.parse(result);
            listaGruppi(lista_gruppi);
        },
        error: function(error) {
            alert("Error: " + error);
        }
    });

    function listaGruppi(arr) {
        var out = "";
        var i;
        for(i = 0; i < arr.length; i++) {
            //out += '<input type="checkbox"/><label>' + arr[i].id + ' - ' +arr[i].nome + '</label><br>';
            out += '<a class="list-group-item" value="' + arr[i].id + '" onclick="mostraAnnotGruppo(this)">' +arr[i].nome + '</a><br>';
        }
        $('div#lista_gruppi').html(out);
        $('#numGru').html(arr.length);
    }

    $.ajax({
        url: '/scrapingDocumenti',
        type: 'GET',
        success: function(result) {
            //convert json string to json object
            lista_doc = JSON.parse(result);
            listaDocumenti(lista_doc);
        },
        error: function(error) {
            alert("Error: " + error);
        }
    });



    function listaDocumenti(arr) {
        //var out="";
        var i;
        for(i = 0; i < arr.length; i++) {
            //out += '<a class="list-group-item" value="' + arr[i].url + '" onclick="mostraDocumento(this)">' +arr[i].title + '</a><br>';
            $('div#lista_doc').append('<a class="list-group-item" value="' + arr[i].url + '" onclick="mostraDocumento(this)">' +arr[i].title + '</a><br>');
        }
       //$('div#lista_doc').html(out);
       $('#numDoc').html(arr.length);
    }

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
      addTab = function(text, url){
            var url = url.replace(/([/|_.|_:|_-])/g, '');
            $("ul.nav.nav-tabs").append("<li><a data-toggle='tab' href='#"+url+"'>Doc<button class='close closeTab' type='button' onclick='closeTab(this)'>x</button></a></li>");
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
        //alert(annot);
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

});

function getCitazioni(){
    var urlDoc = 'http://almatourism.unibo.it/article/view/5290';
    $.ajax({
        url: '/scrapingCitazioni',
        type: 'GET',
        data: {url: urlDoc},
        success: function(result) {
            alert(result);
        },
        error: function(error) {
            alert("Error: " + error);
        }
    });
}

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
    $(tabContentId).remove(); //remove respective tab content
}