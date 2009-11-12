Playgrub = {
    PGHOST: 'http://localhost:8080/',
    VERSION: '0.7',
    playlist: {},
    client: {},
    player: {},
    scraper: {},
    bookmarklet: {},

    init: function() {
        new Playgrub.Playlist();
        new Playgrub.Scraper();
        new Playgrub.Client();
        new Playgrub.Bookmarklet();
    }
};

Playgrub.Events = {

    foundSongs: function() {
        // scraper found songs
        Playgrub.playlist.url = window.location;
        Playgrub.playlist.title = document.title;
        Playgrub.client.write_playlist(Playgrub.playlist);
    },

    noScraper: function() {
        // scraper not found
        Playgrub.bookmarklet.set_status("This site is currently not supported by Playgrub");
    },

    noSongs: function() {
        // scraper found but there were no songs
        Playgrub.bookmarklet.set_status(Playgrub.scraper.error);
    },

    clientPlaylistPublished: function() {
        // Playgrub.client is done broadcasting playlist
        Playgrub.Util.inject_script(Playgrub.PGHOST+'twitter_post?playlist='+Playgrub.playlist.id);
        Playgrub.bookmarklet.playlist_loaded();
    },

    clientTrackPublished: function() {
        // Playgrub.client is broadcasting a playlist track
        Playgrub.bookmarklet.track_broadcast();
    }
};

Playgrub.Playlist = function() {
    Playgrub.playlist = this;
};

Playgrub.Playlist.prototype = {
    id: '',
    title: '',
    url: '',
    tracks: [],

    add_track: function(artist, song) {
        this.tracks.push([artist, song]);
    }
};

Playgrub.Client = function() {
    Playgrub.client = this;

    this.broadcast_index = 0;

    this.write_playlist = function(playlist) {
        var data;

        if(playlist.tracks.length == 0){
            return false;
        }

        if(this.broadcast_index > playlist.tracks.length) {
            Playgrub.Events.clientPlaylistPublished();
            return false;
        }

        if(this.broadcast_index == 0) {
            // first song in playlist, write header
            data = Playgrub.PGHOST+'playlist_header.js?songs='+playlist.tracks.length+
                '&title='+encodeURIComponent(playlist.title)+'&url='+encodeURIComponent(playlist.url);
            Playgrub.Util.inject_script(data);
        } else {
            // write current track
            data = Playgrub.PGHOST+'playlist_track.js?artist='+encodeURIComponent(playlist.tracks[this.broadcast_index-1][0])+'&track='+
                encodeURIComponent(playlist.tracks[this.broadcast_index-1][1])+'&index='+encodeURIComponent(this.broadcast_index)+'&playlist='+playlist.id;
            Playgrub.Util.inject_script(data);
            Playgrub.Events.clientTrackPublished();
        }
    }
};

Playgrub.Bookmarklet = function() {
    Playgrub.bookmarklet = this;

    Playgrub.Util.inject_css(Playgrub.PGHOST+'css/bookmarklet.css');
    $('body').prepend(this.base_html);
    this.set_status("Loading...");
    $('#playgrub-bookmarklet-content').hide();
};

Playgrub.Bookmarklet.prototype = {
    base_html: "<div id='playgrub-bookmarklet'>"
        +"<div id='playgrub-bookmarklet-background'></div>"
        +"<div id='playgrub-bookmarklet-body'>"
        +"<div id='playgrub-bookmarklet-header'>"
        +"<div id='playgrub-bookmarklet-close' class='playgrub-clickable' onclick='$(\"#playgrub-bookmarklet\").remove(); return false;'>"
        +"close"
        +"</div>"
        +"<span class='playgrub-clickable' onclick='window.open(\""+Playgrub.PGHOST+"\")'>Playgrub</span>"
        +"</div>"
        +"<div id='playgrub-bookmarklet-content'></div>"
        +"<div id='playgrub-bookmarklet-status'></div>"
        +"</div>"
        +"</div>",

    loaded_html: function() {
        return "<span class='playgrub-rounded' id='playgrub-bookmarklet-title'>"+document.title+"</span>"
        +"<div id='playgrub-bookmarklet-buttons'>"
        +"<span class='playgrub-clickable playgrub-button' onClick='window.open(\""+Playgrub.Util.playlick_link()+"\");'>"
        +"Play &#9654;"
        +"</span>"
        +"<span class='playgrub-clickable playgrub-button' "
        +"onClick='window.open(\"http://j.mp/?v=3&u="+encodeURIComponent(Playgrub.Util.playlick_link())+"&s="+encodeURIComponent(Playgrub.playlist.title)+"\");'>"
        +"Share"
        +"</span>"
        +"</div>"
        +"<div id='playgrub-bookmarklet-links'>"
        +"<span style='margin-right: 10px;'>More:</span>"
        +"<span class='playgrub-clickable playgrub-link' onClick='window.open(\""+Playgrub.Util.playlick_link()+"\");'>Playlick</span>"
        +"<span class='playgrub-clickable playgrub-link' onClick='window.open(\""+Playgrub.Util.spiffdar_link()+"\");'>Spiffdar</span>"
        +"<span class='playgrub-clickable playgrub-link' onClick='window.open(\""+Playgrub.PGHOST+Playgrub.playlist.id+".xspf\");'>Download XSPF</span>"
        +"</div>";
    },

    playlist_loaded: function() {
        $("#playgrub-bookmarklet-content").append(this.loaded_html()).slideDown("normal", function(){
            Playgrub.bookmarklet.set_status(Playgrub.playlist.tracks.length+' tracks found');
        });
    },

    track_broadcast: function() {
        Playgrub.bookmarklet.set_status('Loading... '+Playgrub.client.broadcast_index+' tracks');
    },

    set_status: function(new_status) {
        $("#playgrub-bookmarklet-status").html(new_status);
    },

};

Playgrub.Scraper = function() {
    Playgrub.scraper = this;

    Playgrub.Util.inject_script(Playgrub.PGHOST+'scraper.js?url='+encodeURIComponent(window.location));

    this.start = function() {
        var regex = new RegExp(this.url);
        if(this.scrape && regex.exec(window.location)) {
            this.scrape();
            if(Playgrub.playlist.tracks.length > 0){
                Playgrub.Events.foundSongs();
                return true;
            }
        }
        Playgrub.Events.noSongs();
        return false;
    }

};

Playgrub.Scraper.prototype = {
    url: '',
    error: '',
    scrape: null
};

Playgrub.Util = {
    jquery_injected: false,

    inject_script: function (script) {
        var script_element = document.createElement('script');
        script_element.type = 'text/javascript';
        script_element.src = script;
        document.getElementsByTagName('head')[0].appendChild(script_element);
    },

    inject_css: function (css) {
        var css_element = document.createElement('link');
        css_element.type = 'text/css';
        css_element.rel = 'stylesheet';
        css_element.href = css;
        document.getElementsByTagName('head')[0].appendChild(css_element);
    },

    load_jquery: function(){
        if (typeof(jQuery) == 'undefined') {
            if(!this.jquery_injected) {
                Playgrub.Util.inject_script('http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js');
                this.jquery_injected = true;
            }
            setTimeout("Playgrub.Util.load_jquery()",50);
        } else {
            // document set up, start doing stuff
            Playgrub.init();
        }
    },

    playlick_link: function() {
        return "http://www.playlick.com/#xspf="+Playgrub.PGHOST+Playgrub.playlist.id+".xspf";
    },

    spiffdar_link: function() {
        return "http://spiffdar.org/?spiff="+encodeURIComponent(Playgrub.PGHOST+Playgrub.playlist.id)+".xspf";
    }
};

// load jquery - will run Playgrub.init() when done
Playgrub.Util.load_jquery();

