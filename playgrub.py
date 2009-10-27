import logging

import os
import datetime
import wsgiref.handlers
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext import db

class PlaylistTrack(db.Model):
  artist = db.StringProperty(required=True)
  track = db.StringProperty(required=True)
  index = db.IntegerProperty(required=True)
  playlist = db.StringProperty(required=True)
  create_date = db.DateTimeProperty(required=True)

class PlaylistHeader(db.Model):
  title = db.StringProperty(required=True)
  playlist = db.StringProperty(required=True)
  create_date = db.DateTimeProperty(required=True)

class IndexHandler(webapp.RequestHandler):

  def get(self):
    template_values = {}
    path = os.path.join(os.path.dirname(__file__), 'index.html')
    self.response.out.write(template.render(path, template_values))


class PlaylistHeaderHandler(webapp.RequestHandler):

  def get(self):
    playlist_header= PlaylistHeader(title = self.request.get('title'),
                                   playlist = self.request.get('playlist'),
                                   create_date = datetime.datetime.now())

    playlist_header.put()
    logging.error("playlist_header --> %s", playlist_header.title)
    self.response.out.write('broadcast_index++; broadcast_songs();')

class PlaylistTrackHandler(webapp.RequestHandler):

  def get(self):
    playlist_track = PlaylistTrack(artist = self.request.get('artist'),
                                   track = self.request.get('track'),
                                   index = int(self.request.get('index')),
                                   playlist = self.request.get('playlist'),
                                   create_date = datetime.datetime.now())

    playlist_track.put()
    logging.error("playlist_track --> %s", playlist_track.artist)
    self.response.out.write('broadcast_index++; broadcast_songs();')


def main():
  application = webapp.WSGIApplication([('/playlist_header.js', PlaylistHeaderHandler),('/playlist_track.js', PlaylistTrackHandler),('/', IndexHandler)],
                                       debug=True)
  wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
  main()
