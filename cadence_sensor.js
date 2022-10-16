import { Gpio } from 'onoff';
import { DIRECTION, EDGE } from './constants.js';

const sensorPower = 38;
const sensorSignal = 40;

new Gpio(sensorPower, DIRECTION.high);
const cadenceSignal = new Gpio(sensorSignal, DIRECTION.in, EDGE.rising);

cadenceSignal.watch((error, value) => {
  if (error) {
    throw error;
  }

  console.log('value', value);
});
