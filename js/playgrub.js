Playgrub = {
    PGHOST: 'http://localhost:8080/',
    VERSION: '0.4',
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
        Playgrub.bookmarklet.set_status("No songs found on this page");
    },

    clientPublished: function() {
        // Playgrub.client is done broadcasting playlist
        Playgrub.bookmarklet.playlist_loaded();
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
            Playgrub.Events.clientPublished();
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
        }
    }
};

Playgrub.Bookmarklet = function() {
    Playgrub.bookmarklet = this;

    $('body').prepend(this.base_html);
    this.set_status("Loading...");
    $('#playgrub-bookmarklet-content').hide();
};

Playgrub.Bookmarklet.prototype = {
    base_html: "<div id='playgrub-bookmarklet' style='width: 100%; position: absolute; top: 0px; font-size: 16px; opacity: 0.85;"
        +"left: 0px; z-index: 10000; background: #000000; color: #ffffff; font-family: Arial,Helvetica; text-align: left;'>"
        +"<div id='playgrub-bookmarklet-header' style='padding: 15px; border-bottom: 1px solid #ffffff;'>"
        +"<div id='playgrub-bookmarklet-close' style='position: absolute; top: 15px; right: 25px; margin: 0px; border: 0px;'>"
        +"<span onclick='$(\"#playgrub-bookmarklet\").remove(); return false;' style='cursor: pointer;'>close</span>"
        +"</div>"
        +"<span onclick='window.open(\""+Playgrub.PGHOST+"\")' style='cursor: pointer;'>Playgrub</span>"
        +"</div>"
        +"<div id='playgrub-bookmarklet-content' style='padding: 15px;'></div>"
        +"<div id='playgrub-bookmarklet-status' style='padding: 5px 15px 5px 15px; font-size: 10px;'></div>"
        +"</div>",

    loaded_html: function() {
        return "Title: "+document.title
        +"<br />"
        +"<span style='cursor: pointer;' onMouseOver='style.textDecoration=\"underline\";' onMouseOut='style.textDecoration=\"none\";' "
        +"onClick='window.open(\"http://j.mp/?v=3&u="+encodeURIComponent(Playgrub.Util.playlick_link())+"&s="+encodeURIComponent(Playgrub.playlist.title)+"\");'>Share</span>"
        +"<br />"
        +"<a href='"+Playgrub.Util.playlick_link()+"' target='_blank'>&#9654; Playlick</a>"
        +"<br />"
        +"<a href='"+Playgrub.Util.spiffdar_link()+"' target='_blank'>&#9654; Spiffdar</a>"
        +"<br />"
        +"<a href='"+Playgrub.PGHOST+Playgrub.playlist.id+".xspf'>Download XSPF</a>";
    },

    playlist_loaded: function() {
        $("#playgrub-bookmarklet-content").append(this.loaded_html()).slideDown("normal", function(){
            Playgrub.bookmarklet.set_status(Playgrub.playlist.tracks.length+' tracks found');
        });
    },

    set_status: function(new_status) {
        $("#playgrub-bookmarklet-status").html(new_status);
    }
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
        var script_element = document.createElement('SCRIPT');
        script_element.type = 'text/javascript';
        script_element.src = script;
        document.getElementsByTagName('head')[0].appendChild(script_element);
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

