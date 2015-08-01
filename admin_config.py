import models.ndb_models as ndb_models
import webapp2
import os

MAIN_PAGE_HTML = """\
<html>
  <body>
    <form action="/admin/create" method="post">
      <div><input type="email" name="email"/></div>
      <div><input type="text" name="position"/></div>
      <div><input type="submit" value="Sign Guestbook"></div>
    </form>
  </body>
</html>
"""

# Handled Automatic Deletion of Items that Are Either Purchased or Rejected
class CreateApprover(webapp2.RequestHandler):
    def post(self):
        email = self.request.get('email')
        position = self.request.get('position')
        approver = ndb_models.Approver(email = email, position = position)
        approver.put()
        self.redirect('/')
    def get(self):
        f = open('static/create_approver.html')
    	self.response.headers['Content-Type'] = 'text/html'
        self.response.write(f.read())
        f.close()


app = webapp2.WSGIApplication([
    ('/admin/create', CreateApprover)
], debug=True)
