from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse
from django.forms.models import model_to_dict
from .models import Room
from datetime import datetime, timedelta
import json


def room_list(request):

    if not request.user.is_authenticated():
        return HttpResponse(status=401)

    user = request.user

    if request.method == 'GET':
        return JsonResponse(list(Room.objects.all().values()), safe=False)
        # return JsonResponse(list(Room.objects.filter(members__id=user.id).values()), safe=False)

    elif request.method == 'POST':
        data = json.loads(request.body.decode())
        name = data['name']
        place = data['place']
        t = int(data['min_time_required'])
        min_time_required = timedelta(hours=t/60, minutes=t%60)
        new_room = Room(
            name=name,
            place=place,
            min_time_required=min_time_required,
            owner=user
        )
        new_room.save()

        new_room.members.add(user)
        new_room.save()

        # does not add this user to new_room.users
        # room.user is only added when selecting free_time
        return JsonResponse(model_to_dict(new_room, exclude='members'), safe=False)

    else:
        return HttpResponseNotAllowed(['GET', 'POST'])


def room_detail(request, room_id):
    if not request.user.is_authenticated():
        return HttpResponse(status=401)

    try:
        room = Room.objects.get(id=room_id)
    except Room.DoesNotExist:
        return HttpResponseNotFound()

    '''  
    TODO: Object of type 'User' is not JSON serializable
    members of the room are currently excluded
    '''
    if request.method == 'GET':
        return JsonResponse(model_to_dict(room, exclude='members'), safe=False)

    elif request.method == 'DELETE':
        room.delete()
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET', 'DELETE'])


def room_members(request, room_id):
    if not request.user.is_authenticated():
        return HttpResponse(status=401)

    room_id = int(room_id)
    try:
        room = Room.objects.get(id=room_id)
    except Room.DoesNotExist:
        return HttpResponseNotFound()

    if request.method == 'GET':
        return JsonResponse(list(room.members.all().values('id')), safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])

