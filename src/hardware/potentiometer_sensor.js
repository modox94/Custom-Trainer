const { noop, random } = require("lodash");

const sensorPlaceholder = {
  read: cb => cb(undefined, { value: random(0, 1, true) }),
  close: noop,
};

let mcpadc;
try {
  mcpadc = require("mcp-spi-adc");
} catch (error) {
  console.log("import mcp-spi-adc error", error);

  mcpadc = {
    open: (arg, cb) => {
      cb("ERROR");

      return sensorPlaceholder;
    },
  };
}

class PotentiometerSensor {
  constructor() {
    this.condition = { isReady: false, error: false };

    if (process.env.ELECTRON_DEV_MODE || process.env.WEB_MODE) {
      this.sensor = sensorPlaceholder;
      this.condition.isReady = true;

      console.log("Potentiometer sensor simulator is started");
    } else {
      this.sensor = mcpadc.open(5, err => {
        if (err) {
          // console.log("err", err);
          this.condition.error = err;
        } else {
          this.condition.isReady = true;
        }
      });
    }
  }

  async readPosition() {
    return await new Promise(resolve => {
      if (this.condition.isReady) {
        this.sensor.read((err, reading) => {
          resolve(reading?.value * 100);
        });
      } else {
        resolve(NaN);
      }
    });
  }

  // TODO создать обсервер с интервалом 15-50 мс на рекурсивном таймауте, промифицировать чтение

  off() {
    try {
      this.sensor.close(noop);
    } catch (error) {
      console.log("sensor.close error", error);
    }
  }
}

exports.PotentiometerSensor = PotentiometerSensor;
