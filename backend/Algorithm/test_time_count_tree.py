from time_count_tree import TimeCountTree, TimeCountNode
from best_time_calculator import BestTimeCalculator
from datetime import datetime, timedelta

def add_best_time(time_list):
    time_list.append(1)





# simple testing
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

