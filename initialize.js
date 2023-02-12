const MotorDriver = require("./src/hardware/motor_driver");

const motor = new MotorDriver({
  minPosition: 95,
  maxPosition: 5,
  sleepRatio: 1435,
});

motor.initialize();
