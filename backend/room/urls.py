from django.conf.urls import url
from .views import *

urlpatterns = [
    url(r'^rooms$', room_list, name='^room_list'),
    url(r'^rooms/(?P<room_id>[0-9]+)$', room_detail, name='^room_detail'),
    url(r'^rooms/(?P<room_id>[0-9]+)/members$', room_members, name='^room_members'),
    url(r'^rooms/hash/(?P<room_hash>[A-Za-z0-9]+)$', room_detail_hash, name='^room_detail_hash'),
]
