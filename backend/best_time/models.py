from django.db import models
from django.contrib.postgres.fields import ArrayField, JSONField
from room.models import Room


class BestTime(models.Model):
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    room = models.ForeignKey(
        Room,
        related_name='best_times',
    )

    full_attend = ArrayField(models.CharField(max_length=200), null=True, blank=True)

    # partial_attend = ArrayField(JSONField(), blank=True, default=[])
