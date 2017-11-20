import json
from datetime import datetime, timedelta
from dateutil.parser import parse
from django.test import TestCase, Client
from dateutil.tz import gettz

from room.models import Room
from user.models import User
from .models import FreeTime
from best_time.models import BestTime

CONTENT_TYPE = 'application/json'


def make_time(str, i=0):
    if i == 0:
        return parse('2017-11-1T'+str+':00.000Z', ignoretz=True)
    if i == 1:
        return parse('2017-11-2T'+str+':00.000Z', ignoretz=True)
    if i == 2:
        return parse('2017-11-3T'+str+':00.000Z', ignoretz=True)


def make_time_list(start_list, end_list):

    result = []
    for i in range(len(start_list)):
        for j in range(len(start_list[i])):
            result.append((make_time(start_list[i][j], i), make_time(end_list[i][j], i)))
    return result


def time_list_to_dic(start_list, end_list):

    result = []
    for i in range(len(start_list)):
        for j in range(len(start_list[i])):
            date = ''
            if i == 0:
                date = '2017-11-1T'
            if i == 1:
                date = '2017-11-2T'
            if i == 2:
                date = '2017-11-3T'
            result.append({'start': date + start_list[i][j], 'end': date + end_list[i][j]})

    return result


class FreeTimeTestCase(TestCase):

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
        min_time1 = timedelta(hours=2, minutes=00)
        min_time3 = timedelta(hours=0, minutes=30)

        time_span_start1 = parse('2017-11-1T12:30:00.000Z', ignoretz=True)
        time_span_end1 = parse('2017-11-30T17:30:00.000Z', ignoretz=True)

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
            time_span_start=time_span_start1,
            time_span_end=time_span_end1,
            min_time_required=min_time1,
            owner=user1,
            min_members=2
        )
        Room.objects.create(
            name="room3",
            place="place3",
            time_span_start=time_span_start1,
            time_span_end=time_span_end1,
            min_time_required=min_time3,
            owner=user1,
        )
        room1 = Room.objects.get(id=1)
        room2 = Room.objects.get(id=2)
        room3 = Room.objects.get(id=3)

        room1.members.add(user1)
        room1.members.add(user2)
        room1.members.add(user3)
        room1.members.add(user4)

        room2.members.add(user1)
        room2.members.add(user2)

        room3.members.add(user1)
        room3.members.add(user2)
        room3.members.add(user3)

        mw_start_list = [
            ['08:00', '12:20']
        ]
        mw_end_list = [
            ['11:00', '20:00']
        ]
        tb_start_list = [
            ['08:00', '12:30', '15:30', '18:30'],
            ['11:50', '15:50'],
            ['08:00', '12:30', '15:20']
        ]
        tb_end_list = [
            ['11:00', '14:00', '17:00', '22:00'],
            ['14:00', '22:00'],
            ['11:00', '14:00', '16:50']
        ]
        ps_start_list = [
            ['10:00', '14:00'],
            ['10:00', '11:50', '17:00'],
            ['10:00', '14:00']
        ]
        ps_end_list = [
            ['11:00', '18:20'],
            ['11:00', '13:50', '22:30'],
            ['11:00', '18:30']
        ]
        ds_start_list = [
            ['08:00', '12:10', '15:20'],
            ['08:00', '14:00', '17:00'],
            ['08:00', '12:10', '15:20']
        ]
        ds_end_list = [
            ['11:00', '14:00', '23:00'],
            ['11:00', '15:30', '23:00'],
            ['11:00', '14:00', '18:30']
        ]

        mw_time_list = make_time_list(mw_start_list, mw_end_list)
        tb_time_list = make_time_list(tb_start_list, tb_end_list)
        ps_time_list = make_time_list(ps_start_list, ps_end_list)
        ds_time_list = make_time_list(ds_start_list, ds_end_list)

        for time in mw_time_list:
            ft = FreeTime(user=user1, room=room1, start_time=time[0], end_time=time[1])
            ft.save()
        for time in tb_time_list:
            ft = FreeTime(user=user2, room=room1, start_time=time[0], end_time=time[1])
            ft.save()
        for time in ps_time_list:
            ft = FreeTime(user=user3, room=room1, start_time=time[0], end_time=time[1])
            ft.save()
        for time in ds_time_list:
            ft = FreeTime(user=user4, room=room1, start_time=time[0], end_time=time[1])
            ft.save()

        self.client = Client()

    def test_free_time_list_get(self):

        self.client.post(
            '/api/signin',
            json.dumps({'email': 'email1', 'password': 'password1'}),
            content_type=CONTENT_TYPE
        )
        response = self.client.get('/api/rooms/1/free-times')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 2)

    def test_tree_time_list_unauth_user(self):
        response = self.client.post(
            '/api/signin',
            json.dumps({'email': 'email1', 'password': 'wrong password'}),
            content_type=CONTENT_TYPE
        )
        self.assertEqual(response.status_code, 401)


    def test_free_time_list_post_add_member(self):

        # login as user3 and post a new free time
        # check if the room2 has new free time

        self.client.post(
            '/api/signin',
            json.dumps({'email': 'email3', 'password': 'password3'}),
            content_type=CONTENT_TYPE
        )

        room2 = Room.objects.get(id=2)
        member_list = list(User.objects.filter(joined_rooms=room2).values())
        self.assertEqual(len(member_list), 2)

        response = self.client.post(
            '/api/rooms/2/free-times',
            content_type=CONTENT_TYPE
        )
        self.assertEqual(response.status_code, 201)
        room2 = Room.objects.get(id=2)
        member_list = list(User.objects.filter(joined_rooms=room2).values())
        self.assertEqual(len(member_list), 3)

    def test_free_time_list_post_send_nothing(self):

        self.client.post(
            '/api/signin',
            json.dumps({'email': 'email1', 'password': 'password1'}),
            content_type=CONTENT_TYPE
        )

        response = self.client.post(
            '/api/rooms/1/free-times',
            content_type=CONTENT_TYPE
        )

        self.assertEqual(response.status_code, 201)
        mw_time_list = FreeTime.objects.filter(user_id=1)
        self.assertEqual(len(mw_time_list), 0)

    def test_free_time_list_delete(self):
        self.client.post(
            '/api/signin',
            json.dumps({'email': 'email1', 'password': 'password1'}),
            content_type=CONTENT_TYPE
        )
        response = self.client.delete(
            '/api/rooms/1/free-times',
            content_type=CONTENT_TYPE
        )
        self.assertEqual(response.status_code, 405)

    def test_free_time_list_post1(self):

        self.client.post(
            '/api/signin',
            json.dumps({'email': 'email1', 'password': 'password1'}),
            content_type=CONTENT_TYPE
        )
        mw_start_list = [
            ['08:00', '12:20'],
            ['08:00', '11:50', '16:50'],
            ['08:00', '12:30']
        ]
        mw_end_list = [
            ['11:00', '20:00'],
            ['11:00', '15:20', '20:00'],
            ['11:00', '18:30']
        ]
        mw_str_time_list = time_list_to_dic(mw_start_list, mw_end_list)

        response = self.client.post(
            '/api/rooms/1/free-times',
            json.dumps(mw_str_time_list),
            content_type=CONTENT_TYPE
        )
        self.assertEqual(response.status_code, 201)
        best_time_list = list(BestTime.objects.filter(room_id=1).values())
        self.assertEqual(len(best_time_list), 3)
        self.assertEqual(best_time_list[0]['start_time'], datetime(2017, 11, 2, 17, 0))

        # then send nothing to see that if the best time is recalculated
        response = self.client.post(
            '/api/rooms/1/free-times',
            content_type=CONTENT_TYPE
        )

        self.assertEqual(response.status_code, 201)
        mw_time_list = FreeTime.objects.filter(user_id=1)
        self.assertEqual(len(mw_time_list), 0)


    def test_free_time_list_post2(self):

        # add user1's and user2's free time so that they don't intersect
        # the min_members of room2 is 2, so the result must be nothing
        # use room2, and login as user2

        mw_start_list = [
            ['12:00', '16:00']
        ]
        mw_end_list = [
            ['14:00', '17:00']
        ]
        tb_start_list = [
            ['14:00', '20:00']
        ]
        tb_end_list = [
            ['16:00', '23:00']
        ]
        mw_time_list = make_time_list(mw_start_list, mw_end_list)
        user1 = User.objects.get(id=1)
        room2 = Room.objects.get(id=2)
        room2.members.add(user1)

        for time in mw_time_list:
            ft = FreeTime(user=user1, room=room2, start_time=time[0], end_time=time[1])
            ft.save()

        self.client.post(
            '/api/signin',
            json.dumps({'email': 'email2', 'password': 'password2'}),
            content_type=CONTENT_TYPE
        )
        tb_str_time_list = time_list_to_dic(tb_start_list, tb_end_list)

        response = self.client.post(
            '/api/rooms/2/free-times',
            json.dumps(tb_str_time_list),
            content_type=CONTENT_TYPE
        )
        self.assertEqual(response.status_code, 201)
        best_time_list = list(BestTime.objects.filter(room_id=2).values())
        self.assertEqual(len(best_time_list), 0)
        tb_free_time_list = list(FreeTime.objects.filter(room_id=2).filter(user_id=2).values())
        # check correctly posted
        self.assertEqual(len(tb_free_time_list), 2)

    def test_free_time_list_post3(self):

        self.client.post(
            '/api/signin',
            json.dumps({'email': 'email4', 'password': 'password4'}),
            content_type=CONTENT_TYPE
        )

        mw_start_list = [
            ['12:00']
        ]
        mw_end_list = [
            ['18:10']
        ]
        tb_start_list = [
            ['15:00', '17:20', '18:00']
        ]
        tb_end_list = [
            ['17:00', '17:50', '18:10']
        ]
        ps_start_list = [
            ['16:00', '17:50']
        ]
        ps_end_list = [
            ['17:40', '18:10']
        ]
        ds_start_list = [
            ['16:30', '17:30']
        ]
        ds_end_list = [
            ['17:20', '18:00']
        ]
        mw_time_list = make_time_list(mw_start_list, mw_end_list)
        tb_time_list = make_time_list(tb_start_list, tb_end_list)
        ps_time_list = make_time_list(ps_start_list, ps_end_list)

        user1 = User.objects.get(id=1)
        user2 = User.objects.get(id=2)
        user3 = User.objects.get(id=3)

        room3 = Room.objects.get(id=3)

        for time in mw_time_list:
            ft = FreeTime(user=user1, room=room3, start_time=time[0], end_time=time[1])
            ft.save()
        for time in tb_time_list:
            ft = FreeTime(user=user2, room=room3, start_time=time[0], end_time=time[1])
            ft.save()
        for time in ps_time_list:
            ft = FreeTime(user=user3, room=room3, start_time=time[0], end_time=time[1])
            ft.save()

        ds_str_time_list = time_list_to_dic(ds_start_list, ds_end_list)

        response = self.client.post(
            '/api/rooms/3/free-times',
            json.dumps(ds_str_time_list),
            content_type=CONTENT_TYPE
        )

        self.assertEqual(response.status_code, 201)
        best_time_list = list(BestTime.objects.filter(room_id=3).values())
        self.assertEqual(len(best_time_list), 3)
        self.assertEqual(best_time_list[0]['start_time'], datetime(2017, 11, 1, 16, 30))







