import os
import urllib
import webapp2

# Send's back the static HTML for the Index Page
class StaticIndexHandler(webapp2.RequestHandler):
    def get(self):
    	f = open('static/index.html')
    	self.response.headers['Content-Type'] = 'text/html'
        self.response.write(f.read())

# Send's back the static HTML for the Items Page
class StaticCreateItemHandler(webapp2.RequestHandler):
	def get(self):
		self.response.headers['Content-Type'] = 'text/plain'
		self.response.write('Items Go Here')

app = webapp2.WSGIApplication([
    ('/', StaticIndexHandler),
    ('/items',StaticCreateItemHandler)
], debug=True)