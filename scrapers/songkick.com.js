/**
 * Songkick Playgrub.source
 * Created by: Toby Padilla <tobypadilla AT gmail DOT com>
 * Version: 0.1
 *
 * Notes:
 *
 * This scraper will work on any Songkick setlist
 */

Playgrub.source.url = 'http://.*songkick\.com.*/.*';
Playgrub.source.error = 'Playgrub currently supports Songkick setlists only. Please check your url.';
Playgrub.source.scrape = function() {
    $("div#setlists").each(function () {
        var artist = $(this).children('h3').text();
        $(this).children('ol.setlist').children('li').each(function() {
            var song = $(this).text();
            Playgrub.playlist.add_track(artist, song);
        });
    });
}

Playgrub.source.start();
