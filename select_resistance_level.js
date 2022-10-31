const { potentiometerSensor, condition } = require("./potentiometer_sensor");
const { motor } = require("./motor_driver");
const { consoleCheck, sleep } = require("./utils");

const step = 5;
// const sleepDelay = 1;

const readFn = async () => {
  return await new Promise(resolve => {
    if (condition.isReady) {
      potentiometerSensor.read((err, reading) => {
        console.log("reading", reading.value);
        resolve(reading?.value);
      });
    } else {
      resolve(NaN);
    }
  });
};

const consoleCb = async input => {
  switch (input) {
    case "m": {
      console.log("more");
      const motorPos = await readFn();
      if (Number.isNaN(motorPos) || (1 - motorPos) * 100 < step) {
        console.log("wrong motor position");
        break;
      }

      let newMotorPos = motorPos;

      motor.forward();
      while (newMotorPos * 100 <= motorPos * 100 + step && newMotorPos < 0.95) {
        // await sleep(sleepDelay);
        newMotorPos = await readFn();
      }

      motor.stop();
      console.log("motorPos", motorPos);
      console.log("newMotorPos", newMotorPos);
      break;
    }

    case "l": {
      console.log("less");
      const motorPos = await readFn();
      if (Number.isNaN(motorPos) || motorPos * 100 < step) {
        console.log("wrong motor position");
        break;
      }

      let newMotorPos = motorPos;
      motor.back();
      while (newMotorPos * 100 >= motorPos * 100 - step && newMotorPos > 0.05) {
        // await sleep(sleepDelay);
        newMotorPos = await readFn();
      }

      motor.stop();
      console.log("motorPos", motorPos);
      console.log("newMotorPos", newMotorPos);
      break;
    }

    default: {
      motor.stop();
      break;
    }
  }
};

consoleCheck(consoleCb);
