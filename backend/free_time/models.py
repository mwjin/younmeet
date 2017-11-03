from django.db import models

class free_time(models.Model):
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

# Create your models here.
