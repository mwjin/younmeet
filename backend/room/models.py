from django.db import models
from user.models import User


class Room(models.Model):
    name = models.CharField(max_length=64)
    place = models.CharField(max_length=64)
    best_start_time = models.DateTimeField()
    best_end_time = models.DateTimeField()
    min_time_required = models.DateTimeField()

    users = models.ManyToManyField(
        User,
        related_name='rooms',
    )
# Create your models here.
