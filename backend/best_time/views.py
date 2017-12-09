from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse
from .models import BestTime
from room.models import Room
from datetime import datetime


def best_time_list(request, room_id):
    if not request.user.is_authenticated():
        return HttpResponse(status=401)

    room_id = int(room_id)

    try:
        Room.objects.get(id=room_id)
    except Room.DoesNotExist:
        return HttpResponseNotFound()

    if request.method == 'GET':
        best_times = BestTime.objects.filter(room_id=room_id).all()
        best_times_list = []
        current_time = datetime.now()
        for best_time in best_times:
            print(best_time)
            print(current_time)
            print(best_time.start_time)
            if best_time.start_time > current_time:
                best_time_dict = dict()
                best_time_dict['start_time'] = best_time.start_time.strftime('%Y-%m-%dT%H:%M:%SZ')
                best_time_dict['end_time'] = best_time.end_time.strftime('%Y-%m-%dT%H:%M:%SZ')
                best_time_dict['full_attend'] = list(map(lambda user: user.username, list(best_time.full_attend.all())))
                partial_attends = list(best_time.partial_attend.values())
                for partial_attend in partial_attends:
                    partial_attend['start'] = partial_attend['start'].strftime('%Y-%m-%dT%H:%M:%SZ')
                    partial_attend['end'] = partial_attend['end'].strftime('%Y-%m-%dT%H:%M:%SZ')
                best_time_dict['partial_attend'] = partial_attends
                best_times_list.append(best_time_dict)
        return JsonResponse(best_times_list, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])
