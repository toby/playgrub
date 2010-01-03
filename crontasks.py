import logging
import os
import wsgiref.handlers
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext import db
from models import PlaylistTrack
from models import PlaygrubChartEntry

class GenerateCharts(webapp.RequestHandler):
	def get(self):
		# Scale down all scores so more recently added tracks are more prominant
		for entry in PlaygrubChartEntry.all():
			if (entry.score > 0.1):
				entry.score *= 0.95
				entry.put()
			else:
				entry.delete()
		
		# List all tracks that haven't been processed for charts
		for track in PlaylistTrack.gql('where charted = :1', False):
			entries = PlaygrubChartEntry.gql('where artist = :1 and track = :2',track.artist,track.track)
			if (entries.count() == 0):
				entry = PlaygrubChartEntry(artist = track.artist,track = track.track,score = 1.0)
			else:
				entry = entries.fetch(1)[0]
				entry.score += 1
			entry.put()
			try:
				print "Incremented \""+entry.track+"\" - "+entry.artist+" to "+str(entry.score)
			except:
				print "Some UTF-8 encoded track name, CBA to figure out how to echo them :P"
			track.charted = True
			track.put()
	
def main():
  application = webapp.WSGIApplication([('/cron/charts', GenerateCharts)],
                                       debug=True)
  wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
  main()
