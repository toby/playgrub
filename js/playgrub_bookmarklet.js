PLUtil = {

    PGHOST: 'http://localhost:8080/',

    inject_script: function (script) {
        var script_element = document.createElement('script');
        script_element.type = 'text/javascript';
        script_element.src = script;
        document.getElementsByTagName('head')[0].appendChild(script_element);
    },

    inject_css: function (css) {
        var css_element = document.createElement('link');
        css_element.type = 'text/css';
        css_element.rel = 'stylesheet';
        css_element.href = css;
        document.getElementsByTagName('head')[0].appendChild(css_element);
    },

    load_remote: function(object_type, remote_url, callback) {
        PLUtil.inject_script(remote_url);
        var poll = function() { PLUtil.load_remote_poll(object_type, callback); };
        setTimeout(poll, 50);
    },

    load_remotes: function(remotes, callback) {
        var index = 0;
        var remotes_callback = function() {
            if(index == remotes.length){
                callback();
            } else {
                PLUtil.load_remote(remotes[index][0], remotes[index][1], remotes_callback);
                index++;
            }
        };
        remotes_callback();
    },

    load_remote_poll: function(object_type, callback){
        if (typeof(eval(object_type)) == 'undefined') {
            var poll = function() { PLUtil.load_remote_poll(object_type, callback); };
            setTimeout(poll, 50);
        } else {
            // document set up, start doing stuff
            callback();
        }
    }

};

var remotes = [
    ['jQuery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js'],
    ['Playgrub', PLUtil.PGHOST+'js/playgrub.js']
];

PLUtil.load_remotes(remotes, function() { alert(jQuery+Playgrub); });

// load jquery
//PLUtil.load_remote('jQuery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js', function() { alert('jquery loaded'); });

// load Playgrub.js- will run Playgrub.init() when done
// PLUtil.load_remote('Playgrub', PLUtil.PGHOST+'playgrub.js', function() { Playgrub.Events.init(); });

