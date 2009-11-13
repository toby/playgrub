/**
 * Apple.com iTunes Chart Playgrub Scraper
 * Created by: Toby Padilla <tobypadilla AT gmail DOT com>
 * Version: 0.1
 *
 * Notes:
 *
 * This scraper will work on the Apple.com iTunes Chart Page
 */

Playgrub.scraper.url = 'http://.*apple\.com.*/itunes/charts/songs.*';
Playgrub.scraper.error = 'Playgrub currently supports iTunes Charts pages only. Please check your url.';
Playgrub.scraper.scrape = function() {
    $("li").each(function () {
        var artist = $(this).children('h4').text();
        var song = $(this).children('h3').children('a').text();
        if(artist && song)
            Playgrub.playlist.add_track(artist, song);
    });
}

Playgrub.scraper.start();
