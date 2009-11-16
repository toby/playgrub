/**
 * Grooveshark Playgrub.source
 * Created by: Toby Padilla <tobypadilla AT gmail DOT com>
 * Version: 0.1
 *
 * Notes:
 *
 * This scraper will work on any Last.fm song page and only add unique songs.
 */

Playgrub.source.url = 'http://widgets\.grooveshark\.com/add_songs.*';
Playgrub.source.error = "To use Playgrub on Grooveshark export a song list, choose \"Mirror Changes\" or \"Copy Songs\", scroll down and hit \"Next Step\", then use the bookmarklet.";
Playgrub.source.scrape = function() {
    $("h4").each(function () {
        var song_result = $(this).html().split(" - ");
        Playgrub.playlist.add_track(song_result[1], song_result[0]);
    });
}

Playgrub.source.start();
