/**
 * Kerrang Radio Playlist Scraper
 * Created by: JP Hastings-Spital & Lucas Gonze
 * Version: 0.1
 *
 * Notes:
 *
 * The Kerrang Radio playlist
 *
 * To test, go to http://www.kerrangradio.co.uk/playlist.asp
 */
Playgrub.source.url = 'http://www.kerrangradio.co.uk/playlist.asp';
Playgrub.source.error = 'Sorry, no suitable songs could be found';
Playgrub.source.scrape = function() {
	$("form table tr td font.Text").each(function () {
		var artist = $(this).find('b').text();
		var title = $(this).find('br')[0].nextSibling.nodeValue;
		if( artist && title && artist != "" && title != "")
			Playgrub.playlist.add_track(artist,title);
	});
}

Playgrub.source.start();
