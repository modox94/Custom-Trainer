import RPi.GPIO as GPIO
import time

__author__ = 'Gus (Adapted from Adafruit)'
__license__ = "GPL"
__maintainer__ = "pimylifeup.com"

count_of_magnets = 2
pin_to_circuit = 7
times_array = []

GPIO.setmode(GPIO.BOARD)
GPIO.setup(pin_to_circuit, GPIO.IN)

# define the pin that goes to the circuit


def check_sensor():
    print(GPIO.input(pin_to_circuit))
    time.sleep(0.1)
    return


# Catch when script is interupted, cleanup correctly
try:
    # Main loop
    while True:
        check_sensor()
except KeyboardInterrupt:
    pass
finally:
    GPIO.cleanup()
