import os
import wsgiref.handlers
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template


class IndexHandler(webapp.RequestHandler):

  def get(self):
    template_values = {}
    path = os.path.join(os.path.dirname(__file__), 'index.html')
    self.response.out.write(template.render(path, template_values))



class PlaylistPublishHandler(webapp.RequestHandler):

  def get(self):
    self.response.out.write('broadcast_songs();')


def main():
  application = webapp.WSGIApplication([('/post.js', PlaylistPublishHandler),('/', IndexHandler)],
                                       debug=True)
  wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
  main()
