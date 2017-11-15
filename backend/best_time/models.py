from django.db import models
from room.models import Room


class BestTime(models.Model):
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    room = models.ForeignKey(
        Room,
        related_name='best_times',
    )
