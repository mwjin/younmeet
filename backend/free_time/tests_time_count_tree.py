from .time_count_tree import TimeCountTree

import unittest
import sys
import io
import random


class TimeCountTreeTest(unittest.TestCase):
    def setUp(self):
        self.tree = TimeCountTree()

    def test_time_constraint_exception(self):
        with self.assertRaises(TimeCountTree.TimeConstraintException):
            TimeCountTree.TimeCountNode(2, 1)

    def test_time_constraint_str(self):
        self.assertEqual(str(TimeCountTree.TimeConstraintException()), "start should be earlier than end")

    def test_time_count_node_str(self):
        members = ['user']
        result = "Start: "
        result += str(1) + ", "
        result += "End: "
        result += str(2) + ", "
        result += "Time count: " + str(1) + ", "
        result += "Members: "
        result += "["
        for member in members:
            result += str(member) + ", "
        result += "]"

        self.assertEqual(str(TimeCountTree.TimeCountNode(1, 2, members=['user'])), result)

    def test_time_count_tree_print_tree(self):
        node = TimeCountTree.TimeCountNode(1, 2, members=['user'])
        self.tree.insert(1, 2, 'user')
        capture_string = io.StringIO()
        sys.stdout = capture_string
        self.tree.print_tree()
        sys.stdout = sys.__stdout__

        self.assertEqual(capture_string.getvalue(), str(node) + '\n')

    def test_tree_is_avl(self):
        # check is avl with inserting random 1000 nodes
        insert = 0
        while insert < 1000:
            start = random.randint(0, 500)
            end = random.randint(0, 1000)
            while end <= start:
                end = random.randint(0, 1000)

            self.tree.insert(start, end, 'user')
            insert += 1

        self.assertEqual(self.tree.check_balanced(), True)

    def test_append_in_order_guarantee_increasing_order(self):
        # check increasing order with inserting random 500 nodes
        insert = 0
        while insert < 500:
            start = random.randint(0, 500)
            end = random.randint(0, 1000)
            while end <= start:
                end = random.randint(0, 1000)

            self.tree.insert(start, end, 'user')
            insert += 1

        tree_list = self.tree.append_inorder()
        prev = tree_list[0]
        i = 1
        while i < len(tree_list):
            cur = tree_list[i]
            self.assertGreaterEqual(cur.start, prev.end)
            prev = cur
            i += 1
