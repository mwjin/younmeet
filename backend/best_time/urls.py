from django.conf.urls import url
from .views import *

urlpatterns = [
    url(r'^rooms/(?P<room_id>[0-9]+)/best-times$', best_time_list, name='^best_times'),
]
