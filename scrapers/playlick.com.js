/**
 * Playlick Playgrub.source
 * Created by: Toby Padilla <tobypadilla AT gmail DOT com>
 * Version: 0.1
 *
 * Notes:
 *
 * This scraper will work on any Playlick setlist
 */

Playgrub.source.url = 'http://.*playlick\.com.*/.*';
Playgrub.source.error = 'Please check your Playlick playlist.';
Playgrub.source.scrape = function() {
    var title = $("#playlistMetadata").children('h1').text();
    Playgrub.playlist.set_title('Playlick: '+title);
    $(".haudio").each(function () {
        var artist = $(this).children('.contributor').text();
        var song = $(this).children('.fn').text();
        Playgrub.playlist.add_track(artist, song);
    });
};

Playgrub.source.start();
