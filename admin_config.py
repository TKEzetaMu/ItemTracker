import models.ndb_models as ndb_models
import webapp2
import os

import os
import urllib

from google.appengine.ext import ndb

import jinja2

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__) + '/static'),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

# Handled Automatic Deletion of Items that Are Either Purchased or Rejected
class CreateApprover(webapp2.RequestHandler):
    def post(self):
        email = self.request.get('email')
        position = self.request.get('position')
        approver = ndb_models.Approver(email = email, position = position)
        approver.put()
        self.redirect('/')
    def get(self):
        '''
        f = open('static/create_approver.html')
    	self.response.headers['Content-Type'] = 'text/html'
        self.response.write(f.read())
        f.close()
        '''
        approvers = ndb_models.Approver.query()
        template_values = {
            'approvers': approvers,
        }
        self.response.headers['Content-Type'] = 'text/html'
        template = JINJA_ENVIRONMENT.get_template('create_approver.html')
        self.response.write(template.render(template_values))


app = webapp2.WSGIApplication([
    ('/admin/create', CreateApprover)
], debug=True)
