import logging
import os
import re
import urlparse
import urllib
import base64
import datetime
import hashlib
import wsgiref.handlers
from django.utils import simplejson
from google.appengine.api import urlfetch
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext import db
from models import PlaylistHeader
from models import PlaylistTrack
from models import PlaygrubAccount

class IndexHandler(webapp.RequestHandler):

  def get(self):
    heads = PlaylistHeader.gql("order by create_date desc limit 25");
    template_values = {
        'headers': heads,
        }
    path = os.path.join(os.path.dirname(__file__), 'html/index.html')
    self.response.out.write(template.render(path, template_values))


class PlaylistHeaderHandler(webapp.RequestHandler):

  def get(self):
    rtitle = self.request.get('title')
    rurl = self.request.get('url')
    rsongs = self.request.get('songs')
    rcreate_date = datetime.datetime.now()

    h = hashlib.new('ripemd160')
    h.update(rurl+rcreate_date.ctime())
    rplaylist = h.hexdigest()

    playlist_header = PlaylistHeader(title = rtitle,
                                     url = rurl,
                                     playlist = rplaylist,
                                     songs = rsongs,
                                     create_date = rcreate_date)

    playlist_header.put()
    # logging.error("playlist_header --> %s", playlist_header.title)
    self.response.out.write("Playgrub.playlist.id = '"+rplaylist+"'; Playgrub.client.broadcast_index++; Playgrub.client.write_playlist(Playgrub.playlist);")

class PlaylistTrackHandler(webapp.RequestHandler):

  def get(self):
    playlist_track = PlaylistTrack(artist = self.request.get('artist'),
                                   track = self.request.get('track'),
                                   index = int(self.request.get('index')),
                                   playlist = self.request.get('playlist'),
                                   create_date = datetime.datetime.now())

    playlist_track.put()
    # logging.error("playlist_track --> %s", playlist_track.artist)
    self.response.out.write('Playgrub.client.broadcast_index++; Playgrub.client.write_playlist(Playgrub.playlist);')

class XSPFHandler(webapp.RequestHandler):

  def get(self):
    playlist_key = self.request.path.split('.xspf')[0]
    playlist_key = playlist_key.lstrip('/')

    # logging.error("XSPF key --> %s", playlist_key)

    q = PlaylistHeader.gql('WHERE playlist = :1', playlist_key)
    head = q.fetch(1)[0]
    # logging.error("head -> %s",head.title)

    q = PlaylistTrack.gql('WHERE playlist = :1 ORDER BY index ASC', playlist_key)
    songs = q.fetch(500)
    # for r in songs:
        # logging.error("index -> %s", r.index)
        # logging.error("artist -> %s", r.artist)
        # logging.error("track -> %s", r.track)

    template_values = {
        'header': head,
        'songs': songs,
        }

    path = os.path.join(os.path.dirname(__file__), 'html/xspf-template.xspf')
    self.response.headers['Content-Type'] = 'application/xspf+xml'
    self.response.out.write(template.render(path, template_values))

class BookmarkletIframeHandler(webapp.RequestHandler):

  def get(self):
    template_values = {}

    path = os.path.join(os.path.dirname(__file__), 'html/bookmarklet-iframe.html')
    self.response.out.write(template.render(path, template_values))

class PlayerHandler(webapp.RequestHandler):

  def get(self):
    url = self.request.get('xspf')
    template_values = {
        'xspf': url,
        }

    path = os.path.join(os.path.dirname(__file__), 'html/standalone.html')
    self.response.out.write(template.render(path, template_values))

class JSONXSPFHandler(webapp.RequestHandler):

  def get(self):
    playlist_key = self.request.path.split('.xspf')[0]
    playlist_key = playlist_key.lstrip('/')

    # logging.error("XSPF key --> %s", playlist_key)

    q = PlaylistHeader.gql('WHERE playlist = :1', playlist_key)
    head = q.fetch(1)[0]
    # logging.error("head -> %s",head.title)

    q = PlaylistTrack.gql('WHERE playlist = :1 ORDER BY index ASC', playlist_key)
    songs = q.fetch(500)
    # for r in songs:
        # logging.error("index -> %s", r.index)
        # logging.error("artist -> %s", r.artist)
        # logging.error("track -> %s", r.track)

    template_values = {
        'header': head,
        'songs': songs,
        }

    path = os.path.join(os.path.dirname(__file__), 'html/json-xspf-template.html')
    self.response.headers['Content-Type'] = 'text/javascript'
    self.response.out.write(template.render(path, template_values))

class ScrapeHandler(webapp.RequestHandler):

  def get(self):
    url = self.request.get('url')
    domain = urlparse.urlparse(url).netloc
    scraper_path = os.path.join(os.path.dirname(__file__), 'scrapers/')

    for root, dirs, files in os.walk(scraper_path):
        for filename in files:
            if filename.endswith('.js'):
                # logging.error("filename -> %s",filename.split('.js')[0])
                sre = re.compile('.*'+filename.split('.js')[0])
                if sre.match(domain):
                    # logging.error("match -> %s",domain)
                    self.response.headers['Content-Type'] = 'text/javascript'
                    self.response.out.write(template.render(scraper_path+filename, {}))
                    return
    self.response.out.write('Playgrub.Events.noScraper();')

class TwitterPostHandler(webapp.RequestHandler):

    def get(self):
      playlist_key = self.request.get('playlist')
      q = PlaylistHeader.gql('WHERE playlist = :1', playlist_key)
      if q.count() == 0:
          return
      head = q.fetch(1)[0]

      q = PlaygrubAccount.gql('WHERE service = :1', 'bit.ly')
      if q.count(1) == 0:
          return
      bitly_account = q.fetch(1)[0]

      play_url = 'http://www.playlick.com/'+urllib.quote('#xspf=http://www.playgrub.com/'+head.playlist+'.xspf')
      login = bitly_account.user
      password = bitly_account.password
      shorten_url = 'http://api.bit.ly/shorten?version=2.0.1&login='+login+'&apiKey='+password+'&history=1&longUrl='+play_url
      result = urlfetch.fetch(shorten_url, payload=None, method=urlfetch.GET, headers={})
      # logging.error('bitly result -> %s', result.content)
      sre = re.compile('.*shortUrl.*(http.*)"')
      search = sre.search(result.content)
      if not search:
          return
      shortened_url = search.group(1)
      # logging.error('shortened_url -> %s', shortened_url)


      q = PlaygrubAccount.gql('WHERE service = :1','twitter')
      if q.count(1) == 0:
          return
      twitter_account = q.fetch(1)[0]


      message = head.title + ' ' + shortened_url
      login = twitter_account.user
      password = twitter_account.password
      payload= {'status' : message.encode('utf-8'),  'source' : 'Playgrub'}
      payload = urllib.urlencode(payload)

      base64string = base64.encodestring('%s:%s' % (login, password))[:-1]
      headers = {'Authorization': "Basic %s" % base64string}

      url = "http://twitter.com/statuses/update.xml"
      result = urlfetch.fetch(url, payload=payload, method=urlfetch.POST, headers=headers)
      # logging.error('twitter result -> %s', result.content)

      self.response.headers['Content-Type'] = 'text/plain'
      self.response.out.write(result.content)


def main():
  application = webapp.WSGIApplication([('/bookmarklet_iframe', BookmarkletIframeHandler),
                                       ('/player', PlayerHandler),
                                       ('/json-xspf/', JSONXSPFHandler),
                                       ('/twitter_post', TwitterPostHandler),
                                       ('/scraper.js', ScrapeHandler),
                                       ('/playlist_header.js', PlaylistHeaderHandler),
                                       ('/playlist_track.js', PlaylistTrackHandler),
                                       ('/', IndexHandler),('/.*\.xspf', XSPFHandler)],
                                       debug=True)
  wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
  main()
