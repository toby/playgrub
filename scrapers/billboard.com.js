/**
 * Billboard.com Scraper
 * Created by: JP Hastings-Spital
 * Version: 0.1
 *
 * NB! Not fully working - new pages are loaded via AJAX, so playgrub is left loaded,
 * preventing the new playgrub playlist from being processed. Ideas anyone?
 * 
 * Notes:
 * Try these:
 *  - http://www.billboard.com/#/charts/digital-songs
 *  - http://www.billboard.com/#/charts/billboard-200
 */
Playgrub.source.url = 'http://www.billboard.com/*';
Playgrub.source.error = 'Sorry, any songs named on this page aren\'t in the expected format';

Playgrub.source.scrape = function() {
	if ($('#chart-header p').text().search('album') == -1) {
		// Remove any previous playgrub scripts, because of the hash layout of the site
		// Not done!
		
		try {
			var first = parseInt(location.href.match(/begin=(\d+)/)[1])
		} catch (err) {
			var first = 1;
		}
		try {
			var by = location.href.match(/order=([a-z]+)/)[1]
		} catch (err) {
			var by = "position";
		}
	
		document.title += " (By '"+by+"' starting at #"+first+")"
		$("div.units div.info").each(function () {
			var artist = $(this).find('h2').text();
			var title = $(this).find('h3').text();
			if( artist && title && artist != "" && title != "")
		    	Playgrub.playlist.add_track(artist,title);
	    });
	}
}

Playgrub.source.start();
