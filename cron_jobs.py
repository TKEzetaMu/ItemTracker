import models.ndb_models as ndb_models
from datetime import date
import webapp2

from google.appengine.api import mail

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

class CronJobRemindHandler(webapp2.RequestHandler):

    def notify_new_item(self,item):
        for approver in ndb_models.Approver.query():
            is_pylo = approver.position=='pylo'
            is_cryso = approver.position=='cryso'
            if(is_pylo or is_cryso):
                base_url = 'https://item-tracker.appspot.com/approve?id='+item.key.urlsafe()
                url = ''
                if is_pylo:
                    if(item.pylo_approved):
                        continue
                    url = base_url+'&pylo=1'
                elif is_cryso:
                    if(item.cryso_approved):
                        continue
                    url = base_url+'&cryso=1'
                message = mail.EmailMessage(sender='Item Tracker API<notify@item-tracker.appspotmail.com>', subject='Item Request Waiting')
                message.to = approver.email
                message.body = """
Sup Champ,

You still have a request waiting at:"""+url+"""

Thanks,

Item Tracker Support
"""
                message.send()
    def get(self):
        i = 0
        for item in ndb_models.ItemModel.query():
            d0 = item.date
            d1 = date.today()
            diff = d1.day-d0.day
            if ((diff >= 2) or (d1.month > d0.month) or (d1.year > d0.year)):
                self.notify_new_item(item)
                i = i + 1
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write('Sucessfully Notified: '+str(i)+' entries from the database')


cronApp = webapp2.WSGIApplication([
    ('/jobs/delete', CronJobDeleteHandler),
    ('/jobs/remind',CronJobRemindHandler)
], debug=True)
