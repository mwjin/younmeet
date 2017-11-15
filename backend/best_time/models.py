from django.db import models
from room.models import Room

class BestTime(models.Model):
    start = models.DateTimeField()
    end = models.DateTimeField()

    room = models.ForeignKey(
        Room,
        related_name='best_times',
    )
