/**
 * MOG.com Playgrub Scraper
 * Created by: Niall Smart <niall AT pobox DOT com>
 * Version: 0.1
 *
 * Notes:
 *
 * This scraper will work on MOG.com playlist pages.
 */
Playgrub.source.url = 'http://.*\.mog.com.*';
Playgrub.source.error = 'Check your MOG page - only playlist pages are supported.'
Playgrub.source.scrape = function() {

    $(".song-title").each(function() {
        var artist = $(this).find('a:last-child').text();
        var song = $(this).find('a:first-child').text();

        artist = $.trim(artist);
        song = $.trim(song);

        if (artist && song) {
            Playgrub.playlist.add_track(artist, song);
        }
    });
}

Playgrub.source.start();
