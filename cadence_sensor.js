const { Gpio } = require("onoff");
const {
  DIRECTION,
  EDGE,
  PHYSICAL_TO_GPIO,
  PAUSE_DELAY,
} = require("./constants.js");
const { Frequency } = require("./utils.js");
const { random } = require("lodash");

const cadenceSignalPin = PHYSICAL_TO_GPIO[11];

let cadenceSignal;
try {
  cadenceSignal = new Gpio(cadenceSignalPin, DIRECTION.in, EDGE.rising);
} catch (error) {
  const watch = fn => {
    const timeout = random(500, PAUSE_DELAY / 2);
    const isLongTimeout = false; // random(0, 100) > 90;
    fn();
    setTimeout(watch.bind(this, fn), isLongTimeout ? 10000 : timeout);
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
