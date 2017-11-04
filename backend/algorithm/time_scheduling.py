from datetime import datetime, timedelta

'''

Assumes that start and end is integer multiplcation of 30 minutes




1. input: 
    1) dictionary of pairs ('user_id': list)
        list = is a list of tuple consisting of of start and end
        
        format: { 'user_id': [ (start, end) ] }
        
    2) min_time_required

output: top k best_time


'''

MIN_INTERVAL = 30   #minute
MAX_PLAN_DAYS = 365

TABLE_SIZE = (60 / MIN_INTERVAL) * 24 * MAX_PLAN_DAYS


class TimeConstraintException(Exception):
    def __init__(self, msg):
        self.msg = "start should be earlier than end"

    def __str__(self):
        return self.msg

'''
#assumes that createTime minute is n * MINTERVAL
def hash_dateTime(time, createTime):

    if time < createTime:
        raise TimeConstraintException()

    #render time in to n * MININTERVAL minute
    time_split = 60 / MIN_INTERVAL
    for i in range (time_split):
        if time.minute < (i + 1) * MIN_INTERVAL:
            time.minute = i * MIN_INTERVAL
            break

    timediff = time - createTime
    timediff.minutes


class FreeTimeList:
    def __init__(self, user_id, start, end):
        if start >= end:
            raise TimeConstraintException()
        self.time_list.append((start, end))
        self.user_id = user_id

    def append(self, start, end):
        if start >= end
            raise TimeConstraintException()
        self.time_list.append((start, end))
'''



def top_k_best_time(data):
    pass






