import models.ndb_models as ndb_models
import webapp2

# Handled Automatic Deletion of Items that Are Either Purchased or Rejected
class CronJobDeleteHandler(webapp2.RequestHandler):
    def get(self):
        i = 0
        # Query all Items that are Status >= 4
        # Delete all of them
        for item in ndb_models.ItemModel.query(ndb_models.ItemModel.status >= 4):
            item.key.delete()
            i = i + 1
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write('Sucessfully Deleted: '+str(i)+' entries from the database')

cronApp = webapp2.WSGIApplication([
    ('/jobs/delete', CronJobDeleteHandler)
], debug=True)
