from time_count_tree import TimeCountTree, TimeCountNode
from best_time_calculator import BestTimeCalculator
from time_count_tree import TimeConstraintException
from datetime import datetime, timedelta

import unittest

'''
$ coverage run -m unittest test_best_time.py
$ coverage html

'''

def make_time(str, i=0):
    if i == 0:
        return datetime.strptime('2017-11-1 ' + str, '%Y-%m-%d %H:%M')
    if i == 1:
        return datetime.strptime('2017-11-2 ' + str, '%Y-%m-%d %H:%M')
    if i == 2:
        return datetime.strptime('2017-11-3 ' + str, '%Y-%m-%d %H:%M')

def make_time_list(start_list, end_list):
    result = []
    for i in range(3):
        for j in range(len(start_list[i])):
            result.append((make_time(start_list[i][j], i), make_time(end_list[i][j], i)))
    return result


class TestBestTime(unittest.TestCase):

    def test_no_input(self):
        btc = BestTimeCalculator(
            min_time_required=timedelta(hours=2),
            min_people=3,
            k=3
        )
        result = btc.calculate_best_time()
        self.assertEqual(len(result), 0)

    def test_end_earlier_than_start_input(self):
        btc = BestTimeCalculator(
            min_time_required=timedelta(hours=2),
            min_people=3,
            k=3
        )
        with self.assertRaises(TimeConstraintException):
            btc.insert_time([(make_time('14:00'), make_time('12:00'))])

    def test_1day_team_table(self):

        start_str_list = ['12:00', '15:30', '14:00', '20:30', '12:30', '15:30', '18:30', '12:30']
        end_str_list = ['14:00', '21:00', '18:30', '22:00', '14:00', '17:00', '23:00', '22:00']

        btc = BestTimeCalculator(
            min_time_required=timedelta(hours=2),
            min_people=3,
            k=3
        )

        time_list = []

        for i in range(len(start_str_list) - 1, -1, -1):
            time_list.append((make_time(start_str_list[i], 1), make_time(end_str_list[i], 1)))
        btc.insert_time(time_list)
        result = btc.calculate_best_time()

        self.assertGreaterEqual(3, len(result))

        for t in result:
            self.assertGreater(t[0], 350)


    def test_3days_team_table(self):

        mw_start_list = [['08:00', '12:20'], ['08:00', '11:50', '16:50'], ['08:00', '12:30']]
        mw_end_list = [['11:00', '20:00'], ['11:00', '15:20', '20:00'], ['11:00', '18:30']]
        tb_start_list = [['08:00', '12:30', '15:30', '18:30'], ['11:50', '15:50'], ['08:00', '12:30', '15:20']]
        tb_end_list = [['11:00', '14:00', '17:00', '22:00'], ['14:00', '22:00'], ['11:00', '14:00', '16:50']]
        ps_start_list = [['10:00', '14:00'], ['10:00', '11:50', '17:00'], ['10:00', '14:00']]
        ps_end_list = [['11:00', '18:20'], ['11:00', '13:50', '22:30'], ['11:00', '18:30']]
        ds_start_list = [['08:00', '12:10', '15:20'], ['08:00', '14:00', '17:00'], ['08:00', '12:10', '15:20']]
        ds_end_list = [['11:00', '14:00', '23:00'], ['11:00', '15:30', '23:00'], ['11:00', '14:00', '18:30']]

        K = 3

        btc = BestTimeCalculator(
            min_time_required=timedelta(hours=2),
            min_people=3,
            k=K
        )
        btc.insert_time(make_time_list(mw_start_list, mw_end_list))
        btc.insert_time(make_time_list(tb_start_list, tb_end_list))
        btc.insert_time(make_time_list(ps_start_list, ps_end_list))
        btc.insert_time(make_time_list(ds_start_list, ds_end_list))
        result = btc.calculate_best_time()

        self.assertGreaterEqual(K, len(result))

        prev_sum = 490
        for i in range (K):
            self.assertGreaterEqual(prev_sum, result[i][0])
            prev_sum = result[i][0]

        self.assertEqual(result[0][0], 480)
        self.assertEqual(result[1][0], 450)
        self.assertEqual(result[2][0], 450)

        btc.make_tree_testing()
        tree_list = btc.tree_list
        time_count_list = []
        for node in tree_list:
            time_count_list.append(node.time_count)

        answer = [3, 4, 1, 2, 3, 2, 3, 4, 3, 2, 3, 2, 1,
                  2, 3, 3, 2, 2, 1, 1, 2, 4, 3, 2, 1,
                  3, 4, 1, 3, 2, 4, 3]
        self.assertEqual(len(answer), len(time_count_list))
        for i in range (len(answer)):
            self.assertEqual(answer[i], time_count_list[i])






