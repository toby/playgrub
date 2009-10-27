PGHOST = 'http://localhost:8080/';
// PGHOST = 'http://www.playgrub.com/';

current_date = new Date();

// array of supported depots
depots = [];

// song index for playlist
broadcast_index = 0;

// regular expression escape utility method
RegExp.escape = function(str) {
    var specials = new RegExp("[.*+?|()\\[\\]{}\\\\]", "g"); // .*+?|()[]{}\
    return str.replace(specials, "\\$&");
}

// load md5 js
inject_script(PGHOST+'js/md5.js');

// load jquery - will start after_load() when done
load_jquery();

// SongDepot : object for song services
function SongDepot(d,s,e) {
    // url is regex for site
    this.url = d;
    // scrape is function to return songs [[artist, song],...]
    this.scrape = s;
    // error is user message if no songs found
    this.error = e;
    // songs get loaded with scrape function
    this.songs = [];
    // TODO playlist title
}

// loads external javascript into page
function inject_script(script) {
    // alert('script! -> '+script);
    var script_element = document.createElement('SCRIPT');
    script_element.type = 'text/javascript';
    script_element.src = script;
    document.getElementsByTagName('head')[0].appendChild(script_element);
}

// load jquery from google
// http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
function load_jquery() {
    if (typeof(jQuery) == 'undefined') {
        inject_script('http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js');
        setTimeout("after_load()",50);
    } else {
        // document set up, start doing stuff
        after_load();
    }

}

// we need this because dynamically loading jquery is not-instant
function after_load() {
    if (typeof(jQuery) == 'undefined') {
        // try again
        setTimeout("after_load()",50);
    } else {


        // create depots...

        // ----- Grooveshark ----- //

        var groove_url = 'http://widgets.grooveshark.com/add_songs';
        var groove_scrape = function() {
            var depot_songs = [];
            $("h4").each(function () {
                var song_result = $(this).html().split(" - ");
                depot_songs.push([song_result[1], song_result[0]]);
            });
            this.songs = depot_songs;
        }
        var groove_error = "You have to go to the widget building page to run this";
        var groove_depot = new SongDepot(groove_url, groove_scrape, groove_error);
        depots.push(groove_depot);


        // cycle through depots and return songs
        songs = get_songs();

        if(songs && songs.length > 0) {
            // alert('song length: '+songs.length);
            setTimeout('broadcast_songs()', 150);
            // alert("master songs-> "+songs);
        }
    }
}

function broadcast_songs() {
    // alert('song.length: '+songs.length);

    if(songs.length == 0) {
        return true;
    }

    // first song in playlist
    if(broadcast_index == 0) {
        broadcast_index = 1;
        playlist_id = MD5.hex(window.location+current_date.getTime());
    } else {
        broadcast_index++;
    }

    var data = PGHOST+'post.js?artist='+songs[0][0]+'&track='+songs[0][1]+
        '&index='+broadcast_index+'&playlist='+playlist_id;
    inject_script(data);

    songs.shift();
}

function get_songs() {
    var master_songs = [];
    // check all depots
    for(var i = 0; i < depots.length; i++) {
        // check to see if this depot's url matches the current url
        regex = new RegExp(RegExp.escape(depots[i].url)+'.*');
        if(regex.exec(window.location)) {
            // run depot's scraping function
            depots[i].scrape();
            if(depots[i].songs.length > 0) {
                // add to songs from other depots
                master_songs = master_songs.concat(depots[i].songs);
            } else {
                alert(depots[i].error);
            }
        }
    }
    return master_songs;
}

