/**
 * Grooveshark Playgrub Scraper
 * Created by: Toby Padilla <tobypadilla AT gmail DOT com>
 * Version: 0.1
 *
 * Notes:
 *
 * This scraper will work on any Last.fm song page and only add unique songs.
 */

Playgrub.scraper.url = 'http://widgets\.grooveshark\.com/add_songs.*';
Playgrub.scraper.error = "To use Playgrub on Grooveshark export a song list, choose \"Mirror Changes\" or \"Copy Songs\", scroll down and hit \"Next Step\", then use the bookmarklet.";
Playgrub.scraper.scrape = function() {
    var songs = [];
    $("h4").each(function () {
        var song_result = $(this).html().split(" - ");
        Playgrub.playlist.add_track(song_result[1], song_result[0]);
    });
}

Playgrub.scraper.start();
