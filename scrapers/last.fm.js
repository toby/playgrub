/**
 * Last.fm Playgrub.source
 * Created by: Toby Padilla <tobypadilla AT gmail DOT com>
 * Version: 0.1
 *
 * Notes:
 *
 * This scraper will work on any Last.fm song page and only add unique songs.
 */

Playgrub.source.url = 'http://.*last.fm.*';
Playgrub.source.error = "Check your Last.fm url";
Playgrub.source.scrape = function() {
    // lots of duplicate song links, so use this to only add songs once
    var unique_songs = {};

    // some Last.fm specific escaping stuff
    var last_escape = function(escapee) {
        var escaped = decodeURIComponent(escapee);
        escaped = escaped.replace(/\+/g, ' ');
        escaped = escaped.replace(/%26/g, '&');
        return escaped;
    };

    $("a").filter(function() {
            var match = $(this).attr('href').match('.*\/music\/([^+][^\/]*)\/[^+][^\/]*\/([^+][^\?\\#\/]*)');
            if(match) {
                var artist = match[1];
                var song = match[2];
                var uartist = unique_songs[artist];
                if(typeof(uartist) != 'undefined')
                    var usong = uartist[match[2]];
                if((typeof(uartist) == 'undefined') || (typeof(usong) == 'undefined')) {
                    unique_songs[artist] = {};
                    unique_songs[artist][song] = {};
                    Playgrub.playlist.add_track(last_escape(artist), last_escape(song));
                }
            }
        });
}

Playgrub.source.start();
