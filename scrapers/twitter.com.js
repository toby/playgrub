/**
 * Songkick Playgrub.source
 * Created by: Toby Padilla <tobypadilla AT gmail DOT com>
 * Version: 0.1
 *
 * Notes:
 *
 * This scraper will work on any Playtapus Search result
 */
Playgrub.source.url = 'http://.*twitter\.com';
Playgrub.source.error = 'To play Twitter songs please use the format &#9733; ARTIST &#9835; SONG. <a href=\'http://twitter.com/#search?q=%23playtapus\'>Example</a>';
Playgrub.source.scrape = function() {
    var reg = /\u2605(.*)\u266B([^#]*)#/gi;
    $(".msgtxt").each(function () {
        $(this).text().match(reg);
        var artist = RegExp.$1.substring(0,RegExp.$1.length-2);
        var song = RegExp.$2.substring(0,RegExp.$2.length-1);
        if(artist.length > 0 && song.length > 0)
            Playgrub.playlist.add_track(artist, song);
    });

    $(".entry-content").each(function () {
        $(this).text().match(reg);
        var artist = RegExp.$1.substring(0,RegExp.$1.length-2);
        var song = RegExp.$2.substring(0,RegExp.$2.length-1);
        if(artist.length > 0 && song.length > 0)
            Playgrub.playlist.add_track(artist, song);
    });
}

Playgrub.source.start();
