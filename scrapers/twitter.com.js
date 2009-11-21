/**
 * Songkick Playgrub.source
 * Created by: Toby Padilla <tobypadilla AT gmail DOT com>
 * Version: 0.1
 *
 * Notes:
 *
 * This scraper will work on any Playtapus Search result
 */
Playgrub.source.url = 'http://.*twitter\.com.*playtapus';
Playgrub.source.error = 'Playgrub currently supports Playtapus Twitter searches. Please check your search.';
Playgrub.source.scrape = function() {
    var reg = /\u2605(.*)\u266B(.*)#/gi;
    $(".msgtxt").each(function () {
        $(this).text().match(reg);
        var artist = RegExp.$1.substring(0,RegExp.$1.length-2);
        var song = RegExp.$2.substring(0,RegExp.$2.length-2);
        Playgrub.playlist.add_track(artist, song);
    });
}

Playgrub.source.start();
