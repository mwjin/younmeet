from time_count_tree import TimeCountTree
from datetime import timedelta


class BestTimeCalculator:

    def __init__(self, min_time_required, min_people, k):
        self.min_time_required = min_time_required
        self.min_people = min_people
        self.time_count_tree = TimeCountTree()
        self.k = k
        self.top_k_list = []

    # time_list is list of pair (start, end)
    def insert_time(self, time_list):

        for time in time_list:
            self.time_count_tree.insert(time[0], time[1])

    # maintains top k list
    def k_max_pq_add(self, new_sum, node_list):
        print(len(self.top_k_list))
        if len(self.top_k_list) < self.k:
            self.top_k_list.append((new_sum, node_list))
        else:
            min_sum = 987654321
            min_sum_index = -1
            for i in range(self.k):
                if self.top_k_list[i][0] < min_sum:
                    min_sum = self.top_k_list[i][0]
                    min_sum_index = i
            if new_sum > min_sum:
                self.top_k_list[min_sum_index] = (new_sum, node_list)

    # calculate best time from tree_list[i...j]
    # ensures that tree_list[i...j] has at least one best time
    # fix j and increment i to get max weight
    def add_best_time(self, tree_list, i, j):

        #increment i
        while tree_list[j].end - tree_list[i].start >= self.min_time_required:
            # print(i, j)
            new_end = i
            exist_new_end = True

            while tree_list[new_end].end - tree_list[i].start < self.min_time_required:
                new_end += 1
                if new_end > j:
                    exist_new_end = False
                    break

            if exist_new_end:
                sum1 = 0
                min_time1 = self.min_time_required
                for curr in range(i, new_end + 1):
                    weight = tree_list[curr].time_count
                    if curr == new_end:
                        sum1 += weight * min_time1.total_seconds() / 60
                    else:
                        duration = tree_list[curr].end - tree_list[curr].start
                        sum1 += weight * duration.total_seconds() / 60
                        min_time1 -= duration

                sum2 = 0
                min_time2 = self.min_time_required
                for curr in range(new_end, i - 1, -1):
                    weight = tree_list[curr].time_count
                    if curr == i:
                        sum2 += weight * min_time2.total_seconds() / 60
                    else:
                        duration = tree_list[curr].end - tree_list[curr].start
                        sum2 += weight * duration.total_seconds() / 60
                        min_time2 -= duration

                max_sum = 0
                if sum1 > sum2:
                    max_sum = sum1
                else:
                    max_sum = sum2
                # print(i, j, max_sum)
                self.k_max_pq_add(max_sum, tree_list[i: j + 1])

            i += 1

        return i

    # returns top k best time
    def top_k_best_time(self):
        tree_list = []
        self.time_count_tree.append_inorder(tree_list)

        top_k_list = []

        i = 0
        j = 0
        end_time = tree_list[0].start

        for j in range(len(tree_list)):

            if end_time != tree_list[j].start:
                i = j
                end_time = tree_list[i].start
            else:
                time_diff_bigger_than_min_time = True
                time_diff = tree_list[j].end - tree_list[i].start
                end_time = tree_list[j].end
                if time_diff >= self.min_time_required:
                    if time_diff_bigger_than_min_time:
                        i = self.add_best_time(tree_list, i, j)

                ''' 
                    while j < len(tree_list) and time_diff < self.min_time_required:
                    # check if the time is continuous
                    if end_time != tree_list[j].start:
                        time_diff_bigger_than_min_time = False
                        break
                    else:
                        time_diff += tree_list[j].end - tree_list[j].start
                        end_time = tree_list[j].end
                        j += 1
            '''


