import models
import logging
import os
import re
import urlparse
import datetime
import hashlib
import wsgiref.handlers
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext import db
import models
from models import PlaygrubAccount


class AccountsAdmin(webapp.RequestHandler):
    q = PlaygrubAccount.gql("where service = :1 limit 1", 'twitter');
    aresults = q.fetch(1)
    if q.count(1) > 0:
        account = aresults[0]
    else:
        account = None

    def post(self):
      account = self.account
      logging.error("account -> %s", account)
      if account == None:
          account = PlaygrubAccount(service = 'twitter')
      account.user = self.request.get('user')
      account.password = self.request.get('password')
      db.put(account)
      template_values = {
          'account': account,
          }
      path = os.path.join(os.path.dirname(__file__), 'html/admin_accounts.html')
      self.response.out.write(template.render(path, template_values))

    def get(self):
      account = self.account
      template_values = {
          'account': account,
          }
      path = os.path.join(os.path.dirname(__file__), 'html/admin_accounts.html')
      self.response.out.write(template.render(path, template_values))


def main():
  application = webapp.WSGIApplication([('/admin/accounts', AccountsAdmin)],
                                       debug=True)
  wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
  main()
