/**
 * haudio Playgrub Scraper
 * Created by: JP Hastings-Spital
 * Version: 0.1
 *
 * Notes:
 *
 * To test, go to http://www.classicfm.co.uk/on-air/playlist/
 * and pick a recent show.
 */
Playgrub.source.url = '*';
Playgrub.source.error = 'Sorry, no suitable haudio tags could be found on this page';
Playgrub.source.scrape = function() {
    $(".haudio").each(function () {
		var artist = $(this).find("span.contributor").text();
		var title = $(this).find("span.title").text();
		if( artist && title && artist != "" && title != "" )
	    	Playgrub.playlist.add_track(artist,title);
    });
}

Playgrub.source.start();
