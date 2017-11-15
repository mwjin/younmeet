from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse
from django.forms.models import model_to_dict
from .models import FreeTime
from room.models import Room
from datetime import datetime, timedelta
import json


def free_time_list(request, room_id):

    if not request.user.is_authenticated():
        return HttpResponse(status=401)

    user = request.user
    room_id = int(room_id)

    try:
        current_room = Room.objects.get(id=room_id)

    except Room.DoesNotExist:
        return HttpResponseNotFound()

    if request.method == 'GET':
        return JsonResponse(
            list(FreeTime.objects.filter(user_id=user.id).filter(room_id=room_id).values()),
            safe=False
        )

    elif request.method == 'POST':
        old_free_times = list(FreeTime.objects.filter(user_id=user.id).filter(room_id=room_id).values())

        for old_free_time in old_free_times:
            old_free_time.delete()

        # New free times
        free_time_jsons = request.POST.getlist()

        for free_time_json in free_time_jsons:
            free_time_data = json.loads(free_time_json)

            start_time = datetime.strptime(free_time_data['start_time'])
            end_time = datetime.strptime(free_time_data['end_time'])

            new_free_time = FreeTime(
                start_time=start_time,
                end_time=end_time,
                user=user,
                room=current_room,
            )
            new_free_time.save()

        return HttpResponse(status=201)

    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

"""
def free_time_detail(request):
    
    if not request.user.is_authenticated():
        return HttpResponse(status=401)
    
    user = request.user
    
    if request.method == 'GET':
        
        return 1
  
    elif request.method == 'PUT':
        return 1
  
    elif request.method == 'DELETE':
        return 1
    
    else:
        return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])
"""