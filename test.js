const { getTimecodes, Frequency } = require("./utils.js");
const { cadenceSignal, counter } = require("./cadence_sensor.js");
const { isReady, potentiometerSensor } = require("./potentiometer_sensor");

const { frq, pl, sensorSignals } = getTimecodes();

// const testAr = sensorSignals.slice(4, 11);

// const coef = 60000 / (testAr[testAr.length - 1] - testAr[0]);
// const rpm = (testAr.length * coef) / 2;

// console.log('rpm', rpm);

// const frqEl = new Frequency({ magnetsCount: 2 });

// sensorSignals.forEach(el => {
//   console.log(frqEl.inc(el.getMilliseconds()));
// });

// for (let idx = 1; idx < sensorSignals.length; idx++) {
//   const prevDate = sensorSignals[idx - 1];
//   const currDate = sensorSignals[idx];

//   const duration = (currDate - prevDate) / 60000;
//   const distance = 0.5;
//   const result = distance / duration;

//   console.log(result);
// }

// cadenceSignal.watch(() => console.log("MAGNET"));

console.log("isReady", isReady);

setInterval(() => {
  console.log("isReady", isReady);
  //   potentiometerSensor.read(value => console.log("ptnS", value));
}, 1000);
