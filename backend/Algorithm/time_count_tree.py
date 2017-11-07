'''
best k time algorithm


def of "best time" = argmax ( sum( time_count * (minutes) )

1. minutes > min_time_required
2. each output is time interval that is sum of time interval of nodes


'''

'''
How algorithm works

def time_interval = (start_time, end_time)

1. build tree
    1) Input to root a time_interval
        If a new time_interval has been inputed, it has time_count of 1

    2) Input other nodes
        when inputting other nodes, the other node can have 3 relationship with the tree node
        (1) one time_interval contains the other    
        (2) it overlaps
        (3) it does not intersect
        These 3 cases are held accordingly considering time_count by node_relationship()

        so node_relationship outputs [new_left)node, new_self_node, new_right_node]
        (new_self_node is not None)

        the new_left_node recursively inserted to the left node and as same for right
        the new_self_node becomes the self node


'''

'''
Tree input specification(Database integrity)

Assumes that for each person, the free time interval must not overlap

ex) 
person that has free time(start_time, end_time)  
(1, 3) and (2,4) must not exit in DB

'''
from queue import Queue
from datetime import timedelta

K = 5

class TimeConstraintException(Exception):
    def __init__(self):
        self.msg = "start should be earlier than end"

    def __str__(self):
        return self.msg


class TimeCountNode:
    def __init__(self, start, end, time_count=1):
        if start >= end:
            raise TimeConstraintException()
        self.start = start
        self.end = end
        self.time_count = time_count
        self.left = None
        self.right = None

    # finds out the relation
    def node_relationship(self, oth):
        new_left = None
        new_self = None
        new_right = None
        # new left is not None
        if oth.start < self.start:
            if oth.end > self.end:
                new_left = TimeCountNode(oth.start, self.start, oth.time_count)
                new_self = TimeCountNode(self.start, self.end, self.time_count + oth.time_count)
                new_right = TimeCountNode(self.end, oth.end, oth.time_count)
            elif oth.end == self.end:
                new_left = TimeCountNode(oth.start, self.start, oth.time_count)
                new_self = TimeCountNode(self.start, self.end, self.time_count + oth.time_count)
            else:
                # oth.end < self.end
                if oth.end > self.start:
                    new_left = TimeCountNode(oth.start, self.start, oth.time_count)
                    new_self = TimeCountNode(self.start, oth.end, self.time_count + oth.time_count)
                    new_right = TimeCountNode(oth.end, self.end, self.time_count)
                else:
                    new_left = TimeCountNode(oth.start, oth.end, oth.time_count)
                    new_self = TimeCountNode(self.start, self.end, self.time_count)

        elif oth.start == self.start:
            if oth.end > self.end:
                new_self = TimeCountNode(self.start, self.end, self.time_count + oth.time_count)
                new_right = TimeCountNode(self.end, oth.end, oth.time_count)
            elif oth.end == self.end:
                new_self = TimeCountNode(self.start, self.end, self.time_count + oth.time_count)
            else:
                new_self = TimeCountNode(self.start, oth.end, self.time_count + oth.time_count)
                new_right = TimeCountNode(oth.end, self.end, self.time_count)

        else:
            # oth.start > self.start

            if oth.end > self.end:
                if oth.start < self.end:
                    new_left = TimeCountNode(self.start, oth.start, self.time_count)
                    new_self = TimeCountNode(oth.start, self.end, self.time_count + oth.time_count)
                    new_right = TimeCountNode(self.end, oth.end, oth.time_count)
                else:
                    new_self = TimeCountNode(self.start, self.end, self.time_count)
                    new_right = TimeCountNode(oth.start, oth.end, oth.time_count)
            elif oth.end == self.end:
                new_left = TimeCountNode(self.start, oth.start, self.time_count)
                new_self = TimeCountNode(oth.start, oth.end, self.time_count + oth.time_count)
            else:
                new_left = TimeCountNode(self.start, oth.start, self.time_count)
                new_self = TimeCountNode(oth.start, oth.end, oth.time_count + self.time_count)
                new_right = TimeCountNode(oth.end, self.end, self.time_count)

        return [new_left, new_self, new_right]

    def insert_node(self, oth):
        if oth is None:
            return

        [new_left, new_self, new_right] = self.node_relationship(oth)

        self.start = new_self.start
        self.end = new_self.end
        self.time_count = new_self.time_count

        if self.left is None:
            self.left = new_left
        else:
            self.left.insert_node(new_left)

        if self.right is None:
            self.right = new_right
        else:
            self.right.insert_node(new_right)

    def print_inorder(self):
        if self.left is not None:
            self.left.print_inorder()
        print("start: {}, end: {}, time count: {}".format(self.start, self.end, self.time_count))
        if self.right is not None:
            self.right.print_inorder()

    def append_inorder(self, list):
        if self.left is not None:
            self.left.append_inorder(list)
        list.append(self)
        if self.right is not None:
            self.right.append_inorder(list)


class TimeCountTree:

    def __init__(self, node=None):
        self.root = node

    def insert(self, oth):
        if self.root is None:
            self.root = oth
        else:
            self.root.insert_node(oth)

    def print_inorder(self):
        self.root.print_inorder()

    def append_inorder(self, list):
        self.root.append_inorder(list)

    def k_max_pq_add(top_k_list, weight, node_list):
        if (len(top_k_list) < K):
            top_k_list.append((weight, node_list))
        else:
            max_weight = -1
            max_weight_index = -1
            for i in range (K):
                if top_k_list[i][0] < max_weight:
                    max_weight = top_k_list[i][0]
                    max_weight_index = i
            if max_weight > weight:
                top_k_list[i] = (weight, node_list)
            return top_k_list

    def calculate_best_time(self, min_time_required):
        # min_time_required is time_delta
        list = []
        self.append_inorder(list)

        top_k_list = []

        i = 0
        j = 0
        time_diff = timedelta()
        end_time = list[0].end

        while j < len(list):

            # check if the time is continuous
            if end_time != list[j].start_time:
                i = j
                time_diff = timedelta()
                end_time = list[i].start_time
            else:
                time_diff_bigger_than_min_time = True
                while j < len(list) and time_diff < min_time_required:
                    # check if the time is continuous
                    if end_time != list[j].start_time:
                        time_diff_bigger_than_min_time = False
                        break
                    else:
                        time_diff += list[j].end - list[j].start
                        end_time = list[j].end
                        j += 1

                # time_diff > min_time_required
                # move i and calculate the weight of node. weight = sum(time_count * minutes)
                # list[j].end_time - list[i].start_time >= min_time_required
                # list[j - 1].end_time - list[i].start_time min_time_required
                if time_diff_bigger_than_min_time:
                    next_i = i - 1
                    max_weight = 0

                    #increment i
                    while next_i <= j:
                        # fixed i
                        # new_end cannot be bigger than j by assumption (always exists new_end)
                        new_end = next_i
                        while list[new_end].end_time - list[i].start_time < min_time_required:
                            new_end += 1
                        # ensures that list[i...new_end] is the minimum node that satisfies
                        # list[new_end].end_time - list[i].start_time >= min_time_required
                        weight1 = 0
                        min_time1 = min_time_required
                        for curr in range (i, new_end + 1):
                            if curr == new_end:
                                weight1 += min_time1.total_seconds() / 60
                            else:
                                duration = list[curr].end - list[curr].start
                                weight1 += duration.total_seconds() / 60
                                min_time1 -= duration

                        weight2 = 0
                        min_time2 = min_time_required
                        for curr in range(new_end, i - 1, -1):
                            if curr == i:
                                weight2 += min_time2.total_seconds() / 60
                            else:
                                duration = list[curr].end - list[curr].start
                                weight2 += duration.total_seconds() / 60
                                min_time2 -= duration

                        new_max_weight = 0
                        if weight1 > weight2:
                            new_max_weight = weight1
                        else:
                            new_max_weight = weight2

                        TimeCountTree.k_max_pq_add(top_k_list, new_max_weight, list[i: j + 1])
        return top_k_list












