from dateutil.parser import parse

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
        old_free_times = FreeTime.objects.filter(user_id=user.id).filter(room_id=room_id)

        for old_free_time in old_free_times:
            old_free_time.delete()

        # New free times
        data = json.loads(request.body.decode())

        for free_time in data:

            start = parse(free_time['start'], ignoretz=True)
            end = parse(free_time['end'], ignoretz=True)

            new_free_time = FreeTime(
                start_time=start,
                end_time=end,
                user=user,
                room=current_room,
            )
            new_free_time.save()

        # Calculate new best time
        new_free_time_dic = list(FreeTime.objects.filter(room_id=room_id).values('start_time', 'end_time'))
        new_free_time_list = []
        print(new_free_time_dic)
        for ft in new_free_time_dic:
            print(ft)
            new_free_time_list.append((ft['start_time'], ft['end_time']))
        print()
        print(new_free_time_list)
        print()


        btc = BestTimeCalculator(
            current_room.min_time_required,
            current_room.min_members,
        )   # default k=3
        btc.insert_time(new_free_time_list)
        result = btc.calculate_best_time()

        # delete old best time and replace it with a new one
        best_times = BestTime.objects.filter(room_id=room_id)
        for bt in best_times:
            bt.delete()

        # replace best time
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