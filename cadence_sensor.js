import fs from 'fs';
import { Gpio } from 'onoff';
import Freq from 'frequency-counter';
import { DIRECTION, EDGE, PHYSICAL_TO_GPIO } from './constants.js';

const sensorPower = PHYSICAL_TO_GPIO[38];
const sensorSignal = PHYSICAL_TO_GPIO[40];

new Gpio(sensorPower, DIRECTION.high);
const cadenceSignal = new Gpio(sensorSignal, DIRECTION.in, EDGE.rising);

const dataFile = 'data.txt';

try {
  fs.unlinkSync(dataFile);
} catch (error) {
  console.log('unlink error', error);
}

fs.writeFileSync(dataFile, `Program launched: ${Date.now()}`, 'utf8');

const window = 1;
const resultWindow = 60;
const countMagnets = 2;

const counter = new Freq(window);

const recordingSignals = (error, value) => {
  if (error) {
    console.error(error);
    return;
  }

  fs.appendFile(dataFile, '\n' + String(Date.now()), () => {});
  counter.inc(1);
};

const calculateCadence = () => {
  const frequencyRaw = counter.freq();
  const frequency = frequencyRaw * (resultWindow / window / countMagnets);

  const freqString = `frequencyRaw: ${frequencyRaw}
  frequency: ${frequency}`;

  fs.appendFile(dataFile, '\n' + freqString);

  console.log(freqString);
};

cadenceSignal.watch(recordingSignals);

setInterval(calculateCadence, 1000);
