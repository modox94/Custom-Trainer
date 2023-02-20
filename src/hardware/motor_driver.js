const Promise = require("bluebird");
const { round, noop, get, isFunction, isFinite } = require("lodash");
const fs = require("node:fs");
const { Gpio } = require("onoff");
const {
  DIRECTION,
  PHYSICAL_TO_GPIO,
  MOVE_DIRECTION,
} = require("../constants/constants");
const { sleepCb } = require("../utils/utils");
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

    this.minPosition = get(options, ["minPosition"], null); // can be less then maxPosition!
    this.maxPosition = get(options, ["maxPosition"], null); // can be higher then minPosition!
    this.sleepRatio = get(options, ["sleepRatio"], null);
    this.swappedMotorWires = get(options, ["swappedMotorWires"], null);
    this.swappedPotentiometerWires = get(
      options,
      ["swappedPotentiometerWires"],
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

  async off() {
    if (isFunction(this.action?.cancel)) {
      this.action.cancel();
    }
    this.stop();
    this.in1.unexport();
    this.in2.unexport();
    this.potentiometer.off();
  }

  swapMotorWires(value) {
    this.swappedMotorWires = Boolean(value);
  }

  swapPotentiometerWires(value) {
    this.swappedPotentiometerWires = Boolean(value);
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

  forward() {
    this.move(MOVE_DIRECTION.forward);
  }

  back() {
    this.move(MOVE_DIRECTION.back);
  }

  stop() {
    if (
      isFunction(this.action?.isFulfilled) &&
      !this.action.isFulfilled() &&
      isFunction(this.action?.cancel)
    ) {
      this.action.cancel();
    }

    this.in1.writeSync(0);
    this.in2.writeSync(0);
  }

  async DANGER_forward() {
    try {
      this.forward();
      await sleepCb(noop, DELAY);
      this.stop();
    } catch (error) {
      return { error };
    }

    return { error: false };
  }

  async DANGER_back() {
    try {
      this.back();
      await sleepCb(noop, DELAY);
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

  // TODO remove
  async calibration(loops = 1) {
    if (!this.minPosition || !this.maxPosition) {
      return console.log("Невозможно проводить калибровку без инициализации!");
    }

    if (this.sleepRatio) {
      delete this.sleepRatio;
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

    this.sleepRatio = sleepRatio;

    fs.writeFileSync(
      "./motor_settings.json",
      JSON.stringify({
        minPosition: this.minPosition,
        maxPosition: this.maxPosition,
        sleepRatio: this.sleepRatio,
      }),
    );

    return this.sleepRatio;
  }

  async setLevel(level, isCalibration) {
    if (
      isFunction(this.action?.isFulfilled) &&
      !this.action.isFulfilled() &&
      isFunction(this.action?.cancel)
    ) {
      this.action.cancel();
      this.action = null;
      console.log("setLevel canceled previous action");
    }

    const onCancelFn = () => this.stop();

    let localAction;
    const isCancelled = () => {
      if (isFunction(localAction?.isCancelled) && localAction.isCancelled()) {
        console.log("canceled");
        return true;
      }

      return false;
    };

    if (level < 1 || level > RESIST_LEVELS) {
      console.log("wrong resist level");
      return "error";
    }

    while (!this.isReady && !this.isError) {
      console.log("loading...");

      if (isCancelled()) {
        return;
      }

      localAction = new Promise((resolve, reject, onCancel) => {
        onCancel(onCancelFn);
        sleepCb(resolve, 200);
      });
      this.action = localAction;

      await localAction;
    }

    if (this.isError) {
      console.log("potentiometer not working");
      return;
    }

    const interval =
      Math.abs(this.maxPosition - this.minPosition) / (RESIST_LEVELS - 1);
    let targetPos;

    if (!isFinite(this.maxPosition) || !isFinite(this.minPosition)) {
      console.log("wrong motor edges");
      return;
    } else if (this.maxPosition > this.minPosition) {
      targetPos = this.minPosition + interval * (level - 1);
    } else if (this.maxPosition < this.minPosition) {
      targetPos = this.minPosition - interval * (level - 1);
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

    if (this.sleepRatio) {
      firstTime = (Math.abs(posCur - targetPos) / interval) * this.sleepRatio;
    }

    // TODO improve checking position
    while (Math.abs(posCur - targetPos) > 1) {
      if (isCancelled()) {
        return;
      }
      ++counter;

      if (posCur < targetPos) {
        this.forward();
      } else {
        this.back();
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
