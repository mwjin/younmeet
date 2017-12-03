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
        min_time2 = timedelta(hours=0, minutes=30)

        time_span_start = parse('2017-11-01T00:00:00.000Z', ignoretz=True)
        time_span_end = parse('2017-11-04T00:00:00.000Z', ignoretz=True)

        Room.objects.create(
            name='room1',
            place='place1',
            time_span_start=time_span_start,
            time_span_end=time_span_end,
            min_time_required=min_time1,
            owner=user1
        )

        Room.objects.create(
            name="room2",
            place="place2",
            time_span_start=time_span_start,
            time_span_end=time_span_end,
            min_time_required=min_time1,
            owner=user2,
            min_members=2
        )
        Room.objects.create(
            name="room3",
            place="place3",
            time_span_start=time_span_start,
            time_span_end=time_span_end,
            min_time_required=min_time2,
            owner=user3,
        )

        self.client = Client()

    def sign_in(self, user_id):
        # sign in with given user_id
        self.client.post(
            '/api/signin',
            json.dumps({'email': 'email{:d}'.format(user_id), 'password': 'password{:d}'.format(user_id)}),
            content_type=CONTENT_TYPE
        )

    def test_get_free_times_success(self):
        self.sign_in(1)
        previous_free_times = [
            {'start': '2017-11-01T08:00.000Z',
             'end': '2017-11-01T11:00.000Z',
             },
            {'start': '2017-11-01T12:20.000Z',
             'end': '2017-11-01T20:00.000Z',
             }
        ]
        for free_time in previous_free_times:
            FreeTime.objects.create(
                user=User.objects.get(id=1),
                room=Room.objects.get(id=1),
                start_time=parse(free_time['start'], ignoretz=True),
                end_time=parse(free_time['end'], ignoretz=True)
            )

        response = self.client.get('/api/rooms/1/free-times')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 2)

    def test_get_free_times_unauthorized(self):
        previous_free_times = [
            {'start': '2017-11-01T08:00.000Z',
             'end': '2017-11-01T11:00.000Z',
             },
            {'start': '2017-11-01T12:20.000Z',
             'end': '2017-11-01T20:00.000Z',
             }
        ]
        for free_time in previous_free_times:
            FreeTime.objects.create(
                user=User.objects.get(id=1),
                room=Room.objects.get(id=1),
                start_time=parse(free_time['start'], ignoretz=True),
                end_time=parse(free_time['end'], ignoretz=True)
            )

        response = self.client.get('/api/rooms/1/free-times')
        self.assertEqual(response.status_code, 401)

    def test_room_does_not_exist(self):
        self.sign_in(1)
        response = self.client.post(
            '/api/rooms/4/free-times',
            content_type=CONTENT_TYPE
        )
        self.assertEqual(response.status_code, 404)

    def test_response_not_allowed(self):
        self.sign_in(1)
        response = self.client.delete(
            '/api/rooms/1/free-times',
            content_type=CONTENT_TYPE
        )
        self.assertEqual(response.status_code, 405)

    def test_free_time_list_post_add_member(self):

        # login as user1 and post a new free time
        # check if the room2 has new free time

        self.sign_in(1)

        room2 = Room.objects.get(id=2)
        member_list = list(User.objects.filter(joined_rooms=room2).values())

        self.assertEqual(len(member_list), 0)
        response = self.client.post(
            '/api/rooms/2/free-times',
            content_type=CONTENT_TYPE
        )

        self.assertEqual(response.status_code, 201)
        room2 = Room.objects.get(id=2)
        member_list = list(User.objects.filter(joined_rooms=room2).values())
        self.assertEqual(len(member_list), 1)

    def test_post_three_user(self):
        # can hold partial attend information
        self.sign_in(3)

        username1_freetime = [
            {'start': '2017-11-01T08:00.000Z',
             'end': '2017-11-01T10:00.000Z',
             }
        ]
        for free_time in username1_freetime:
            FreeTime.objects.create(
                user=User.objects.get(id=1),
                room=Room.objects.get(id=1),
                start_time=parse(free_time['start'], ignoretz=True),
                end_time=parse(free_time['end'], ignoretz=True)
            )

        username2_freetime = [
            {'start': '2017-11-01T08:00.000Z',
             'end': '2017-11-01T10:00.000Z',
             }
        ]

        for free_time in username2_freetime:
            FreeTime.objects.create(
                user=User.objects.get(id=2),
                room=Room.objects.get(id=1),
                start_time=parse(free_time['start'], ignoretz=True),
                end_time=parse(free_time['end'], ignoretz=True)
            )

        username3_freetime = [
            {'start': '2017-11-01T09:00.000Z',
             'end': '2017-11-01T10:00.000Z',
             }
        ]

        self.client.post(
            '/api/rooms/1/free-times',
            json.dumps(username3_freetime),
            content_type=CONTENT_TYPE
        )

        best_times = list(BestTime.objects.filter(room_id=1).all())
        self.assertEqual(len(best_times[0].partial_attend.all()), 1)

    def test_delete_previous_times_and_best_times(self):
        self.sign_in(1)
        previous_free_times = [
            {'start': '2017-11-01T08:00.000Z',
             'end': '2017-11-01T11:00.000Z',
             },
            {'start': '2017-11-01T12:20.000Z',
             'end': '2017-11-01T20:00.000Z',
             }
        ]
        for free_time in previous_free_times:
            FreeTime.objects.create(
                user=User.objects.get(id=1),
                room=Room.objects.get(id=1),
                start_time=parse(free_time['start'], ignoretz=True),
                end_time=parse(free_time['end'], ignoretz=True)
            )
        best_time = BestTime.objects.create(
            start_time=parse(previous_free_times[0]['start'], ignoretz=True),
            end_time=parse(previous_free_times[0]['end'], ignoretz=True),
            room=Room.objects.get(id=1)
        )

        best_time.full_attend.add(User.objects.get(id=1))

        new_free_times = [
            {'start': '2017-11-02T08:00.000Z',
             'end': '2017-11-02T11:00.000Z',
             },
        ]
        free_times = list(FreeTime.objects.filter(user_id=1).filter(room_id=1).values())
        self.assertEqual(len(free_times), 2)
        self.client.post(
            '/api/rooms/1/free-times',
            json.dumps(new_free_times),
            content_type=CONTENT_TYPE
        )
        free_times = list(FreeTime.objects.filter(user_id=1).filter(room_id=1).values())
        self.assertEqual(len(free_times), 1)
        best_time = list(BestTime.objects.filter(room_id=1).values())
        self.assertEqual(best_time[0]['start_time'], datetime(2017, 11, 2, 8, 0))

    def test_post_single_user(self):
        self.sign_in(1)

        username1_freetime = [
            {'start': '2017-11-01T08:00.000Z',
             'end': '2017-11-01T11:00.000Z',
             },
            {'start': '2017-11-01T12:20.000Z',
             'end': '2017-11-01T20:00.000Z',
             },
            {'start': '2017-11-02T08:00.000Z',
             'end': '2017-11-02T11:00.000Z',
             },
            {'start': '2017-11-02T11:50.000Z',
             'end': '2017-11-02T15:20.000Z',
             },
            {'start': '2017-11-02T16:50.000Z',
             'end': '2017-11-02T20:00.000Z',
             },
            {'start': '2017-11-03T08:00.000Z',
             'end': '2017-11-03T11:00.000Z',
             },
            {'start': '2017-11-03T12:30.000Z',
             'end': '2017-11-03T18:30.000Z',
             },
        ]

        response = self.client.post(
            '/api/rooms/1/free-times',
            json.dumps(username1_freetime),
            content_type=CONTENT_TYPE
        )

        self.assertEqual(response.status_code, 201)
        best_times = list(BestTime.objects.filter(room_id=1).values())
        self.assertEqual(len(best_times), 7)
        self.assertEqual(best_times[0]['start_time'], datetime(2017, 11, 1, 12, 20))
        self.assertEqual(best_times[0]['end_time'], datetime(2017, 11, 1, 20, 00))
