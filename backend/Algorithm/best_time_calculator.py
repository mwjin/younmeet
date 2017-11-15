from time_count_tree import TimeCountTree, TimeCountNode
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

    # TODO: Edit so that people in the time_list is same
    def check_min_people(self, node_list):
        for node in node_list:
            if node.time_count < self.min_people:
                return False
        return True

    # maintains top k list
    def k_max_pq_add(self, new_sum, node_list):
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

    def td_to_min(self, td):
        return td.days * 24 * 60 + td.seconds / 60

    def check_continuity(self, tree_list, f, l):

        for i in range(f, l):
            if tree_list[i].end != tree_list[i + 1].start:
                return False
        return True

    def top_k_best_time(self):
        tree_list = []
        self.time_count_tree.append_inorder(tree_list)

        top_k_list = []
        f = 0
        l = 0

        # to check whether the tree_list should be checked from the first
        check_first = False

        # every time a while loop is called, f or l moves forward 0 or 1 (both can move)
        while l < len(tree_list):

            if not self.check_continuity(tree_list, f, l):
                f = l
                continue

            first = tree_list[f]
            last = tree_list[l]

            if last.end - first.start < self.min_time_required:
                l += 1
                check_first = True
                continue

            # ensures tree_list[f...l] is the min node that is longer than min_time_req
            # tree_list[f...l-1] is shorter than min_time_req

            if not self.check_min_people(tree_list[f: l + 1]):
                if not self.check_min_people(tree_list[l: l + 1]):
                    f = l + 1
                    l = l + 1
                for i in range (l, f - 1, - 1):
                    if not self.check_min_people(tree_list[i: i + 1]):
                        f = i + 1
                        break
                continue

            # ensures tree_list[f...l] has at least one best time

            if check_first:

                if last.end - first.start == self.min_time_required:
                    sum = 0
                    for i in range(f, l + 1):
                        curr = tree_list[i]
                        sum += self.td_to_min(curr.end - curr.start) * curr.time_count
                    self.k_max_pq_add(sum, tree_list[f: l + 1])
                    print("f: {}, l: {} sum: {}".format(f, l, sum))

                    #f and l changes
                    f += 1
                    l += 1

                else:
                    sum = 0
                    time_diff = self.min_time_required
                    for i in range(f, l + 1):
                        curr = tree_list[i]
                        if time_diff > curr.end - curr.start:
                            sum += self.td_to_min(curr.end - curr.start) * curr.time_count
                            time_diff -= curr.end - curr.start
                        else:
                            sum += self.td_to_min(time_diff) * curr.time_count

                    # self.k_max_pq_add(sum, tree_list[f: l].append(
                    #    TimeCountNode(tree_list[l].start, tree_list[l].start + time_diff, tree_list[l].time_count)))
                    self.k_max_pq_add(sum, tree_list[f: l + 1])
                    print("f: {}, l: {} sum: {}".format(f, l, sum))

                    if last.end - self.min_time_required < first.end:
                        check_first = False
                    else:
                        f += 1

            # not check_first
            else:
                sum = 0
                time_diff = self.min_time_required
                for i in range(l, f - 1, -1):
                    curr = tree_list[i]
                    if time_diff > curr.end - curr.start:
                        sum += self.td_to_min(curr.end - curr.start) * curr.time_count
                        time_diff -= curr.end - curr.start
                    else:
                        sum += self.td_to_min(time_diff) * curr.time_count
                self.k_max_pq_add(sum, tree_list[f: l + 1])
                print("f: {}, l: {} sum: {}".format(f, l, sum))

                # self.k_max_pq_add(sum, [TimeCountNode(tree_list[f].end - time_diff, tree_list[f].end, tree_list[f].time_count)]
                #                    .append(tree_list[f + 1: l + 1]))

                l += 1

                while l < len(tree_list):

                    if not self.check_continuity(tree_list, f, l):
                        break
                    if not self.check_min_people(tree_list[f: l + 1]):
                        break
                    if tree_list[l].end - time_diff > tree_list[f].end:
                        break

                    sum = 0
                    time_diff = self.min_time_required
                    for i in range(l, f - 1, -1):
                        curr = tree_list[i]
                        if time_diff > curr.end - curr.start:
                            sum += self.td_to_min(curr.end - curr.start) * curr.time_count
                            time_diff -= curr.end - curr.start
                        else:
                            sum += time_diff * curr.time_count

                    self.k_max_pq_add(sum, tree_list[f: l + 1])
                    print("f: {}, l: {} sum: {}".format(f, l, sum))
                    # self.k_max_pq_add(sum, [
                    #    TimeCountNode(tree_list[f].end - time_diff, tree_list[f].end, tree_list[f].time_count)]
                    #                  .append(tree_list[f + 1, l + 1]))
                    l += 1
                f += 1
                check_first = True


