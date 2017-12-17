from django.db import models
from django.conf import settings
from django.db.models.signals import post_save

from hashids import Hashids

'''
auto_now_add=True will create a warning which is inevitable according to 
https://groups.google.com/forum/#!topic/django-users/pm6F9RSEGPk

'''


class Room(models.Model):
    name = models.CharField(max_length=64)
    place = models.CharField(max_length=64, null=True)

    time_span_start = models.DateTimeField(null=True)
    time_span_end = models.DateTimeField(null=True)
    min_time_required = models.DurationField(null=True, blank=True)
    created_time = models.DateTimeField(auto_now_add=True)

    min_members = models.IntegerField(default=1)

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='owned_rooms',
        null=True,
    )

    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='joined_rooms',
    )
    latitude = models.FloatField(null=True)
    longitude = models.FloatField(null=True)

    hashid = models.CharField(max_length=16, null=True, blank=True)

    hashids = Hashids(salt='lasagna is very delicious', min_length=7)
    anonymity = models.BooleanField(default=False)
    best_start_time = models.DateTimeField(null=True)

    def get_hash(id_num):
        return Room.hashids.encode(id_num)

    def decode_hash(hash_str):
        result = Room.hashids.decode(hash_str)
        if result == ():
            return None
        return result[0]

    # TODO: Implement member functions for make best times.


# function that inits hashid field at room object creation
def init_hashid(**kwargs):
    instance = kwargs.get('instance')
    instance.hashid = Room.get_hash(int(instance.id))


post_save.connect(init_hashid, Room)
