import os
import urllib
import webapp2



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

class StaticApproveItemsHandler(webapp2.RequestHandler):
    def get(self):
        try:
            f = open('static/approve.html')
            self.response.headers['Content-Type'] = 'text/html'
            self.response.write(f.read())
            f.close()
        except IOError:
            self.response.headers['Content-Type'] = 'text/plain'
            self.response.write('Error')
            self.error(401)




class StaticBuyItemsHandler(webapp2.RequestHandler):
    def get(self):
        f = open('static/buy.html')
    	self.response.headers['Content-Type'] = 'text/html'
        self.response.write(f.read())
        f.close()

app = webapp2.WSGIApplication([
    ('/', StaticIndexHandler),
    ('/buy',StaticBuyItemsHandler),
    ('/approve',StaticApproveItemsHandler)
], debug=True)
