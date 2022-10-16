import { Gpio } from 'onoff';
import Freq from 'frequency-counter';
import { DIRECTION, EDGE, PHYSICAL_TO_GPIO } from './constants.js';

const sensorPower = PHYSICAL_TO_GPIO[38];
const sensorSignal = PHYSICAL_TO_GPIO[40];

new Gpio(sensorPower, DIRECTION.high);
const cadenceSignal = new Gpio(sensorSignal, DIRECTION.in, EDGE.rising);

const timesArray = [];
const maxTimeout = 5000;

const counter = new Freq();

const recordingSignals = (error, value) => {
  if (error) {
    throw error;
  }

  // splice;
  counter.inc();
  console.log('value', value);
};

const calculateCadence = () => {
  const res = counter.freq();
  console.log('res', res);
};

cadenceSignal.watch(recordingSignals);

setInterval(calculateCadence, 1000);
