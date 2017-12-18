class BestTimeHeap:
    def __init__(self):
        self.items = []
        self.size = 0

    def __str__(self):
        msg = '[ '
        for item in self.items:
            msg += str(item)
            msg += ', '
        msg += ']'
        return msg

    def insert(self, besttime):
        self.items.append(besttime)
        self.sift_up(self.size)
        self.size += 1

    def extract_max(self):
        if self.size == 0:
            return None
        max_item = self.items[0]
        self.size -= 1
        self.items[0] = self.items[self.size]
        self.sift_down(0)

        return max_item

    def print_heap(self):
        for item in self.items:
            print(str(item.weight) + ', ', end='')

    def sift_up(self, k):
        while k > 0:
            parent = int((k - 1) / 2)
            if self.is_parent_high_priority(parent, k):
                return
            self.items[parent], self.items[k] = self.items[k], self.items[parent]

            k = parent

    def sift_down(self, k):
        while k <= int(self.size / 2) - 1:
            if 2 * k + 2 == self.size:
                child = 2 * k + 1
            else:
                if self.items[2 * k + 2].weight >= self.items[2 * k + 1].weight:
                    child = 2 * k + 2
                else:
                    child = 2 * k + 1

            if self.is_parent_high_priority(k, child):
                return
            self.items[child], self.items[k] = self.items[k], self.items[child]

            k = child

    def is_parent_high_priority(self, parent_i, child_i):
        parent = self.items[parent_i]
        child = self.items[child_i]

        if len(parent.full_attend) == len(child.full_attend):
            # compare weight
            if len(parent.partial_attend.keys()) == len(child.partial_attend.keys()):
                # compare weight
                if parent.weight == child.weight:
                    # compare start time
                    return parent.start <= child.start

                return parent.weight >= child.weight

            return len(parent.partial_attend.keys()) >= len(child.partial_attend.keys())

        return len(parent.full_attend) >= len(child.full_attend)
