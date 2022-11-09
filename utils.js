const fs = require("node:fs");
const { DEV_CONSTS, DEFAULT_WINDOW, DEFAULT_M_C } = require("./constants.js");

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

exports.Frequency = class Frequency {
  constructor(options) {
    this.timecodes = options?.timecodes || [];
    this.window = options?.window || DEFAULT_WINDOW;
    this.magnetsCount = options?.magnetsCount || DEFAULT_M_C;
    this.gearRatio = options?.gearRatio || 1;
  }

  inc(milliseconds) {
    if (!milliseconds) {
      milliseconds = Date.now();
    }

    this.timecodes.push(milliseconds);

    return this.rpm;
  }

  get rpm() {
    const now = Date.now();
    const lastIndex = this.timecodes.length - 1;
    if (lastIndex >= 0 && Math.abs(now - lastIndex) < 1000) {
      const prevMills = this.timecodes[lastIndex - 1];
      const currMills = this.timecodes[lastIndex];

      const duration = (currMills - prevMills) / (1000 * this.window);
      const distance = (1 / this.magnetsCount) * this.gearRatio;
      const result = distance / duration;

      return result;
    }

    return 0;
  }
};

exports.sleep = (delay = 1000) =>
  new Promise(resolve => {
    setTimeout(resolve, delay);
  });
