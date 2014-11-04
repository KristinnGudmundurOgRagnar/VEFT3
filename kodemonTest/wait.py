from kodemon import kodemon
import time
import sys
from random import randint

@kodemon
def calculate():
	bla = randint(2,9)
	print bla
	time.sleep(bla)

if (len(sys.argv) > 1):
	iterations = int(sys.argv[1])
else:
	iterations = 1

for i in range(0,iterations):
	calculate()