'''
API for the Backend System
'''

import endpoints

from google.appengine.ext import ndb
from protorpc import remote

from endpoints_proto_datastore.ndb import EndpointsModel

# Basic Definition of an Item
class Item(EndpointsModel):
    # Name of the Item
    name = ndb.StringProperty(required = True)
    # Reason it is Required
    reason = ndb.StringProperty(required = True)
    # Date Requested
    date = ndb.DateTimeProperty(auto_now_add = True)
    # Did the Cryso Approve It?
    cryso_approved = ndb.BooleanProperty()
    # Did the Pylo Approve It?
    pylo_approved = ndb.BooleanProperty()
    # Status of the Request
    status = ndb.IntegerProperty()

@endpoints.api(name = 'items_api', version='v1', description='API for the Item Tracker')
class ItemsApi(remote.Service):

    @Item.method(path='item', http_method='POST', name='item.insert')
    def ItemInsert(self, item_):
        item_.put()
        return item_

    @Item.query_method(path='items', name='item.list')
    def ItemList(self, query):
        return query



app = endpoints.api_server([ItemsApi], restricted=False)
