/**
 * BBC Radio 2 Playlist Scraper
 * Created by: JP Hastings-Spital & Lucas Gonze
 * Version: 0.1
 *
 * Notes:
 *
 * To test, go to http://www.bbc.co.uk/radio2/music/playlist/
 */
Playgrub.source.url = 'http://www.bbc.co.uk/radio2/music/playlist/';
Playgrub.source.error = 'Sorry, no suitable songs could be found';
Playgrub.source.scrape = function() {
	$("div.box ol li div.record").each(function () {
		var artist = $(this).text().split("- ")[0];
		var title = $(this).text().split("- ")[1];
		if( artist && title && artist != "" && title != "")
			Playgrub.playlist.add_track(artist,title);
	});
}

Playgrub.source.start();
