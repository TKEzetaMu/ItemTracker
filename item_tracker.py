import os
import urllib
import webapp2
import json

# Send's back the static HTML for the Index Page
class StaticIndexHandler(webapp2.RequestHandler):
    def get(self):
    	f = open('static/index.html')
    	self.response.headers['Content-Type'] = 'text/html'
        self.response.write(f.read())
        f.close()

# Send's back the static HTML for the Items Page
class StaticCreateItemHandler(webapp2.RequestHandler):
	def get(self):
		self.response.headers['Content-Type'] = 'text/plain'
		self.response.write('Items Go Here')


class ApiItemsHandler(webapp2.RequestHandler):
	def get(self):
		#TODO: Implement Database instead of Static Data
		data = [{'id':0,'name':'Bleach', 'status':'Awaiting Approval', 'price':12.0, 'link':'google.com', 'reason_needed':'Clean the Bathrooms'}]
		data_string = json.dumps(data, sort_keys=True, indent=2)
		self.response.headers['Content-Type'] = 'application/json'
		self.response.write(data_string)



app = webapp2.WSGIApplication([
    ('/', StaticIndexHandler),
    ('/items',StaticCreateItemHandler),
    ('/api/items',ApiItemsHandler)
], debug=True)