const { Gpio } = require("onoff");
const { DIRECTION, PHYSICAL_TO_GPIO } = require("../constants/constants");
const readline = require("node:readline");
const fs = require("node:fs");
const { round, noop, get } = require("lodash");
const { stdin: input, stdout: output } = require("node:process");
const { sleep, sleepCb } = require("../utils/utils");
const { PotentiometerSensor } = require("./potentiometer_sensor");
const Promise = require("bluebird");
const { isFunction } = require("lodash");

Promise.config({ cancellation: true });

const DELAY = 100;
const DELAY_FOR_READ = 25;
const RESIST_LEVELS = 10;

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

    this.reverseDirection = get(options, ["reverseDirection"], null);
    this.minPosition = get(options, ["minPosition"], null);
    this.maxPosition = get(options, ["maxPosition"], null);
    this.sleepRatio = get(options, ["sleepRatio"], null);

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

  async initialize() {
    this.in1.writeSync(0);
    this.in2.writeSync(0);

    if (!this.minPosition && !this.maxPosition) {
      console.log(
        "Нужно найти положение двигателя соответствующее минимальной нагрузке",
      );
      console.log(
        "Отправляйте f (вперед) или b (назад) для управления мотором",
      );
      console.log("При достижении соответсвующего положения отправьте next");
    } else {
      console.log("Мотор уже инициализирован.");
      console.log(`Позиция минимальной нагрузки: ${this.minPosition}.`);
      console.log(`Позиция максимальной нагрузки ${this.maxPosition}.`);
      console.log("Для сброса настроек отправьте reset.");
    }

    const rl = readline.createInterface({ input, output });

    rl.prompt();

    return new Promise(resolve => {
      rl.on("line", async inputRaw => {
        const input = inputRaw.trim();

        switch (input) {
          case "exit":
            console.log("Остановка...");
            this.stop();
            rl.close();
            break;

          case "reset":
            console.log("Cброс настроек...");
            this.stop();
            delete this.minPosition;
            delete this.maxPosition;
            console.log(
              "Нужно найти положение двигателя соответствующее минимальной нагрузке",
            );
            console.log(
              "Отправляйте f (вперед) или b (назад) для управления мотором",
            );
            console.log(
              "При достижении соответсвующего положения отправьте next",
            );
            break;

          case "g":
            console.log("pos", await this.readPosition());
            break;

          case "f": {
            const posCur = await this.readPosition();

            if (posCur >= 95) {
              console.log("Дальше нельзя!");
              break;
            }

            this.forward();
            await sleep(DELAY);
            this.stop();
            console.log("pos", await this.readPosition());
            break;
          }

          case "b": {
            const posCur = await this.readPosition();

            if (posCur <= 5) {
              console.log("Дальше нельзя!");
              break;
            }

            this.back();
            await sleep(DELAY);
            this.stop();
            console.log("pos", await this.readPosition());
            break;
          }

          case "next": {
            let positionSum = 0;
            for (let i = 0; i < 3; i++) {
              positionSum += await this.readPosition();
            }
            const positionRes = round(positionSum / 3);
            if (!this.minPosition) {
              this.minPosition = positionRes;

              console.log("Значение записано", positionRes);
              console.log("");

              console.log(
                "Нужно найти положение двигателя соответствующее максимальной нагрузке",
              );
              console.log(
                "Отправляйте f (вперед) или b (назад) для управления мотором",
              );
              console.log(
                "При достижении соответсвующего положения отправьте next",
              );
            } else if (!this.maxPosition) {
              this.maxPosition = positionRes;

              console.log("Значение записано", positionRes);
              console.log("");

              fs.writeFileSync(
                "./motor_settings.json",
                JSON.stringify({
                  minPosition: this.minPosition,
                  maxPosition: this.maxPosition,
                }),
              );

              await motor.calibration();

              rl.close();
            }
            break;
          }

          default:
            console.log("Не знаю таких команд.");
            break;
        }
      }).on("close", () => {
        console.log("readline closed");
        resolve();
      });
    });
  }

  forward() {
    this.in1.writeSync(0);
    this.in2.writeSync(1);
  }

  back() {
    this.in2.writeSync(0);
    this.in1.writeSync(1);
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

  get isReady() {
    return this.potentiometer?.condition?.isReady;
  }

  get isError() {
    return this.potentiometer?.condition?.error;
  }

  async readPosition() {
    return await this.potentiometer.readPosition();
  }

  readPositionCb(cb) {
    return this.potentiometer.readPositionCb(cb);
  }

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
      (this.maxPosition - this.minPosition) / (RESIST_LEVELS - 1);
    const targetPos = this.minPosition + interval * (level - 1);

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

    while (Math.abs(posCur - targetPos) > 1) {
      if (isCancelled()) {
        return;
      }
      ++counter;

      if (posCur > targetPos) {
        this.back();
      } else {
        this.forward();
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
