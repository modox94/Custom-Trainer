const { Gpio } = require("onoff");
const { DIRECTION, PHYSICAL_TO_GPIO } = require("./constants.js");
const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");
const { sleep } = require("./utils");
const { potentiometerSensor, condition } = require("./potentiometer_sensor");

const write = (value, cb = () => {}) => {
  console.log("write", value);
  cb();
};
const writeSync = (value, cb = () => {}) => {
  console.log("writeSync", value);
  cb();
};
const motorInNoop = { write, writeSync };

class MotorDriver {
  constructor(options) {
    Object.assign(this, options);

    this.motorIn1 = this.motorIn1 || motorInNoop;
    this.motorIn2 = this.motorIn2 || motorInNoop;

    this.motorIn1.writeSync(0);
    this.motorIn2.writeSync(0);
  }

  // initialize() {
  //   this.motorIn1.writeSync(0);
  //   this.motorIn2.writeSync(0);

  //   if (
  //     !this.minPosition ||
  //     !this.maxPosition ||
  //     !this.resistanceLevels ||
  //     resistanceLevels.length <= 1
  //   ) {
  //     console.log("Нужно найти минимум возможный");
  //     console.log("Жмите f или b для управления мотором");
  //     console.log("При достижении пишем next");

  //     const rl = readline.createInterface({ input, output });

  //     rl.prompt();

  //     rl.on("line", async inputRaw => {
  //       const input = inputRaw.trim();

  //       switch (input) {
  //         case "f":
  //           this.back();
  //           await sleep(100);
  //           this.stop();
  //         case "b":

  //         case "next":
  //           break;

  //         default:
  //           break;
  //       }
  //       if (input.trim() === "exit") {
  //       }

  //       cb(...args);
  //     }).on("close", () => {
  //       console.log("readline closed");
  //     });

  //     consoleOnLine();
  //   }

  //   // minPosition
  //   // maxPosition
  //   // resistanceLevels
  // }

  forward() {
    this.motorIn1.writeSync(0);
    this.motorIn2.writeSync(1);
  }

  back() {
    this.motorIn2.writeSync(0);
    this.motorIn1.writeSync(1);
  }

  stop() {
    this.motorIn1.writeSync(0);
    this.motorIn2.writeSync(0);
  }
}

const motorIn1Pin = PHYSICAL_TO_GPIO[16];
const motorIn2Pin = PHYSICAL_TO_GPIO[18];

let motorIn1;
let motorIn2;
try {
  motorIn1 = new Gpio(motorIn1Pin, DIRECTION.low);
  motorIn2 = new Gpio(motorIn2Pin, DIRECTION.low);
} catch (error) {
  motorIn1 = motorInNoop;
  motorIn2 = motorInNoop;

  console.log("Gpio error", error);
}

const motor = new MotorDriver({ motorIn1, motorIn2 });

exports.motor = motor;
