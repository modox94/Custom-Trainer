import { Gpio } from 'onoff';
import { DIRECTION, EDGE } from './constants.js';

const sensorPower = 38;
const sensorSignal = 40;

const cadencePower = new Gpio(sensorPower, DIRECTION.high);
const cadenceSignal = new Gpio(sensorSignal, DIRECTION.in, EDGE.rising);

console.log('cadencePower', cadencePower);
console.log('cadenceSignal', cadenceSignal);

cadenceSignal.watch((error, value) => {
  if (error) {
    throw error;
  }

  console.log('value', value);
});
