/**
 * Absolute Radio Playlist Scraper
 * Created by: JP Hastings-Spital & Lucas Gonze
 * Version: 0.1
 *
 * Notes:
 *
 * Be an XFM DJ!
 *
 * To test, go to http://www.absoluteradio.co.uk/music/we_play/playlist/
 */
Playgrub.source.url = 'http://www.absoluteradio.co.uk/music/we_play/playlist/';
Playgrub.source.error = 'Sorry, no suitable songs could be found';
Playgrub.source.scrape = function() {
	$('#playlist strong').remove();
	$("#playlist a").each(function () {
		try {
			var artist = $(this).text();
			var title = String($(this).next('br')[0].nextSibling.nodeValue);
			
			if( artist && title && artist != "" && title != "")
				Playgrub.playlist.add_track(artist,title);
		} catch (err) {
		}
	});
}

Playgrub.source.start();
