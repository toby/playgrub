/**
 * XFM Playlist Scraper
 * Created by: JP Hastings-Spital & Lucas Gonze
 * Version: 0.1
 *
 * Notes:
 *
 * Be an XFM DJ!
 *
 * To test, go to http://www.xfm.co.uk/onair/playlist
 */
Playgrub.source.url = 'http://www.xfm.co.uk/onair/playlist';
Playgrub.source.error = 'Sorry, no suitable songs could be found';
Playgrub.source.scrape = function() {
	$("table.playlist tr").each(function () {
		var artist = $(this).find('td').eq(0).text();
		var title = $(this).find('td.track_title').text();
		if( artist && title && artist != "" && title != "")
			Playgrub.playlist.add_track(artist,title);
	});
}

Playgrub.source.start();
