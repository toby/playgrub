Playgrub = {
    PGHOST: 'http://localhost:8080/',
    VERSION: '0.3',
    playlist: {},
    client: {},
    player: {},
    scraper: {},

    init: function() {
        new Playgrub.Playlist();
        new Playgrub.Scraper();
        new Playgrub.Bookmarklet();
        new Playgrub.Client();
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

        if(playlist.tracks.length == 0 || this.broadcast_index > playlist.tracks.length) {
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
    this.html =  "<div id='playgrub-bookmarklet' style='width: 100%; position: absolute; padding: 15px 0px 15px 15px; top: 0px;"
        +"left: 0px; z-index: 10000; background: #000000; color: #ffffff; font-family: Arial,Helvetica;'>"
        +"<div style='position: absolute; top: 15px; right: 25px;'><a href='' id='playgrub-bookmarklet-close'>close</a></div>"
        +"Title: "+document.title
        +"<br />"
        +"Share: "+Playgrub.PGHOST+Playgrub.playlist.id+'.xspf'
        +"<br />"
        +"<a href='"+"http://www.playlick.com/#xspf="+Playgrub.PGHOST+Playgrub.playlist.id+".xspf"+"' target='_blank'>&#9654; Playlick</a>"
        +"<br />"
        +"<a href='"+"http://spiffdar.org/?spiff="+encodeURIComponent(Playgrub.PGHOST+Playgrub.playlist.id)+".xspf"+"' target='_blank'>&#9654; Spiffdar</a>"
        +"<br />"
        +"<a href='"+Playgrub.PGHOST+Playgrub.playlist.id+".xspf'>Download XSPF</a>"
        +"</div>";

    $('body').prepend(this.html);
}

Playgrub.Scraper = function() {
    Playgrub.scraper = this;

    Playgrub.Util.inject_script(Playgrub.PGHOST+'scraper.js?url='+encodeURIComponent(window.location));

    this.start = function() {
        var regex = new RegExp(this.url);
        if(this.scrape && regex.exec(window.location)) {
            this.scrape();
            // alert(Playgrub.playlist.tracks);
            if(Playgrub.playlist.tracks.length > 0)
                Playgrub.playlist.url = window.location;
                Playgrub.playlist.title = document.title;
                Playgrub.client.write_playlist(Playgrub.playlist);
        } else {
            return false;
        }
    };
}

Playgrub.Scraper.prototype = {
    url: '',
    error: '',
    scrape: null
}

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
    }
}

// load jquery - will run Playgrub.init() when done
Playgrub.Util.load_jquery();

