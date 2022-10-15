import RPi.GPIO as GPIO
import time

sensor_plus = 38
sensor_ground = 40

GPIO.setmode(GPIO.BOARD)
GPIO.setup(sensor_plus, GPIO.OUT)
GPIO.setup(sensor_ground, GPIO.IN)

GPIO.output(sensor_plus, GPIO.HIGH)


def my_callback(channel):
    print('40', GPIO.input(channel))


GPIO.add_event_detect(sensor_ground, GPIO.FALLING, callback=my_callback)


while True:
    pass
