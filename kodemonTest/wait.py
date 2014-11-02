from kodemon import kodemon
import time
from random import randint

@kodemon
def calculate():
    time.sleep(randint(2,9))

calculate()