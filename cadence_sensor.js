import { Gpio } from 'onoff';
import Freq from 'frequency-counter';
import { DIRECTION, EDGE, PHYSICAL_TO_GPIO } from './constants.js';

const sensorPower = PHYSICAL_TO_GPIO[38];
const sensorSignal = PHYSICAL_TO_GPIO[40];

new Gpio(sensorPower, DIRECTION.high);
const cadenceSignal = new Gpio(sensorSignal, DIRECTION.in, EDGE.rising);

const window = 1;
const resultWindow = 60;
const countMagnets = 2;

const counter = new Freq(window);

const recordingSignals = (error, value) => {
  if (error) {
    console.error(error);
    return;
  }

  counter.inc(1);
};

const calculateCadence = () => {
  const frequencyRaw = counter.freq();
  const frequency = frequencyRaw * (resultWindow / window / countMagnets);

  console.log('frequencyRaw', frequencyRaw);
  console.log('frequency', frequency);
};

cadenceSignal.watch(recordingSignals);

setInterval(calculateCadence, 1000);
