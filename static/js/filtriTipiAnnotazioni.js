$(document).ready(function() {

    $('#toggleTitolo').change(function() {
        if ($("#toggleTitolo").prop('checked')) {
            $(".highlightTitle").css("background-color", "#48D1CC");
        }else{
            $('#toggleTitolo').prop('checked', false);
            $(".highlightTitle").css("background-color", "White");
        }
    });

      $('#toggleURL').change(function() {
        if ($("#toggleURL").prop('checked')) {
            $(".highlightURL").css("background-color", "#008080");
        }else{
            $('#toggleURL').prop('checked', false);
            $(".highlightURL").css("background-color", "White");
        }
    });

    $('#toggleAutore').change(function() {
        if ($("#toggleAutore").prop('checked')) {
            $(".highlightAuthor").css("background-color", "#ffd700");
        }else{
            $('#toggleAutore').prop('checked', false);
            $(".highlightAuthor").css("background-color", "White");
        }
    });

    $('#toggleAnnoP').change(function() {
        if ($("#toggleAnnoP").prop('checked')) {
            $(".highlightPublicationYear").css("background-color", "#ff934d");
        }else{
            $('#toggleAnnoP').prop('checked', false);
            $(".highlightPublicationYear").css("background-color", "White");
        }
    });

    $('#toggleDOI').change(function() {
        if ($("#toggleDOI").prop('checked')) {
            $(".highlightDOI").css("background-color", "#DC143C");
        }else{
            $('#toggleDOI').prop('checked', false);
            $(".highlightDOI").css("background-color", "White");
        }
    });

    $('#toggleFunzRet').change(function() {
        if ($("#toggleFunzRet").prop('checked')) {
            $(".highlightDenotesRhetoric").css("background-color", "#bfff80");
        }else{
            $('#toggleFunzRet').prop('checked', false);
            $(".highlightDenotesRhetoric").css("background-color", "White");
        }
    });

    $('#toggleCit').change(function() {
        if ($("#toggleCit").prop('checked')) {
            $(".highlightCites").css("background-color", "#d29aaf");
            $(".highlightMultiple").css("background-color", "#dae0e6");
        }else{
            $('#toggleCit').prop('checked', false);
            $(".highlightCites").css("background-color", "White");
            $(".highlightMultiple").css("background-color", "White");
        }
    });

    $('#toggleComm').change(function() {
        if ($("#toggleComm").prop('checked')) {
            $(".highlightComment").css("background-color", "#ffdd99");
        }else{
            $('#toggleComm').prop('checked', false);
            $(".highlightComment").css("background-color", "White");
        }
    });

});

function filtriAttivi(){
    $('#toggleTitolo').prop('checked', true);
    $('#toggleURL').prop('checked', true);
    $('#toggleAutore').prop('checked', true);
    $('#toggleAnnoP').prop('checked', true);
    $('#toggleDOI').prop('checked', true);
    $('#toggleFunzRet').prop('checked', true);
    $('#toggleCit').prop('checked', true);
    $('#toggleComm').prop('checked', true);
}

$( document ).ready(function() {
    filtriAttivi();
});