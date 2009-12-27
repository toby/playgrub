/**
 * World Music Charts Europe Scraper
 * Created by: JP Hastings-Spital & Lucas Gonze
 * Version: 0.1
 *
 * Notes:
 *
* To test, go to http://www.wmce.de/
*/
Playgrub.source.url = 'http://www.wmce.de/';
Playgrub.source.error = 'Oops, make sure its a singles chart!';
Playgrub.source.scrape = function() {
 	$("#top20 tr").each(function () {
		try {
			var artist = $(this).find("td.song").text().match(/\n\W+(.+),\ .+$/)[1];
		} catch(err) {
			var artist = "";
		}
		var title = $(this).find("td.song a").text();
		if( artist && title && artist != "" && title != "")
	    	Playgrub.playlist.add_track(artist,title);
	});
}

Playgrub.source.start();
