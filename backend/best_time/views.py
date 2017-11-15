from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse
from django.forms.models import model_to_dict
from .models import BestTime
from room.models import Room
from datetime import datetime, timedelta
import json


def best_time_list(request, room_id):

    if not request.user.is_authenticated():
        return HttpResponse(status=401)

    room_id = int(room_id)

    try:
        Room.objects.get(id=room_id)
    except Room.DoesNotExist:
        return HttpResponseNotFound()

    if request.method == 'GET':
        return JsonResponse(
            list(BestTime.objects.filter(room_id=room_id).values()),
            safe=False
        )

    else:
        return HttpResponseNotAllowed(['GET'])
