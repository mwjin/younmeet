from django.db import models
from best_time.models import BestTime


# Create your models here.

class PartialAttendInfo(models.Model):
    username = models.CharField(max_length=64, null=False)
    start = models.DateTimeField(null=True)
    end = models.DateTimeField(null=True)

    best_time = models.ForeignKey(
        BestTime,
        related_name='partial_attend'
    )
