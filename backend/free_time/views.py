from dateutil.parser import parse
from datetime import timezone, timedelta
from dateutil.tz import gettz

from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse
from django.forms.models import model_to_dict

from .models import FreeTime
from .best_time_calculator import BestTimeCalculator
from best_time.models import BestTime
from room.models import Room
from user.models import User
from partial_attend_info.models import PartialAttendInfo
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
        previous_free_times = list(FreeTime.objects.filter(user_id=user.id).filter(room_id=room_id).values())
        for time in previous_free_times:
            time['start_time'] = time['start_time'].strftime('%Y-%m-%dT%H:%M:%SZ')
            time['end_time'] = time['end_time'].strftime('%Y-%m-%dT%H:%M:%SZ')
        return JsonResponse(
            previous_free_times,
            safe=False
        )

    elif request.method == 'POST':

        # add user to the room members, redundant adding is OK
        current_room.members.add(user)

        # delete previous free times
        old_free_times = FreeTime.objects.filter(user_id=user.id).filter(room_id=room_id)
        for old_free_time in old_free_times:
            old_free_time.delete()

        # Add new free times
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

        # delete old best time and replace it with a new one
        best_times = BestTime.objects.filter(room_id=room_id)
        for best_time in best_times:
            best_time.delete()

        # Calculate new best time
        new_free_time_dic = list(FreeTime.objects.filter(room_id=room_id).values('start_time', 'end_time', 'user'))
        new_free_time_list = []

        for free_time in new_free_time_dic:
            new_free_time_list.append((free_time['start_time'],
                                       free_time['end_time'],
                                       free_time['user']))

        best_time_calculator = BestTimeCalculator(
            current_room.min_time_required,
            current_room.min_members,
        )  # default k=3

        best_time_calculator.insert_time(new_free_time_list)
        best_time_calculator.calculate_best_times()
        best_times = best_time_calculator.get_best_times()
        current_room.best_start_time = best_times[0].start;
        current_room.save()
        for time in best_times:
            print(time)
            full_attend_members = time.full_attend
            partial_attend_members = time.partial_attend
            new_best_time = BestTime(
                room=current_room,
                start_time=time.start,
                end_time=time.end,
            )
            new_best_time.save()
            print(partial_attend_members.keys())
            for user_id in partial_attend_members.keys():
                partial_info = PartialAttendInfo(
                    username=User.objects.get(id=user_id).name,
                    start=partial_attend_members[user_id]['start'],
                    end=partial_attend_members[user_id]['end'],
                    best_time=new_best_time
                )
                partial_info.save()
            for user_id in full_attend_members:
                new_best_time.full_attend.add(User.objects.get(id=user_id))
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])
