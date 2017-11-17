from time_count_tree import TimeCountTree, TimeCountNode
from datetime import timedelta

class BestTimeCalculator:

    def __init__(self, min_time_required, min_people, k):
        self.min_time_required = min_time_required
        self.min_people = min_people
        self.time_count_tree = TimeCountTree()
        self.k = k
        self.top_k_list = []

    # inputs list of pair (start, end)
    def insert_time(self, time_list):

        for time in time_list:
            self.time_count_tree.insert(time[0], time[1])

    # TODO: Edit so that people in the time_list is same
    def check_min_people(self, f, l):

        for node in self.tree_list[f: l + 1]:
            if node.time_count < self.min_people:
                return False
        return True

    # maintains top k list
    def k_max_pq_add(self, new_sum, f, l):

        if len(self.top_k_list) < self.k:
            self.top_k_list.append((new_sum, f , l))
        else:
            min_sum = 987654321
            min_sum_index = -1

            for i in range(self.k):
                if self.top_k_list[i][1] < f and self.top_k_list[i][2] == l and self.top_k_list[i][0] <= new_sum:
                    self.top_k_list[i] = (new_sum, f, l)
                    return

                if self.top_k_list[i][0] < min_sum:
                    min_sum = self.top_k_list[i][0]
                    min_sum_index = i

            if new_sum > min_sum:
                self.top_k_list[min_sum_index] = (new_sum, f, l)


    def td_to_min(self, td):
        return td.days * 24 * 60 + td.seconds / 60

    def check_continuity(self, f, l):

        for i in range(f, l):
            if self.tree_list[i].end != self.tree_list[i + 1].start:
                return False
        return True

    # return (sum_weight, start, end)
    def calculate_best_time(self):
        self.tree_list = []
        self.time_count_tree.append_inorder(self.tree_list, self.min_people)

        f = 0
        l = 0

        # to check whether the tree_list should be checked from the first
        check_first = False

        # every time a while loop is called, f or l moves forward 0 or 1 (both can move)
        while l < len(self.tree_list):

            if not self.check_continuity(f, l):
                f = l
                continue

            first = self.tree_list[f]
            last = self.tree_list[l]

            if last.end - first.start < self.min_time_required:
                l += 1
                check_first = True
                continue

            # ensures tree_list[f...l] is the min node that is longer than min_time_req
            # tree_list[f...l-1] is shorter than min_time_req

            if not self.check_min_people(f, l):
                if not self.check_min_people(l, l):
                    f = l + 1
                    l = l + 1
                for i in range (l, f - 1, - 1):
                    if not self.check_min_people(i , i):
                        f = i + 1
                        break
                continue

            # ensures tree_list[f...l] has at least one best time

            if check_first:

                if last.end - first.start == self.min_time_required:
                    sum = 0
                    for i in range(f, l + 1):
                        curr = self.tree_list[i]
                        sum += self.td_to_min(curr.end - curr.start) * curr.time_count
                    self.k_max_pq_add(sum, f, l)
                    # print("f: {}, l: {} sum: {}".format(f, l, sum))

                    #f and l changes
                    f += 1
                    l += 1

                else:
                    sum = 0
                    time_diff = self.min_time_required
                    for i in range(f, l + 1):
                        curr = self.tree_list[i]
                        if time_diff > curr.end - curr.start:
                            sum += self.td_to_min(curr.end - curr.start) * curr.time_count
                            time_diff -= curr.end - curr.start
                        else:
                            sum += self.td_to_min(time_diff) * curr.time_count

                    # self.k_max_pq_add(sum, tree_list[f: l].append(
                    #    TimeCountNode(tree_list[l].start, tree_list[l].start + time_diff, tree_list[l].time_count)))
                    self.k_max_pq_add(sum, f, l)

                    if f == l:
                        f += 1
                        l += 1
                    elif last.end - self.min_time_required < first.end:
                        check_first = False
                    else:
                        f += 1

            # not check_first
            else:
                sum = 0
                time_diff = self.min_time_required
                for i in range(l, f - 1, -1):
                    curr = self.tree_list[i]
                    if time_diff > curr.end - curr.start:
                        sum += self.td_to_min(curr.end - curr.start) * curr.time_count
                        time_diff -= curr.end - curr.start
                    else:
                        sum += self.td_to_min(time_diff) * curr.time_count
                self.k_max_pq_add(sum, f, l)

                # self.k_max_pq_add(sum, [TimeCountNode(tree_list[f].end - time_diff, tree_list[f].end, tree_list[f].time_count)]
                #                    .append(tree_list[f + 1: l + 1]))

                l += 1

                while l < len(self.tree_list):

                    if not self.check_continuity(f, l):
                        break
                    if not self.check_min_people(f, l):
                        break
                    if self.tree_list[l].end - time_diff > self.tree_list[f].end:
                        break

                    sum = 0
                    time_diff = self.min_time_required
                    for i in range(l, f - 1, -1):
                        curr = self.tree_list[i]
                        if time_diff > curr.end - curr.start:
                            sum += self.td_to_min(curr.end - curr.start) * curr.time_count
                            time_diff -= curr.end - curr.start
                        else:
                            sum += self.td_to_min(time_diff) * curr.time_count

                    self.k_max_pq_add(sum, f, l)
                    # self.k_max_pq_add(sum, [
                    #    TimeCountNode(tree_list[f].end - time_diff, tree_list[f].end, tree_list[f].time_count)]
                    #                  .append(tree_list[f + 1, l + 1]))
                    l += 1
                f += 1
                check_first = True

        # to (start_time, end_time) format
        result = []
        for indices in self.top_k_list:
            # print(indices[1], indices[2])
            # return (sum_weight, start, end)
            result.append((indices[0], self.tree_list[indices[1]].start, self.tree_list[indices[2]].end))
        result.sort(key=lambda t: t[0], reverse=True)
        return result


    def make_tree_testing(self):
        self.tree_list = []
        self.time_count_tree.append_inorder(self.tree_list, self.min_people)