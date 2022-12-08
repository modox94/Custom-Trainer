const fs = require("node:fs");
const { DEV_CONSTS } = require("../constants/constants.js");

const { dataFile, LF, PL, FRQ_R, FRQ } = DEV_CONSTS;

const stringSlice = (fullString, forCut) =>
  fullString.slice(fullString.indexOf(forCut) + forCut.length);

exports.getTimecodes = () => {
  const data = fs.readFileSync(dataFile, "utf-8");
  const resultObject = {
    frqR: [],
    frq: [],
    sensorSignals: [],
  };

  const rowsArray = data.split(LF);

  for (const rowEl of rowsArray) {
    if (rowEl.includes(FRQ_R)) {
      resultObject.frqR.push(stringSlice(rowEl, FRQ_R));
      continue;
    }

    if (rowEl.includes(FRQ)) {
      resultObject.frq.push(stringSlice(rowEl, FRQ));
      continue;
    }

    if (rowEl.includes(PL)) {
      resultObject.pl = new Date(Number(stringSlice(rowEl, PL)));
      continue;
    }

    resultObject.sensorSignals.push(new Date(Number(rowEl)));
  }

  return resultObject;
};

exports.sleep = (delay = 1000) =>
  new Promise(resolve => {
    setTimeout(resolve, delay);
  });

exports.sleepCb = (cb, delay = 1000) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
      cb();
    }, delay);
  });
