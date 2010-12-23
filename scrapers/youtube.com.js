/**
 * YouTube.com Playgrub Scraper
 * Created by: Niall Smart <niall AT pobox DOT com>
 * Version: 0.1
 *
 * Notes:
 *
 * This scraper will work on YouTube Disco and YouTube playlist pages (in "Play All" mode)
 */
Playgrub.source.url = 'http://.*\.youtube.com.*';
Playgrub.source.error = 'Check your YouTube page - only YouTube Disco/playlist playback pages are supported.'
Playgrub.source.scrape = function() { 

    var quicklist = $("#quicklist");

    if (quicklist.size() == 0) {
        return;
    }

    quicklist.find("ol.video-list li.quicklist-item").each(function() {
        var title = $(this).find("span.title > span").clone();
        title.children().remove();
        title = title.text().split(" - ");
        var artist = title[0];
        var song = title[1];

        if (artist && song) {
            Playgrub.playlist.add_track(artist, song);
        }
    });
}

Playgrub.source.start();
