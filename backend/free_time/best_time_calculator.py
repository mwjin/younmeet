from .time_count_tree import TimeCountTree
from .best_time_heap import BestTimeHeap


class BestTimeCalculator:
    def __init__(self, min_time_required, min_people, k=3):
        # k denotes how many times to show
        self.min_time_required = min_time_required
        self.min_people = min_people
        self.time_count_tree = TimeCountTree()
        self.k = k
        self.best_k_times = BestTimeHeap()

    def calculate_best_times(self):
        time_node_list = self.time_count_tree.append_inorder(self.min_people)
        for i in range(len(time_node_list)):
            time_node = time_node_list[i]
            new_best_time = BestTimeCalculator.BestTime(time_node)
            if new_best_time.end - new_best_time.start >= self.min_time_required:
                self.best_k_times.insert(new_best_time)
            else:
                # failed to exceed min time
                for j in range(i + 1, len(time_node_list)):
                    next_node = time_node_list[j]
                    if next_node.start != new_best_time.end:
                        # not consecutive, break
                        break

                    if next_node.end - next_node.start < self.min_time_required:
                        # if the next node exceeds min_time_required, merging will product duplicate result
                        new_best_time.expand_best_time(next_node)
                        if new_best_time.end - new_best_time.start >= self.min_time_required:
                            break

                if new_best_time.end - new_best_time.start >= self.min_time_required:
                    self.best_k_times.insert(new_best_time)

    # inputs list of pair (start, end)
    def insert_time(self, time_list):
        for time in time_list:
            self.time_count_tree.insert(time[0], time[1], time[2])
            # inserting (start_time, end_time, member_id)

    def get_k_best_times(self):
        k_times = []
        for k in range(self.k):
            k_times.append(self.best_k_times.extract_max())
        return k_times

    class BestTime(object):
        def __init__(self, time_node):
            self.start = time_node.start
            self.end = time_node.end
            self.full_attend = set(time_node.members)
            self.partial_attend = dict()
            self.weight = self.calculate_weight()

        def __str__(self):
            print('starttime:', self.start)
            print('endtime:', self.end)
            print('full_attend:', self.full_attend)
            print('partial_attend:')
            for member in self.partial_attend.keys():
                print('\t{:s} from'.format(member), self.partial_attend[member]['start'], ' to',
                      self.partial_attend[member]['end'])
            print()
            return ''

        def calculate_weight(self):
            weight = 0
            weight += (BestTimeCalculator.time_delta_to_minute(self.end - self.start) * len(self.full_attend) ** 1.5)
            for time_node in self.partial_attend.values():
                weight += BestTimeCalculator.time_delta_to_minute(time_node['end'] - time_node['start'])
            return weight

        def expand_best_time(self, new_time_node):
            # Merge distinct time_node
            remove_members = []
            for member in self.full_attend:
                if member not in new_time_node.members:
                    remove_members.append(member)
                    self.partial_attend[member] = {'start': self.start, 'end': self.end}

            for member in remove_members:
                self.full_attend.remove(member)

            for member in self.partial_attend.keys():
                if member in new_time_node.members:
                    before_available_time = self.partial_attend[member]
                    if before_available_time['end'] == new_time_node.start:
                        # Can expand time
                        self.partial_attend[member]['start'] = before_available_time['start']
                        self.partial_attend[member]['end'] = new_time_node.end
                    else:
                        # Take longer time
                        if new_time_node.end - new_time_node.start > \
                                        before_available_time['end'] - before_available_time['start']:
                            self.partial_attend[member]['start'] = new_time_node.start
                            self.partial_attend[member]['end'] = new_time_node.end

            for member in new_time_node.members:
                if member not in self.partial_attend.keys() and member not in self.full_attend:
                    self.partial_attend[member]['start'] = new_time_node.start
                    self.partial_attend[member]['end'] = new_time_node.end

            self.end = new_time_node.end
            self.weight = self.calculate_weight()

    @staticmethod
    def time_delta_to_minute(time_delta):
        return time_delta.days * 24 * 60 + time_delta.seconds / 60
