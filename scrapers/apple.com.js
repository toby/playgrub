/**
 * Apple.com iTunes Chart Playgrub Scraper
 * Created by: Toby Padilla <tobypadilla AT gmail DOT com>
 * Version: 0.1
 *
 * Notes:
 *
 * This scraper will work on the Apple.com iTunes Chart Page
 */

Playgrub.source.url = 'http://.*apple\.com.*/itunes/charts/songs.*';
Playgrub.source.error = 'Playgrub currently supports iTunes Charts pages only. Please check your url.';
Playgrub.source.scrape = function() {
    $("li").each(function () {
        var artist = $(this).children('h4').text();
        var song = $(this).children('h3').children('a').text();
        if(artist && song)
            Playgrub.playlist.add_track(artist, song);
    });
}

Playgrub.source.start();
