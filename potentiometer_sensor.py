import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BOARD)

pin_a = 38
pin_b = 40

def discharge():
    GPIO.setup(pin_a, GPIO.IN)
    GPIO.setup(pin_b, GPIO.OUT)
    GPIO.output(pin_b, False)
    time.sleep(0.004)

def charge_time():
    GPIO.setup(pin_b, GPIO.IN)
    GPIO.setup(pin_a, GPIO.OUT)
    count = 0
    GPIO.output(pin_a, True)
    while not GPIO.input(pin_b):
        count = count + 1
    return count

def analog_read():
    discharge()
    return charge_time()

while True:
    print(analog_read())
    time.sleep(1)
