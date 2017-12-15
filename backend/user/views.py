from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.forms.models import model_to_dict
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseForbidden, HttpResponseNotFound, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.forms.models import model_to_dict
from user.models import User
from room.models import Room

import json
import string
import random


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
        name = req_data['name']

        User.objects.create_user(email=email, password=password, username=username, name=name)

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


@ensure_csrf_cookie
@csrf_exempt
def signin_nonuser(request):
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())

        username = ''.join(random.choices(string.ascii_letters + string.digits, k=64))
        email = username + '@nonuser.com'
        password = User.objects.make_random_password()
        name = req_data['name']

        User.objects.create_user(email=email, password=password, username=username, name=name, is_fake=True)

        user = authenticate(email=email, password=password)
        login(request, user)

        return HttpResponse(status=200)

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
                          'username': dict_model['username'],
                          'name': dict_model['name']}

        return JsonResponse(dict_user_info)

    elif request.method == 'PUT':
        req_data = json.loads(request.body.decode())  # Deserialization

        new_password = req_data['password']
        new_name = req_data['name']

        user.set_password(new_password)
        user.name = new_name
        user.save()

        update_session_auth_hash(request, user)

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
        room_list =list(user.owned_rooms.all())
        result = []
        for room in room_list:
            dict = model_to_dict(room, exclude='members')
            dict['member_count'] = len(list(room.members.all().values()))
            result.append(dict)
        return JsonResponse(result, safe=False)

    else:
        return HttpResponseNotAllowed(['GET'])


def user_joined_room_list(request):
    user = request.user

    if not user.is_authenticated():
        return HttpResponse(status=401)

    if request.method == 'GET':
        room_list = list(user.joined_rooms.all())
        result = []
        for room in room_list:
            dict = model_to_dict(room, exclude='members')
            dict['member_count'] = len(list(room.members.all().values()))
            result.append(dict)
        return JsonResponse(result, safe=False)

    else:
        return HttpResponseNotAllowed(['GET'])


def check_password(request):
    user = request.user
    if not user.is_authenticated():
        return HttpResponse(status=401)
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        password = req_data['password']
        if user.check_password(password):
            return JsonResponse(True, safe=False)
        else:
            return JsonResponse(False, safe=False)
    else:
        return HttpResponseNotAllowed(['POST'])

