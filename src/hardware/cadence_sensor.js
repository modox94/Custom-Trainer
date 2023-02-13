const { Gpio } = require("onoff");
const { random, noop, get } = require("lodash");
const {
  DEFAULT_M_C,
  DEFAULT_WINDOW,
  DIRECTION,
  EDGE,
  PAUSE_DELAY,
  PHYSICAL_TO_GPIO,
} = require("../constants/constants");

const cadenceSensorPin = PHYSICAL_TO_GPIO[11];

class Frequency {
  constructor(options) {
    this.timecodes = get(options, ["timecodes"], []);
    this.window = get(options, ["window"], DEFAULT_WINDOW);
    this.magnetsCount = get(options, ["magnetsCount"], DEFAULT_M_C);
    this.gearRatio = get(options, ["gearRatio"], 1);

    try {
      this.cadenceSensor = new Gpio(
        cadenceSensorPin,
        DIRECTION.in,
        EDGE.rising,
      );
    } catch (error) {
      console.log("Gpio error", error);
      console.log("cadence sensor simulator is start");

      this.watchCallbacks = [];
      this.loopFn = () => {
        if (!this.lastTimeout) {
          console.log("cadence sensor simulator is stopped");
          return;
        }

        this.watchCallbacks.forEach(cbFn => cbFn());
        const timeout = random(500, PAUSE_DELAY / 2);
        const isLongTimeout = random(0, 100) > 90;
        this.lastTimeout = setTimeout(
          this.loopFn.bind(this),
          isLongTimeout ? 10000 : timeout,
        );
      };

      this.lastTimeout = setTimeout(this.loopFn.bind(this), 0);

      const watch = fn => this.watchCallbacks.push(fn);
      const unwatch = fn => {
        this.watchCallbacks = this.watchCallbacks.filter(cbFn => cbFn !== fn);
      };
      const unwatchAll = () => {
        this.watchCallbacks = [];
      };

      this.cadenceSensor = { watch, unwatch, unwatchAll, unexport: noop };
    }

    this.cadenceSensor.watch(this.inc.bind(this));
  }

  off() {
    clearTimeout(this.lastTimeout);
    this.lastTimeout = undefined;
    this.cadenceSensor.unwatchAll();
    this.cadenceSensor.unexport();
  }

  inc(milliseconds) {
    if (!milliseconds) {
      milliseconds = Date.now();
    }

    this.timecodes.push(milliseconds);
  }

  get rpm() {
    const now = Date.now();
    const lastIndex = this.timecodes.length - 1;
    if (
      lastIndex >= 0 &&
      Math.abs(now - this.timecodes[lastIndex]) < PAUSE_DELAY
    ) {
      const prevMills = this.timecodes[lastIndex - 1];
      const currMills = this.timecodes[lastIndex];

      const duration = (currMills - prevMills) / (1000 * this.window);
      const distance = (1 / this.magnetsCount) * this.gearRatio;
      const result = distance / duration;

      return { lastTimecode: this.timecodes[lastIndex], result };
    }

    return { lastTimecode: this.timecodes[lastIndex], result: 0 };
  }
}

const rate = new Frequency({ magnetsCount: 2 });

exports.rate = rate;
