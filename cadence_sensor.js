const { Gpio } = require('onoff');
const { DIRECTION, EDGE, PHYSICAL_TO_GPIO } = require('./constants.js');
const { Frequency } = require('./utils.js');

const sensorSignal = PHYSICAL_TO_GPIO[11];

const cadenceSignal = new Gpio(sensorSignal, DIRECTION.in, EDGE.rising);

const counter = new Frequency({ magnetsCount: 2 });

const recordingSignals = (error, value) => {
  if (error) {
    console.error(error);
    return;
  }

  counter.inc();
};

cadenceSignal.watch(recordingSignals);

setInterval(counter.rpm, 1000);
