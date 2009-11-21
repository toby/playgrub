/**
 * BBC Playlist Playgrub Scraper
 * Created by: Lucas Gonze
 * Version: 0.1
 *
 * Notes:
 *
 * When a playlist is more than a week old the BBC blocks access to
 * playlists for people who aren't in the UK.  This is because it
 * doesn't have the rights to play music to them.  So this scraper
 * will only work outside of the UK for a short time.  
* 
* To test, go to http://www.bbc.co.uk/radio1/programmes/schedules 
* and pick a recent show.
*/
Playgrub.source.url = 'http://www\.bbc\.co\.uk/programmes/*';
Playgrub.source.error = 'Please make sure you are on a BBC page with songs.';
Playgrub.source.scrape = function() {
    $("*.segment ").each(function () {
	var artist = $(this).find("span.artist").text();
	var title = $(this).find("span.track").text();
	if( artist && title && artist != "" && title != "" )
	    Playgrub.playlist.add_track(artist,title);
    });
}

Playgrub.source.start();
