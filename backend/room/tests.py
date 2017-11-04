from django.test import TestCase, Client
from .models import Room
from django.forms.models import model_to_dict
from datetime import datetime
from django.utils import timezone
from user.models import User
import json

CONTENT_TYPE = 'application/json'

class RoomTestCase(TestCase):

    def setUp(self):
        User.objects.create_user(email='email1', password='password1')
        User.objects.create_user(email='email2', password='password2')
        User.objects.create_user(email='email3', password='password3')
        user1 = User.objects.get(id=1)
        user2 = User.objects.get(id=2)


        min_time1 = timezone.make_aware(datetime.strptime('2000-01-1 2:30', '%Y-%m-%d %H:%M'))
        min_time2 = timezone.make_aware(datetime.strptime('2000-01-1 1:00', '%Y-%m-%d %H:%M'))
        create_time = timezone.localtime(timezone.now())

        best_start_time1 = timezone.make_aware(datetime.strptime('2017-11-4 12:30', '%Y-%m-%d %H:%M'))
        best_end_time1 = timezone.make_aware(datetime.strptime('2017-11-4 17:30', '%Y-%m-%d %H:%M'))

        best_start_time2 = timezone.make_aware(datetime.strptime('2017-11-4 15:30', '%Y-%m-%d %H:%M'))
        best_end_time2 = timezone.make_aware(datetime.strptime('2017-11-4 16:30', '%Y-%m-%d %H:%M'))

        Room.objects.create(
            name="room1",
            place="place1",
            best_start_time=best_start_time1,
            best_end_time=best_end_time1,
            min_time_required=min_time1,
            owner=user1,
        )
        Room.objects.create(
            name="room2",
            place="place2",
            best_start_time=best_start_time2,
            best_end_time=best_end_time2,
            min_time_required=min_time2,
            owner=user2,
        )
        room1 = Room.objects.get(id=1)
        room2 = Room.objects.get(id=2)
        room1.members.add(user1)
        room2.members.add(user1)

        self.client = Client()


    def test_room_list_get(self):
        self.client.post('/api/signin',
                         json.dumps({'email': 'email1', 'password': 'password1'}),
                         content_type=CONTENT_TYPE)
        response = self.client.get('/api/rooms')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]['name'], 'room1')
        self.assertEqual(data[1]['place'], 'place2')

'''
    def test_room_list_post(self):
        self.client.post('/api/signin',
                         json.dumps({'username': 'user1', 'password': 'password1'}),
                         content_type=CONTENT_TYPE)
        response = self.client.post('/api/rooms', json.dump)

'''