import RPi.GPIO as GPIO
import time
import utils
from utils import array_filter

count_of_magnets = 2
sensor_power = 38
sensor_signal = 40
times_array = []
max_timeout = 5000

GPIO.setmode(GPIO.BOARD)
GPIO.setup(sensor_power, GPIO.OUT)
GPIO.setup(sensor_signal, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

GPIO.output(sensor_power, GPIO.HIGH)


def my_callback(channel):
    print('40', GPIO.input(channel))


def recording_signals():
    global sensor_signal
    global times_array
    global max_timeout
    new_array = []
    GPIO.wait_for_edge(sensor_signal, GPIO.RISING)
    now = time.gmtime()
    edge_timeout = now - max_timeout
    for time in times_array:
        is_valid = time > edge_timeout
        if is_valid:
            new_array.append(time)
    times_array = new_array


def calculate_cadence():
    global times_array
    print('times_array', times_array)
    time.sleep(1)


try:
    # Main loop
    while True:
        recording_signals()
        calculate_cadence()
except KeyboardInterrupt:
    pass
finally:
    GPIO.cleanup()
