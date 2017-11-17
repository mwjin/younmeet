from time_count_tree import TimeCountTree, TimeCountNode
from best_time_calculator import BestTimeCalculator
from datetime import datetime, timedelta

import unittest

class TestBestTime(unittest.TestCase):
    def test_no_input(self):
        btc = BestTimeCalculator(
            min_time_required=timedelta(hours=2),
            min_people=3,
            k=3
        )
        result = btc.calculate_best_time()
        self.assertEqual(len(result), 0)


'''# simple testing
if __name__ == "__main__":

    def make_time(str):
        return datetime.strptime('2017-11-4 '+str, '%Y-%m-%d %H:%M')
    start_str_list = ['12:00', '15:30', '14:00', '20:30', '12:30', '15:30', '18:30', '12:30']
    end_str_list = ['14:00', '21:00', '18:30', '22:00', '14:00', '17:00', '23:00', '22:00']

    btc = BestTimeCalculator(
        min_time_required=timedelta(hours=2),
        min_people=3,
        k=3
    )

    time_list = []

    for i in range(len(start_str_list) - 1, -1, -1):
        time_list.append((make_time(start_str_list[i]), make_time(end_str_list[i])))
    btc.insert_time(time_list)
    print(make_time(start_str_list[0]))
    btc.top_k_best_time()

    for node in btc.top_k_list:
        print (node[0])
        print(node[1], node[2])
'''


def make_time(str, i):
    if i == 0:
        return datetime.strptime('2017-11-1 ' + str, '%Y-%m-%d %H:%M')
    if i == 1:
        return datetime.strptime('2017-11-2 ' + str, '%Y-%m-%d %H:%M')
    if i == 2:
        return datetime.strptime('2017-11-3 ' + str, '%Y-%m-%d %H:%M')

def make_time_list(start_list, end_list):
    result = []
    for i in range (3):
        for j in range(len(start_list[i])):
            result.append((make_time(start_list[i][j], i), make_time(end_list[i][j], i)))
    return result

if __name__=="__main__":

    mw_start_list = [['08:00', '12:20'], ['08:00', '11:50', '16:50'], ['08:00', '12:30']]
    mw_end_list = [['11:00', '20:00'], ['11:00', '15:20', '20:00'], ['11:00', '18:30']]
    tb_start_list = [['08:00', '12:30', '15:30', '18:30'], ['11:50', '13:50'], ['08:00', '12:30', '15:20']]
    tb_end_list = [['11:00', '14:00', '17:00', '22:00'], ['14:00', '22:00'], ['11:00', '14:00', '16:50']]
    ps_start_list = [['10:00', '14:00'], ['10:00', '11:50', '17:00'], ['10:00', '14:00']]
    ps_end_list = [['11:00', '18:20'], ['11:00', '13:50', '22:30'], ['11:00', '18:30']]
    ds_start_list = [['08:00', '12:10', '15:20'], ['08:00', '14:00', '17:00'], ['08:00', '12:10', '15:20']]
    ds_end_list = [['11:00', '14:00', '23:00'], ['11:00', '15:30', '23:00'], ['11:00', '14:00', '18:30']]

    btc = BestTimeCalculator(
        min_time_required=timedelta(hours=2),
        min_people=3,
        k=3
    )
    btc.insert_time(make_time_list(mw_start_list, mw_end_list))
    btc.insert_time(make_time_list(tb_start_list, tb_end_list))
    btc.insert_time(make_time_list(ps_start_list, ps_end_list))
    btc.insert_time(make_time_list(ds_start_list, ds_end_list))
    result = btc.calculate_best_time()

    for t in result:
        print(t[0], t[1], t[2])

if __name__ == '__main__':
    unittest.main()