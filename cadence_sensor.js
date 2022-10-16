import { Gpio } from 'onoff';
import { DIRECTION, EDGE } from './constants.js';

// const sensorPower = 38;
// const sensorSignal = 40;

const sensorPower = 7;
const sensorSignal = 8;

// const cadencePower = new Gpio(sensorPower, DIRECTION.high);
// cadencePower.writeSync(Gpio.HIGH );
const cadenceSignal = new Gpio(sensorSignal, DIRECTION.in, EDGE.both); // EDGE.rising);

// console.log('cadencePower', cadencePower.readSync());
console.log('cadenceSignal', cadenceSignal.readSync());

console.log('-------------------');

setInterval(() => {
  // console.log('cadencePower', cadencePower.readSync());
  console.log('cadenceSignal', cadenceSignal.readSync());
}, 2000);

cadenceSignal.watch((error, value) => {
  if (error) {
    throw error;
  }

  console.log('value', value);
});
