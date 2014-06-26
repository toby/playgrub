/**
 * Rdio.com Playgrub Scraper
 * Created by: Niall Smart <niall AT pobox DOT com>
 * Version: 0.1
 *
 * Notes:
 *
 * This scraper will work on Rdio.com artist/album/playlist pages.
 */
Playgrub.source.url = 'http://.*\.rdio.com.*';
Playgrub.source.error = 'Check your Rdio page - only artist, album and playlist pages are supported.'
Playgrub.source.scrape = function() {

    var albumArtist;
    var ah = $("div.album_header");

    if (ah.size() > 0) {
        albumArtist = ah.find("a.mini_header").text();
    }

    $("div.track").each(function() {
        var artist = $(this).find('div.album_info > a:first-child').text();
        var song = $(this).find('div.title_info').text();

        if (!artist) {
            artist = albumArtist;
        }

        artist = $.trim(artist);
        song = $.trim(song);

        if (artist && song) {
            Playgrub.playlist.add_track(artist, song);
        }
    });
}

Playgrub.source.start();
