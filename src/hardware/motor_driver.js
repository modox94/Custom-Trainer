const Promise = require("bluebird");
const { round, noop, get, isFunction, isFinite } = require("lodash");
const fs = require("node:fs");
const { Gpio } = require("onoff");
const {
  DIRECTION,
  PHYSICAL_TO_GPIO,
  MOVE_DIRECTION,
  ERRORS,
  MOTOR_FIELDS,
  LOADING_TIMER,
  LOADING_PAUSE,
  TEST_IN_PROGRESS,
} = require("../constants/constants");
const { sleepCb, getIsCancelledFn } = require("../utils/utils");
const { PotentiometerSensor } = require("./potentiometer_sensor");

Promise.config({ cancellation: true });

const DELAY = 100; // TODO transfer to settings
const DELAY_FOR_READ = 25; // TODO transfer to settings
const RESIST_LEVELS = 10; // TODO transfer to settings

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
    if (
      isFunction(this.action?.isFulfilled) &&
      !this.action.isFulfilled() &&
      isFunction(this.action?.cancel)
    ) {
      this.action.cancel();
      this.action = null;
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
    this.actionCancel();
    this.in1.writeSync(0);
    this.in2.writeSync(0);
  }

  async DANGER_move(direction) {
    this.actionCancel();

    if (!Object.values(MOVE_DIRECTION).includes(direction)) {
      console.log("DANGER_move wrong direction");
      return { error: "wrong direction" };
    }

    const onCancelFn = () => this.stop();

    try {
      this.move(direction);
      const localAction = new Promise((resolve, reject, onCancel) => {
        onCancel(onCancelFn);
        sleepCb(resolve, DELAY);
      });
      this.action = localAction;
      await localAction;
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

  readPositionCb(rawCb) {
    const cb = rawValue => {
      const value = this.swappedPotentiometerWires ? 100 - rawValue : rawValue;
      rawCb(value);
    };
    return this.potentiometer.readPositionCb(cb);
  }

  async calibration() {
    this.actionCancel();

    if (!this[MOTOR_FIELDS.MIN_POS] || !this[MOTOR_FIELDS.MAX_POS]) {
      return { error: ERRORS.CALIBRATION_NO_DATA };
    }

    const onCancelFn = () => this.stop();
    let localAction;
    const isCancelled = getIsCancelledFn(localAction);
    let loadingCounter = LOADING_TIMER;
    // TODO improve this part
    while (!this.isReady && !this.isError) {
      if (loadingCounter-- <= 0) {
        return "error";
      }
      if (isCancelled()) {
        return;
      }

      console.log("loading...");

      localAction = new Promise((resolve, reject, onCancel) => {
        onCancel(onCancelFn);
        sleepCb(resolve, LOADING_PAUSE);
      });
      this.action = localAction;
      await localAction;
    }

    if (this.isError) {
      console.log("potentiometer not working");
      return;
    }

    localAction = new Promise((resolve, reject, onCancel) => {
      onCancel(onCancelFn);
      this.readPositionCb(resolve);
    });
    this.action = localAction;
    let posCur = await localAction;

    const posData = []; // 65, 66, 66, MOVE_DIRECTION, 66, 66, 66, MOVE_DIRECTION, 67, 67, 67,...
    const checkPosData = () => {
      console.log("posData", posData);

      if (posData.length > 3) {
        return {
          error: "error",
          [MOTOR_FIELDS.SLEEP_RATIO]: 1300,
        };
      }

      return TEST_IN_PROGRESS;
    };
    while (checkPosData() === TEST_IN_PROGRESS) {
      posData.push(posCur);
      // this.DANGER_move
      // MOVE_DIRECTION
    }
  }

  // TODO remove
  async calibration_old(loops = 1) {
    if (!this[MOTOR_FIELDS.MIN_POS] || !this[MOTOR_FIELDS.MAX_POS]) {
      return console.log("Невозможно проводить калибровку без инициализации!");
    }

    if (this[MOTOR_FIELDS.SLEEP_RATIO]) {
      delete this[MOTOR_FIELDS.SLEEP_RATIO];
    }

    const result = await this.setLevel(1);
    if (result === "error") {
      console.log("Что-то не так с двигателем!");
      this.stop();
      return "error";
    }

    let loopsCounter = loops;
    let driveTimeSum = 0;

    while (loopsCounter > 0) {
      const { driveTime: driveTimeUp } = await this.setLevel(
        RESIST_LEVELS,
        true,
      );
      driveTimeSum += driveTimeUp;

      const { driveTime: driveTimeDown } = await this.setLevel(1, true);
      driveTimeSum += driveTimeDown;

      loopsCounter -= 1;
    }

    const sleepRatio = round(
      (driveTimeSum / 2 / loops / (RESIST_LEVELS - 1)) * 0.95,
    );

    this[MOTOR_FIELDS.SLEEP_RATIO] = sleepRatio;

    fs.writeFileSync(
      "./motor_settings.json",
      JSON.stringify({
        minPosition: this[MOTOR_FIELDS.MIN_POS],
        maxPosition: this[MOTOR_FIELDS.MAX_POS],
        sleepRatio: this[MOTOR_FIELDS.SLEEP_RATIO],
      }),
    );

    return this[MOTOR_FIELDS.SLEEP_RATIO];
  }

  async setLevel(level, isCalibration) {
    this.actionCancel();

    if (level < 1 || level > RESIST_LEVELS) {
      console.log("wrong resist level");
      return "error";
    }

    const onCancelFn = () => this.stop();
    let localAction;
    const isCancelled = getIsCancelledFn(localAction);
    let loadingCounter = LOADING_TIMER;
    // TODO improve this part
    while (!this.isReady && !this.isError) {
      if (loadingCounter-- <= 0) {
        return "error";
      }
      if (isCancelled()) {
        return;
      }

      console.log("loading...");

      localAction = new Promise((resolve, reject, onCancel) => {
        onCancel(onCancelFn);
        sleepCb(resolve, LOADING_PAUSE);
      });
      this.action = localAction;
      await localAction;
    }

    if (this.isError) {
      console.log("potentiometer not working");
      return;
    }

    const interval =
      Math.abs(this[MOTOR_FIELDS.MAX_POS] - this[MOTOR_FIELDS.MIN_POS]) /
      (RESIST_LEVELS - 1);
    let targetPos;

    if (
      !isFinite(this[MOTOR_FIELDS.MAX_POS]) ||
      !isFinite(this[MOTOR_FIELDS.MIN_POS])
    ) {
      console.log("wrong motor edges");
      return;
    } else if (this[MOTOR_FIELDS.MAX_POS] > this[MOTOR_FIELDS.MIN_POS]) {
      targetPos = this[MOTOR_FIELDS.MIN_POS] + interval * (level - 1);
    } else if (this[MOTOR_FIELDS.MAX_POS] < this[MOTOR_FIELDS.MIN_POS]) {
      targetPos = this[MOTOR_FIELDS.MIN_POS] - interval * (level - 1);
    } else {
      console.log("wrong motor edges");
      return;
    }

    if (isCancelled()) {
      return;
    }
    localAction = new Promise((resolve, reject, onCancel) => {
      onCancel(onCancelFn);
      this.readPositionCb(resolve);
    });
    this.action = localAction;

    let posCur = await localAction;
    let counter = 0;
    let firstTime = false;

    if (this[MOTOR_FIELDS.SLEEP_RATIO]) {
      firstTime =
        (Math.abs(posCur - targetPos) / interval) *
        this[MOTOR_FIELDS.SLEEP_RATIO];
    }

    // TODO improve checking position
    while (Math.abs(posCur - targetPos) > 1) {
      if (isCancelled()) {
        return;
      }
      ++counter;

      if (posCur < targetPos) {
        this.move(MOVE_DIRECTION.forward);
      } else {
        this.move(MOVE_DIRECTION.back);
      }

      if (firstTime) {
        localAction = new Promise((resolve, reject, onCancel) => {
          onCancel(onCancelFn);
          sleepCb(resolve, firstTime);
        });
        this.action = localAction;

        firstTime = false;
      } else {
        localAction = new Promise((resolve, reject, onCancel) => {
          onCancel(onCancelFn);
          sleepCb(resolve, DELAY);
        });
        this.action = localAction;
      }

      await localAction;

      this.stop();

      if (isCancelled()) {
        return;
      }
      localAction = new Promise((resolve, reject, onCancel) => {
        onCancel(onCancelFn);
        sleepCb(resolve, DELAY_FOR_READ);
      });
      this.action = localAction;
      await localAction;

      if (isCancelled()) {
        return;
      }
      localAction = new Promise((resolve, reject, onCancel) => {
        onCancel(onCancelFn);
        this.readPositionCb(resolve);
      });
      this.action = localAction;

      posCur = await localAction;
    }

    return isCalibration ? { driveTime: counter * DELAY } : "done";
  }
}

module.exports = MotorDriver;
