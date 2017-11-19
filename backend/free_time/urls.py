from django.conf.urls import url
from .views import *

urlpatterns = [
    url(r'^rooms/(?P<room_id>[0-9]+)/free-times$', free_time_list, name='^free_times'),
]
