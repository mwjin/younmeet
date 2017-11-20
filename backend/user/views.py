import json

from django.contrib.auth import authenticate, login, logout
from django.forms.models import model_to_dict
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseForbidden, HttpResponseNotFound, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.forms.models import model_to_dict
from user.models import User
from room.models import Room
import json


"""
@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])
"""


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        email = req_data['email']
        username = req_data['username']
        password = req_data['password']
        User.objects.create_user(email=email, password=password, username=username)
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['POST'])


@ensure_csrf_cookie
@csrf_exempt
def signin(request):
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        password = req_data['password']

        if 'email' in req_data:
            email = req_data['email']

        else:  # Username
            try:
                email = User.objects.get(username=req_data['username']).email
            except User.DoesNotExist:
                return HttpResponse(status=401)

        user = authenticate(email=email, password=password)

        if user is not None:
            login(request, user)
            return HttpResponse(status=200)
        else:
            return HttpResponse(status=401)  # Unauthorized user

    else:
        return HttpResponseNotAllowed(['POST'])


def signout(request):
    if not request.user.is_authenticated():
        return HttpResponse(status=401)

    if request.method == 'GET':
        logout(request)
        return HttpResponse(status=200)
    else:
        return HttpResponseNotAllowed(['GET'])


def user_detail(request):
    user = request.user

    if not user.is_authenticated():
        return HttpResponse(status=401)

    if request.method == 'GET':
        dict_model = model_to_dict(user)
        dict_user_info = {'id': dict_model['id'],
                          'email': dict_model['email'],
                          'username': dict_model['username']}

        return JsonResponse(dict_user_info)

    elif request.method == 'PUT':
        req_new_password = json.loads(request.body.decode())  # Deserialization
        new_password = req_new_password['password']

        user.set_password(new_password)
        user.save()

        return HttpResponse(status=204)

    elif request.method == 'DELETE':
        user.delete()
        return HttpResponse(status=204)

    else:
        return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])


def user_owned_room_list(request):
    user = request.user

    if not user.is_authenticated():
        return HttpResponse(status=401)

    if request.method == 'GET':
        return JsonResponse(list(user.owned_rooms.all().values()), safe=False)

    else:
        return HttpResponseNotAllowed(['GET'])


def user_joined_room_list(request):
    user = request.user

    if not user.is_authenticated():
        return HttpResponse(status=401)

    if request.method == 'GET':
        return JsonResponse(list(user.joined_rooms.all().values()), safe=False)

    else:
        return HttpResponseNotAllowed(['GET'])
