const { getTimecodes, Frequency, consoleCheck } = require("./utils.js");
// const { cadenceSignal, counter } = require("./cadence_sensor.js");
// const { condition, potentiometerSensor } = require("./potentiometer_sensor");
const fs = require("fs");

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

// setInterval(() => {
//   console.log("isReady", condition.isReady);
//   if (condition.isReady) {
//     potentiometerSensor.read((err, reading) =>
//       console.log("ptnS", reading?.value),
//     );
//   } else {
//     console.log("not ready");
//   }
// }, 1000);

const temp = [];
const consoleCb = path => input => {
  if (input === "stop") {
    return fs.writeFileSync(path, JSON.stringify(temp));
  }

  const value = Number(String(input).trim());
  if (Number.isNaN(value) || value <= 0) {
    return console.log("invalid value");
  }

  const length = temp.length;
  let lastIdx = length - 1;
  if (
    length === 0 ||
    (temp[lastIdx].resistanceLevel && temp[lastIdx].targetRpm)
  ) {
    temp.push({ resistanceLevel: undefined, targetRpm: undefined });
    lastIdx = temp.length - 1;
  }

  if (!temp[lastIdx].resistanceLevel) {
    temp[lastIdx].resistanceLevel = Number(input);
  } else {
    temp[lastIdx].targetRpm = Number(input);
  }
};

// consoleCheck(consoleCb());
