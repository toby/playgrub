
/**
 * BBC Radio 1 Charts Scraper
 * Created by: JP Hastings-Spital & Lucas Gonze
 * Version: 0.2
 *
 * Notes:
 *
 * To test, go to http://www.bbc.co.uk/radio1/chart/singles
 */
if(Playgrub.source.set_url('http://www.bbc.co.uk/radio1/chart/*')) {
    Playgrub.source.error = 'Oops, make sure its a singles chart!';
    Playgrub.source.scrape = function() {
        if (/singles\/?$/.test(location.href)) {
           $("div.chart li").each(function () {
            var artist = $(this).find("span.artist").text();
            var title = $(this).find("span.track").text();
            if( artist && title && artist != "" && title != "")
                Playgrub.playlist.add_track(artist,title);
            });
        }
    }
}

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
if(Playgrub.source.set_url('http://www\.bbc\.co\.uk/programmes/*')) {
    Playgrub.source.error = 'Please make sure you are on a BBC page with songs.';
    Playgrub.source.scrape = function() {
        $("*.segment ").each(function () {
        var artist = $(this).find("span.artist").text();
        var title = $(this).find("span.track").text();
        if( artist && title && artist != "" && title != "" )
            Playgrub.playlist.add_track(artist,title);
        });
    }
}

/**
 * BBC Radio 1 Playlist Scraper
 * Created by: JP Hastings-Spital & Lucas Gonze
 * Version: 0.1
 *
 * Notes:
 *
 * To test, go to http://www.bbc.co.uk/radio1/playlist/
 */
if(Playgrub.source.set_url('http://www.bbc.co.uk/radio1/playlist/')) {
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
}

/**
 * BBC Radio 2 Playlist Scraper
 * Created by: JP Hastings-Spital & Lucas Gonze
 * Version: 0.1
 *
 * Notes:
 *
 * To test, go to http://www.bbc.co.uk/radio2/music/playlist/
 */
if(Playgrub.source.set_url('http://www.bbc.co.uk/radio2/music/playlist/')) {
    Playgrub.source.error = 'Sorry, no suitable songs could be found';
    Playgrub.source.scrape = function() {
        $("div.box ol li div.record").each(function () {
            var artist = $(this).text().split("- ")[0];
            var title = $(this).text().split("- ")[1];
            if( artist && title && artist != "" && title != "")
                Playgrub.playlist.add_track(artist,title);
        });
    }
}

Playgrub.source.start();
