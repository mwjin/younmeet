from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse
from django.forms.models import model_to_dict
from datetime import datetime
from .models import Room
import json



def room_list(request):
    if not request.user.is_authenticated():
        return HttpResponse(status=401)
    user = request.user

    if request.method == 'GET':
        return JsonResponse(list(Room.objects.get(user=user).values()))

    elif request.method == 'POST':
        data = json.loads(request.body.decode())
        name = data['name']
        place = data['place']
        min_time_required = data['min_time_required']
        created_time = datetime.now()
        new_room = Room(
            name=name,
            place=place,
            min_time_required=min_time_required,
            created_time=created_time,
            owner=user
        )
        new_room.save()
        # does not add this user to new_room.users
        # room.user is only added when selecting free_time
        return HttpResponse( status=201)

    else:
        return HttpResponseNotAllowed(['GET', 'POST'])


def room_detail(request, room_id):

    if not request.user.is_authenticated():
        return HttpResponse(status=401)

    room_id = int(room_id)
    try:
        room = Room.objects.get(id=room_id)
    except Room.DoesNotExist:
        return HttpResponseNotFound()

    if request.method == 'GET':
        return JsonResponse(model_to_dict(room))

    elif request.method == 'DELETE':
        room.delete()
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET', 'DELETE'])


def room_users(request, room_id):
    if not request.user.is_authenticated():
        return HttpResponse(status=401)

    room_id = int(room_id)
    try:
        room = Room.objects.get(id=room_id)
    except Room.DoesNotExist:
        return HttpResponseNotFound()

    if request.method == 'GET':
        return JsonResponse(list(room.users.all().values()))
    else:
        return HttpResponseNotAllowed(['GET'])

