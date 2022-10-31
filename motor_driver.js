const { Gpio } = require("onoff");
const { DIRECTION, PHYSICAL_TO_GPIO } = require("./constants.js");

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

exports.motor = motor;
