import Freq from 'frequency-counter';
import fs from 'fs';
import { Gpio } from 'onoff';
import { DEV_CONSTS, DIRECTION, EDGE, PHYSICAL_TO_GPIO } from './constants.js';

const { LF, PL, FRQ_R, FRQ, dataFile } = DEV_CONSTS;

const noop = () => {};

// const sensorPower = PHYSICAL_TO_GPIO[38];
const sensorSignal = PHYSICAL_TO_GPIO[11];

// new Gpio(sensorPower, DIRECTION.high);
const cadenceSignal = new Gpio(sensorSignal, DIRECTION.in, EDGE.rising);

try {
  fs.unlinkSync(dataFile);
} catch (error) {
  console.log('unlink error', error);
}

fs.writeFileSync(dataFile, `${PL}${Date.now()}`, 'utf8');

const window = 1;
const resultWindow = 60;
const countMagnets = 2;

const counter = new Freq(window);

const recordingSignals = (error, value) => {
  if (error) {
    console.error(error);
    return;
  }

  fs.appendFile(dataFile, LF + String(Date.now()), noop);
  counter.inc(1);
};

const calculateCadence = () => {
  const frequencyRaw = counter.freq();
  const frequency = frequencyRaw * (resultWindow / window / countMagnets);

  const freqString = `${FRQ_R}${frequencyRaw}` + LF + `${FRQ}${frequency}`;

  fs.appendFile(dataFile, LF + freqString, noop);

  console.log(freqString);
};

cadenceSignal.watch(recordingSignals);

setInterval(calculateCadence, 1000);
