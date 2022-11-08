const { Gpio } = require("onoff");
const { DIRECTION, PHYSICAL_TO_GPIO } = require("./constants.js");
const readline = require("node:readline");
const fs = require("fs");
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

    rl.on("line", async inputRaw => {
      const input = inputRaw.trim();

      switch (input) {
        case "exit":
          console.log("экстренная остановка");
          this.stop();
          rl.close();
          break;

        case "reset":
          console.log("Cброс настроек...");
          this.stop();
          this.minPosition = undefined;
          this.maxPosition = undefined;
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
          console.log("pos", await this.potentiometer.readPosition());
          break;

        case "f": {
          const posCur = await this.potentiometer.readPosition();

          if (posCur >= 95) {
            console.log("Дальше нельзя!");
            break;
          }

          this.forward();
          await sleep(DELAY);
          this.stop();
          console.log("pos", await this.potentiometer.readPosition());
          break;
        }

        case "b": {
          const posCur = await this.potentiometer.readPosition();

          if (posCur <= 5) {
            console.log("Дальше нельзя!");
            break;
          }

          this.back();
          await sleep(DELAY);
          this.stop();
          console.log("pos", await this.potentiometer.readPosition());
          break;
        }

        case "next": {
          let positionSum = 0;
          for (let i = 0; i < 3; i++) {
            positionSum += await this.potentiometer.readPosition();
          }
          const positionRes = Math.round(positionSum / 3);
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

  setLevel(level) {
    //
  }
}

const motor = new MotorDriver(motorSettings);

// motor.initialize();

exports.motor = motor;
