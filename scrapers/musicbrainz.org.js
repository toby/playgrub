/**
 * Musicbrainz Playgrub.source
 * Created by: Toby Padilla <tobypadilla AT gmail DOT com>
 * Version: 0.1
 *
 * Notes:
 *
 * This scraper will work on any Musicbrainz Release pages.
 */

Playgrub.source.url = 'http://musicbrainz\.org.*/release.*';
Playgrub.source.error = 'Playgrub currently supports Musicbrainz Release pages only. Please check your url.';
Playgrub.source.scrape = function() {
    var artist = $('table.artisttitle td.title a').html();
    $("tr.track").each(function () {
        var song_result = $(this).children('td.title').children('a').text();
        Playgrub.playlist.add_track(artist, song_result);
    });
}

Playgrub.source.start();
