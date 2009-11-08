/**
 * Yahoo Radish Playgrub Scraper
 * Created by: Lucas Gonze
 * Version: 0.1
 *
 * Notes:
 *
 * This scraper will work on any Y! Radish Playlist.
 */

Playgrub.scraper.url = 'http://new\.music\.yahoo\.com/blogs/yradish/*';
Playgrub.scraper.error = 'Check your Robert Radish URL.';
Playgrub.scraper.scrape = function() {
   var regex = /(^\s*[0-9]+\. )/;
    $("div.ymusic-text-article p").each(function () {
        var txt = $(this).text();
        if( txt.match(regex) ){
            txt = txt.replace(regex,"");
            var song_result = txt.split(" - ");
            Playgrub.playlist.add_track(song_result[1], song_result[0]);
        }
    });
}

Playgrub.scraper.start();
