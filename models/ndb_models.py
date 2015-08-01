from google.appengine.ext import ndb

# NDB Model
# Used to store the item in NDB. Note the required properties
class ItemModel(ndb.Model):
    # Name of the Item
    name = ndb.StringProperty(required = True)
    # Reason it is Required
    reason = ndb.StringProperty(required = True)
    # Who requested the item?
    requested_by = ndb.StringProperty(required = True)
    # Cost of the Item
    cost = ndb.FloatProperty()
    # Link to the resource
    link = ndb.StringProperty()
    # Date Requested
    date = ndb.DateTimeProperty(auto_now_add = True)
    # Did the Cryso Approve It?
    cryso_approved = ndb.BooleanProperty()
    # Did the Pylo Approve It?
    pylo_approved = ndb.BooleanProperty()
    # Status of the Request
    status = ndb.IntegerProperty()

class Approver(ndb.Model):
    # E-Mail
    email = ndb.StringProperty(required = True)
    # position
    position = ndb.StringProperty(required = True)
