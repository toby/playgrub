import logging
import os
import wsgiref.handlers
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext import db
from models import PlaygrubAccount


class AccountsAdmin(webapp.RequestHandler):

    def post(self):
      service = self.request.get('service')
      user = self.request.get('user')
      password = self.request.get('password')

      q = PlaygrubAccount.gql('where service = :1', service)
      if(q.count(1) > 0):
          account = q.fetch(1)[0]
      else:
          account = PlaygrubAccount()

      account.service = service
      account.user = user
      account.password = password
      db.put(account)

      q = PlaygrubAccount.all()
      accounts = q.fetch(100)

      template_values = {
          'accounts': accounts,
          }
      path = os.path.join(os.path.dirname(__file__), 'html/admin_accounts.html')
      self.response.out.write(template.render(path, template_values))

    def get(self):
      delete = self.request.get('delete')
      if delete:
          account = db.get(delete)
          account.delete()

      q = PlaygrubAccount.all()
      accounts = q.fetch(100)

      template_values = {
          'accounts': accounts,
          }
      path = os.path.join(os.path.dirname(__file__), 'html/admin_accounts.html')
      self.response.out.write(template.render(path, template_values))


def main():
  application = webapp.WSGIApplication([('/admin/accounts', AccountsAdmin)],
                                       debug=True)
  wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
  main()
