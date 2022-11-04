const mcpadc = require("mcp-spi-adc");

let condition = { isReady: false, error: false };

exports.PotentiometerSensor = class PotentiometerSensor {
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
          console.log("reading", reading.value);
          resolve(reading?.value);
        });
      } else {
        resolve(NaN);
      }
    });
  }
};

const potentiometerSensor = mcpadc.open(5, err => {
  if (err) {
    console.log("err", err);
    condition.error = err;
  } else {
    condition.isReady = true;
  }

  // console.log("potentiometerSensor", potentiometerSensor);
});

exports.condition = condition;
exports.potentiometerSensor = potentiometerSensor;
