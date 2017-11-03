from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    google_accounts = models.CharField(max_length=64, default='')
    pass

class Room(models.Model):
    name = models.CharField(max_length=64)
    place = models.CharField(max_length=64)
    best_start_time = models.DateTimeField()
    best_end_time = models.DateTimeField()
    min_time_required = models.DateTimeField()

# Create your models here.
