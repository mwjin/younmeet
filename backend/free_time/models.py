from django.db import models
from django.conf import settings
from room.models import Room


class FreeTime(models.Model):
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='free_times',
        null=True
    )

    room = models.ForeignKey(
        Room,
        related_name='free_times',
        null=True
    )

# Create your models here.
