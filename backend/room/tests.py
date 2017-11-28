from dateutil.parser import parse
from datetime import datetime, timedelta
import json

from django.test import TestCase, Client
from .models import Room
from user.models import User

CONTENT_TYPE = 'application/json'


def time_delta_handler(x):
    if isinstance(x, timedelta):
        minutes = x.seconds % 60
        minutes = "{}".format(minutes)
        return minutes
    raise TypeError("Unknown type")


class RoomTestCase(TestCase):
    def setUp(self):
        User.objects.create_user(email='email1', password='password1', username='username1')
        User.objects.create_user(email='email2', password='password2', username='username2')
        User.objects.create_user(email='email3', password='password3', username='username3')
        User.objects.create_user(email='email4', password='password4', username='username4')

        user1 = User.objects.get(id=1)
        user2 = User.objects.get(id=2)
        user3 = User.objects.get(id=3)
        user4 = User.objects.get(id=4)

        # timezone.make_aware() is used to suppress warning
        min_time1 = timedelta(hours=2, minutes=30)
        min_time2 = timedelta(hours=1, minutes=00)

        time_span_start1 = parse('2017-11-4T12:30:00.000Z', ignoretz=True)
        time_span_end1 = parse('2017-11-4T17:30:00.000Z', ignoretz=True)

        time_span_start2 = parse('2017-11-4T15:30:00.000Z', ignoretz=True)
        time_span_end2 = parse('2017-11-4T16:30:00.000Z', ignoretz=True)

        Room.objects.create(
            name="room1",
            place="place1",
            time_span_start=time_span_start1,
            time_span_end=time_span_end1,
            min_time_required=min_time1,
            owner=user1,
        )
        Room.objects.create(
            name="room2",
            place="place2",
            time_span_start=time_span_start2,
            time_span_end=time_span_end2,
            min_time_required=min_time2,
            owner=user2,
        )
        room1 = Room.objects.get(id=1)
        room2 = Room.objects.get(id=2)

        room1.members.add(user1)
        room1.members.add(user2)
        room1.members.add(user3)
        room1.members.add(user4)
        room2.members.add(user1)

        self.client = Client()

    def test_room_list_get(self):
        self.client.post(
            '/api/signin',
            json.dumps({'email': 'email1', 'password': 'password1'}),
            content_type=CONTENT_TYPE
        )
        response = self.client.get('/api/rooms')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]['name'], 'room1')
        self.assertEqual(data[1]['place'], 'place2')

    def test_room_list_post(self):
        self.client.post(
            '/api/signin',
            json.dumps({'email': 'email1', 'password': 'password1'}),
            content_type=CONTENT_TYPE
        )

        min_time = timedelta(hours=1)
        time_span_start = '2017-11-4 12:30'
        time_span_end = '2017-11-4 17:30'

        response = self.client.post(
            '/api/rooms',
            json.dumps({'name': 'room1',
                        'place': 'place1',
                        'min_time_required': time_delta_handler(min_time),
                        'min_members': '1',
                        'time_span_start': time_span_start,
                        'time_span_end': time_span_end,
                        }),
            content_type=CONTENT_TYPE,
        )

        self.assertEqual(response.status_code, 200)

        response = self.client.get('/api/rooms')
        data = json.loads(response.content.decode())

        self.assertEqual(len(data), 3)

    def test_room_list_delete(self):
        self.client.post(
            '/api/signin',
            json.dumps({'email': 'email1', 'password': 'password1'}),
            content_type=CONTENT_TYPE
        )
        response = self.client.delete('/api/rooms')
        self.assertEqual(response.status_code, 405)

    def test_room_list_get_not_authenticated(self):
        response = self.client.get('/api/rooms')
        self.assertEqual(response.status_code, 401)

    def test_room_detail_get(self):
        self.client.post(
            '/api/signin',
            json.dumps({'email': 'email1', 'password': 'password1'}),
            content_type=CONTENT_TYPE
        )
        response = self.client.get('/api/rooms/1')
        self.assertEqual(response.status_code, 200)
        room = json.loads(response.content.decode())
        self.assertEqual(room['name'], 'room1')
        self.assertEqual(room['place'], 'place1')

    def test_room_detail_delete(self):
        self.client.post(
            '/api/signin',
            json.dumps({'email': 'email1', 'password': 'password1'}),
            content_type=CONTENT_TYPE
        )
        response = self.client.delete('/api/rooms/1')
        self.assertEqual(response.status_code, 204)
        response = self.client.get('/api/rooms')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 1)

    def test_room_detail_post(self):
        self.client.post(
            '/api/signin',
            json.dumps({'email': 'email1', 'password': 'password1'}),
            content_type=CONTENT_TYPE
        )
        response = self.client.post('/api/rooms/1')
        self.assertEqual(response.status_code, 405)

    def test_room_detail_get_not_authenticated(self):
        response = self.client.get('/api/rooms/1')
        self.assertEqual(response.status_code, 401)

    def test_room_detail_get_not_found(self):
        self.client.post(
            '/api/signin',
            json.dumps({'email': 'email1', 'password': 'password1'}),
            content_type=CONTENT_TYPE
        )
        response = self.client.get('/api/rooms/100')
        self.assertEqual(response.status_code, 404)

    def test_room_members_get(self):
        self.client.post(
            '/api/signin',
            json.dumps({'email': 'email1', 'password': 'password1'}),
            content_type=CONTENT_TYPE
        )
        response = self.client.get('/api/rooms/1/members')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 4)

    def test_room_members_post(self):
        self.client.post(
            '/api/signin',
            json.dumps({'email': 'email1', 'password': 'password1'}),
            content_type=CONTENT_TYPE
        )
        response = self.client.post('/api/rooms/1/members')
        self.assertEqual(response.status_code, 405)

    def test_room_members_get_not_authenticated(self):
        response = self.client.get('/api/rooms/1/members')
        self.assertEqual(response.status_code, 401)

    def test_room_members_get_not_found(self):
        self.client.post(
            '/api/signin',
            json.dumps({'email': 'email1', 'password': 'password1'}),
            content_type=CONTENT_TYPE
        )
        response = self.client.get('/api/rooms/100/members')
        self.assertEqual(response.status_code, 404)
