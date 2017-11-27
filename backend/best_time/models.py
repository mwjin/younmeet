from django.db import models
from room.models import Room
from django.conf import settings


class BestTime(models.Model):
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    room = models.ForeignKey(
        Room,
        related_name='best_times',
    )

    full_attend = models.ManyToManyField(
        # each user has many fully attend best time
        # each best time has many fully attend user
        settings.AUTH_USER_MODEL,
        related_name='fully_attend_time',
    )
