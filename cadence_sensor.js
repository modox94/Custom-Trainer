const { Gpio } = require("onoff");
const { DIRECTION, EDGE, PHYSICAL_TO_GPIO } = require("./constants.js");
const { Frequency } = require("./utils.js");
const { random } = require("lodash");

const sensorSignal = PHYSICAL_TO_GPIO[11];

let cadenceSignal;
try {
  cadenceSignal = new Gpio(sensorSignal, DIRECTION.in, EDGE.rising);
} catch (error) {
  const watch = fn => {
    const timeout = random(100, 1000);
    fn();
    setTimeout(watch.bind(this, fn), timeout);
  };
  cadenceSignal = { watch };
  console.log("Gpio error", error);
}

const counter = new Frequency({ magnetsCount: 2 });

const recordingSignals = (error, value) => {
  if (error) {
    console.error(error);
    return;
  }

  counter.inc();
};

cadenceSignal.watch(recordingSignals);

// setInterval(() => console.log(counter.rpm), 1000);

exports.cadenceSignal = cadenceSignal;
exports.counter = counter;
