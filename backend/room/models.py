from django.db import models
from django.conf import settings
from datetime import datetime

class Room(models.Model):
    name = models.CharField(max_length=64)
    place = models.CharField(max_length=64)
    best_start_time = models.DateTimeField(blank=True)
    best_end_time = models.DateTimeField(blank=True)
    min_time_required = models.DateTimeField(blank=True)
    created_time = models.DateTimeField(default=datetime.now, blank=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='created_room',
        null=True
    )
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='rooms',
    )
