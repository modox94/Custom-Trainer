const MotorDriver = require("./src/hardware/motor_driver");

const motor = new MotorDriver({
  reverseDirection: false,
  minPosition: 5,
  maxPosition: 95,
  sleepRatio: 1435,
});

motor.calibration(5);
