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

import math


class TimeCountTree:
    def __init__(self, node=None):
        self.root = node

    def print_tree(self):
        self._print_tree(self.root, '')

    def _print_tree(self, node, indent):
        if node is None:
            return

        self._print_tree(node.left, indent + '     ')
        print(indent + str(node))
        self._print_tree(node.right, indent + '     ')

    def insert(self, start, end, member):
        insert_node = self.TimeCountNode(start, end, 1, [member])
        self.root = self._insert(insert_node, self.root)

    def _insert(self, insert_node, root):
        if root is None:
            root = insert_node
            return root
        split_left, split_root, split_right = TimeCountTree.split_node(insert_node, root)

        root.start = split_root.start
        root.end = split_root.end
        root.time_count = split_root.time_count
        root.members = split_root.members

        if split_left is not None:
            root.left = self._insert(split_left, root.left)
            if TimeCountTree.get_height(root.left) - TimeCountTree.get_height(root.right) == 2:
                if TimeCountTree.get_height(root.left.left) > TimeCountTree.get_height(root.left.right):
                    root = TimeCountTree.right_rotate(root)
                else:
                    root = TimeCountTree.double_right_rotate(root)

        if split_right is not None:
            root.right = self._insert(split_right, root.right)
            if TimeCountTree.get_height(root.left) - TimeCountTree.get_height(root.right) == -2:
                if TimeCountTree.get_height(root.right.right) > TimeCountTree.get_height(root.right.left):
                    root = TimeCountTree.left_rotate(root)
                else:
                    root = TimeCountTree.double_left_rotate(root)

        root.height = 1 + max(TimeCountTree.get_height(root.left), TimeCountTree.get_height(root.right))

        return root

    def append_inorder(self, min_people=0):
        time_node_list = []
        self._append_inorder(self.root, time_node_list, min_people)
        return time_node_list

    def _append_inorder(self, node, tree_list, min_people):
        if node is None:
            return
        if node.left is not None:
            self._append_inorder(node.left, tree_list, min_people)
        if node.time_count >= min_people:
            tree_list.append(node)
        if node.right is not None:
            self._append_inorder(node.right, tree_list, min_people)

    def check_balanced(self):
        return self._check_balanced(self.root)

    def _check_balanced(self, root):
        if root is None:
            return True
        return self._check_balanced(root.left) \
               and math.fabs(TimeCountTree.get_height(root.left) - TimeCountTree.get_height(root.right)) < 2 \
               and self._check_balanced(root.right)

    @staticmethod
    def split_node(inserted_node, root):
        # new left is not None
        if inserted_node.start < root.start:
            if inserted_node.end > root.end:
                new_left = TimeCountTree.TimeCountNode(inserted_node.start, root.start, inserted_node.time_count,
                                                       inserted_node.members)
                new_self = TimeCountTree.TimeCountNode(root.start, root.end,
                                                       root.time_count + inserted_node.time_count,
                                                       root.members + inserted_node.members)
                new_right = TimeCountTree.TimeCountNode(root.end, inserted_node.end, inserted_node.time_count,
                                                        inserted_node.members)
            elif inserted_node.end == root.end:
                new_left = TimeCountTree.TimeCountNode(inserted_node.start, root.start, inserted_node.time_count,
                                                       inserted_node.members)
                new_self = TimeCountTree.TimeCountNode(root.start, root.end,
                                                       root.time_count + inserted_node.time_count,
                                                       root.members + inserted_node.members)
                new_right = None
            else:
                # inserted_node.end < root.end
                if inserted_node.end > root.start:
                    new_left = TimeCountTree.TimeCountNode(inserted_node.start, root.start,
                                                           inserted_node.time_count,
                                                           inserted_node.members)
                    new_self = TimeCountTree.TimeCountNode(root.start, inserted_node.end,
                                                           root.time_count + inserted_node.time_count,
                                                           root.members + inserted_node.members)
                    new_right = TimeCountTree.TimeCountNode(inserted_node.end, root.end, root.time_count,
                                                            root.members)
                else:
                    new_left = TimeCountTree.TimeCountNode(inserted_node.start, inserted_node.end,
                                                           inserted_node.time_count,
                                                           inserted_node.members)
                    new_self = TimeCountTree.TimeCountNode(root.start, root.end, root.time_count, root.members)
                    new_right = None

        elif inserted_node.start == root.start:
            if inserted_node.end > root.end:
                new_left = None
                new_self = TimeCountTree.TimeCountNode(root.start, root.end,
                                                       root.time_count + inserted_node.time_count,
                                                       root.members + inserted_node.members)
                new_right = TimeCountTree.TimeCountNode(root.end, inserted_node.end, inserted_node.time_count,
                                                        inserted_node.members)
            elif inserted_node.end == root.end:
                new_left = None
                new_self = TimeCountTree.TimeCountNode(root.start, root.end,
                                                       root.time_count + inserted_node.time_count,
                                                       root.members + inserted_node.members)
                new_right = None
            else:
                new_left = None
                new_self = TimeCountTree.TimeCountNode(inserted_node.start, inserted_node.end,
                                                       root.time_count + inserted_node.time_count,
                                                       root.members + inserted_node.members)
                new_right = TimeCountTree.TimeCountNode(inserted_node.end, root.end, root.time_count,
                                                        root.members)
        else:
            # inserted_node.start > root.start
            if inserted_node.end > root.end:
                if inserted_node.start < root.end:
                    new_left = TimeCountTree.TimeCountNode(root.start, inserted_node.start, root.time_count,
                                                           root.members)
                    new_self = TimeCountTree.TimeCountNode(inserted_node.start, root.end,
                                                           root.time_count + inserted_node.time_count,
                                                           root.members + inserted_node.members)
                    new_right = TimeCountTree.TimeCountNode(root.end, inserted_node.end, inserted_node.time_count,
                                                            inserted_node.members)
                else:
                    new_left = None
                    new_self = TimeCountTree.TimeCountNode(root.start, root.end, root.time_count, root.members)
                    new_right = TimeCountTree.TimeCountNode(inserted_node.start, inserted_node.end,
                                                            inserted_node.time_count,
                                                            inserted_node.members)
            elif inserted_node.end == root.end:
                new_left = None
                new_self = TimeCountTree.TimeCountNode(root.start, inserted_node.start, root.time_count,
                                                       root.members)
                new_right = TimeCountTree.TimeCountNode(inserted_node.start, inserted_node.end,
                                                        root.time_count + inserted_node.time_count,
                                                        root.members + inserted_node.members)

            else:
                new_left = TimeCountTree.TimeCountNode(root.start, inserted_node.start, root.time_count,
                                                       root.members)
                new_self = TimeCountTree.TimeCountNode(inserted_node.start, inserted_node.end,
                                                       inserted_node.time_count + root.time_count,
                                                       root.members + inserted_node.members)
                new_right = TimeCountTree.TimeCountNode(inserted_node.end, root.end, root.time_count,
                                                        root.members)
        return new_left, new_self, new_right

    @staticmethod
    def get_height(node):
        if node is None:
            return 0
        else:
            return node.height

    @staticmethod
    def left_rotate(target):
        left = TimeCountTree.TimeCountNode(target.start, target.end, time_count=target.time_count,
                                           members=target.members, left=target.left, right=target.right.left)
        target = TimeCountTree.TimeCountNode(target.right.start, target.right.end, time_count=target.right.time_count,
                                             members=target.right.members, left=left, right=target.right.right)
        return target

    @staticmethod
    def right_rotate(target):
        right = TimeCountTree.TimeCountNode(target.start, target.end, time_count=target.time_count,
                                            members=target.members, left=target.left.right, right=target.right)
        target = TimeCountTree.TimeCountNode(target.left.start, target.left.end, time_count=target.left.time_count,
                                             members=target.left.members, left=target.left.left, right=right)
        return target

    @staticmethod
    def double_left_rotate(target):
        target.right = TimeCountTree.right_rotate(target.right)
        target = TimeCountTree.left_rotate(target)
        return target

    @staticmethod
    def double_right_rotate(target):
        target.left = TimeCountTree.left_rotate(target.left)
        target = TimeCountTree.right_rotate(target)
        return target

    class TimeCountNode:
        def __init__(self, start, end, time_count=1, members=list(), left=None, right=None):
            if start >= end:
                raise TimeCountTree.TimeConstraintException()
            self.start = start
            self.end = end
            self.time_count = time_count
            self.left = left
            self.right = right
            self.members = members
            self.height = 1 + max(TimeCountTree.get_height(left), TimeCountTree.get_height(right))

        def __str__(self):
            result = "Start: "
            result += str(self.start) + ", "
            result += "End: "
            result += str(self.end) + ", "
            result += "Time count: " + str(self.time_count) + ", "
            result += "Members: "
            result += "["
            for i in self.members:
                result += str(i) + ", "
            result += "]"
            return result

    class TimeConstraintException(Exception):
        def __init__(self):
            self.msg = "start should be earlier than end"

        def __str__(self):
            return self.msg
