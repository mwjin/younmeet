from django.db import models
from django.conf import settings
from geoposition.fields import GeopositionField

'''
auto_now_add=True will create a warning which is inevitable according to 
https://groups.google.com/forum/#!topic/django-users/pm6F9RSEGPk

'''


class Room(models.Model):
    name = models.CharField(max_length=64)
    place_name = models.CharField(max_length=64, null=True)
    # place_id = models.CharField(max_length=64, null=True)
    position = GeopositionField(null=True)

    min_time_required = models.DurationField(null=True, blank=True)
    created_time = models.DateTimeField(auto_now_add=True)

    time_span_start = models.DateTimeField(null=True)
    time_span_end = models.DateTimeField(null=True)

    min_members = models.IntegerField(default=0)

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='owned_rooms',
        null=False
    )

    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='joined_rooms',
    )

    # TODO: Implement member functions for make best times.
