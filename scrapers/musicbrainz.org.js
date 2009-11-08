/**
 * Musicbrainz Playgrub Scraper
 * Created by: Toby Padilla <tobypadilla AT gmail DOT com>
 * Version: 0.1
 *
 * Notes:
 *
 * This scraper will work on any Musicbrainz Release pages.
 */

Playgrub.scraper.url = 'http://musicbrainz\.org.*/release.*';
Playgrub.scraper.error = 'Playgrub currently supports Musicbrainz Release pages only. Please check your url.';
Playgrub.scraper.scrape = function() {
    var artist = $('table.artisttitle td.title a').html();
    $("tr.track").each(function () {
        var song_result = $(this).children('td.title').children('a').text();
        Playgrub.playlist.add_track(artist, song_result);
    });
}

Playgrub.scraper.start();
