from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse
from django.forms.models import model_to_dict
from .models import FreeTime
from .best_time_calculator import BestTimeCalculator
from best_time.models import BestTime
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

            start_time = datetime.strptime(free_time_data['start_time'], '%Y-%m-%d %H:%M')
            end_time = datetime.strptime(free_time_data['end_time'], '%Y-%m-%d %H:%M')

            new_free_time = FreeTime(
                start_time=start_time,
                end_time=end_time,
                user=user,
                room=current_room,
            )
            new_free_time.save()

        # Calculate new best time
        new_free_time_list = list(FreeTime.objects.filter(room_id=room_id).values())

        btc = BestTimeCalculator(
            current_room.min_time_required,
            current_room.min_members,
        )   # default k=3
        btc.insert_time(new_free_time_list)
        result = btc.calculate_best_time()

        for t in result:
            new_best_time = BestTime(
                room=current_room,
                start_time=t[1],
                end_time=t[2]
            )
            new_best_time.save()

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