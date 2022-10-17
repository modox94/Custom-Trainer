import Encoder
from time import sleep
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)

Tuner = Encoder.Encoder(20, 21)

while True:
    print(Tuner.read())
    sleep(.25)
