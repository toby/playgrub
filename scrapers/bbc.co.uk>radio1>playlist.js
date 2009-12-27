/**
 * BBC Radio 1 Playlist Scraper
 * Created by: JP Hastings-Spital & Lucas Gonze
 * Version: 0.1
 *
 * Notes:
 *
 * To test, go to http://www.bbc.co.uk/radio1/playlist/
 */
Playgrub.source.url = 'http://www.bbc.co.uk/radio1/playlist/';
Playgrub.source.error = 'Sorry, no suitable songs could be found';
Playgrub.source.scrape = function() {
	$("div.artists_and_songs ul.clearme").each(function () {
		var artist = $(this).find("li.artist").text();
		console.log(artist);
		var title = $(this).find("li.song").text();
		if( artist && title && artist != "" && title != "")
			Playgrub.playlist.add_track(artist,title);
	});
}

Playgrub.source.start();
