// SongDepot : object for song services
function SongDepot(d,s,e) {
    // domain is regex for site
    this.domain = d;
    // scrape is function to return songs [{artist,song},...]
    this.scrape = s;
    // error is user message if no songs foudn
    this.error = e;
    // TODO playlist title
}

// array of supported depots
depots = [];

// load jquery from google
// http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
function load_jquery() {
    if (typeof(jQuery) == 'undefined') {
        host = 'http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/';
        jquery_script = document.createElement('SCRIPT');
        jquery_script.type = 'text/javascript';
        jquery_script.src = host+'jquery.min.js';
        document.getElementsByTagName('head')[0].appendChild(jquery_script);
        setTimeout("after_load()",50);
    } else {
        after_load();
    }
}

// we need this because dynamically loading jquery is not-instant
function after_load() {
    if (typeof(jQuery) == 'undefined') {
        // try again
        setTimeout("after_load()",50);
    } else {
        // create depots
        groove_domain = 'grooveshark.com';
        groove_scrape = function() {
            $("h4").each(function (i) {
                alert($(this).html());
            });
        }
        groove_error = "You have to go to the widget building page to run this";
        groove_depot = new SongDepot(groove_domain, groove_scrape, groove_error);
        depots.push(groove_depot);

        look_for_songs();
    }
}

function look_for_songs() {
    for(d in depots) {
        depots[d].scrape();
    }
}

load_jquery();
