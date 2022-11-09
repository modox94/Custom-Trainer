const { Gpio } = require("onoff");
const { DIRECTION, PHYSICAL_TO_GPIO } = require("./constants.js");
const readline = require("node:readline");
const fs = require("fs");
const { round } = require("lodash");
const { stdin: input, stdout: output } = require("node:process");
const { sleep } = require("./utils");
const { PotentiometerSensor } = require("./potentiometer_sensor");
let motorSettings;
try {
  motorSettings = require("./motor_settings.json");
} catch (error) {
  motorSettings = {};
}

const DELAY = 100;
const DELAY_FOR_READ = 25;
const RESIST_LEVELS = 10;

const write = (value, cb = () => {}) => {
  console.log("write", value);
  cb();
};
const writeSync = (value, cb = () => {}) => {
  console.log("writeSync", value);
  cb();
};
const motorInNoop = { write, writeSync };

const motorIn1Pin = PHYSICAL_TO_GPIO[16];
const motorIn2Pin = PHYSICAL_TO_GPIO[18];

class MotorDriver {
  constructor(options) {
    Object.assign(this, options);

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
            // console.log("pos", await this.readPosition());
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
            // console.log("pos", await this.readPosition());
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
            // console.log("pos", await this.readPosition());
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
    this.in1.writeSync(0);
    this.in2.writeSync(0);
  }

  get isReady() {
    return this.potentiometer?.condition?.isReady;
  }

  async readPosition() {
    return await this.potentiometer.readPosition();
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
    if (level < 1 || level > RESIST_LEVELS) {
      console.log("wrong resist level");
      return "error";
    }

    while (!this.isReady) {
      console.log("loading...");
      await sleep(200);
    }

    // 67
    // 20
    const interval =
      (this.maxPosition - this.minPosition) / (RESIST_LEVELS - 1);
    const targetPos = this.minPosition + interval * (level - 1);

    // const start = Date.now();
    let posCur = await this.readPosition();
    // const finish = Date.now();
    // console.log("wait pos", finish - start);

    // let counter = 10;
    let counter3 = 0;

    // const start = Date.now();

    let firstTime = false;

    if (this.sleepRatio) {
      firstTime = (Math.abs(posCur - targetPos) / interval) * this.sleepRatio;
    }

    while (
      Math.abs(posCur - targetPos) > 1
      // && counter > 0
    ) {
      ++counter3;
      // console.log("counter3", counter3);

      if (posCur > targetPos) {
        this.back();
      } else {
        this.forward();
      }
      if (firstTime) {
        await sleep(firstTime);
        firstTime = false;
      } else {
        await sleep(DELAY);
      }

      this.stop();

      // const start = Date.now();
      await sleep(DELAY_FOR_READ);
      // const finish = Date.now();
      // console.log("wait", finish - start);

      posCur = await this.readPosition();

      // counter -= 1;
      // console.log("counter", counter);
    }

    // const finish = Date.now();
    // console.log("latency", finish - start);

    let counter2 = 3;

    // console.log("maxPosition", this.maxPosition);
    // console.log("minPosition", this.minPosition);
    // console.log("targetPos", targetPos);

    while (counter2 > 0) {
      const pos = await this.readPosition();
      // console.log("pos", counter2, pos);
      await sleep(200);

      counter2 -= 1;
    }

    // console.log("counter3", counter3);

    return isCalibration ? { driveTime: counter3 * DELAY } : "done";
  }
}

const motor = new MotorDriver(motorSettings);

// motor.initialize();

exports.motor = motor;
