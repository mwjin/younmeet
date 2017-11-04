from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse
from django.forms.models import model_to_dict
from datetime import datetime
from .models import Room
import json
'''
def heroList(request):
if request.method == 'GET':
# Serialization
return JsonResponse( list(Hero.objects.all().values()), safe=False)
elif request.method == 'POST':
name = json.loads(request.body.decode())[ 'name']
# Deserialization
new_hero = Hero(name=name)
new_hero.save()
return HttpResponse( status=201) # 201 is 'created' response code
else:
# only GET and POST methods are allowed for this url
return HttpResponseNotAllowed([ 'GET', 'POST'])


def heroDetail (request, hero_id):
hero_id = int(hero_id)
if request.method == 'GET':
try:
hero = Hero.objects.get( id=hero_id)
except Hero.DoesNotExist:
return HttpResponseNotFound()
return JsonResponse(model_to_dict(hero))
elif request.method == 'PUT':
name = json.loads(request.body.decode())[ 'name']
try:
hero = Hero.objects.get( id=hero_id)
except Hero.DoesNotExist:
return HttpResponseNotFound()
hero.name = name
hero.save()
return HttpResponse( status=204) # 'No content' response

elif request.method == 'DELETE':
try:
hero = Hero.objects.get( id=hero_id)
except Hero.DoesNotExist:
return HttpResponseNotFound()
hero.delete()
return HttpResponse( status=204) # 'No content' response
else:
# only GET, PUT and DELETE methods are allowed for this url
return HttpResponseNotAllowed([ 'GET', 'PUT', 'DELETE'])
'''

# TODO: user authentication for all methods

def room_list(request):
    # GET, POST
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
        new_room.user.add(user)
        return HttpResponse( status=201)

    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

def room_detail(request):
    #GET, DELETE
    pass 

def room_user_list(request):
    #GET
    pass