const mcpadc = require("mcp-spi-adc");

// let potentiometerSensor;
// const tempVariable = mcpadc.open(5, err => {
//   if (err) {
//     console.log("err", err);
//   }

//   console.log("ptn", tempVariable);
//   potentiometerSensor = tempVariable;
// });

// exports.potentiometerSensor = potentiometerSensor;

let isReady = false;

const potentiometerSensor = mcpadc.open(5, err => {
  if (err) {
    console.log("err", err);
  }

  isReady = true;
});

exports = {
  isReady,
  potentiometerSensor,
};

// exports.isReady = isReady;
// exports.potentiometerSensor = potentiometerSensor;
