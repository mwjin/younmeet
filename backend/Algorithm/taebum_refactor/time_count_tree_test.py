from time_count_tree import TimeCountTree
from best_time_calculator import BestTimeCalculator
from datetime import datetime, timedelta

import unittest

import sys
import io


def convert_to_datetime(time_string):
    return datetime.strptime(time_string, '%Y-%m-%d %H:%M')


"""
class TimeCountTreeTest(unittest.TestCase):
    def setUp(self):
        self.tree = TimeCountTree()

    def test_print_tree(self):
        self.tree.insert(0, 1, '')
        capture_string = io.StringIO()
        sys.stdout = capture_string
        self.tree.print_tree()
        sys.stdout = sys.__stdout__

        self.assertEqual(capture_string.getvalue(),
                         'Start: 0, End: 1, Time count: 1, Members: [, ]\n')

    def test_time_constraint_exception(self):
        with self.assertRaises(TimeCountTree.TimeConstraintException):
            self.tree.insert(1, 0, '')

    def test_get_height_none(self):
        self.assertEqual(TimeCountTree.get_height(None), 0)

    def test_get_height(self):
        node = TimeCountTree.TimeCountNode(0, 1)
        self.assertEqual(TimeCountTree.get_height(node), 1)

"""

"""
t = TimeCountTree()

print(t)

times = [[datetime(2017, 11, 10),
          datetime(2017, 11, 12), 'taebum'],
         [datetime(2017, 11, 11),
          datetime(2017, 11, 13), 'dongsu']]

mw_time = [
    [convert_to_datetime('2017-11-01 08:00'), convert_to_datetime('2017-11-01 11:00'), 'minwoo'],
    [convert_to_datetime('2017-11-01 12:20'), convert_to_datetime('2017-11-01 20:00'), 'minwoo'],
    [convert_to_datetime('2017-11-02 08:00'), convert_to_datetime('2017-11-02 11:00'), 'minwoo'],
    [convert_to_datetime('2017-11-02 11:50'), convert_to_datetime('2017-11-02 15:20'), 'minwoo'],
    [convert_to_datetime('2017-11-02 16:50'), convert_to_datetime('2017-11-02 20:00'), 'minwoo'],
    [convert_to_datetime('2017-11-03 08:00'), convert_to_datetime('2017-11-03 11:00'), 'minwoo'],
    [convert_to_datetime('2017-11-03 12:30'), convert_to_datetime('2017-11-03 18:30'), 'minwoo'],
]
for time in mw_time:
    t.insert(time[0], time[1], time[2])

tb_time = [
    [convert_to_datetime('2017-11-01 08:00'), convert_to_datetime('2017-11-01 11:00'), 'taebum'],
    [convert_to_datetime('2017-11-01 12:30'), convert_to_datetime('2017-11-01 14:00'), 'taebum'],
    [convert_to_datetime('2017-11-01 15:30'), convert_to_datetime('2017-11-01 17:00'), 'taebum'],
    [convert_to_datetime('2017-11-01 18:30'), convert_to_datetime('2017-11-01 22:00'), 'taebum'],
    [convert_to_datetime('2017-11-02 11:50'), convert_to_datetime('2017-11-02 14:00'), 'taebum'],
    [convert_to_datetime('2017-11-02 15:50'), convert_to_datetime('2017-11-02 22:00'), 'taebum'],
    [convert_to_datetime('2017-11-03 08:00'), convert_to_datetime('2017-11-03 11:00'), 'taebum'],
    [convert_to_datetime('2017-11-03 12:30'), convert_to_datetime('2017-11-03 14:00'), 'taebum'],
    [convert_to_datetime('2017-11-03 15:20'), convert_to_datetime('2017-11-03 16:50'), 'taebum'],
]
for time in tb_time:
    t.insert(time[0], time[1], time[2])

ps_time = [
    [convert_to_datetime('2017-11-01 10:00'), convert_to_datetime('2017-11-01 11:00'), 'philsik'],
    [convert_to_datetime('2017-11-01 14:00'), convert_to_datetime('2017-11-01 18:20'), 'philsik'],
    [convert_to_datetime('2017-11-02 10:00'), convert_to_datetime('2017-11-02 11:00'), 'philsik'],
    [convert_to_datetime('2017-11-02 11:50'), convert_to_datetime('2017-11-02 13:50'), 'philsik'],
    [convert_to_datetime('2017-11-02 17:00'), convert_to_datetime('2017-11-02 22:30'), 'philsik'],
    [convert_to_datetime('2017-11-03 10:00'), convert_to_datetime('2017-11-03 11:00'), 'philsik'],
    [convert_to_datetime('2017-11-03 14:00'), convert_to_datetime('2017-11-03 18:30'), 'philsik'],
]
for time in ps_time:
    t.insert(time[0], time[1], time[2])

ds_time = [
    [convert_to_datetime('2017-11-01 08:00'), convert_to_datetime('2017-11-01 11:00'), 'dongsu'],
    [convert_to_datetime('2017-11-01 12:10'), convert_to_datetime('2017-11-01 14:00'), 'dongsu'],
    [convert_to_datetime('2017-11-01 15:20'), convert_to_datetime('2017-11-01 23:00'), 'dongsu'],
    [convert_to_datetime('2017-11-02 08:00'), convert_to_datetime('2017-11-02 11:00'), 'dongsu'],
    [convert_to_datetime('2017-11-02 14:00'), convert_to_datetime('2017-11-02 15:30'), 'dongsu'],
    [convert_to_datetime('2017-11-02 17:00'), convert_to_datetime('2017-11-02 23:00'), 'dongsu'],
    [convert_to_datetime('2017-11-03 08:00'), convert_to_datetime('2017-11-03 11:00'), 'dongsu'],
    [convert_to_datetime('2017-11-03 12:10'), convert_to_datetime('2017-11-03 14:00'), 'dongsu'],
    [convert_to_datetime('2017-11-03 15:20'), convert_to_datetime('2017-11-03 18:30'), 'dongsu'],
]
for time in ds_time:
    t.insert(time[0], time[1], time[2])

btc = BestTimeCalculator(timedelta(minutes=120), min_people=1)

btc.insert_time(mw_time)
btc.insert_time(tb_time)
btc.insert_time(ps_time)
btc.insert_time(ds_time)
# print(btc.calculate_best_time())
btc.calculate_best_times()

while btc.best_k_times.size > 0:
    print(btc.best_k_times.extract_max())
"""


def make_time(str, i=0):
    if i == 0:
        return datetime.strptime('2017-11-1 ' + str, '%Y-%m-%d %H:%M')
    if i == 1:
        return datetime.strptime('2017-11-2 ' + str, '%Y-%m-%d %H:%M')
    if i == 2:
        return datetime.strptime('2017-11-3 ' + str, '%Y-%m-%d %H:%M')


def make_time_list(start_list, end_list, member_id):
    result = []
    for i in range(len(start_list)):
        for j in range(len(start_list[i])):
            result.append((make_time(start_list[i][j], i), make_time(end_list[i][j], i), member_id))
    return result


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

mw_list = make_time_list(mw_start_list, mw_end_list, 'minwoo')
tb_list = make_time_list(tb_start_list, tb_end_list, 'taebum')
ps_list = make_time_list(ps_start_list, ps_end_list, 'pilsik')
ds_list = make_time_list(ds_start_list, ds_end_list, 'dongsu')

btc = BestTimeCalculator(timedelta(minutes=30), min_people=2)
btc.insert_time(mw_list)
btc.insert_time(tb_list)
btc.insert_time(ps_list)
btc.insert_time(ds_list)
btc.calculate_best_times()
while btc.best_k_times.size > 0:
    print(btc.best_k_times.extract_max())
