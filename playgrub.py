import wsgiref.handlers
from google.appengine.ext import webapp

class PlaylistPublishHandler(webapp.RequestHandler):

  def post(self):
    self.response.out.write('Hello world!')


def main():
  application = webapp.WSGIApplication([('/post', PlaylistPublishHandler)],
                                       debug=True)
  wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
  main()
