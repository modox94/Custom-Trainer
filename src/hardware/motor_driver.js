const { get, isFinite, isFunction, noop, round, min } = require("lodash");
const { Gpio } = require("onoff");
const {
  CALIBRATION_MAX_MOVES,
  CALIBRATION_MIN_POINTS,
  CALIBRATION_ST_CYCLES,
  DIRECTION,
  ERRORS,
  LOADING_PAUSE,
  LOADING_TIMER,
  MOTOR_FIELDS,
  MOVE_DIRECTION,
  PHYSICAL_TO_GPIO,
  TEST_IN_PROGRESS,
} = require("../constants/constants");
const { sleep } = require("../utils/utils");
const { PotentiometerSensor } = require("./potentiometer_sensor");

const MOVE_DIRECTION_ARRAY = Object.values(MOVE_DIRECTION);
const DELAY = 100; // TODO transfer to settings
const DELAY_FOR_READ = 25; // TODO transfer to settings
const MAX_RES_LEVEL = 10; // TODO transfer to settings

const write = (value, cb = noop) => {
  console.log("write", value);
  cb();
};
const writeSync = (value, cb = noop) => {
  console.log("writeSync", value);
  cb();
};
const unexport = (value, cb = noop) => {
  console.log("unexport", value);
  cb();
};
const motorInNoop = { write, writeSync, unexport };

const motorIn1Pin = PHYSICAL_TO_GPIO[16];
const motorIn2Pin = PHYSICAL_TO_GPIO[18];

class MotorDriver {
  constructor(options) {
    // { "minPosition": 5, "maxPosition": 95, "sleepRatio": 1435 }

    this[MOTOR_FIELDS.MIN_POS] = get(options, [MOTOR_FIELDS.MIN_POS], null); // can be less then maxPosition!
    this[MOTOR_FIELDS.MAX_POS] = get(options, [MOTOR_FIELDS.MAX_POS], null); // can be higher then minPosition!
    this[MOTOR_FIELDS.SLEEP_RATIO] = get(
      options,
      [MOTOR_FIELDS.SLEEP_RATIO],
      null,
    );
    this[MOTOR_FIELDS.SWAP_MOTOR_WIRES] = get(
      options,
      [MOTOR_FIELDS.SWAP_MOTOR_WIRES],
      null,
    );
    this[MOTOR_FIELDS.SWAP_POTEN_WIRES] = get(
      options,
      [MOTOR_FIELDS.SWAP_POTEN_WIRES],
      null,
    );

    this.action = null;
    this.potentiometer = new PotentiometerSensor();

    try {
      this.in1 = new Gpio(motorIn1Pin, DIRECTION.low);
      this.in2 = new Gpio(motorIn2Pin, DIRECTION.low);
    } catch (error) {
      this.in1 = motorInNoop;
      this.in2 = motorInNoop;

      console.log("Gpio error", error);
    }

    this.in1.writeSync(0);
    this.in2.writeSync(0);
  }

  actionCancel() {
    if (!this.action?.signal?.aborted && isFunction(this.action?.abort)) {
      this.action.abort();
    }
  }

  async off() {
    this.actionCancel();
    this.stop();
    this.in1.unexport();
    this.in2.unexport();
    this.potentiometer.off();
  }

  updateField(field, value) {
    switch (field) {
      case MOTOR_FIELDS.MIN_POS:
      case MOTOR_FIELDS.MAX_POS:
      case MOTOR_FIELDS.SLEEP_RATIO:
        if (isFinite(value)) {
          this[field] = round(value);
        }
        break;

      case MOTOR_FIELDS.SWAP_MOTOR_WIRES:
      case MOTOR_FIELDS.SWAP_POTEN_WIRES:
        this[field] = Boolean(value);
        break;

      default:
        break;
    }
  }

  move(direction) {
    if (
      (direction === MOVE_DIRECTION.forward && !this.swappedMotorWires) ||
      (direction === MOVE_DIRECTION.back && this.swappedMotorWires)
    ) {
      this.in1.writeSync(0);
      this.in2.writeSync(1);
    } else if (
      (direction === MOVE_DIRECTION.back && !this.swappedMotorWires) ||
      (direction === MOVE_DIRECTION.forward && this.swappedMotorWires)
    ) {
      this.in1.writeSync(1);
      this.in2.writeSync(0);
    }
  }

  stop() {
    this.in1.writeSync(0);
    this.in2.writeSync(0);
  }

  async DANGER_move(direction, outerAc) {
    const ac = outerAc || new AbortController();

    if (!outerAc) {
      this.actionCancel();
      this.action = ac;
      ac.signal.onabort = this.stop.bind(this);
    }

    if (!MOVE_DIRECTION_ARRAY.includes(direction)) {
      console.log("DANGER_move wrong direction");
      return { error: "wrong direction" };
    }

    if (ac.signal?.aborted) {
      return { error: ERRORS.PROMISE_CANCELLED };
    }

    try {
      this.move(direction);
      await sleep(DELAY);

      if (ac.signal?.aborted) {
        return { error: ERRORS.PROMISE_CANCELLED };
      }

      this.stop();
    } catch (error) {
      return { error };
    }

    return { error: false };
  }

  get isReady() {
    return this.potentiometer?.condition?.isReady;
  }

  get isError() {
    return this.potentiometer?.condition?.error;
  }

  async readPosition() {
    const rawValue = await this.potentiometer.readPosition();
    return this.swappedPotentiometerWires ? 100 - rawValue : rawValue;
  }

  async getMotorLevel() {
    if (
      !isFinite(this[MOTOR_FIELDS.MAX_POS]) ||
      !isFinite(this[MOTOR_FIELDS.MIN_POS])
    ) {
      return { error: ERRORS.CALIBRATION_NO_DATA };
    }
    const posCur = await this.readPosition();
    const interval =
      Math.abs(this[MOTOR_FIELDS.MAX_POS] - this[MOTOR_FIELDS.MIN_POS]) /
      (MAX_RES_LEVEL - 1);

    const posMin =
      this[MOTOR_FIELDS.MAX_POS] > this[MOTOR_FIELDS.MIN_POS]
        ? this[MOTOR_FIELDS.MIN_POS]
        : this[MOTOR_FIELDS.MAX_POS];
    return round((posCur - posMin) / interval) + 1;
  }

  async calibrationDirectionTest() {
    const ac = new AbortController();
    this.actionCancel();
    this.action = ac;
    ac.signal.onabort = this.stop.bind(this);

    if (
      !isFinite(this[MOTOR_FIELDS.MAX_POS]) ||
      !isFinite(this[MOTOR_FIELDS.MIN_POS])
    ) {
      return { error: ERRORS.CALIBRATION_NO_DATA };
    } else if (
      Math.abs(this[MOTOR_FIELDS.MAX_POS] - this[MOTOR_FIELDS.MIN_POS]) <= 10
    ) {
      return { error: ERRORS.CALIBRATION_INVALID_EDGES };
    }

    let loadingTimer = LOADING_TIMER;
    // TODO improve this part
    while (!this.isReady && !this.isError) {
      if (loadingTimer-- <= 0) {
        return { error: ERRORS.LOADING_TIMER_EXPIRED };
      }

      console.log("loading...");

      await sleep(LOADING_PAUSE);
    }

    if (this.isError) {
      return { error: ERRORS.POTEN_ERROR };
    }

    let posCur = round(await this.readPosition());

    if (!isFinite(posCur)) {
      return { error: ERRORS.POTEN_ERROR };
    }

    let directionCur;
    let directionChanged = false;
    const distanceToMin = Math.abs(this[MOTOR_FIELDS.MIN_POS] - posCur);
    const distanceToMax = Math.abs(this[MOTOR_FIELDS.MAX_POS] - posCur);
    if (distanceToMin > distanceToMax) {
      directionCur = MOVE_DIRECTION.back;
    } else {
      directionCur = MOVE_DIRECTION.forward;
    }

    const posData = [posCur]; // 65, MOVE_DIRECTION, 66, MOVE_DIRECTION, 67,...
    const checkPosData = () => {
      let behaviorСounter = 0;

      for (let index = 0; index < posData.length; index++) {
        const posPrevEl = posData[index - 2];
        const directionEl = posData[index - 1];
        const posEl = posData[index];

        if (
          isFinite(posPrevEl) &&
          isFinite(posEl) &&
          MOVE_DIRECTION_ARRAY.includes(directionEl)
        ) {
          switch (directionEl) {
            case MOVE_DIRECTION.forward:
              if (posEl > posPrevEl) {
                behaviorСounter += 1;
              } else if (posEl < posPrevEl) {
                return {
                  error: ERRORS.CALIBRATION_WRONG_DIRECTION,
                };
              }
              break;

            case MOVE_DIRECTION.back:
              if (posEl < posPrevEl) {
                behaviorСounter += 1;
              } else if (posEl > posPrevEl) {
                return {
                  error: ERRORS.CALIBRATION_WRONG_DIRECTION,
                };
              }
              break;

            default:
              break;
          }
        }
      }

      if (behaviorСounter >= CALIBRATION_MIN_POINTS) {
        if (!directionChanged) {
          directionCur =
            directionCur === MOVE_DIRECTION.forward
              ? MOVE_DIRECTION.back
              : MOVE_DIRECTION.forward;
          directionChanged = true;
          behaviorСounter = 0;
        } else {
          return true;
        }
      }

      if (posData.length > CALIBRATION_MAX_MOVES) {
        return { error: ERRORS.CALIBRATION_TOO_LONG };
      }

      return TEST_IN_PROGRESS;
    };

    while (checkPosData() === TEST_IN_PROGRESS && !ac.signal?.aborted) {
      await this.DANGER_move(directionCur, ac);
      posData.push(directionCur);

      await sleep(DELAY_FOR_READ);

      posCur = round(await this.readPosition());

      posData.push(posCur);
    }

    const testResult = checkPosData();
    if (testResult !== true) {
      return {
        ...testResult,
        error: testResult?.error || ERRORS.CALIBRATION_UNKNOWN,
      };
    }
    return testResult;
  }

  async calibrationCalcSleepRatio() {
    const ac = new AbortController();
    this.actionCancel();
    this.action = ac;
    ac.signal.onabort = this.stop.bind(this);

    if (ac.signal?.aborted) {
      return { error: ERRORS.PROMISE_CANCELLED };
    }
    await this.setLevel(1, ac);

    let sleepRatio = 0;
    // TODO CALIBRATION_ST_CYCLES
    for (let idx = 0; idx < 1; idx++) {
      if (ac.signal?.aborted) {
        return { error: ERRORS.PROMISE_CANCELLED };
      }
      const toMaxEdgeRes = await this.setLevel(MAX_RES_LEVEL, ac, sleepRatio);
      const { error: errorToMax, driveTime: driveTimeToMax } = toMaxEdgeRes;

      if (errorToMax) {
        return toMaxEdgeRes;
      }

      if (ac.signal?.aborted) {
        return { error: ERRORS.PROMISE_CANCELLED };
      }
      const toMinEdgeRes = await this.setLevel(1, ac);
      const { error: errorToMin, driveTime: driveTimeToMin } = toMinEdgeRes;

      if (errorToMin) {
        return toMinEdgeRes;
      }

      sleepRatio = min([driveTimeToMax, driveTimeToMin]); // round((driveTimeSum / 2) * 0.95);
      console.log("sleepRatio", sleepRatio);

      // this.updateField(MOTOR_FIELDS.SLEEP_RATIO, sleepRatio);
    }

    return sleepRatio;
    //
  }

  async calibration() {
    const ac = new AbortController();
    this.actionCancel();
    this.action = ac;
    ac.signal.onabort = this.stop.bind(this);

    if (
      !isFinite(this[MOTOR_FIELDS.MAX_POS]) ||
      !isFinite(this[MOTOR_FIELDS.MIN_POS])
    ) {
      return { error: ERRORS.CALIBRATION_NO_DATA };
    } else if (
      Math.abs(this[MOTOR_FIELDS.MAX_POS] - this[MOTOR_FIELDS.MIN_POS]) <= 10
    ) {
      return { error: ERRORS.CALIBRATION_INVALID_EDGES };
    }

    let loadingTimer = LOADING_TIMER;
    // TODO improve this part
    while (!this.isReady && !this.isError) {
      if (loadingTimer-- <= 0) {
        return { error: ERRORS.LOADING_TIMER_EXPIRED };
      }

      console.log("loading...");

      await sleep(LOADING_PAUSE);
    }

    if (this.isError) {
      return { error: ERRORS.POTEN_ERROR };
    }

    let posCur = await this.readPosition();

    if (!isFinite(posCur)) {
      return { error: ERRORS.POTEN_ERROR };
    }

    let directionCur;
    let directionChanged = false;
    const distanceToMin = Math.abs(this[MOTOR_FIELDS.MIN_POS] - posCur);
    const distanceToMax = Math.abs(this[MOTOR_FIELDS.MAX_POS] - posCur);
    if (distanceToMin > distanceToMax) {
      directionCur = MOVE_DIRECTION.back;
    } else {
      directionCur = MOVE_DIRECTION.forward;
    }

    const posData = [posCur]; // 65, MOVE_DIRECTION, 66, MOVE_DIRECTION, 67,...
    const checkPosData = () => {
      let behaviorСounter = 0;

      for (let index = 0; index < posData.length; index++) {
        const posPrevEl = posData[index - 2];
        const directionEl = posData[index - 1];
        const posEl = posData[index];

        if (
          isFinite(posPrevEl) &&
          isFinite(posEl) &&
          MOVE_DIRECTION_ARRAY.includes(directionEl)
        ) {
          switch (directionEl) {
            case MOVE_DIRECTION.forward:
              if (posEl > posPrevEl) {
                behaviorСounter += 1;
              } else if (posEl < posPrevEl) {
                return {
                  error: ERRORS.CALIBRATION_WRONG_DIRECTION,
                };
              }
              break;

            case MOVE_DIRECTION.back:
              if (posEl < posPrevEl) {
                behaviorСounter += 1;
              } else if (posEl > posPrevEl) {
                return {
                  error: ERRORS.CALIBRATION_WRONG_DIRECTION,
                };
              }
              break;

            default:
              break;
          }
        }
      }

      if (behaviorСounter >= CALIBRATION_MIN_POINTS) {
        if (!directionChanged) {
          directionCur =
            directionCur === MOVE_DIRECTION.forward
              ? MOVE_DIRECTION.back
              : MOVE_DIRECTION.forward;
          directionChanged = true;
          behaviorСounter = 0;
        } else {
          return true;
        }
      }

      if (posData.length > CALIBRATION_MAX_MOVES) {
        return { error: ERRORS.CALIBRATION_TOO_LONG };
      }

      return TEST_IN_PROGRESS;
    };

    while (checkPosData() === TEST_IN_PROGRESS && !ac.signal?.aborted) {
      await this.DANGER_move(directionCur, ac);
      posData.push(directionCur);

      await sleep(DELAY_FOR_READ);

      posCur = await this.readPosition();

      posData.push(posCur);
    }

    const testResult = checkPosData();
    if (testResult !== true) {
      return {
        ...testResult,
        error: testResult?.error || ERRORS.CALIBRATION_UNKNOWN,
      };
    }
    if (ac.signal?.aborted) {
      return { error: ERRORS.PROMISE_CANCELLED };
    }
    await this.setLevel(1, ac);

    for (let idx = 0; idx < CALIBRATION_ST_CYCLES; idx++) {
      if (ac.signal?.aborted) {
        return { error: ERRORS.PROMISE_CANCELLED };
      }
      const toMaxEdgeRes = await this.setLevel(MAX_RES_LEVEL, ac);
      const { error: errorToMax, driveTime: driveTimeToMax } = toMaxEdgeRes;

      if (errorToMax) {
        return toMaxEdgeRes;
      }

      if (ac.signal?.aborted) {
        return { error: ERRORS.PROMISE_CANCELLED };
      }
      const toMinEdgeRes = await this.setLevel(1, ac);
      const { error: errorToMin, driveTime: driveTimeToMin } = toMinEdgeRes;

      if (errorToMin) {
        return toMinEdgeRes;
      }

      const driveTimeSum = driveTimeToMax + driveTimeToMin;
      const sleepRatio = round((driveTimeSum / 2) * 0.95);
      this.updateField(MOTOR_FIELDS.SLEEP_RATIO, sleepRatio);
    }

    return this[MOTOR_FIELDS.SLEEP_RATIO];
  }

  async setLevel(level, outerAc, outerSR) {
    const ac = outerAc || new AbortController();
    const sleepRatio =
      outerSR === undefined ? this[MOTOR_FIELDS.SLEEP_RATIO] : outerSR;

    if (!outerAc) {
      this.actionCancel();
      this.action = ac;
      ac.signal.onabort = this.stop.bind(this);
    }

    if (level < 1 || level > MAX_RES_LEVEL) {
      return { error: ERRORS.INVALID_RESIST_LEVEL };
    }

    let driveTime = 0;
    let loadingTimer = LOADING_TIMER;
    // TODO improve this part
    while (!this.isReady && !this.isError && !ac.signal?.aborted) {
      if (loadingTimer-- <= 0) {
        return { error: ERRORS.LOADING_TIMER_EXPIRED };
      }
      console.log("loading...");
      await sleep(LOADING_PAUSE);
    }

    if (this.isError) {
      return { error: ERRORS.POTEN_ERROR };
    }
    if (ac.signal?.aborted) {
      return { error: ERRORS.PROMISE_CANCELLED };
    }

    this.stop();

    const interval =
      Math.abs(this[MOTOR_FIELDS.MAX_POS] - this[MOTOR_FIELDS.MIN_POS]) /
      (MAX_RES_LEVEL - 1);
    let posTarget;

    if (
      !isFinite(this[MOTOR_FIELDS.MAX_POS]) ||
      !isFinite(this[MOTOR_FIELDS.MIN_POS])
    ) {
      return { error: ERRORS.CALIBRATION_NO_DATA };
    } else if (
      Math.abs(this[MOTOR_FIELDS.MAX_POS] - this[MOTOR_FIELDS.MIN_POS]) <= 10
    ) {
      return { error: ERRORS.CALIBRATION_INVALID_EDGES };
    } else if (this[MOTOR_FIELDS.MAX_POS] > this[MOTOR_FIELDS.MIN_POS]) {
      posTarget = this[MOTOR_FIELDS.MIN_POS] + interval * (level - 1);
    } else if (this[MOTOR_FIELDS.MAX_POS] < this[MOTOR_FIELDS.MIN_POS]) {
      posTarget = this[MOTOR_FIELDS.MIN_POS] - interval * (level - 1);
    } else {
      return { error: ERRORS.CALIBRATION_INVALID_EDGES };
    }

    let posCur = await this.readPosition();

    let firstTime = false;

    if (sleepRatio > 0) {
      firstTime =
        (Math.abs(posCur - posTarget) / interval) *
        (sleepRatio / (MAX_RES_LEVEL - 1));
    }

    // TODO improve checking position
    // TODO add max counter for stop cycle, i.e. 100 max moves
    while (!ac.signal?.aborted && Math.abs(posCur - posTarget) > 1) {
      if (ac.signal?.aborted) {
        return { error: ERRORS.PROMISE_CANCELLED };
      }

      if (posCur < posTarget) {
        this.move(MOVE_DIRECTION.forward);
      } else {
        this.move(MOVE_DIRECTION.back);
      }

      if (firstTime) {
        await sleep(firstTime);
        driveTime =
          posCur - posTarget ? driveTime + firstTime : driveTime - firstTime;
        firstTime = false;
      } else {
        await sleep(DELAY);
        driveTime = posCur - posTarget ? driveTime + DELAY : driveTime - DELAY;
      }

      if (ac.signal?.aborted) {
        return { error: ERRORS.PROMISE_CANCELLED };
      }

      this.stop();
      await sleep(DELAY_FOR_READ);

      if (ac.signal?.aborted) {
        return { error: ERRORS.PROMISE_CANCELLED };
      }

      posCur = await this.readPosition();
    }

    return { driveTime };
  }
}

module.exports = MotorDriver;
