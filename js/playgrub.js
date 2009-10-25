// SongDepot : object for song services
function SongDepot(d,s,e) {
    // domain is regex for site
    this.domain = d;
    // scrape is function to return songs [[artist, song],...]
    this.scrape = s;
    // error is user message if no songs foudn
    this.error = e;
    // songs get loaded with scrape function
    this.songs = [];
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
        var groove_domain = 'grooveshark.com';
        var groove_scrape = function() {
            var depot_songs = [];
            $("h4").each(function () {
                var song_result = $(this).html().split(" - ");
                depot_songs.push([song_result[1], song_result[0]]);
            });
            this.songs = depot_songs;
        }
        var groove_error = "You have to go to the widget building page to run this";
        var groove_depot = new SongDepot(groove_domain, groove_scrape, groove_error);
        depots.push(groove_depot);

        songs = get_songs();

        alert("master songs-> "+songs);
    }
}

function get_songs() {
    var master_songs = [];
    for(var i = 0; i < depots.length; i++ ) {
        depots[i].scrape();
        if(depots[i].songs.length > 0) {
            master_songs = master_songs.concat(depots[i].songs);
        } else {
            alert(depots[i].error);
        }
    }
    return master_songs;
}

load_jquery();
