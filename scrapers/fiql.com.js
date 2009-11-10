/**
 * FIQL Playgrub Scraper
 * Created by: Toby Padilla <tobypadilla AT gmail DOT com>
 * Version: 0.1
 *
 * Notes:
 *
 * This scraper will work on any FIQL playlist page.
 */

Playgrub.scraper.url = 'http://.*fiql\.com.*/playlists.*';
Playgrub.scraper.error = 'Playgrub currently supports FIQL Playlist pages only. Please check your url.';
Playgrub.scraper.scrape = function() {
    $("div.table-track-row").each(function () {
        var artist = $(this).children('span.track-artist').children('a').text();
        var song = $(this).children('span.track-song').children('a').text();
        Playgrub.playlist.add_track(artist, song);
    });
}

Playgrub.scraper.start();
