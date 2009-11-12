from google.appengine.ext import db

class PlaylistTrack(db.Model):
  artist = db.StringProperty(required=True)
  track = db.StringProperty(required=True)
  index = db.IntegerProperty(required=True)
  playlist = db.StringProperty(required=True)
  create_date = db.DateTimeProperty(required=True)

class PlaylistHeader(db.Model):
  title = db.StringProperty(required=True)
  url= db.StringProperty(required=True)
  playlist = db.StringProperty(required=True)
  songs = db.StringProperty(required=True)
  create_date = db.DateTimeProperty(required=True)

class PlaygrubAccount(db.Model):
  service = db.StringProperty()
  user = db.StringProperty()
  password = db.StringProperty()
