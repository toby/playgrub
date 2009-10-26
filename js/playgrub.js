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
// TODO load easyXDM
function load_jquery() {
    if (typeof(jQuery) == 'undefined') {
        var host = 'http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/';
        var jquery_script = document.createElement('SCRIPT');
        jquery_script.type = 'text/javascript';
        jquery_script.src = host+'jquery.min.js';
        document.getElementsByTagName('head')[0].appendChild(jquery_script);
        // find a better place to set up the terminal iframe

        setTimeout("after_load()",50);
    } else {
        // document set up, start doing stuff
        after_load();
    }

}

function load_terminal() {
    // load terminal.html iframe for listening
    var host = 'http://localhost:8080/iframe/';
    var tdiv = document.createElement('div');
    tdiv.innerHTML = '<iframe style="border: 0px; width: 0px; height: 0px;" id="playgrubterminal" src="'+host+'terminal.html"></iframe>';
    document.getElementsByTagName('body')[0].appendChild(tdiv);
    // global terminal
    terminal = document.getElementById('playgrubterminal');
    if(document.getElementById('playgrubterminal')) {
        alert('playgrubterminal: '+document.getElementById('playgrubterminal'));
    } else {
        alert("broken");
    }
}


// we need this because dynamically loading jquery is not-instant
function after_load() {
    if (typeof(jQuery) == 'undefined') {
        // try again
        setTimeout("after_load()",50);
    } else {

        // load terminal iframe to talk to playgrub.com
        load_terminal();

        // create depots...

        // ----- Grooveshark ----- //

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


        // cycle through depots and return songs
        songs = get_songs();

        if(songs && songs.length > 0) {
            for(var i = 0; i < songs.length; i++) {
                // terminal.src = terminal.src+'?artist='+songs[i][0];
            }
            alert("master songs-> "+songs);
        }
        terminal.src = terminal.src+'?artist=';
    }
}

function get_songs() {
    var master_songs = [];
    for(var i = 0; i < depots.length; i++) {
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
