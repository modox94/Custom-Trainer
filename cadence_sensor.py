import RPi.GPIO as GPIO
import time

__author__ = 'Gus (Adapted from Adafruit)'
__license__ = "GPL"
__maintainer__ = "pimylifeup.com"

count_of_magnets = 2
pin_to_circuit = 7
times_array = []
counter = 0

GPIO.setmode(GPIO.BOARD)
GPIO.setup(pin_to_circuit, GPIO.IN)


def my_callback(channel):
    print(GPIO.input(channel))


GPIO.add_event_detect(pin_to_circuit, GPIO.BOTH, pull_up_down=GPIO.PUD_UP,
                      callback=my_callback, bouncetime=100)


def check_sensor(pin_to_circuit):
    global counter
    GPIO.setup(pin_to_circuit, GPIO.OUT)
    GPIO.output(pin_to_circuit, GPIO.LOW)
    time.sleep(0.1)

    GPIO.setup(pin_to_circuit, GPIO.IN)

    while (GPIO.input(pin_to_circuit) == GPIO.LOW):
        pass

    counter += 1
    return print('magnit!', counter)


# Catch when script is interupted, cleanup correctly
try:
    # Main loop
    while True:
        # check_sensor(pin_to_circuit)
        pass
except KeyboardInterrupt:
    pass
finally:
    GPIO.cleanup()
