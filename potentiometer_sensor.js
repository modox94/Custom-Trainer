const mcpadc = require("mcp-spi-adc");

let condition = { isReady: false, error: false };

const potentiometerSensor = mcpadc.open(5, err => {
  if (err) {
    console.log("err", err);
    condition.error = err;
  } else {
    condition.isReady = true;
  }

  console.log("potentiometerSensor", potentiometerSensor);
});

exports.condition = condition;
exports.potentiometerSensor = potentiometerSensor;
