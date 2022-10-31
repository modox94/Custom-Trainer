const { Gpio } = require("onoff");
const { DIRECTION, EDGE, PHYSICAL_TO_GPIO } = require("./constants.js");

const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");

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
    this.motorIn1 = options.motorIn1 || motorInNoop;
    this.motorIn2 = options.motorIn2 || motorInNoop;

    this.motorIn1.writeSync(0);
    this.motorIn2.writeSync(0);
  }

  forward() {
    this.motorIn2.writeSync(0);
    this.motorIn1.writeSync(1);
  }

  back() {
    this.motorIn1.writeSync(0);
    this.motorIn2.writeSync(1);
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

const rl = readline.createInterface({ input, output });

const consoleCheck = async () => {
  for await (const line of rl) {
    switch (line) {
      case "f":
        motor.forward();
        break;

      case "b":
        motor.back();
        break;

      case "s":
        motor.stop();
        break;

      default:
        motor.stop();
        break;
    }
  }
};

consoleCheck();
