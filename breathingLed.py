#              .';:cc;.
#            .,',;lol::c.
#            ;';lddddlclo
#            lcloxxoddodxdool:,.
#            cxdddxdodxdkOkkkkkkkd:.
#          .ldxkkOOOOkkOO000Okkxkkkkx:.
#        .lddxkkOkOOO0OOO0000Okxxxxkkkk:
#       'ooddkkkxxkO0000KK00Okxdoodxkkkko
#      .ooodxkkxxxOO000kkkO0KOxolooxkkxxkl
#      lolodxkkxxkOx,.      .lkdolodkkxxxO.
#      doloodxkkkOk           ....   .,cxO;
#      ddoodddxkkkk:         ,oxxxkOdc'..o'
#      :kdddxxxxd,  ,lolccldxxxkkOOOkkkko,
#       lOkxkkk;  :xkkkkkkkkOOO000OOkkOOk.
#        ;00Ok' 'O000OO0000000000OOOO0Od.
#         .l0l.;OOO000000OOOOOO000000x,
#            .'OKKKK00000000000000kc.
#               .:ox0KKKKKKK0kdc,.
#                      ...
#
# Author: peppe8o
# Blog: https://peppe8o.com
# Date: May 18th, 2021
# Version: 1.0

import RPi.GPIO as GPIO
import sys
import time

# define PINs according to cabling
PWMLed = 18

# set pins to PWM output
GPIO.setmode(GPIO.BCM)
GPIO.setup(PWMLed,GPIO.OUT)

breath = GPIO.PWM(PWMLed, 1000) # Set Frequency to 1KHz
breath.start(0)

def pwm():
 while True:
  for dc in range(1, 101, 1): # Increase duty cycle: 0~100
   breath.ChangeDutyCycle(dc) # Change duty cycle
   time.sleep(0.02)
  for dc in range(100, 0, -1): # Decrease duty cycle: 100~0
   breath.ChangeDutyCycle(dc)
   time.sleep(0.02)

# main program
while True:
 try:
  pwm()
 except KeyboardInterrupt:
  breath.stop()
  GPIO.cleanup()
  sys.exit()
