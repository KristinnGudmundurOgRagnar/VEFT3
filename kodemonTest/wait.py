from kodemon import kodemon
import time
from random import randint

@kodemon
def calculate():
	bla = randint(2,9)
	print bla
	time.sleep(bla)

calculate()