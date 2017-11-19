import json
from datetime import datetime, timedelta
from django.test import TestCase, Client
from django.utils import timezone

from room.models import Room
from user.models import User
from .models import FreeTime
CONTENT_TYPE = 'application/json'

def make_time(str, i=0):

    if i == 0:
        return timezone.make_aware(datetime.strptime('2017-11-1 ' + str, '%Y-%m-%d %H:%M'))
    if i == 1:
        return timezone.make_aware(datetime.strptime('2017-11-2 ' + str, '%Y-%m-%d %H:%M'))
    if i == 2:
        return timezone.make_aware(datetime.strptime('2017-11-3 ' + str, '%Y-%m-%d %H:%M'))


def make_time_list(start_list, end_list):

    result = []
    for i in range(len(start_list)):
        for j in range(len(start_list[i])):
            result.append((make_time(start_list[i][j], i), make_time(end_list[i][j], i)))
    return result


def time_list_to_dic(start_list, end_list):

    result = []
    for i in range (3):
        for j in range(len(start_list[i])):
            date = ''
            if i == 0:
                date = '2017-11-1 '
            if i == 1:
                date = '2017-11-2 '
            if i == 2:
                date = '2017-11-3 '
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

        time_span_start1 = timezone.make_aware(datetime.strptime('2017-11-4 12:30', '%Y-%m-%d %H:%M'))
        time_span_end1 = timezone.make_aware(datetime.strptime('2017-11-4 17:30', '%Y-%m-%d %H:%M'))

        # TODO Parse time
        # print(dateutil.parser.parse('Sat, 11 Nov 2017 00:50:00 GMT'))
        # date = dateutil.parser.parse('2017-11-11T00:20:00.000Z', ignoretz=True)

        Room.objects.create(
            name="room1",
            place="place1",
            time_span_start=time_span_start1,
            time_span_end=time_span_end1,
            min_time_required=min_time1,
            owner=user1,
        )
        room1 = Room.objects.get(id=1)

        room1.members.add(user1)
        room1.members.add(user2)
        room1.members.add(user3)
        room1.members.add(user4)

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
            ft = FreeTime(user=user1, room=room1, start_time=time[0], end_time=time[1])
            ft.save()
        for time in ps_time_list:
            ft = FreeTime(user=user1, room=room1, start_time=time[0], end_time=time[1])
            ft.save()
        for time in ds_time_list:
            ft = FreeTime(user=user1, room=room1, start_time=time[0], end_time=time[1])
            ft.save()

        self.client = Client(enforce_csrf_checks=True)

    def test_free_time_list_get(self):

        self.client.post(
            '/api/signin',
            json.dumps({'email': 'email1', 'password': 'password1'}),
            content_type=CONTENT_TYPE
        )
        response = self.client.get('/api/rooms/1/free-times')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 27)

    def test_free_time_list_post(self):

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

        #print()
        #print(json.dumps(mw_str_time_list))
        #print()
        response = self.client.post(
            '/api/rooms/1/free-times',
            json.dumps(mw_str_time_list),
            content_type=CONTENT_TYPE
        )

        self.assertEqual(response.status_code, 200)







