/**
 * MyMusicLists Scraper
 * Created by: JP Hastings-Spital
 * Version: 0.1
 *
 * Notes:
 *
 * To test, go to http://www.mymusiclists.com/songs/worst-cover-songs-all-time.asp
 */
Playgrub.source.url = 'http://www.mymusiclists.com/songs/*';
Playgrub.source.error = 'Sorry, there aren\'t any appropriate song names here.';
Playgrub.source.scrape = function() {
	$("div.list-item b").each(function () {
		var spec = $(this).text().split(") ")[1];
		var artist = spec.split(" - ")[1];
		var title = spec.split(" - ")[0];
		if( artist && title && artist != "" && title != "")
	    	Playgrub.playlist.add_track(artist,title);
    });
}

Playgrub.source.start();
