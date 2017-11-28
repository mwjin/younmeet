from .best_time_heap import BestTimeHeap

import unittest
import sys
import io


class BestTimeMock:
    def __init__(self, weight):
        self.weight = weight

    def __str__(self):
        return str(self.weight)


class BestTimeHeapTester(unittest.TestCase):
    def setUp(self):
        self.heap = BestTimeHeap()

    def test_best_time_mock_str(self):
        self.assertEqual(str(BestTimeMock(1)), '1')

    def test_insert_case(self):
        self.heap.insert(BestTimeMock(10))
        self.assertEqual(self.heap.size, 1)

    def test_empty_heap_return_None(self):
        self.assertEqual(self.heap.extract_max(), None)

    def test_extract_min(self):
        self.heap.insert(BestTimeMock(10))
        self.heap.insert(BestTimeMock(20))
        self.heap.insert(BestTimeMock(50))
        self.heap.insert(BestTimeMock(30))
        self.heap.insert(BestTimeMock(15))

        before_size = self.heap.size
        self.assertEqual(self.heap.extract_max().weight, 50)
        self.assertEqual(self.heap.size, before_size - 1)

    def test_heap_str(self):
        self.heap.insert(BestTimeMock(10))
        self.heap.insert(BestTimeMock(50))
        msg = str(self.heap)
        self.assertEqual(msg, '[ 50, 10, ]')

    def test_print_heap(self):
        self.heap.insert(BestTimeMock(10))
        capture_string = io.StringIO()
        sys.stdout = capture_string
        self.heap.print_heap()
        sys.stdout = sys.__stdout__

        self.assertEqual(capture_string.getvalue(), '10, ')
