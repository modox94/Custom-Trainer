const mcpadc = require("mcp-spi-adc");

class PotentiometerSensor {
  constructor() {
    this.condition = { isReady: false, error: false };
    this.sensor = mcpadc.open(5, err => {
      if (err) {
        console.log("err", err);
        this.condition.error = err;
      } else {
        this.condition.isReady = true;
      }
    });
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

  readPositionCb(cb) {
    if (this.condition.isReady) {
      this.sensor.read((err, reading) => {
        cb(reading?.value * 100);
      });
    } else {
      cb(NaN);
    }
  }

  // TODO создать обсервер с интервалом 15-50 мс на рекурсивном таймауте, промифицировать чтение

  off() {
    try {
      this.sensor.close();
    } catch (error) {
      console.log("sensor.close error", error);
    }
  }
}

exports.PotentiometerSensor = PotentiometerSensor;
