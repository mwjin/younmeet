from django.db import models
from user.models import User
from room.models import Room

class free_time(models.Model):
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    user = models.ForeignKey(
        User,
        related_name='free_times',
        null=True
    )

    room = models.ForeignKey(
        Room,
        related_name='free_times',
        null=True
    )

# Create your models here.
