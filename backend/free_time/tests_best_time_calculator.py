from .best_time_calculator import BestTimeCalculator
from .time_count_tree import TimeCountTree

import unittest
from datetime import datetime, timedelta


def convert_to_datetime(time_string):
    return datetime.strptime(time_string, '%Y-%m-%d %H:%M')


class BestTimeCalculatorTest(unittest.TestCase):
    def test_single_person_min_2hours_min_one_person_3_best_times(self):
        times = [
            [convert_to_datetime('2017-11-01 08:00'), convert_to_datetime('2017-11-01 11:00'), 'user'],
            [convert_to_datetime('2017-11-01 12:20'), convert_to_datetime('2017-11-01 20:00'), 'user'],
            [convert_to_datetime('2017-11-02 08:00'), convert_to_datetime('2017-11-02 11:00'), 'user'],
            [convert_to_datetime('2017-11-02 11:50'), convert_to_datetime('2017-11-02 15:20'), 'user'],
            [convert_to_datetime('2017-11-02 16:50'), convert_to_datetime('2017-11-02 20:00'), 'user'],
            [convert_to_datetime('2017-11-03 08:00'), convert_to_datetime('2017-11-03 11:00'), 'user'],
            [convert_to_datetime('2017-11-03 12:30'), convert_to_datetime('2017-11-03 18:30'), 'user'],
        ]

        calculator = BestTimeCalculator(timedelta(hours=2), min_people=1, k=3)

        calculator.insert_time(times)
        calculator.calculate_best_times()
        k_times = calculator.get_k_best_times()

        self.assertEqual(len(k_times), 3)
        self.assertEqual(k_times[0].start, datetime(2017, 11, 1, 12, 20))
        self.assertEqual(k_times[0].end, datetime(2017, 11, 1, 20, 00))
        self.assertEqual(k_times[1].start, datetime(2017, 11, 3, 12, 30))
        self.assertEqual(k_times[1].end, datetime(2017, 11, 3, 18, 30))
        self.assertEqual(k_times[2].start, datetime(2017, 11, 2, 11, 50))
        self.assertEqual(k_times[2].end, datetime(2017, 11, 2, 15, 20))

    def test_single_person_min_10hours_min_one_person_3_best_times(self):
        times = [
            [convert_to_datetime('2017-11-01 08:00'), convert_to_datetime('2017-11-01 11:00'), 'user'],
            [convert_to_datetime('2017-11-01 12:20'), convert_to_datetime('2017-11-01 20:00'), 'user'],
            [convert_to_datetime('2017-11-02 08:00'), convert_to_datetime('2017-11-02 11:00'), 'user'],
            [convert_to_datetime('2017-11-02 11:50'), convert_to_datetime('2017-11-02 15:20'), 'user'],
            [convert_to_datetime('2017-11-02 16:50'), convert_to_datetime('2017-11-02 20:00'), 'user'],
            [convert_to_datetime('2017-11-03 08:00'), convert_to_datetime('2017-11-03 11:00'), 'user'],
            [convert_to_datetime('2017-11-03 12:30'), convert_to_datetime('2017-11-03 18:30'), 'user'],
        ]

        calculator = BestTimeCalculator(timedelta(hours=10), min_people=1, k=3)

        calculator.insert_time(times)
        calculator.calculate_best_times()
        k_times = calculator.get_k_best_times()

        self.assertEqual(len(k_times), 3)
        self.assertEqual(k_times[0], None)
        self.assertEqual(k_times[1], None)
        self.assertEqual(k_times[2], None)

    def test_single_person_min_2hours_min_two_people_3_best_times(self):
        times = [
            [convert_to_datetime('2017-11-01 08:00'), convert_to_datetime('2017-11-01 11:00'), 'user'],
            [convert_to_datetime('2017-11-01 12:20'), convert_to_datetime('2017-11-01 20:00'), 'user'],
            [convert_to_datetime('2017-11-02 08:00'), convert_to_datetime('2017-11-02 11:00'), 'user'],
            [convert_to_datetime('2017-11-02 11:50'), convert_to_datetime('2017-11-02 15:20'), 'user'],
            [convert_to_datetime('2017-11-02 16:50'), convert_to_datetime('2017-11-02 20:00'), 'user'],
            [convert_to_datetime('2017-11-03 08:00'), convert_to_datetime('2017-11-03 11:00'), 'user'],
            [convert_to_datetime('2017-11-03 12:30'), convert_to_datetime('2017-11-03 18:30'), 'user'],
        ]

        calculator = BestTimeCalculator(timedelta(hours=2), min_people=2, k=3)

        calculator.insert_time(times)
        calculator.calculate_best_times()
        k_times = calculator.get_k_best_times()

        self.assertEqual(len(k_times), 3)
        self.assertEqual(k_times[0], None)
        self.assertEqual(k_times[1], None)
        self.assertEqual(k_times[2], None)

    def test_single_person_same_time_span_different_start(self):
        # from heap criteria, the earlier times will come first
        times = [
            [convert_to_datetime('2017-11-01 11:00'), convert_to_datetime('2017-11-01 14:00'), 'user'],
            [convert_to_datetime('2017-11-01 07:00'), convert_to_datetime('2017-11-01 10:00'), 'user'],
            [convert_to_datetime('2017-11-01 15:00'), convert_to_datetime('2017-11-01 18:00'), 'user'],
        ]

        calculator = BestTimeCalculator(timedelta(hours=3), min_people=1, k=3)

        calculator.insert_time(times)
        calculator.calculate_best_times()
        k_times = calculator.get_k_best_times()

        self.assertEqual(k_times[0].start, datetime(2017, 11, 1, 7, 0))
        self.assertEqual(k_times[0].end, datetime(2017, 11, 1, 10, 0))
        self.assertEqual(k_times[1].start, datetime(2017, 11, 1, 11, 0))
        self.assertEqual(k_times[1].end, datetime(2017, 11, 1, 14, 0))
        self.assertEqual(k_times[2].start, datetime(2017, 11, 1, 15, 0))
        self.assertEqual(k_times[2].end, datetime(2017, 11, 1, 18, 0))

    def test_two_people_do_not_intersect(self):
        # do not intersect => no best time
        time1 = [
            [convert_to_datetime('2017-11-01 12:00'), convert_to_datetime('2017-11-01 14:00'), 'user1'],
            [convert_to_datetime('2017-11-02 16:00'), convert_to_datetime('2017-11-02 17:00'), 'user1'],
        ]
        time2 = [
            [convert_to_datetime('2017-11-01 14:00'), convert_to_datetime('2017-11-01 20:00'), 'user2'],
            [convert_to_datetime('2017-11-02 20:00'), convert_to_datetime('2017-11-02 23:00'), 'user2'],
        ]

        calculator = BestTimeCalculator(timedelta(hours=2), min_people=2, k=3)

        calculator.insert_time(time1)
        calculator.insert_time(time2)
        calculator.calculate_best_times()
        k_times = calculator.get_k_best_times()
        self.assertEqual(k_times[0], None)
        self.assertEqual(k_times[1], None)
        self.assertEqual(k_times[2], None)

    def test_two_people_min_2hours_min_two_people_3_best_times(self):
        time1 = [
            [convert_to_datetime('2017-11-01 08:00'), convert_to_datetime('2017-11-01 10:00'), 'user1'],
            [convert_to_datetime('2017-11-02 08:00'), convert_to_datetime('2017-11-02 10:00'), 'user1'],
            [convert_to_datetime('2017-11-03 08:00'), convert_to_datetime('2017-11-03 10:00'), 'user1'],
        ]
        time2 = [
            [convert_to_datetime('2017-11-01 08:00'), convert_to_datetime('2017-11-01 10:00'), 'user2'],
            [convert_to_datetime('2017-11-02 08:00'), convert_to_datetime('2017-11-02 10:00'), 'user2'],
            [convert_to_datetime('2017-11-03 08:00'), convert_to_datetime('2017-11-03 10:00'), 'user2'],
        ]

        calculator = BestTimeCalculator(timedelta(hours=2), min_people=2, k=3)

        calculator.insert_time(time1)
        calculator.insert_time(time2)
        calculator.calculate_best_times()
        k_times = calculator.get_k_best_times()
        self.assertEqual(k_times[0].end - k_times[0].start, timedelta(hours=2))
        self.assertEqual(k_times[1].end - k_times[1].start, timedelta(hours=2))
        self.assertEqual(k_times[2].end - k_times[2].start, timedelta(hours=2))
        # TODO: Add heap compare criteria when weight is same, the earlier time first

    def test_three_people_min_2hours_min_two_people_1_best_times(self):
        # Test how algorithm include partial attend
        time1 = [
            [convert_to_datetime('2017-11-01 08:00'), convert_to_datetime('2017-11-01 10:00'), 'user1'],
        ]
        time2 = [
            [convert_to_datetime('2017-11-01 08:00'), convert_to_datetime('2017-11-01 10:00'), 'user2'],
        ]
        time3 = [
            [convert_to_datetime('2017-11-01 09:00'), convert_to_datetime('2017-11-01 10:00'), 'user3'],
        ]

        calculator = BestTimeCalculator(timedelta(hours=2), min_people=2, k=1)

        calculator.insert_time(time1)
        calculator.insert_time(time2)
        calculator.insert_time(time3)
        calculator.calculate_best_times()
        k_times = calculator.get_k_best_times()

        self.assertEqual(len(k_times), 1)
        self.assertEqual(k_times[0].start, datetime(2017, 11, 1, 8, 0))
        self.assertEqual(k_times[0].end, datetime(2017, 11, 1, 10, 0))
        self.assertEqual(len(k_times[0].full_attend), 2)
        self.assertEqual(len(k_times[0].partial_attend), 1)

    def test_four_people_normal_case_1(self):
        time1 = [
            [convert_to_datetime('2017-11-01 12:00'), convert_to_datetime('2017-11-01 18:10'), 'user1'],
        ]
        time2 = [
            [convert_to_datetime('2017-11-01 15:00'), convert_to_datetime('2017-11-01 17:00'), 'user2'],
            [convert_to_datetime('2017-11-01 17:20'), convert_to_datetime('2017-11-01 17:50'), 'user2'],
            [convert_to_datetime('2017-11-01 18:00'), convert_to_datetime('2017-11-01 18:10'), 'user2'],
        ]
        time3 = [
            [convert_to_datetime('2017-11-01 16:00'), convert_to_datetime('2017-11-01 17:40'), 'user3'],
            [convert_to_datetime('2017-11-01 17:50'), convert_to_datetime('2017-11-01 18:10'), 'user3'],
        ]
        time4 = [
            [convert_to_datetime('2017-11-01 16:30'), convert_to_datetime('2017-11-01 17:20'), 'user4'],
            [convert_to_datetime('2017-11-01 17:30'), convert_to_datetime('2017-11-01 18:00'), 'user4'],
        ]

        calculator = BestTimeCalculator(timedelta(minutes=30), min_people=4, k=3)

        calculator.insert_time(time1)
        calculator.insert_time(time2)
        calculator.insert_time(time3)
        calculator.insert_time(time4)
        calculator.calculate_best_times()
        k_times = calculator.get_k_best_times()

        self.assertEqual(k_times[0].start, datetime(2017, 11, 1, 16, 30))
        self.assertEqual(k_times[0].end, datetime(2017, 11, 1, 17, 00))

    def test_four_people_normal_case_2(self):
        time1 = [
            [convert_to_datetime('2017-11-01 08:00'), convert_to_datetime('2017-11-01 11:00'), 'user1'],
            [convert_to_datetime('2017-11-01 12:20'), convert_to_datetime('2017-11-01 20:00'), 'user1'],
            [convert_to_datetime('2017-11-02 08:00'), convert_to_datetime('2017-11-02 11:00'), 'user1'],
            [convert_to_datetime('2017-11-02 11:50'), convert_to_datetime('2017-11-02 15:20'), 'user1'],
            [convert_to_datetime('2017-11-02 16:50'), convert_to_datetime('2017-11-02 20:00'), 'user1'],
            [convert_to_datetime('2017-11-03 08:00'), convert_to_datetime('2017-11-03 11:00'), 'user1'],
            [convert_to_datetime('2017-11-03 12:30'), convert_to_datetime('2017-11-03 18:30'), 'user1'],
        ]
        time2 = [
            [convert_to_datetime('2017-11-01 08:00'), convert_to_datetime('2017-11-01 11:00'), 'user2'],
            [convert_to_datetime('2017-11-01 12:30'), convert_to_datetime('2017-11-01 14:00'), 'user2'],
            [convert_to_datetime('2017-11-01 15:30'), convert_to_datetime('2017-11-01 17:00'), 'user2'],
            [convert_to_datetime('2017-11-01 18:30'), convert_to_datetime('2017-11-01 22:00'), 'user2'],
            [convert_to_datetime('2017-11-02 11:50'), convert_to_datetime('2017-11-02 14:00'), 'user2'],
            [convert_to_datetime('2017-11-02 15:50'), convert_to_datetime('2017-11-02 22:00'), 'user2'],
            [convert_to_datetime('2017-11-03 08:00'), convert_to_datetime('2017-11-03 11:00'), 'user2'],
            [convert_to_datetime('2017-11-03 12:30'), convert_to_datetime('2017-11-03 14:00'), 'user2'],
            [convert_to_datetime('2017-11-03 15:20'), convert_to_datetime('2017-11-03 16:50'), 'user2'],
        ]
        time3 = [
            [convert_to_datetime('2017-11-01 10:00'), convert_to_datetime('2017-11-01 11:00'), 'user3'],
            [convert_to_datetime('2017-11-01 14:00'), convert_to_datetime('2017-11-01 18:20'), 'user3'],
            [convert_to_datetime('2017-11-02 10:00'), convert_to_datetime('2017-11-02 11:00'), 'user3'],
            [convert_to_datetime('2017-11-02 11:50'), convert_to_datetime('2017-11-02 13:50'), 'user3'],
            [convert_to_datetime('2017-11-02 17:00'), convert_to_datetime('2017-11-02 22:30'), 'user3'],
            [convert_to_datetime('2017-11-03 10:00'), convert_to_datetime('2017-11-03 11:00'), 'user3'],
            [convert_to_datetime('2017-11-03 14:00'), convert_to_datetime('2017-11-03 18:30'), 'user3'],
        ]
        time4 = [
            [convert_to_datetime('2017-11-01 08:00'), convert_to_datetime('2017-11-01 11:00'), 'user4'],
            [convert_to_datetime('2017-11-01 12:10'), convert_to_datetime('2017-11-01 14:00'), 'user4'],
            [convert_to_datetime('2017-11-01 15:20'), convert_to_datetime('2017-11-01 23:00'), 'user4'],
            [convert_to_datetime('2017-11-02 08:00'), convert_to_datetime('2017-11-02 11:00'), 'user4'],
            [convert_to_datetime('2017-11-02 14:00'), convert_to_datetime('2017-11-02 15:30'), 'user4'],
            [convert_to_datetime('2017-11-02 17:00'), convert_to_datetime('2017-11-02 23:00'), 'user4'],
            [convert_to_datetime('2017-11-03 08:00'), convert_to_datetime('2017-11-03 11:00'), 'user4'],
            [convert_to_datetime('2017-11-03 12:10'), convert_to_datetime('2017-11-03 14:00'), 'user4'],
            [convert_to_datetime('2017-11-03 15:20'), convert_to_datetime('2017-11-03 18:30'), 'user4'],
        ]

        calculator = BestTimeCalculator(timedelta(hours=1, minutes=30), min_people=4, k=3)

        calculator.insert_time(time1)
        calculator.insert_time(time2)
        calculator.insert_time(time3)
        calculator.insert_time(time4)
        calculator.calculate_best_times()
        k_times = calculator.get_k_best_times()
        self.assertEqual(k_times[0].start, datetime(2017, 11, 2, 17, 0))
        self.assertEqual(k_times[0].end, datetime(2017, 11, 2, 20, 0))
        self.assertEqual(k_times[1].end - k_times[1].start, timedelta(hours=1, minutes=30))
        self.assertEqual(k_times[2].end - k_times[2].start, timedelta(hours=1, minutes=30))

    def test_expand_best_time_redistribution(self):
        node1 = TimeCountTree.TimeCountNode(start=datetime(2017, 11, 1),
                                            end=datetime(2017, 11, 5),
                                            time_count=3,
                                            members=['a', 'b', 'c'])
        node2 = TimeCountTree.TimeCountNode(start=datetime(2017, 11, 5),
                                            end=datetime(2017, 11, 10),
                                            time_count=5,
                                            members=['b', 'c', 'd', 'e', 'f'])
        node3 = TimeCountTree.TimeCountNode(start=datetime(2017, 11, 10),
                                            end=datetime(2017, 11, 20),
                                            time_count=2,
                                            members=['a', 'f'])
        best_time = BestTimeCalculator.BestTime(node1)
        self.assertEqual(len(best_time.full_attend), 3)
        self.assertEqual(best_time.full_attend, {'a', 'b', 'c'})

        best_time.expand_best_time(node2)
        self.assertEqual(len(best_time.full_attend), 2)
        self.assertEqual(best_time.full_attend, {'b', 'c'})
        self.assertEqual(len(best_time.partial_attend), 4)
        self.assertIn('a', best_time.partial_attend.keys())
        self.assertIn('d', best_time.partial_attend.keys())
        self.assertIn('e', best_time.partial_attend.keys())
        self.assertIn('f', best_time.partial_attend.keys())
        self.assertEqual(best_time.partial_attend['a']['start'], datetime(2017, 11, 1))
        self.assertEqual(best_time.partial_attend['a']['end'], datetime(2017, 11, 5))

        best_time.expand_best_time(node3)
        self.assertEqual(len(best_time.full_attend), 0)
        self.assertEqual(len(best_time.partial_attend), 6)
        self.assertEqual(best_time.partial_attend['a']['start'], datetime(2017, 11, 10))
        self.assertEqual(best_time.partial_attend['a']['end'], datetime(2017, 11, 20))

    def test_best_time_str(self):
        start = datetime(2017, 11, 1)
        end = datetime(2017, 11, 2)
        best_time = BestTimeCalculator.BestTime(TimeCountTree.TimeCountNode(start, end, time_count=1, members=['user']))
        msg = ''
        msg += 'starttime:'
        msg += str(start)
        msg += '\nendtime:'
        msg += str(end)
        msg += '\nfull_attend:'
        msg += str({'user'})
        msg += '\npartial_attend'
        msg += str(dict())
        self.assertEqual(str(best_time), msg)
