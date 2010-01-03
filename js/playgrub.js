Playgrub = {
    PGHOST: 'http://localhost:8080/',
    VERSION: '0.9.3',
    playlist: {},
    client: {},
    player: {},
    source: {},
    bookmarklet: {},
    content: {}
};

Playgrub.Events = {

    // Playgrub init
    init: function() {
        // new Playgrub.Playlist();
        // new Playgrub.ScraperSource();
        // new Playgrub.RemoteSource();
        // new Playgrub.Client();
        // new Playgrub.Bookmarklet();
        // new Playgrub.Content();
    },

    // no scraper found for this domain
    noScraper: function() {
        // Playgrub.container.set_status("This site is currently not supported by Playgrub");
    },

    // scraper found but there were no songs
    noSongs: function() {
        // Playgrub.container.set_status(Playgrub.source.error);
    },

    // scraper done finding songs
    foundSongs: function() {
        // Playgrub.playlist.url = window.location;
        // Playgrub.playlist.title = document.title;

        // write to playgrub server
        // Playgrub.client.write_playlist(Playgrub.playlist);

    },

    // Playgrub.client has set the playlist.id
    setPlaylistId: function() {
    },

    // Playgrub.client is done broadcasting playlist
    clientPlaylistPublished: function() {
        // Post to Twitter
        // Playgrub.Util.inject_script(Playgrub.PGHOST+'twitter_post?playlist='+Playgrub.playlist.id);

        // Playgrub.container.playlist_loaded();
    },

    // Playgrub.client is broadcasting a playlist track
    clientTrackPublished: function() {
        // Playgrub.container.track_broadcast();
    }
};

Playgrub.Playlist = function() {
    Playgrub.playlist = this;
};

Playgrub.Playlist.prototype = {
    id: '',
    title: '',
    url: '',
    xspf: '',
    tracks: [],

    add_track: function(artist, song) {
        this.tracks.push([artist, song]);
    },

    clear_tracks: function() {
        this.tracks.length = 0;
    },

    set_title: function(title) {
        this.title = title;
    },

    set_empty_title: function(title) {
        if(this.title == '')
            this.title = title;
    },

    to_html: function() {
        var html ='';
        html = html+'<div class=\'playgrub-playlist\'>';
        for (var i in this.tracks) {
            if(this.tracks[i][0] && this.tracks[i][1])
                html = html+'<div class=\'playgrub-playlist-track\'>'+decodeURIComponent(this.tracks[i][0])+' - '+decodeURIComponent(this.tracks[i][1])+'</div>';
        }
        html = html+'</div>';

        return html;
    },

    xspf_url: function() {
        if(this.id != '')
            return Playgrub.PGHOST+this.id+".xspf";
        else if(this.xspf != '')
            return this.xspf;
        // no xspf url for some reason
        return false;
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
    };

    this.header_callback = function(id) {
        Playgrub.playlist.id = id;
        Playgrub.Events.setPlaylistId();
        Playgrub.client.broadcast_index++;
        Playgrub.client.write_playlist(Playgrub.playlist);
    }
};

Playgrub.Sidebar = function() {
    Playgrub.container = this;

    this.title = '';
    this.url = '';
    this.playlists = [];
    this.playlist_index = 0;
    if($('#playgrub-bookmarklet').length < 1) {
        Playgrub.Util.inject_css(Playgrub.PGHOST+'css/sidebar.css');
        Playgrub.Util.inject_css(Playgrub.PGHOST+'css/player.css');
        $('body').prepend(this.base_html());
    }
};

Playgrub.Sidebar.prototype = {
    base_html: function() {
        return "<div id='playgrub-bookmarklet'>"
        +"<div id='playgrub-bookmarklet-background'></div>"
        +"<div id='playgrub-bookmarklet-body'>"
        +"<div id='playgrub-bookmarklet-header'>"
        +"<span id='playgrub-playlist-title' class='playgrub-clickable'><a href='"+this.url+"' target='_blank'>"+this.title+"</a></span>"
        +"<div id='playlist-nav-buttons'>"
        +"<div id='playgrub-previous' class='playgrub-clickable playgrub-title-nav' onclick='Playgrub.container.previous_playlist(); return false;'>"
        +"&lt;"
        +"</div>"
        +"<div id='playgrub-next' class='playgrub-clickable playgrub-title-nav' onclick='Playgrub.container.next_playlist(); return false;'>"
        +"&gt;"
        +"</div>"
        +"</div>"
        +"</div>"
        +"<div id='playgrub-bookmarklet-content'>"
        +"<div id='playgrub-player-frame'></div>"
        +"</div>"
        +"</div>"
        +"</div>";
    },

    playlist_loaded: function() {
        this.set_title(Playgrub.playlist.title, Playgrub.playlist.url);
        this.update_playlist_nav();
    },

    track_broadcast: function() {
    },

    set_title: function(title, url) {
        this.title = title;
        this.url = url;
        this.update_title();
    },

    update_title: function() {
        var title_html = "<a class='permalink' href='#xspf="+Playgrub.PGHOST+"latest?url="+encodeURIComponent(this.url)+"' title='Permalink to the latest version of this playlist'>&#9835;</a> <a href='"+this.url+"' target='_blank'>"+this.title+"</a>";
        $('#playgrub-playlist-title').html(title_html);
    },

    update_playlist_nav: function() {
        if(this.playlist_index == this.playlists.length-1) {
            $('#playgrub-next').removeClass('playgrub-nav-active');
        } else {
            $('#playgrub-next').addClass('playgrub-nav-active');
        }

        if(this.playlist_index == 0) {
            $('#playgrub-previous').removeClass('playgrub-nav-active');
        } else {
            $('#playgrub-previous').addClass('playgrub-nav-active');
        }
    },

    load_playlist: function(index) {
        if(index < this.playlists.length && index >= 0) {
            this.playlist_index = index;
            Playdar.client.cancel_resolve();
            $('#playgrub-playlist-title').html("");
            Playgrub.content.clear_playlist();
            new Playgrub.XSPFSource(this.playlists[index]);
            document.location.hash = 'xspf='+this.playlists[index];
            this.update_playlist_nav();
        }
    },

    next_playlist: function() {
        if(this.playlist_index < this.playlists.length-1) {
            this.load_playlist(++this.playlist_index);
        }
    },

    previous_playlist: function() {
        if(this.playlist_index > 0) {
            this.load_playlist(--this.playlist_index);
        }
    }
}

Playgrub.Standalone = function() {
    Playgrub.container = this;
    Playgrub.Util.inject_css(Playgrub.PGHOST+'css/standalone.css');
    $('body').prepend(this.base_html);
};

Playgrub.Standalone.prototype = {
    base_html: "<div id='playgrub-bookmarklet'>"
        +"<div id='playgrub-bookmarklet-background'></div>"
        +"<div id='playgrub-bookmarklet-body'>"
        +"<div id='playgrub-bookmarklet-header'>"
        +"<span class='playgrub-clickable' onclick='window.open(\""+Playgrub.PGHOST+"\")'><img src=\'"+Playgrub.PGHOST+"images/logo-sm.gif\' /></span>"
        +"</div>"
        +"<div id='playgrub-bookmarklet-content'>"
        +'<iframe id=\'playgrub-server-iframe\' name=\'playgrub-server-iframe\' scrolling=\'no\' src=\''+Playgrub.PGHOST+'bookmarklet_iframe?\'></iframe>'
        +"</div>"
        +"</div>"
        +"</div>",

    iframe_loaded: function() {
        var iframe = window.frames['playgrub-server-iframe'];
        iframe.postMessage(Playgrub.Util.JSONstringify(Playgrub.playlist), '*');
        $("#playgrub-bookmarklet-content").slideDown("normal", function(){ });
    },

    playlist_loaded: function() {
        // playlist loaded, setup iframe
        var iframe = window.frames['playgrub-server-iframe'];
        // TODO check to see if iframe is ready for postMessage with src # polling
        if(typeof(iframe.postMessage) != undefined) {
            setTimeout(Playgrub.container.iframe_loaded, 2000);
        }

        // set the document title to the playlist title
        document.title = 'Playgrub - '+Playgrub.playlist.title;
    },

    track_broadcast: function() {
    }
}

Playgrub.Bookmarklet = function() {
    Playgrub.container = this;

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
        +"<div id='playgrub-bookmarklet-close' class='playgrub-clickable' onclick='$(\"#playgrub-bookmarklet\").hide(); return false;'>"
        +"close"
        +"</div>"
        +"<span class='playgrub-clickable' onclick='window.open(\""+Playgrub.PGHOST+"\")'><img src=\'"+Playgrub.PGHOST+"images/logo-sm.gif\' /></span>"
        +"</div>"
        +"<div id='playgrub-bookmarklet-content'>"
        +'<iframe id=\'playgrub-server-iframe\' name=\'playgrub-server-iframe\' scrolling=\'no\' src=\''+Playgrub.PGHOST+'bookmarklet_iframe?\'></iframe>'
        +"</div>"
        +"<div id='playgrub-bookmarklet-status'></div>"
        +"</div>"
        +"</div>",

    iframe_loaded: function() {
        var iframe = window.frames['playgrub-server-iframe'];
        var jplaylist = Playgrub.Util.JSONstringify(Playgrub.playlist);
        iframe.postMessage(jplaylist, '*');
        Playgrub.container.hide_status();
        $("#playgrub-bookmarklet-content").slideDown("normal", function(){ });
    },

    playlist_loaded: function() {
        // playlist loaded, setup iframe
        var iframe = window.frames['playgrub-server-iframe'];
        // TODO check to see if iframe is ready for postMessage with src # polling
        if(typeof(iframe.postMessage) != undefined) {
            setTimeout(Playgrub.container.iframe_loaded, 2000);
        }
    },

    track_broadcast: function() {
    },

    set_status: function(new_status) {
        $("#playgrub-bookmarklet-status").html(new_status);
    },

    show_status: function(new_status) {
        $("#playgrub-bookmarklet-status").show();
    },

    hide_status: function(new_status) {
        $("#playgrub-bookmarklet-status").hide();
    }

};

Playgrub.Content = function() {
    Playgrub.content = this;

    this.show_resolved_only = false;

    // cache button hover states
    new Image().src = '/images/Play_btn-hover.png';
    new Image().src = '/images/Play_next_btn-hover.png';
    new Image().src = '/images/Pause_btn.png';
    new Image().src = '/images/Pause_btn-hover.png';
    new Image().src = '/images/Playable_btn-hover.png';


    this.base_html = function() {
        return ""
        +"<div id='playgrub-player-content'><div id='playgrub-playlist-frame'></div></div>"
        +"<div id='playgrub-playdar-frame'>"
        +"<div id='playgrub-playdar-status'></div>"
        +"<div id='playgrub-playdar-loading'></div>"
        +"</div>";
    };

    this.playlist_html = function() {
        return ""
        +"<div id='playgrub-bookmarklet-buttons'>"
        +"<span class='playgrub-clickable playgrub-button playgrub-bookmarklet-play-button'>"
        +"</span>"
        +"<span class='playgrub-clickable playgrub-button playgrub-bookmarklet-next-button'>"
        +"</span>"
        +"<span class='playgrub-clickable playgrub-button playgrub-tracks-toggle' "
        +"onClick='Playgrub.content.toggle_tracks();'>"
        +"</span>"
        +"<span>"
        +this.clippy_embed()
        +"</span>"
        +"</div>"
        +"<div id='playgrub-bookmarklet-links'>"
        +"<span style='margin-right: 10px;'>More:</span>"
        +"<span class='playgrub-clickable playgrub-link' onClick='window.open(\""+Playgrub.Util.playlick_link(Playgrub.playlist.xspf_url())+"\");'>Playlick</span>"
        +"<span class='playgrub-clickable playgrub-link' onClick='window.open(\""+Playgrub.Util.spiffdar_link(Playgrub.playlist.xspf_url())+"\");'>Spiffdar</span>"
        +"<span class='playgrub-clickable playgrub-link' onClick='window.open(\""+Playgrub.playlist.xspf_url()+"\");'>Download XSPF</span>"
        +"</div>";
    };

    this.clippy_embed = function() {
        return ''
        +'<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"'
        +'width="190" height="34" id="clippy" >'
        +'<param name="movie" value="static/clippy.swf"/>'
        +'<param name="allowScriptAccess" value="always" />'
        +'<param name="quality" value="high" />'
        +'<param name="scale" value="noscale" />'
        +'<param NAME="FlashVars" value="text='+Playgrub.PGHOST+'#xspf='+Playgrub.playlist.xspf_url()+'">'
        +'<param name="wmode" value="transparent">'
        +'<embed src="static/clippy.swf" '
        +'width="190" height="34" '
        +'name="clippy" quality="high" allowScriptAccess="always" '
        +'type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"'
        +'FlashVars="text='+Playgrub.PGHOST+'#xspf='+Playgrub.playlist.xspf_url()+'"'
        +'wmode="transparent"'
        +'/>'
        +'</object>';
    }

    this.display_playlist = function() {
        this.clear_playlist();
        this.display_playdar_status(Playgrub.player.playdar_status);
        $('#playgrub-playlist-frame').html(Playgrub.playlist.to_html());

        // set ui to show or hide unresolved songs
        if(this.show_resolved_only) {
            $('.playgrub-playlist-track').hide();
            $(".playgrub-tracks-toggle").addClass("playgrub-tracks-toggle-on");
            $(".playgrub-tracks-toggle").removeClass("playgrub-tracks-toggle");
        } else {
            $(".playgrub-tracks-toggle-on").addClass("playgrub-tracks-toggle");
            $(".playgrub-tracks-toggle-on").removeClass("playgrub-tracks-toggle-on");
        }

        // setup play button
        $('.playgrub-bookmarklet-play-button').unbind('click').click(function() {
            Playgrub.player.play_playlist(); // TODO fix this
        });

        // setup next button
        $('.playgrub-bookmarklet-next-button').unbind('click').click(function() {
            Playgrub.player.play_next(); // TODO fix this
        });

    };

    this.clear_playlist = function() {
        $('#playgrub-playlist-frame').html('');
    };

    this.display_playdar_status = function(pstatus) {
        $('#playgrub-playdar-status').html(pstatus);
    };

    this.playdar_active = function() {
        $('#playgrub-playdar-loading').html("<img src='"+Playgrub.PGHOST+"images/loading.gif' style='border: 0px;' />");
    };

    this.playdar_idle = function() {
        $('#playgrub-playdar-loading').html("");
    };

    this.show_all_tracks = function() {
        $('div.playgrub-playlist-track').show()
    };

    this.hide_unresolved_tracks = function() {
        $('div.playgrub-playlist-track').hide()
        $('div.playgrub-playlist-track-resolved').show()
    };

    this.toggle_tracks = function() {
        if(this.show_resolved_only) {
            $(".playgrub-tracks-toggle-on").addClass("playgrub-tracks-toggle");
            $(".playgrub-tracks-toggle-on").removeClass("playgrub-tracks-toggle-on");
            this.show_all_tracks();
            this.show_resolved_only = false;
        } else {
            $(".playgrub-tracks-toggle").addClass("playgrub-tracks-toggle-on");
            $(".playgrub-tracks-toggle").removeClass("playgrub-tracks-toggle");
            this.hide_unresolved_tracks();
            this.show_resolved_only = true;
        }
    };

    this.toggle_play_button = function(current_track) {
        if ($('.playgrub-bookmarklet-play-button').hasClass('playgrub-button-active') &&
            current_track.hasClass('playgrub-playlist-track-playing')) {

            $('.playgrub-bookmarklet-play-button').removeClass('playgrub-button-active');
        } else {
            $('.playgrub-bookmarklet-play-button').addClass('playgrub-button-active');
        }
    }

    $('#playgrub-player-frame').html('');
    $('#playgrub-player-frame').append(Playgrub.content.base_html());
    $('#playgrub-player-content').prepend(Playgrub.content.playlist_html());
},

Playgrub.XSPFSource = function(xspf_url) {
    Playgrub.source = this;

    this.start = function(data) {
        var jspf = eval("("+xml2json(data,'')+")");
        var jplaylist = jspf.playlist;
        Playgrub.playlist.clear_tracks();
        Playgrub.playlist.url = jplaylist.info;
        Playgrub.playlist.xspf = Playgrub.source.url;
        Playgrub.playlist.title = jplaylist.title;
        // Playgrub.playlist.id = rplaylist.id;
        for(n in jplaylist.trackList.track) {
            Playgrub.playlist.add_track(jplaylist.trackList.track[n].creator,jplaylist.trackList.track[n].title);
        }
        Playgrub.Events.foundSongs();
    };

    this.url = xspf_url;
    // make sure js/xml2json.js is loaded in whatever called this constructor
    // $.get(this.url, function(data){ Playgrub.source.start(data); });
    $.ajax({
        type: "GET",
        url: this.url,
        dataType: 'xml',
        error: function (xhr, textStatus, errorThrown) {
            alert('Bad XSPF. Please check your URL. ');
        },
        success: function(data) {
            Playgrub.source.start(data);
        }
    });


};

Playgrub.XSPFSource.prototype = {
    url: ''
};

Playgrub.RemoteSource = function() {
    Playgrub.source = this;

    this.start = function(e) {
        Playgrub.playlist.clear_tracks();
        var rplaylist = Playgrub.Util.JSONparse(e.data);
        Playgrub.playlist.id = rplaylist.id;
        Playgrub.playlist.xspf = rplaylist.xspf;
        Playgrub.playlist.url = rplaylist.url;
        Playgrub.playlist.title = rplaylist.title;
        Playgrub.playlist.tracks = eval(rplaylist.tracks);
        Playgrub.Events.foundSongs();
    };

    window.addEventListener("message", function(e) { Playgrub.source.start(e); }, false);
}

Playgrub.ScraperSource = function() {
    Playgrub.source = this;

    Playgrub.Util.inject_script(Playgrub.PGHOST+'scraper.js?url='+encodeURIComponent(window.location));

    this.start = function() {
        var regex = new RegExp(this.url);
        if(this.scrape && regex.exec(window.location)) {
            this.scrape();
            if(Playgrub.playlist.tracks.length > 0){
                Playgrub.playlist.url = ''+window.location+'';
                Playgrub.playlist.set_empty_title(document.title);
                Playgrub.Events.foundSongs();
                return true;
            }
        }
        Playgrub.Events.noSongs();
        return false;
    }

};

Playgrub.ScraperSource.prototype = {
    url: '',
    error: '',
    scrape: null
};

Playgrub.Player = function() {
    Playgrub.player = this;
};

Playgrub.Player.prototype = {
    playdar_status: '',

    resolve_current_playlist: function() {
        Playgrub.player.stop_current();
        $('div.playgrub-playlist-track').click(Playgrub.player.play_track);
        // look for tracks on playdar if authed
        if(Playdar.client && Playdar.client.is_authed() && Playgrub.playlist && Playgrub.playlist.tracks.length > 0) {
            for (var i in Playgrub.playlist.tracks) {
                Playdar.client.resolve(Playgrub.playlist.tracks[i][0], Playgrub.playlist.tracks[i][1]);
            }
        }
    },

    resolved_track: function(artist, track, sid) {
        var track_key = artist+' - '+track;
        $('div.playgrub-playlist-track').each(function(i) {
            if($(this).text() == track_key) {
                $(this).addClass('playgrub-playlist-track-resolved');
                $(this).append("<span class='playgrub-playlist-track-sid'>"+sid+"</span>");
                $(this).show();
            }
        });
        //$("div.playgrub-playlist-track:contains('"+response.query.artist+" - "+response.query.track+"')").css('text-decoration','underline');
    },

    play_track: function() {
        if(!$(this).hasClass('playgrub-playlist-track-resolved')) {
            var keywords = $(this).text().replace(/-/g,'\+');
            window.open('http://www.amazon.com/gp/search?ie=UTF8&keywords='+keywords+'&tag=playgrub-20&index=digital-music&linkCode=ur2&camp=1789&creative=9325');
            return false;
        }
        // toggle play button
        Playgrub.content.toggle_play_button($(this));

        $('.playgrub-playlist-track-playing').removeClass('playgrub-playlist-track-playing');
        $(this).addClass('playgrub-playlist-track-playing');
        sid = $(this).children(".playgrub-playlist-track-sid").text();
        // alert(Playdar.client.get_stream_url(sid));
        Playdar.player.play_stream(sid);

    },

    play_next: function() {
        var found_playable = false;

        if($('.playgrub-playlist-track-playing').length == 0) {
            this.play_playlist();
            return false;
        } else {
            $('.playgrub-playlist-track-playing').nextAll().each(function(){
                if($(this).hasClass('playgrub-playlist-track-resolved')){
                    $(this).click();
                    found_playable = true;
                    return false;
                }
            });
        }

        if(!found_playable) {
            this.stop_current();
            $('.playgrub-playlist-track-playing').removeClass('playgrub-playlist-track-playing');
        }
    },

    play_playlist: function() {

        // if there aren't any songs playing, play first resolved
        if ($('.playgrub-playlist-track-playing').length == 0) {
            if (('.playgrub-playlist-track-resolved').length > 0)
                $('.playgrub-playlist-track-resolved:first').click();
        } else {
            $('.playgrub-playlist-track-playing').click();
        }
    },

    stop_current: function() {
        $('.playgrub-bookmarklet-play-button').removeClass('playgrub-button-active');
        if(Playdar.player)
            Playdar.player.stop_current(false);
    },

    setup_playdar: function() {
        Playdar.USE_STATUS_BAR = false;
        Playdar.MAX_CONCURRENT_RESOLUTIONS = 15;
        Playdar.MAX_POLLS = 6;
        Playdar.auth_details.receiverurl = Playgrub.PGHOST+'static/playdar_auth.html';
        Playdar.setupClient({

            onStat: function (detected) {
                if (detected) {
                    if (!detected.authenticated) {
                        var connect_link = Playdar.client.get_auth_link_html('Connect to Playdar');
                        Playgrub.player.playdar_status = connect_link;
                        Playgrub.content.display_playdar_status(connect_link);
                    }
                } else {
                    var playdar_not = "<a href='http://www.playdar.org/download/' target='_blank'>Playdar not available</a>";
                    Playgrub.player.playdar_status = playdar_not;
                    Playgrub.content.display_playdar_status(playdar_not);
                }
            },

            // Called when the browser is authorised to query Playdar.
            onAuth: function () {
                Playgrub.player.playdar_status = Playdar.client.get_disconnect_link_html('Disconnect from Playdar');
                if(typeof(Playgrub.content) != 'undefined')
                    Playgrub.content.display_playdar_status(Playdar.client.get_disconnect_link_html('Disconnect from Playdar'));
                Playgrub.player.resolve_current_playlist();
            },

            // Called in response to each poll with the results so far.
            onResults: function (response, lastPoll) {
                Playgrub.content.playdar_active();
                if (lastPoll) {
                    // Take a look at the final response.
                    if(response.results.length > 0) {
                        // alert('results-> '+response.results.length+' artist ->'+response.query.artist+' track-> '+response.query.track);
                        Playdar.player.register_stream(response.results[0],{
                            onfinish: function() {
                                Playgrub.player.play_next();
                            },

                            onload: function() {
                                if (this.readyState == 2) { // failed/error
                                    // removed resolved for this track?
                                    $('.playgrub-playlist-track-playing').removeClass('playgrub-playlist-track-resolved');
                                    $('.playgrub-playlist-track-playing').click(function(){});
                                    Playgrub.player.play_next();
                                }
                            }
                        });
                        Playgrub.player.resolved_track(response.query.artist, response.query.track, response.results[0].sid);
                    }
                }
            },

            onResolveIdle: function() {
                Playgrub.content.playdar_idle();
            }

        });

        soundManager.onload = function () {
            Playdar.setupPlayer(soundManager);
            // start Playdar
            Playdar.client.go();
        };
    }
};

Playgrub.Util = {

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

    load_remotes: function(remotes, callback) {
        var index = 0;
        var remotes_callback = function() {
            if(index == remotes.length){
                callback();
            } else {
                Playgrub.Util.load_remote(remotes[index][0], remotes[index][1], remotes_callback);
                index++;
            }
        };
        remotes_callback();
    },

    load_remote: function(object_type, remote_url, callback) {
        Playgrub.Util.inject_script(remote_url);
        var poll = function() { Playgrub.Util.load_remote_poll(object_type, callback); };
        setTimeout(poll, 5);
    },

    load_remote_poll: function(object_type, callback){
        if (eval('typeof('+object_type+')') == 'undefined') {
            var poll = function() { Playgrub.Util.load_remote_poll(object_type, callback); };
            setTimeout(poll, 50);
        } else {
            // document set up, start doing stuff
            callback();
        }
    },

    playlick_link: function(xspf) {
        return "http://www.playlick.com/#xspf="+xspf;
    },

    spiffdar_link: function(xspf) {
        return "http://spiffdar.org/?spiff="+encodeURIComponent(xspf);
    },

    playgrub_link: function(xspf) {
        return Playgrub.PGHOST+"player?xspf="+encodeURIComponent(xspf);
    },

    // implement JSON.stringify and JSON.parse serialization
    // from http://www.sitepoint.com/blogs/2009/08/19/javascript-json-serialization/
    JSONstringify: function (obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"'+obj+'"';
            return String(obj);
        }
        else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);
            for (n in obj) {
                v = obj[n]; t = typeof(v);
                if (t == "string") v = '"'+v.replace(/["]/g,'\\"')+'"';
                else if (t == "object" && v !== null) v = Playgrub.Util.JSONstringify(v);
                if(t != "function")
                    json.push((arr ? "" : '"' + n + '":') + String(v));
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    },

    JSONparse: function(str) {
        if (str === "") str = '""';
        try{
            eval("var p=" + str + ";");
        } catch(err) {
            alert(err);
        }
        return p;
    },

    xspf_hash: function() {
        // we need to do this because we don't want to send
        // Playgrub XSPFs through remote_xspf
        var xspf_url = '';
        if(window.location.hash) {
            hash_array = window.location.hash.split('=');
            if(hash_array.length >= 2) {
                hash_array.shift();
                xspf_value = hash_array.join('=');
                var pghost = Playgrub.PGHOST.split('/')[2];
                var pgreg = new RegExp('^http[:]\/\/'+pghost,'i');
                if(xspf_value.match(pgreg))
                    xspf_url = xspf_value;
                else
                    xspf_url = Playgrub.PGHOST+'remote_xspf?xspf='+encodeURIComponent(xspf_value);
            }
        }
        return xspf_url;
    }

};
