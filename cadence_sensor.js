import { Gpio } from 'onoff';
import { DIRECTION, EDGE, PHYSICAL_TO_GPIO } from './constants.js';

const sensorPower = PHYSICAL_TO_GPIO[38];
const sensorSignal = PHYSICAL_TO_GPIO[40];

new Gpio(sensorPower, DIRECTION.high);
const cadenceSignal = new Gpio(sensorSignal, DIRECTION.in, EDGE.rising);

cadenceSignal.watch((error, value) => {
  if (error) {
    throw error;
  }

  console.log('value', value);
});
