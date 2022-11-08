const mcpadc = require("mcp-spi-adc");

class PotentiometerSensor {
  constructor(options) {
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
}

exports.PotentiometerSensor = PotentiometerSensor;
