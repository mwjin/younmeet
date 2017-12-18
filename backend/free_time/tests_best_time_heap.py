from .best_time_heap import BestTimeHeap

import unittest
import sys
import io


class BestTimeMock:
    def __init__(self, weight, start=1, full_attend=list(), partial_attend=dict()):
        self.weight = weight
        self.start = start
        self.full_attend = full_attend
        self.partial_attend = partial_attend

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

    def test_sift_up_when_same_weight(self):
        self.heap.insert(BestTimeMock(10, 5))
        self.heap.insert(BestTimeMock(10, 1))

        self.assertEqual(self.heap.extract_max().start, 1)

    def test_sift_down_when_same_weight(self):
        self.heap.insert(BestTimeMock(100, 5))
        self.heap.insert(BestTimeMock(10, 1))
        self.heap.insert(BestTimeMock(10, 5))

        self.heap.extract_max()
        self.assertEqual(self.heap.extract_max().start, 1)

    def test_heap_priority_diff_full_attend(self):
        self.heap.insert(BestTimeMock(weight=10,
                                      start=10,
                                      full_attend=[1, 2, 3]))

        self.heap.insert(BestTimeMock(weight=10,
                                      start=10,
                                      full_attend=[1, 2]))

        best_time = self.heap.extract_max()
        self.assertEqual(len(best_time.full_attend), 3)

    def test_heap_priority_diff_partial_attend(self):
        self.heap.insert(BestTimeMock(weight=10,
                                      start=10,
                                      full_attend=[1, 2],
                                      partial_attend={4: 'a', 5: 'a'}))

        self.heap.insert(BestTimeMock(weight=10,
                                      start=10,
                                      full_attend=[1, 2],
                                      partial_attend={4: 'a'}))

        best_time = self.heap.extract_max()
        self.assertEqual(len(best_time.partial_attend.keys()), 2)

    def test_heap_priority_diff_weight(self):
        self.heap.insert(BestTimeMock(weight=10))

        self.heap.insert(BestTimeMock(weight=5))

        best_time = self.heap.extract_max()
        self.assertEqual(best_time.weight, 10)

    def test_heap_priority_diff_start(self):
        self.heap.insert(BestTimeMock(weight=1, start=10))

        self.heap.insert(BestTimeMock(weight=1, start=5))
        best_time = self.heap.extract_max()
        self.assertEqual(best_time.start, 5)
