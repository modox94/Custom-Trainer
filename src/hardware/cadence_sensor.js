const { Gpio } = require("onoff");
const { get, noop, random, round } = require("lodash");
const {
  CADENCE_FIELDS,
  COMMON_CONST,
  DIRECTION,
  EDGE,
  PHYSICAL_TO_GPIO,
} = require("../constants/constants");

const cadenceSensorPin = PHYSICAL_TO_GPIO[11];

class Frequency {
  constructor(options) {
    this.timecodes = get(options, ["timecodes"], []);
    this[CADENCE_FIELDS.GEAR_RATIO] = get(
      options,
      [CADENCE_FIELDS.GEAR_RATIO],
      2,
    );

    try {
      this.cadenceSensor = new Gpio(
        cadenceSensorPin,
        DIRECTION.in,
        EDGE.rising,
      );
    } catch (error) {
      // console.log("Gpio error", error);
      console.log("Cadence sensor simulator is started");

      this.watchCallbacks = [];
      this.loopFn = () => {
        if (!this.lastTimeout) {
          console.log("Cadence sensor simulator is stopped");
          return;
        }

        this.watchCallbacks.forEach(cbFn => cbFn());
        const timeout = random(500, COMMON_CONST.PAUSE_DELAY / 2);
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

  updateField(field, value) {
    switch (field) {
      case CADENCE_FIELDS.GEAR_RATIO:
        if (isFinite(value)) {
          this[field] = round(value, 2);
        }
        break;

      default:
        break;
    }
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
      lastIndex > 0 &&
      Math.abs(now - this.timecodes[lastIndex]) < COMMON_CONST.PAUSE_DELAY
    ) {
      const prevMills = this.timecodes[lastIndex - 1];
      const currMills = this.timecodes[lastIndex];

      const duration = (currMills - prevMills) / 60000;
      const distance = 1 / this[CADENCE_FIELDS.GEAR_RATIO];
      const result = distance / duration;

      return { lastTimecode: this.timecodes[lastIndex], result };
    }

    return { lastTimecode: this.timecodes[lastIndex], result: 0 };
  }
}

module.exports = Frequency;
