from Algorithm.time_count_tree import TimeCountTree, TimeCountNode
from datetime import datetime, timedelta


# simple testing
if __name__ == "__main__":
    '''
    from datetime import datetime

    def make_time(str):
        return datetime.strptime('2017-11-4 '+str, '%Y-%m-%d %H:%M')
    start_str_list = ['12:00', '15:30', '14:00', '20:30', '12:30', '15:30', '18:30', '12:30']
    end_str_list = ['14:00', '21:00', '18:30', '22:00', '14:00', '17:00', '23:00', '22:00']
    start_time_list = []
    end_time_list = []
    tree = TimeCountTree()
    for i in range(len(start_str_list) - 1, -1, -1):
        start_time_list.append(make_time(start_str_list[i]))
        end_time_list.append(make_time(end_str_list[i]))
    for i in range(len(start_time_list)):
        node = TimeCountNode(start_time_list[i], end_time_list[i])
        tree.insert(node)
    # tree.calculate_best_time()

    time1 = datetime.strptime('2017-11-4 12:30', '%Y-%m-%d %H:%M')
    time2 = datetime.strptime('2017-11-4 12:30', '%Y-%m-%d %H:%M')
    print("datetime comparison", time1 == time2)
    '''
    time1 = timedelta(minutes=200)
    datetime1 = datetime.strptime('2017-11-4 12:30', '%Y-%m-%d %H:%M')
    datetime2 = datetime.strptime('2017-11-4 14:30', '%Y-%m-%d %H:%M')

    time1 -= datetime2 - datetime1
    print(time1)

