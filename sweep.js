// load jquery from google
// http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
function load_jquery() {
    if (typeof(jQuery) == 'undefined') {
        host='http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/';
        jquery_script=document.createElement('SCRIPT');
        jquery_script.type='text/javascript';
        jquery_script.src=host+'jquery.min.js';
        document.getElementsByTagName('head')[0].appendChild(jquery_script);
        setTimeout("after_load()",50);
    } else {
        after_load();
    }
}

function after_load() {
    if (typeof(jQuery) == 'undefined') {
        alert("jquery not loaded");
    } else {
        groove_get_songs();
    }
}

load_jquery();

function groove_get_songs() {
    $("h4").each(function (i) {
        alert($(this).html());
    });
}
