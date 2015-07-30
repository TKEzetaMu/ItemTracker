'''
API for the Backend System
'''

import endpoints

from google.appengine.ext import ndb
from protorpc import remote
from protorpc import messages
from protorpc import message_types

# Remove all Proto Datastore Code
#from endpoints_proto_datastore.ndb import EndpointsModel


# NDB Model
# Used to store the item in NDB. Note the required properties
class ItemModel(ndb.Model):
    # Name of the Item
    name = ndb.StringProperty(required = True)
    # Reason it is Required
    reason = ndb.StringProperty(required = True)
    # Who requested the item?
    requested_by = ndb.StringProperty(required = True)
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

# This is the request and the response when you make an item
class MakeItemRequestResponse(messages.Message):
    # Here we are only requested the two required properties and an optional link. The next ones can be inferred or default

    # See NDB model 'name'
    name = messages.StringField(1, required = True)
    # See NDB Model 'reason'
    reason = messages.StringField(2, required = True)
    # Who requested it
    requested_by = messages.StringField(3, required = True)
    # Optional Link(Url)
    link = messages.StringField(4)
    #only used for response
    urlsafeX = messages.StringField(5)

class ItemResponse(messages.Message):
    # Here we are only requested the two required properties and an optional link. The next ones can be inferred or default

    # See NDB model 'name'
    name = messages.StringField(1, required = True)
    # See NDB Model 'reason'
    reason = messages.StringField(2, required = True)
    # Who requested it
    requested_by = messages.StringField(3, required = True)
    # Optional Link(Url)
    link = messages.StringField(4)
    #only used for response
    urlsafe = messages.StringField(5)
    # Date Requested
    date = messages.StringField(6)
    # Did the Cryso Approve It?
    cryso_approved = messages.BooleanField(7)
    # Did the Pylo Approve It?
    pylo_approved = messages.BooleanField(8)
    # Status of the Request
    status = messages.IntegerField(9)

# List of items
class ItemResponseList(messages.Message):
    items = messages.MessageField(ItemResponse, 1, repeated = True)

# This is what allows someone to change an item
class ChangeItemRequestResponse(messages.Message):
    # NDB id
    identifier = messages.StringField(1, required = True)
    # Did the Cryso Approve It?
    cryso_approved = messages.BooleanField(2)
    # Did the Pylo Approve It?
    pylo_approved = messages.BooleanField(3)
    # Status of the Request
    status = messages.IntegerField(4)

class ItemIdRequest(messages.Message):
    # NDB id
    identifier = messages.StringField(1, required = True)

@endpoints.api(name = 'items_api', version='v1', description='API for the Item Tracker')
class ItemsApi(remote.Service):

    @endpoints.method(MakeItemRequestResponse, ItemResponse,
    path='item', http_method='POST',
    name='items.make')
    def make_item(self, request):
        try:
            item = ItemModel(name = request.name, reason = request.reason, link = request.link, cryso_approved = False, pylo_approved = False, status = 0, requested_by = request.requested_by)
            item.put()
            response = ItemResponse(name = item.name, reason = item.reason, link = item.link, cryso_approved = item.cryso_approved, pylo_approved = item.pylo_approved, status = 0, urlsafe = item.key.urlsafe(), date = item.date.isoformat(), requested_by = item.requested_by)
            return response
        except ValueError:
            self.error(401)



    @endpoints.method(ChangeItemRequestResponse, ChangeItemRequestResponse,
    path='item/change', http_method = 'PUT',
    name='items.update')
    def update_item(self,request):
        item_key = ndb.Key(urlsafe=request.identifier)
        item = item_key.get()
        if request.cryso_approved == True:
            item.cryso_approved = True
        else:
            request.cryso_approved = item.cryso_approved
        if request.pylo_approved == True:
            item.pylo_approved = True
        else:
            request.pylo_approved = item.pylo_approved
        if(item.cryso_approved and item.pylo_approved):
            item.status = 3
        elif(item.cryso_approved):
            item.status = 2
        elif(item.pylo_approved):
            item.status = 1
        # Deny the item
        if(request.status == 4):
            item.status = 4;
            item.pylo_approved = False;
            item.cryso_approved = False;
        item.put()
        return request

    @endpoints.method(message_types.VoidMessage, ItemResponseList,
    path='items', http_method='GET',
    name = 'items.list')
    def get_items(self,request):
        items_ = []
        for item in ItemModel.query():
            items_.append(ItemResponse(name = item.name, reason = item.reason, link = item.link, cryso_approved = item.cryso_approved, pylo_approved = item.pylo_approved, status = item.status, urlsafe = item.key.urlsafe(), date = item.date.isoformat(), requested_by = item.requested_by))
        return ItemResponseList(items = items_)

    @endpoints.method(ItemIdRequest, ItemResponse,
    path='item', http_method='GET',
    name='item.get')
    def get_item(self,request):
        item_key = ndb.Key(urlsafe=request.identifier)
        item = item_key.get()
        response = ItemResponse(name = item.name, reason = item.reason, link = item.link, cryso_approved = item.cryso_approved, pylo_approved = item.pylo_approved, status = 0, urlsafe = item.key.urlsafe(), date = item.date.isoformat(), requested_by = item.requested_by)
        return response

    # @Item.method(path='item', http_method='POST', name='item.insert')
    # def ItemInsert(self, item_):
    #     item_.put()
    #     return item_
    #
    # @Item.query_method(path='items', name='item.list')
    # def ItemList(self, query):
    #     return query



app = endpoints.api_server([ItemsApi], restricted=False)
