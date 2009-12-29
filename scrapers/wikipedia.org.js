/**
 * Wikipedia Singles Scraper
 * Created by: JP Hastings-Spital
 * Version: 0.1
 *
 * Notes:
 * Try these:
 *  - http://en.wikipedia.org/wiki/List_of_number-one_singles_from_the_2000s_%28UK%29
 *  - http://en.wikipedia.org/wiki/List_of_best-selling_singles_by_year_%28UK%29
 *  - http://en.wikipedia.org/wiki/List_of_best-selling_singles_in_Japan
 *  - http://en.wikipedia.org/wiki/List_of_Christmas_number_one_singles_%28UK%29
 *  - http://en.wikipedia.org/wiki/List_of_best-selling_singles_%28France%29
 *  - http://en.wikipedia.org/wiki/List_of_best-selling_singles_worldwide
 *  - http://en.wikipedia.org/wiki/List_of_train_songs
 */

// Hmm, http://*.wikipedia.org/wiki/* doesn't seem to work
Playgrub.source.url = 'http://en.wikipedia.org/wiki/*';
Playgrub.source.error = 'Sorry, any songs named on this page aren\'t in the expected format';

Playgrub.source.scrape = function() {
	// Tables
	$("table.wikitable").each(function () {
		var artist_column = -1;
		var title_column = -1;
		
		var doHeader = true;
		$(this).find("tr").each(function () {
			var i = 0;
			if (doHeader) {
				$(this).find('th').each(function () {
					switch($(this).text().trim()) {
					case 'Artist':
						artist_column = i;
						break;
					case 'Song title':	
					case 'Single':
					case 'Song':
					case 'Title':
						title_column = i;
						break;
					}
					
					i += 1;
				});
				doHeader = false;
			} else {
				if( (artist_column * title_column) >= 0) {
					var cols = $(this).find('td');
					var mod = $(this).find('th').length;
					var artist = cols.eq(artist_column - mod).text();
					// I don't like stripping speech marks like this, but I want a quick way of dealing with "Blah" / "Blooh" type entries.
					var title = cols.eq(title_column - mod).text().replace(/"/g,'');
					if( artist && title && artist != "" && title != "")
				    	Playgrub.playlist.add_track(artist,title);
				}
			}
		});
    });

	// Lists
	$("li").each(function () {
		var match = $(this).text().match(/"(.+)" by (.+)/);
		if (match) {
			var artist = match[2];
			var title = match[1];
		} else {
			var match = $(this).text().match(/(.+) - "(.+)"/);
			if (match) {
				var artist = match[1];
				var title = match[2];
			}
		}
		
		if( artist && title && artist != "" && title != "")
			Playgrub.playlist.add_track(artist,title);
	});
}

Playgrub.source.start();
