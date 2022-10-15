import RPi.GPIO as GPIO
import time

GPIO.cleanup()

sensor_plus = 38
sensor_ground = 40

GPIO.setmode(GPIO.BOARD)
GPIO.setup(sensor_plus, GPIO.OUT)
GPIO.setup(sensor_ground, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

GPIO.output(sensor_plus, GPIO.HIGH)


def my_callback(channel):
    print('40', GPIO.input(channel))


# GPIO.add_event_detect(sensor_ground, GPIO.RISING, callback=my_callback)


while True:
    GPIO.wait_for_edge(sensor_ground, GPIO.RISING)
    print(sensor_ground, 'RISING')
    # time.sleep(0.1)
    # print(sensor_plus, GPIO.input(sensor_plus))
    # print(sensor_ground, GPIO.input(sensor_ground))
