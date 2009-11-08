// Last.fm Playgrub Scraper

Playgrub.scraper.url = 'http://.*last.fm.*';
Playgrub.scraper.error = "Check your Last.fm url";
Playgrub.scraper.scrape = function() {
    var all_songs = [];
    var unique_songs = {};
    $("a").filter(function() {
            var match = $(this).attr('href').match('.*\/music\/([^+][^\/]*)\/[^+][^\/]*\/([^+][^\?]*)');
            if(match) {
                var artist = match[1];
                var song = match[2];
                var uartist = unique_songs[artist];
                if(typeof(uartist) != 'undefined')
                    varvar  usong = uartist[match[2]];
                if((typeof(uartist) == 'undefined') || (typeof(usong) == 'undefined')) {
                    unique_songs[artist] = {};
                    unique_songs[artist][song] = {};
                    all_songs.push([decodeURIComponent(artist).replace(/\+/g, ' '), decodeURIComponent(song).replace(/\+/g, ' ')]);
                }
            }
        });
    this.songs = all_songs;
}

Playgrub.scraper.start();
