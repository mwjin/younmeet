import json

from django.contrib.auth import authenticate, login, logout
from django.forms.models import model_to_dict
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseForbidden, HttpResponseNotFound, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from user.models import User


@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        email = req_data['email']
        password = req_data['password']
        User.objects.create_user(email=email, password=password)
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['POST'])


def signin(request):
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        email = req_data['email']
        password = req_data['password']
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


def userDetail(request, user_id):
    if not request.user.is_authenticated():
        return HttpResponse(status=401)

    user_id = int(user_id)

    if request.method == 'GET':
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return HttpResponseNotFound()

        # User can only access to his/her own profile.
        if request.user.id != user_id:
            return HttpResponseForbidden()

        return JsonResponse(model_to_dict(user))

    elif request.method == 'PUT':
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return HttpResponseNotFound()

        # User can only access to his/her own profile.
        if request.user.id != user_id:
            return HttpResponseForbidden()

        req_new_password = json.loads(request.body.decode())  # Deserialization
        new_password = req_new_password['password']

        user.set_password(new_password)
        user.save()

        return HttpResponse(status=204)

    elif request.method == 'DELETE':
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return HttpResponseNotFound()

        # User can only access to his/her own profile.
        if request.user.id != user_id:
            return HttpResponseForbidden()

        user.delete()
        return HttpResponse(status=204)

    else:
        return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])
