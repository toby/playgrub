// PGHOST = 'http://localhost:8080/';
PGHOST = 'http://www.playgrub.com/';

// load MD5 functions from end of file
var MD5 = (load_md5)();

current_date = new Date();

// id for this playlist
playlist_id = MD5.hex(window.location+current_date.getTime());

// array of supported depots
depots = [];

// song index for playlist
broadcast_index = 0;

// load jquery - will start after_load() when done
load_jquery();

// SongDepot : object for song services
function SongDepot(d,s,e) {
    // url is regex for site
    this.url = d;
    // scrape is function to return songs [[artist, song],...]
    this.scrape = s;
    // error is user message if no songs found
    this.error = e;
    // songs get loaded with scrape function
    this.songs = [];
    // TODO playlist title
}

// loads external javascript into page
function inject_script(script) {
    // alert('script! -> '+script);
    var script_element = document.createElement('SCRIPT');
    script_element.type = 'text/javascript';
    script_element.src = script;
    document.getElementsByTagName('head')[0].appendChild(script_element);
}

// load jquery from google
// http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
function load_jquery() {
    if (typeof(jQuery) == 'undefined') {
        inject_script('http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js');
        setTimeout("after_load()",50);
    } else {
        // document set up, start doing stuff
        after_load();
    }

}

function ui_contents() {
    var contents;
    contents = "<div id='playgrub-bookmarklet' style='width: 100%; position: absolute; padding: 15px 0px 15px 15px; top: 0px; left: 0px; z-index: 10000; background: #000000; color: #ffffff; font-family: Arial,Helvetica;'>";
    contents = contents+"<div style='position: absolute; top: 15px; right: 25px;'><a href='' id='playgrub-bookmarklet-close'>close</a></div>";
    contents = contents+"Title: "+document.title;
    contents = contents+"<br />";
    // contents = contents+"Share: "+PGHOST+playlist_id+' '+clippy(PGHOST+playlist_id);
    contents = contents+"Share: "+PGHOST+playlist_id;
    contents = contents+"<br />";
    contents = contents+"<a href='"+"http://www.playlick.com/#xspf="+PGHOST+playlist_id+".xspf"+"' target='_blank'>&#9654; Playlick</a>";
    contents = contents+"<br />";
    contents = contents+"<a href='"+"http://spiffdar.org/?spiff="+encodeURIComponent(PGHOST+playlist_id)+".xspf"+"' target='_blank'>&#9654; Spiffdar</a>";
    contents = contents+"<br />";
    contents = contents+"<a href='"+PGHOST+playlist_id+".xspf'>Download XSPF</a>";
    contents = contents+"</div>";
    return contents;
}

function clippy(clip_text) {
    render = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="110" height="14" id="clippy" >';
    render = render+'<param name="movie" value="'+PGHOST+'static/clippy.swf"/>';
    render = render+'<param name="allowScriptAccess" value="always" />';
    render = render+'<param name="quality" value="high" />';
    render = render+'<param name="scale" value="noscale" />';
    render = render+'<param NAME="FlashVars" value="text='+clip_text+'">';
    render = render+'<param name="bgcolor" value="#FFFFFF">';
    render = render+'<embed src="/flash/clippy.swf" width="110" height="14" name="clippy" quality="high" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" FlashVars="text='+clip_text+'" bgcolor="#FFFFFF" />';
    render = render+'</object>';
}

// we need this because dynamically loading jquery is not-instant
function after_load() {
    if (typeof(jQuery) == 'undefined') {
        // try again
        setTimeout("after_load()",50);
    } else {

        $('body').prepend(ui_contents());

        // create depots...
        var depot;
        var depot_url;
        var depot_scrape;
        var depot_error;

        // ----- Last.fm ----- //
        depot_url = 'http://.*last.fm.*';
        depot_scrape = function() {
            var depot_songs = [];
            var unique_songs = {};
            $("a").filter(function() {
                    match = $(this).attr('href').match('.*\/music\/([^+][^\/]*)\/[^+][^\/]*\/([^+][^\?]*)');
                    if(match) {
                        artist = match[1];
                        song = match[2];
                        uartist = unique_songs[artist];
                        if(typeof(uartist) != 'undefined')
                            usong = uartist[match[2]];
                        if((typeof(uartist) == 'undefined') || (typeof(usong) == 'undefined')) {
                            unique_songs[artist] = {};
                            unique_songs[artist][song] = {};
                            depot_songs.push([decodeURIComponent(artist).replace(/\+/g, ' '), decodeURIComponent(song).replace(/\+/g, ' ')]);
                        }
                    }
                });
            this.songs = depot_songs;
        }
        depot_error = "Check your Last.fm url";
        depot = new SongDepot(depot_url, depot_scrape, depot_error);
        depots.push(depot);

        // ----- Grooveshark ----- //
        depot_url = 'http://widgets\.grooveshark\.com/add_songs.*';
        depot_scrape = function() {
            var depot_songs = [];
            $("h4").each(function () {
                var song_result = $(this).html().split(" - ");
                depot_songs.push([song_result[1], song_result[0]]);
            });
            this.songs = depot_songs;
        }
        depot_error = "You have to go to the widget building page to run this";
        depot = new SongDepot(depot_url, depot_scrape, depot_error);
        depots.push(depot);

        // ----- Musicbrainz Release ----- //
        depot_url = 'http://musicbrainz\.org.*/release.*';
        depot_scrape = function() {
            var depot_songs = [];
            var artist = $('table.artisttitle td.title a').html();
            $("tr.track").each(function () {
                var song_result = $(this).children('td.title').children('a').text();
                depot_songs.push([artist, song_result]);
            });
            this.songs = depot_songs;
        }
        depot_error = "please check your musicbrainz url";
        depot = new SongDepot(depot_url, depot_scrape, depot_error);
        depots.push(depot);
        
        // ----- Robert Radish on Yahoo Music ----- //
        depot_url = 'http://new\.music\.yahoo\.com/blogs/yradish/*';
        depot_scrape = function() {
            var depot_songs = [];
            $("div.ymusic-text-article p").each(function () {
                txt = $(this).text();
                if( txt.match(/^\s*[0-9]+/) ){
                    var song_result = txt.split(" - ");
                    depot_songs.push([song_result[1], song_result[0]]);
                } 
            });
            this.songs = depot_songs;
        }
        depot_error = "Check your Robert Radish URL.";
        depot = new SongDepot(depot_url, depot_scrape, depot_error);
        depots.push(depot);

        // cycle through depots and return songs
        songs = get_songs();

        if(songs && songs.length > 0) {
            // alert('song length: '+songs.length);
            setTimeout('broadcast_songs()', 150);
            // alert("master songs-> "+songs);
        }
    }
}

function broadcast_songs() {
    var data;
    if(songs.length == 0) {
        // alert(PGHOST+playlist_id+'.xspf');
        return true;
    }
    // first song in playlist
    if(broadcast_index == 0) {
        data = PGHOST+'playlist_header.js?playlist='+playlist_id+'&songs='+songs.length+'&title='+encodeURIComponent(document.title)+'&url='+encodeURIComponent(window.location);
        inject_script(data);
    } else {
        data = PGHOST+'playlist_track.js?artist='+encodeURIComponent(songs[0][0])+'&track='+encodeURIComponent(songs[0][1])+
            '&index='+encodeURIComponent(broadcast_index)+'&playlist='+encodeURIComponent(playlist_id);
        inject_script(data);
        songs.shift();
    }
}

function get_songs() {
    var master_songs = [];
    // check all depots
    for(var i = 0; i < depots.length; i++) {
        // check to see if this depot's url matches the current url
        regex = new RegExp(depots[i].url);
        if(regex.exec(window.location)) {
            // run depot's scraping function
            depots[i].scrape();
            if(depots[i].songs.length > 0) {
                // add to songs from other depots
                master_songs = master_songs.concat(depots[i].songs);
            } else {
                alert(depots[i].error);
            }
        }
    }
    return master_songs;
}

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */


function load_md5() {
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return [a, b, c, d];
}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t) {
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t) {
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t) {
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t) {
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t) {
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data) {
  var bkey = str2binl(key);
  if(bkey.length > 16) bkey = core_md5(bkey, key.length * MD5.chrsz);

  var ipad = [], opad = [];
  for(var i = 0; i < 16; i++) {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * MD5.chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str) {
  var bin = [], chrsz = MD5.chrsz;
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
  return bin;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin) {
  var str = "", chrsz = MD5.chrsz;
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
  return str;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray) {
  var hex_tab = MD5.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++) {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray) {
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3) {
    var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++) {
      if(i * 8 + j * 6 > binarray.length * 32) str += MD5.b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}

  return {
/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
    hexcase: 0, // hex output format. 0 - lowercase; 1 - uppercase
    b64pad: "", // base-64 pad character. "=" for strict RFC compliance
    chrsz: 8,   // bits per input character. 8 - ASCII; 16 - Unicode

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
    hex:function( s ) { 
      return binl2hex( core_md5( str2binl( s ), s.length * MD5.chrsz ) );
    },

    base64:function( s ) {
      return binl2b64( core_md5( str2binl( s ), s.length * MD5.chrsz ) );
    },

    string:function( s ) {
      return binl2str( core_md5( str2binl( s ), s.length * MD5.chrsz ) );
    },

    hmac:{
      hex:function( key, data ) {
        return binl2hex( core_hmac_md5( key, data ) );
      },

      base64:function( key, data ) {
        return binl2b64( core_hmac_md5( key, data ) );
      },

      string:function( key, data ) {
        return binl2str( core_hmac_md5( key, data ) );
      }
    },

    test:function() { // Perform a simple self-test to see if the VM is working
      return this.hex("abc") == "900150983cd24fb0d6963f7d28e17f72";
    }
  };
}


