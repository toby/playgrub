/**
 * YouTube.com Playgrub Scraper
 * Created by: Niall Smart <niall AT pobox DOT com>
 * Version: 0.1
 *
 * Notes:
 *
 * This scraper will work on YouTube Disco and YouTube playlist pages (in "Play All" mode)
 */
Playgrub.source.url = 'http://.*\.youtube.com.*';
Playgrub.source.error = 'Check YouTube page - no playlist found.'
Playgrub.source.scrape = function() { 

    var addByTitle = function(title) {
        var title = $(this).attr("title").split(" - ")
        var artist = title[0];
        var song = title[1];

        if (artist && song) {
            Playgrub.playlist.add_track(artist, song);
        }
    }

    /* regular playlist */

    $("#playlist-bar .playlist-bar-item a[title]").each(addByTitle);

    /* cosmic panda playlist */

    $("#watch-tray-playlist .watch-tray-playlist-item a[title]").each(addByTitle);
}

Playgrub.source.start();
