import { Gpio } from 'onoff';
import { DIRECTION, EDGE } from './constants.js';
import rpio from 'rpio';

/*
const sensorPower = 38;
const sensorSignal = 40;

rpio.init({ mapping: 'physical' });
rpio.open(sensorPower, rpio.OUTPUT, rpio.LOW);
// rpio.open(sensorSignal, rpio.INPUT, rpio.PULL_DOWN);
rpio.open(sensorSignal, rpio.INPUT);

rpio.write(sensorPower, rpio.HIGH);

setInterval(() => {
  console.log('sensorSignal', rpio.read(sensorSignal));
}, 2000);
*/

// const sensorPower = 38;
// const sensorSignal = 40;

const sensorPower = 20;
const sensorSignal = 21;

const cadencePower = new Gpio(sensorPower, DIRECTION.high);
// cadencePower.writeSync(Gpio.HIGH);
const cadenceSignal = new Gpio(sensorSignal, DIRECTION.in, EDGE.rising);

console.log('cadencePower', cadencePower.readSync());
console.log('cadenceSignal', cadenceSignal.readSync());

console.log('-------------------');

setInterval(() => {
  console.log('cadencePower', cadencePower.readSync());
  console.log('cadenceSignal', cadenceSignal.readSync());
}, 2000);

cadenceSignal.watch((error, value) => {
  if (error) {
    throw error;
  }

  console.log('value', value);
});
