import dateutil.parser
from datetime import datetime

print(dateutil.parser.parse('Sat, 11 Nov 2017 00:50:00 GMT'))

date = dateutil.parser.parse('2017-11-11T00:20:00.000Z', ignoretz=True)
print(type(date), date)
