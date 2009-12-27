/**
 * BBC Radio 1 Charts Scraper
 * Created by: JP Hastings-Spital & Lucas Gonze
 * Version: 0.1
 *
 * Notes:
 *
* To test, go to http://www.bbc.co.uk/radio1/chart/singles
*/
Playgrub.source.url = 'http://www.bbc.co.uk/radio1/chart/*';
Playgrub.source.error = 'Oops, make sure its a singles chart!';
Playgrub.source.scrape = function() {
	if (/singles\/$/.test(location.href)) {
 	   $("div.chart li").each(function () {
		var artist = $(this).find("span.artist").text();
		var title = $(this).find("span.track").text();
		if( artist && title && artist != "" && title != "")
		    Playgrub.playlist.add_track(artist,title);
	    });
	}
}

Playgrub.source.start();
