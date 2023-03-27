const { noop } = require("lodash");
const mcpadc = require("mcp-spi-adc");
const { Promise } = require("../utils/utils");

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

    this.read = Promise.promisify(this.sensor.read.bind(this.sensor));
  }

  async readPosition() {
    const { value = NaN } = (await this.read()) || {};
    return value * 100;
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
