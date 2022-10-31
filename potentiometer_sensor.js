const mcpadc = require("mcp-spi-adc");

let potentiometerSensor;
const tempVariable = mcpadc.open(5, err => {
  if (err) {
    console.log("err", err);
  }

  potentiometerSensor = tempVariable;
});

exports.potentiometerSensor = potentiometerSensor;
