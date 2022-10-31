const { potentiometerSensor } = require("./potentiometer_sensor");
const { motor } = require("./motor_driver");
const { consoleCheck, sleep } = require("./utils");

const step = 5;
const sleepDelay = 50;

const readFn = async () => {
  await new Promise(resolve => {
    if (potentiometerSensor?.read) {
      potentiometerSensor.read(resolve);
    } else {
      resolve(NaN);
    }
  });
};

const consoleCb = async input => {
  switch (input) {
    case "m":
      console.log("more");
      const motorPos = await readFn();
      if (Number.isNaN(motorPos)) {
        console.log("wrong motor position");
        break;
      }

      let newMotorPos = motorPos;
      motor.forward();
      while (
        newMotorPos * 100 <= motorPos * 100 + step &&
        newMotorPos >= motorPos
      ) {
        await sleep(sleepDelay);
        newMotorPos = await readFn();
      }

      motor.stop();
      console.log("motorPos", motorPos);
      console.log("newMotorPos", newMotorPos);
      break;

    default:
      motor.stop();
      break;
  }
};

consoleCheck(consoleCb);
